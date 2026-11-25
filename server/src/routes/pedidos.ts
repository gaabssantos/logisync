import { Router } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db';
import { AuthRequest, requireAuth, requireEmpresa } from '../auth';
import { HttpError, parseNumero, wrap } from '../errors';

export const pedidosRouter = Router();
pedidosRouter.use(requireAuth, requireEmpresa);

// RF07, RF19: lista de pedidos da empresa (filtros e busca são feitos na tela)
pedidosRouter.get('/', wrap(async (req: AuthRequest, res) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id_pedido AS id, codigo_rastreamento AS codigo, cliente, origem, destino, data_pedido AS data,
            valor, prioridade, status
       FROM pedido WHERE id_empresa = ? ORDER BY data_pedido DESC, id_pedido DESC`, [req.user!.empresaId]);
  res.json(rows);
}));

// RF05: cadastro de pedido (código de rastreamento único gerado pelo sistema)
pedidosRouter.post('/', wrap(async (req: AuthRequest, res) => {
  const { cliente, origem, destino, valor, prioridade } = req.body ?? {};
  if (!cliente || !origem || !destino || valor === undefined || valor === '') {
    throw new HttpError(400, 'Preencha cliente, origem, destino e valor.');
  }
  const v = parseNumero(valor, 'o valor', '1.234,56');
  const codigo = 'LS' + Date.now().toString().slice(-10);
  const [r] = await pool.query<ResultSetHeader>(
    `INSERT INTO pedido (id_empresa, codigo_rastreamento, cliente, origem, destino, valor, prioridade)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user!.empresaId, codigo, cliente, origem, destino, v, prioridade || 'MEDIA']);
  res.status(201).json({ id: r.insertId, codigo, message: 'Pedido registrado com sucesso.' });
}));

// RF06: edição (o gatilho do banco bloqueia pedidos que não estão pendentes)
pedidosRouter.put('/:id', wrap(async (req: AuthRequest, res) => {
  const { cliente, origem, destino, valor, prioridade } = req.body ?? {};
  if (!cliente || !origem || !destino) throw new HttpError(400, 'Preencha cliente, origem, destino e valor.');
  const v = parseNumero(valor, 'o valor', '1.234,56');
  const [r] = await pool.query<ResultSetHeader>(
    `UPDATE pedido SET cliente = ?, origem = ?, destino = ?, valor = ?, prioridade = ?
      WHERE id_pedido = ? AND id_empresa = ?`,
    [cliente, origem, destino, v, prioridade || 'MEDIA', req.params.id, req.user!.empresaId]);
  if (!r.affectedRows) throw new HttpError(404, 'Pedido não encontrado.');
  res.json({ message: 'Pedido atualizado com sucesso.' });
}));

// RF06: exclusão (o gatilho do banco bloqueia pedidos que não estão pendentes)
pedidosRouter.delete('/:id', wrap(async (req: AuthRequest, res) => {
  const [r] = await pool.query<ResultSetHeader>(
    'DELETE FROM pedido WHERE id_pedido = ? AND id_empresa = ?', [req.params.id, req.user!.empresaId]);
  if (!r.affectedRows) throw new HttpError(404, 'Pedido não encontrado.');
  res.json({ message: 'Pedido excluído com sucesso.' });
}));
