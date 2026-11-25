import { Router } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../db';
import { AuthRequest, requireAuth } from '../auth';
import { HttpError, wrap } from '../errors';

export const rastreamentoRouter = Router();

// RF16: rastreamento de encomenda pelo código (consulta pública)
rastreamentoRouter.get('/rastreamento/:codigo', wrap(async (req, res) => {
  const [ped] = await pool.query<RowDataPacket[]>(
    `SELECT p.codigo_rastreamento AS codigo, p.origem, p.destino, p.status AS statusPedido,
            e.id_entrega, e.status AS statusEntrega, e.data_prevista AS previsao
       FROM pedido p LEFT JOIN entrega e ON e.id_pedido = p.id_pedido
      WHERE p.codigo_rastreamento = ?`, [String(req.params.codigo).trim().toUpperCase()]);
  if (!ped.length) throw new HttpError(404, 'Encomenda não encontrada.');
  const p = ped[0];
  let historico: RowDataPacket[] = [];
  if (p.id_entrega) {
    [historico] = await pool.query<RowDataPacket[]>(
      'SELECT data_hora AS dataHora, status, localizacao, observacao FROM rastreamento WHERE id_entrega = ? ORDER BY data_hora',
      [p.id_entrega]);
  }
  delete p.id_entrega;
  res.json({ ...p, historico });
}));

// RF17: histórico de envios do cliente autenticado
rastreamentoRouter.get('/meus-envios', requireAuth, wrap(async (req: AuthRequest, res) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.codigo_rastreamento AS codigo, p.destino, p.data_pedido AS data, COALESCE(e.status, p.status) AS status
       FROM pedido p LEFT JOIN entrega e ON e.id_pedido = p.id_pedido
      WHERE p.id_usuario = ? ORDER BY p.data_pedido DESC`, [req.user!.id]);
  res.json(rows);
}));
