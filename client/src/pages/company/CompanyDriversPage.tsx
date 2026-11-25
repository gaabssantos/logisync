import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import { Plus, Search, Phone } from 'lucide-react';
import { api } from '../../services/api';
import { ErrorAlert } from '../../components/ErrorAlert';

const FormCard = styled.form`
  background: #ffffff;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr) auto;
  gap: 0.6rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  input {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.55rem 0.7rem;
    font-size: 0.85rem;
  }

  button {
    background: #2580d3;
    color: #ffffff;
    border-radius: 8px;
    padding: 0 1rem;
    font-weight: 600;
  }
`;

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background-color: #f1f5f9;
`;

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.75rem 2rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.65rem 1rem;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);

  input {
    border: none;
    outline: none;
    font-size: 0.9rem;
    color: #1e293b;
    width: 100%;

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2580d3;
  color: #ffffff;
  padding: 0.7rem 1.25rem;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(37, 128, 211, 0.25);
  transition: all 0.2s ease;

  &:hover {
    background-color: #1e70bb;
    transform: translateY(-1px);
  }
`;

const TableCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TableHeader = styled.div`
  padding: 1.5rem 1.75rem 1rem 1.75rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
`;

const TotalBadge = styled.span`
  font-size: 0.82rem;
  background-color: #eff6ff;
  color: #2580d3;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-weight: 600;
`;

const TableResponsiveWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 1rem 1.75rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  text-transform: capitalize;

  &:last-child {
    text-align: right;
  }
`;

const Tr = styled.tr`
  transition: background-color 0.15s ease;

  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }

  &:hover {
    background-color: #f8fafc;
  }
`;

const Td = styled.td`
  padding: 1.1rem 1.75rem;
  font-size: 0.9rem;
  color: #475569;
  vertical-align: middle;

  &:last-child {
    text-align: right;
  }
`;

const DriverProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const DriverAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusBadge = styled.span<{ $status: 'EM ROTA' | 'DISPONÍVEL' | 'FOLGA' }>`
  display: inline-block;
  padding: 0.28rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  ${({ $status }) => {
    switch ($status) {
      case 'DISPONÍVEL':
        return `
          background-color: #d1fae5;
          color: #059669;
        `;
      case 'EM ROTA':
        return `
          background-color: #eff6ff;
          color: #2580d3;
        `;
      case 'FOLGA':
        return `
          background-color: #f1f5f9;
          color: #64748b;
        `;
    }
  }}
`;

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'EM ROTA' | 'DISPONÍVEL' | 'FOLGA';
  deliveriesToday: number;
}

interface MotoristaApi {
  id: number; nome: string; telefone: string | null; status: 'DISPONIVEL' | 'EM_ROTA' | 'FOLGA';
  veiculo: string | null; entregasHoje: number;
}

const STATUS_LABEL = { DISPONIVEL: 'DISPONÍVEL', EM_ROTA: 'EM ROTA', FOLGA: 'FOLGA' } as const;

export const CompanyDriversPage = () => {
  // Motoristas carregados da API (RF13)
  const [list, setList] = useState<Driver[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', cpf: '', cnh: '', telefone: '', email: '' });

  const loadDrivers = async () => {
    try {
      const rows = await api<MotoristaApi[]>('/motoristas');
      setList(rows.map((m) => ({
        id: `MOT-${String(m.id).padStart(2, '0')}`,
        name: m.nome,
        phone: m.telefone || '-',
        vehicle: m.veiculo || 'Sem veículo',
        status: STATUS_LABEL[m.status],
        deliveriesToday: Number(m.entregasHoje),
      })));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const drivers = useMemo(() => list.filter((d) =>
    [d.name, d.id, d.vehicle].some((v) => v.toLowerCase().includes(search.toLowerCase()))), [list, search]);

  // cadastro de motorista (a API recusa CPF ou CNH duplicados)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api('/motoristas', { method: 'POST', body: form });
      setForm({ nome: '', cpf: '', cnh: '', telefone: '', email: '' });
      setShowForm(false);
      await loadDrivers();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Layout>
      <CompanySidebar />

      <MainArea>
        <CompanyHeader title="Gestão de Motoristas" />

        <TopActions>
          <SearchBox>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Buscar por nome, placa ou ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </SearchBox>

          <AddButton onClick={() => setShowForm(!showForm)}>
            <Plus size={18} />
            <span>Novo Motorista</span>
          </AddButton>
        </TopActions>

        {error && <ErrorAlert role="alert">{error}</ErrorAlert>}

        {showForm && (
          <FormCard onSubmit={handleCreate}>
            <input required placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            <input required placeholder="CPF" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
            <input required placeholder="CNH" value={form.cnh} onChange={(e) => setForm({ ...form, cnh: e.target.value })} />
            <input placeholder="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
            <input placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <button type="submit">Salvar</button>
          </FormCard>
        )}

        <TableCard>
          <TableHeader>
            <TableTitle>Motoristas Cadastrados</TableTitle>
            <TotalBadge>{list.length} ativos</TotalBadge>
          </TableHeader>

          <TableResponsiveWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <Th>Motorista</Th>
                  <Th>Contato</Th>
                  <Th>Veículo Atribuído</Th>
                  <Th>Status</Th>
                  <Th>Entregas Hoje</Th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => {
                  const initials = driver.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('');

                  return (
                    <Tr key={driver.id}>
                      <Td>
                        <DriverProfile>
                          <DriverAvatar>{initials}</DriverAvatar>
                          <div>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>
                              {driver.name}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                              {driver.id}
                            </span>
                          </div>
                        </DriverProfile>
                      </Td>
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={14} color="#64748b" />
                          <span>{driver.phone}</span>
                        </div>
                      </Td>
                      <Td>{driver.vehicle}</Td>
                      <Td>
                        <StatusBadge $status={driver.status}>
                          {driver.status}
                        </StatusBadge>
                      </Td>
                      <Td style={{ fontWeight: 600 }}>{driver.deliveriesToday}</Td>
                    </Tr>
                  );
                })}
              </tbody>
            </StyledTable>
          </TableResponsiveWrapper>
        </TableCard>
      </MainArea>
    </Layout>
  );
};
