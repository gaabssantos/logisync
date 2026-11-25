import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db';
import { signToken } from '../auth';
import { HttpError, wrap } from '../errors';

export const authRouter = Router();

function userPayload(u: RowDataPacket) {
  return {
    id: u.id_usuario,
    name: u.nome,
    email: u.email,
    type: u.tipo === 'CLIENTE' ? 'usuario' : 'empresa',
    empresaId: u.id_empresa,
  };
}

// RF01, RF02: cadastro de usuário cliente ou de empresa (empresa + usuário gerente)
authRouter.post('/register', wrap(async (req, res) => {
  const { tipo, nome, documento, email, telefone, senha } = req.body ?? {};
  if (!nome || !documento || !email || !senha) throw new HttpError(400, 'Preencha nome, documento, e-mail e senha.');
  if (String(senha).length < 6) throw new HttpError(400, 'A senha deve ter no mínimo 6 caracteres.');
  const hash = await bcrypt.hash(String(senha), 10);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    let idEmpresa: number | null = null;
    if (tipo === 'empresa') {
      const [r] = await conn.query<ResultSetHeader>(
        'INSERT INTO empresa (razao_social, cnpj, telefone, email) VALUES (?, ?, ?, ?)', [nome, documento, telefone || null, email]);
      idEmpresa = r.insertId;
    }
    const [r] = await conn.query<ResultSetHeader>(
      'INSERT INTO usuario (id_empresa, nome, cpf, email, telefone, senha, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [idEmpresa, nome, tipo === 'empresa' ? null : documento, email, telefone || null, hash, tipo === 'empresa' ? 'GERENTE' : 'CLIENTE']);
    await conn.commit();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM usuario WHERE id_usuario = ?', [r.insertId]);
    const u = rows[0];
    res.status(201).json({ token: signToken({ id: u.id_usuario, tipo: u.tipo, empresaId: u.id_empresa }), user: userPayload(u) });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}));

// RF03: autenticação por perfil (aba Empresa ou Usuário)
authRouter.post('/login', wrap(async (req, res) => {
  const { tipo, login, senha } = req.body ?? {};
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM usuario WHERE (email = ? OR cpf = ?) AND ativo = 1', [login, login]);
  const u = rows[0];
  if (!u || !(await bcrypt.compare(String(senha), u.senha))) throw new HttpError(401, 'E-mail ou senha inválidos.');
  const ehEmpresa = u.tipo !== 'CLIENTE';
  if (tipo === 'empresa' && !ehEmpresa) throw new HttpError(403, 'Esta conta é de usuário. Use a aba "Usuário".');
  if (tipo === 'usuario' && ehEmpresa) throw new HttpError(403, 'Esta conta é de empresa. Use a aba "Empresa".');
  res.json({ token: signToken({ id: u.id_usuario, tipo: u.tipo, empresaId: u.id_empresa }), user: userPayload(u) });
}));
