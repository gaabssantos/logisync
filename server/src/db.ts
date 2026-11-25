import 'dotenv/config';
import mysql from 'mysql2/promise';

// Pool de conexões com o MySQL. As credenciais vêm de variáveis de ambiente
// (definidas no docker-compose.yml ou no arquivo .env em desenvolvimento local).
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'logisync',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'logisync',
  // datas como texto ("AAAA-MM-DD HH:MM:SS"), sem conversão de fuso horário
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
});

// Verifica se o banco responde e devolve a versão do MySQL.
export async function checkDatabase(): Promise<{ connected: boolean; version?: string; error?: string }> {
  try {
    const [rows] = await pool.query<mysql.RowDataPacket[]>('SELECT VERSION() AS version');
    return { connected: true, version: rows[0].version };
  } catch (err) {
    return { connected: false, error: (err as Error).message };
  }
}
