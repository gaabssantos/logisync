import { Router } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db';
import { AuthRequest, requireAuth, requireEmpresa } from '../auth';
import { HttpError, wrap } from '../errors';

export const entregasRouter = Router();
entregasRouter.use(requireAuth, requireEmpresa);

// RF08, RF09: lista de entregas com indicadores
entregasRouter.get('/', wrap(async (req: AuthRequest, res) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT e.id_entrega AS id, p.codigo_rastreamento AS codigo, p.origem, p.destino,
            m.nome AS motorista, m.telefone, v.placa, e.status, e.data_prevista AS previsao,
            (e.status IN ('AGUARDANDO','EM_TRANSITO') AND e.data_prevista < NOW()) AS atrasada
       FROM entrega e
       JOIN pedido p ON p.id_pedido = e.id_pedido
       JOIN motorista m ON m.id_motorista = e.id_motorista
       JOIN veiculo v ON v.id_veiculo = e.id_veiculo
      WHERE p.id_empresa = ?
      ORDER BY e.data_prevista DESC`, [req.user!.empresaId]);
  res.json(rows);
}));

// RF08: geração da entrega a partir de um pedido
entregasRouter.post('/', wrap(async (req: AuthRequest, res) => {
  const { idPedido, idMotorista, idVeiculo, dataPrevista } = req.body ?? {};
  const [ped] = await pool.query<RowDataPacket[]>('SELECT id_pedido FROM pedido WHERE id_pedido = ? AND id_empresa = ?',
    [idPedido, req.user!.empresaId]);
  if (!ped.length) throw new HttpError(404, 'Pedido não encontrado.');
  const [r] = await pool.query<ResultSetHeader>(
    'INSERT INTO entrega (id_pedido, id_motorista, id_veiculo, data_prevista) VALUES (?, ?, ?, ?)',
    [idPedido, idMotorista, idVeiculo, dataPrevista]);
  await pool.query("UPDATE pedido SET status = 'ENVIADO' WHERE id_pedido = ?", [idPedido]);
  await pool.query("INSERT INTO rastreamento (id_entrega, status, observacao) VALUES (?, 'AGUARDANDO', 'Entrega gerada')", [r.insertId]);
  res.status(201).json({ id: r.insertId, message: 'Entrega gerada com sucesso.' });
}));

// RF09, RF18: atualização do status (a conclusão exige o recebedor — regra do banco)
entregasRouter.patch('/:id/status', wrap(async (req: AuthRequest, res) => {
  const { status, recebedor, localizacao } = req.body ?? {};
  const extra = status === 'EM_TRANSITO' ? ', data_saida = COALESCE(data_saida, NOW())'
    : status === 'ENTREGUE' ? ', data_entrega = NOW(), confirmada_em = NOW(), recebedor = ?' : '';
  const params: unknown[] = [status];
  if (status === 'ENTREGUE') params.push(recebedor || null);
  params.push(req.params.id, req.user!.empresaId);
  const [r] = await pool.query<ResultSetHeader>(
    `UPDATE entrega e JOIN pedido p ON p.id_pedido = e.id_pedido SET e.status = ?${extra}
      WHERE e.id_entrega = ? AND p.id_empresa = ?`, params);
  if (!r.affectedRows) throw new HttpError(404, 'Entrega não encontrada.');
  await pool.query('INSERT INTO rastreamento (id_entrega, status, localizacao) VALUES (?, ?, ?)', [req.params.id, status, localizacao || null]);
  if (status === 'ENTREGUE') {
    await pool.query("UPDATE pedido p JOIN entrega e ON e.id_pedido = p.id_pedido SET p.status = 'ENTREGUE' WHERE e.id_entrega = ?", [req.params.id]);
  }
  res.json({ message: 'Status da entrega atualizado.' });
}));
