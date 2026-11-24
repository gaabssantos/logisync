import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDatabase } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'LogiSync API está rodando com sucesso!',
    version: '1.0.0'
  });
});

app.get('/api/health', async (req: Request, res: Response) => {
  const database = await checkDatabase();
  res.status(database.connected ? 200 : 503).json({
    status: database.connected ? 'online' : 'degraded',
    environment: process.env.APP_ENV || 'desenvolvimento',
    database,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`[LogiSync Server] Servidor rodando na porta ${PORT}`);
  console.log(`URL local: http://localhost:${PORT}`);
});
