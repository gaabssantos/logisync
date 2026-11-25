import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'logisync_dev_secret';

export interface TokenPayload {
  id: number;
  tipo: 'ADMIN' | 'GERENTE' | 'OPERADOR' | 'CLIENTE';
  empresaId: number | null;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

// Exige um token válido no cabeçalho Authorization: Bearer <token>
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try {
    req.user = jwt.verify(token, SECRET) as TokenPayload;
    next();
  } catch {
    res.status(401).json({ message: 'Sessão expirada ou inválida. Faça login novamente.' });
  }
}

// RF03: rotas de gestão só podem ser usadas por perfis vinculados a uma empresa
export function requireEmpresa(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.empresaId) {
    return res.status(403).json({ message: 'Acesso permitido apenas para contas de empresa.' });
  }
  next();
}
