import { Router } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db';
import { AuthRequest, requireAuth, requireEmpresa } from '../auth';
import { HttpError, wrap } from '../errors';

// ---------------- Veículos (RF11, RF12, RF13) ----------------
export const veiculosRouter = Router();
veiculosRouter.use(requireAuth, requireEmpresa);

veiculosRouter.get('/', wrap(async (req: AuthRequest, res) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT v.id_veiculo AS id, v.placa, v.modelo, v.tipo, v.capacidade, v.status, v.ultima_manutencao AS ultimaManutencao,
            m.nome AS motorista
       FROM veiculo v LEFT JOIN motorista m ON m.id_motorista = v.id_motorista
      WHERE v.id_empresa = ? AND v.ativo = 1 ORDER BY v.id_veiculo`, [req.user!.empresaId]);
  res.json(rows);
}));

veiculosRouter.post('/', wrap(async (req: AuthRequest, res) => {
  const { placa, modelo, tipo, capacidade, idMotorista } = req.body ?? {};
  if (!placa || !modelo || !tipo || !capacidade) throw new HttpError(400, 'Preencha placa, modelo, tipo e capacidade.');
  const [r] = await pool.query<ResultSetHeader>(
    'INSERT INTO veiculo (id_empresa, id_motorista, placa, modelo, tipo, capacidade) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user!.empresaId, idMotorista || null, String(placa).toUpperCase(), modelo, tipo, Number(capacidade)]);
  res.status(201).json({ id: r.insertId, message: 'Veículo cadastrado com sucesso.' });
}));

// alterna entre "em manutenção" e "disponível" (RF11)
veiculosRouter.patch('/:id/manutencao', wrap(async (req: AuthRequest, res) => {
  const [r] = await pool.query<ResultSetHeader>(
    `UPDATE veiculo SET status = IF(status = 'MANUTENCAO', 'DISPONIVEL', 'MANUTENCAO'),
            ultima_manutencao = IF(status = 'MANUTENCAO', CURDATE(), ultima_manutencao)
      WHERE id_veiculo = ? AND id_empresa = ?`, [req.params.id, req.user!.empresaId]);
  if (!r.affectedRows) throw new HttpError(404, 'Veículo não encontrado.');
  res.json({ message: 'Status do veículo atualizado.' });
}));

veiculosRouter.delete('/:id', wrap(async (req: AuthRequest, res) => {
  const [r] = await pool.query<ResultSetHeader>('DELETE FROM veiculo WHERE id_veiculo = ? AND id_empresa = ?',
    [req.params.id, req.user!.empresaId]);
  if (!r.affectedRows) throw new HttpError(404, 'Veículo não encontrado.');
  res.json({ message: 'Veículo excluído com sucesso.' });
}));

// ---------------- Motoristas (RF13) ----------------
export const motoristasRouter = Router();
motoristasRouter.use(requireAuth, requireEmpresa);

motoristasRouter.get('/', wrap(async (req: AuthRequest, res) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT m.id_motorista AS id, m.nome, m.telefone, m.status,
            CONCAT(v.modelo, ' (', v.placa, ')') AS veiculo,
            (SELECT COUNT(*) FROM entrega e WHERE e.id_motorista = m.id_motorista AND DATE(e.data_prevista) = CURDATE()) AS entregasHoje
       FROM motorista m LEFT JOIN veiculo v ON v.id_motorista = m.id_motorista
      WHERE m.id_empresa = ? AND m.ativo = 1 ORDER BY m.nome`, [req.user!.empresaId]);
  res.json(rows);
}));

motoristasRouter.post('/', wrap(async (req: AuthRequest, res) => {
  const { nome, cpf, cnh, telefone, email } = req.body ?? {};
  if (!nome || !cpf || !cnh) throw new HttpError(400, 'Preencha nome, CPF e CNH.');
  const [r] = await pool.query<ResultSetHeader>(
    'INSERT INTO motorista (id_empresa, nome, cpf, cnh, telefone, email) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user!.empresaId, nome, cpf, cnh, telefone || null, email || null]);
  res.status(201).json({ id: r.insertId, message: 'Motorista cadastrado com sucesso.' });
}));
