// Cliente HTTP da API REST do LogiSync.
// Em desenvolvimento o Vite encaminha /api para http://localhost:3001; no Docker, o Nginx faz o mesmo.

export const TOKEN_KEY = '@LogiSync:token';

export async function api<T = unknown>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`/api${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || 'Não foi possível concluir a operação.');
  }
  return data as T;
}

// Conversões entre os valores do banco e os rótulos exibidos nas telas
export const formatMoney = (v: number | string) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// O banco devolve "AAAA-MM-DD" ou "AAAA-MM-DD HH:MM:SS" no horário local da operação
const parse = (v: string) => new Date(/^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T00:00:00` : v.replace(' ', 'T'));

export const formatDate = (v: string) => (v ? parse(v).toLocaleDateString('pt-BR') : '-');

export const formatDateTime = (v: string) =>
  v ? parse(v).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-';
