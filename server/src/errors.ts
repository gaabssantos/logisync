import { NextFunction, Request, Response } from 'express';

// Traduz os erros do MySQL (restrições e gatilhos do schema.sql) em mensagens para a tela.
const DUPLICADOS: Record<string, string> = {
  uq_usuario_email: 'Este e-mail já está cadastrado.',
  uq_usuario_cpf: 'Este CPF já está cadastrado.',
  uq_empresa_cnpj: 'Este CNPJ já está cadastrado.',
  uq_veiculo_placa: 'Esta placa já está cadastrada.',
  uq_veiculo_motorista: 'Este motorista já está vinculado a outro veículo.',
  uq_motorista_cpf: 'Este CPF já está cadastrado para outro motorista.',
  uq_motorista_cnh: 'Esta CNH já está cadastrada para outro motorista.',
  uq_entrega_pedido: 'Este pedido já possui uma entrega.',
  uq_pedido_codigo: 'Código de rastreamento já utilizado.',
};

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err?.code === 'ER_DUP_ENTRY') {
    const key = Object.keys(DUPLICADOS).find((k) => String(err.sqlMessage).includes(k));
    return res.status(409).json({ message: key ? DUPLICADOS[key] : 'Registro duplicado.' });
  }
  if (err?.code === 'ER_SIGNAL_EXCEPTION') {
    // mensagens dos gatilhos (RF06, RF11), sem o código do requisito entre parênteses
    return res.status(422).json({ message: String(err.sqlMessage).replace(/\s*\(RF\d+\)\.?$/, '.') });
  }
  if (err?.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    const msg = String(err.sqlMessage);
    if (msg.includes('ck_entrega_confirmacao')) return res.status(422).json({ message: 'Informe quem recebeu a encomenda para concluir a entrega.' });
    if (msg.includes('ck_ocorrencia_justificativa')) return res.status(422).json({ message: 'A justificativa é obrigatória.' });
    return res.status(422).json({ message: 'Dados inválidos.' });
  }
  if (err?.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ message: 'Não é possível excluir: o registro possui entregas vinculadas.' });
  }
  if (err?.status) return res.status(err.status).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor.' });
}

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/**
 * Converte um número digitado no formato brasileiro ("1.234,56", "R$ 95,00", "5000")
 * e recusa valores inválidos com uma mensagem que explica como corrigir.
 */
export function parseNumero(valor: unknown, campo: string, exemplo: string): number {
  let s = String(valor ?? '').replace(/R\$|\s/g, '');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');      // 1.234,56 -> 1234.56
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');      // 1.234 -> 1234
  const n = Number(s);
  if (!s || !Number.isFinite(n) || n <= 0) {
    throw new HttpError(400, `Não foi possível entender ${campo}. Informe um número maior que zero, por exemplo ${exemplo}.`);
  }
  return n;
}

// Permite usar funções async nas rotas, encaminhando erros ao errorHandler
export const wrap = (fn: (req: any, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => { fn(req, res).catch(next); };
