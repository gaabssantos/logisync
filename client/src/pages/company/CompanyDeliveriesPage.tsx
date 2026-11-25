import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import {
  Hourglass,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Phone,
} from 'lucide-react';
import { api, formatDateTime } from '../../services/api';
import { ErrorAlert } from '../../components/ErrorAlert';

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

/* Cards de Métricas de Entregas */
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.75rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
  }
`;

const IconBadge = styled.div<{ $bg: string; $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MetricInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetricValue = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
  line-height: 1.1;
`;

const MetricLabel = styled.p`
  font-size: 0.84rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 0.2rem;
`;

/* Barra de Filtros e Busca */
const FilterCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  padding: 0.6rem 1.25rem;
  width: 100%;
  max-width: 400px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #2580d3;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(37, 128, 211, 0.1);
  }

  input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.88rem;
    color: #1e293b;
    width: 100%;

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

const FilterButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterPill = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1.15rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
  background-color: ${({ $active }) => ($active ? '#2580d3' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#64748b')};
  border: 1px solid ${({ $active }) => ($active ? '#2580d3' : '#e2e8f0')};

  &:hover {
    background-color: ${({ $active }) => ($active ? '#1e70bb' : '#f8fafc')};
    color: ${({ $active }) => ($active ? '#ffffff' : '#1e293b')};
  }
`;

/* Tabela de Lista de Entregas */
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
  align-items: center;
  justify-content: space-between;
`;

const TableTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
`;

const TableTotal = styled.span`
  font-size: 0.85rem;
  color: #94a3b8;
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
    text-align: center;
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
  padding: 1.15rem 1.75rem;
  font-size: 0.88rem;
  color: #475569;
  vertical-align: middle;

  &:last-child {
    text-align: center;
  }
`;

const CodeText = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  color: #94a3b8;
`;

const StatusPill = styled.span<{
  $status: 'AGUARDANDO' | 'ENTREGUE' | 'EM TRÂNSITO' | 'ATRASADA';
}>`
  display: inline-block;
  padding: 0.28rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;

  ${({ $status }) => {
    switch ($status) {
      case 'AGUARDANDO':
        return `
          background-color: #fef3c7;
          color: #d97706;
        `;
      case 'ENTREGUE':
        return `
          background-color: #d1fae5;
          color: #059669;
        `;
      case 'EM TRÂNSITO':
        return `
          background-color: #dbeafe;
          color: #2563eb;
        `;
      case 'ATRASADA':
        return `
          background-color: #fee2e2;
          color: #dc2626;
        `;
    }
  }}
`;

const StatusActionButton = styled.button`
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 6px;

  &:hover {
    background: #dbeafe;
  }
`;

const PhoneCallButton = styled.button`
  background: transparent;
  color: #ef4444;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: #fee2e2;
    transform: scale(1.1);
  }
`;

/* Paginação */
const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
`;

const PageNavButton = styled.button`
  padding: 0.4rem 0.8rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f8fafc;
    color: #1e293b;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNumberButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;

  ${({ $active }) =>
    $active
      ? `
        background-color: #2580d3;
        color: #ffffff;
      `
      : `
        background-color: #ffffff;
        color: #64748b;
        border: 1px solid #e2e8f0;
        &:hover {
          background-color: #f8fafc;
          color: #1e293b;
        }
      `}
`;

interface DeliveryItem {
  dbId: number;
  id: string;
  route: string;
  driver: string;
  phone: string;
  dbStatus: string;
  status: 'AGUARDANDO' | 'ENTREGUE' | 'EM TRÂNSITO' | 'ATRASADA';
  eta: string;
}

interface EntregaApi {
  id: number; codigo: string; origem: string; destino: string; motorista: string; telefone: string;
  placa: string; status: string; previsao: string; atrasada: number;
}

function toItem(e: EntregaApi): DeliveryItem {
  const status: DeliveryItem['status'] = e.status === 'ENTREGUE' ? 'ENTREGUE'
    : e.atrasada ? 'ATRASADA' : e.status === 'EM_TRANSITO' ? 'EM TRÂNSITO' : 'AGUARDANDO';
  return {
    dbId: e.id, id: e.codigo, route: `${e.origem} - ${e.destino}`, driver: e.motorista, phone: e.telefone,
    dbStatus: e.status, status,
    eta: e.status === 'ENTREGUE' ? 'Concluído' : `${e.atrasada ? 'Atrasada desde ' : ''}${formatDateTime(e.previsao)}`,
  };
}

export const CompanyDeliveriesPage = () => {
  const [filterStatus, setFilterStatus] = useState<
    'Todos' | 'Aguardando' | 'Em Trânsito' | 'Entregues' | 'Atrasados'
  >('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Entregas carregadas da API (RF08, RF09)
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [error, setError] = useState('');

  const loadDeliveries = async () => {
    try {
      setDeliveries((await api<EntregaApi[]>('/entregas')).map(toItem));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const metrics = useMemo(() => ({
    aguardando: deliveries.filter((d) => d.dbStatus === 'AGUARDANDO').length,
    transito: deliveries.filter((d) => d.dbStatus === 'EM_TRANSITO').length,
    concluidas: deliveries.filter((d) => d.dbStatus === 'ENTREGUE').length,
    atrasadas: deliveries.filter((d) => d.status === 'ATRASADA').length,
  }), [deliveries]);

  // RF09, RF18: avança o status; a conclusão exige o nome de quem recebeu
  const advanceStatus = async (item: DeliveryItem) => {
    setError('');
    try {
      if (item.dbStatus === 'AGUARDANDO') {
        // a saída para entrega não pode ser desfeita pela tela, por isso é confirmada antes
        if (!confirm(`Iniciar a entrega ${item.id} (${item.route}) com o motorista ${item.driver}?\n\n`
          + 'O status passará para "Em trânsito" e não poderá voltar para "Aguardando".')) return;
        await api(`/entregas/${item.dbId}/status`, { method: 'PATCH', body: { status: 'EM_TRANSITO' } });
      } else {
        const recebedor = prompt(`Concluir a entrega ${item.id} (${item.route})?\n\n`
          + 'A entrega concluída não poderá ser reaberta. Informe o nome de quem recebeu a encomenda:');
        if (recebedor === null) return;
        await api(`/entregas/${item.dbId}/status`, { method: 'PATCH', body: { status: 'ENTREGUE', recebedor: recebedor.trim() } });
      }
      await loadDeliveries();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((item) => {
      let matchesFilter = true;
      if (filterStatus === 'Aguardando') matchesFilter = item.status === 'AGUARDANDO';
      else if (filterStatus === 'Em Trânsito') matchesFilter = item.status === 'EM TRÂNSITO';
      else if (filterStatus === 'Entregues') matchesFilter = item.status === 'ENTREGUE';
      else if (filterStatus === 'Atrasados') matchesFilter = item.status === 'ATRASADA';

      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.route.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [deliveries, filterStatus, searchTerm]);

  return (
    <Layout>
      <CompanySidebar />

      <MainArea>
        <CompanyHeader title="Entregas" />

        {/* 4 Cards de Métricas */}
        <MetricsGrid>
          <MetricCard>
            <IconBadge $bg="#ffedd5" $color="#ea580c">
              <Hourglass size={24} />
            </IconBadge>
            <MetricInfo>
              <MetricValue>{metrics.aguardando}</MetricValue>
              <MetricLabel>Aguardando Coleta</MetricLabel>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#e0f2fe" $color="#0284c7">
              <Truck size={24} />
            </IconBadge>
            <MetricInfo>
              <MetricValue>{metrics.transito}</MetricValue>
              <MetricLabel>Em Trânsito</MetricLabel>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#dcfce7" $color="#16a34a">
              <CheckCircle2 size={24} />
            </IconBadge>
            <MetricInfo>
              <MetricValue>{metrics.concluidas}</MetricValue>
              <MetricLabel>Concluídos</MetricLabel>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#fee2e2" $color="#dc2626">
              <AlertTriangle size={24} />
            </IconBadge>
            <MetricInfo>
              <MetricValue>{metrics.atrasadas}</MetricValue>
              <MetricLabel>Atrasados</MetricLabel>
            </MetricInfo>
          </MetricCard>
        </MetricsGrid>

        {error && <ErrorAlert role="alert">{error}</ErrorAlert>}

        {/* Barra de Busca e Filtros */}
        <FilterCard>
          <SearchInputWrapper>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Buscar por código, rota ou motorista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputWrapper>

          <FilterButtonsGroup>
            <FilterPill
              $active={filterStatus === 'Todos'}
              onClick={() => setFilterStatus('Todos')}
            >
              Todos
            </FilterPill>
            <FilterPill
              $active={filterStatus === 'Aguardando'}
              onClick={() => setFilterStatus('Aguardando')}
            >
              Aguardando
            </FilterPill>
            <FilterPill
              $active={filterStatus === 'Em Trânsito'}
              onClick={() => setFilterStatus('Em Trânsito')}
            >
              Em Trânsito
            </FilterPill>
            <FilterPill
              $active={filterStatus === 'Entregues'}
              onClick={() => setFilterStatus('Entregues')}
            >
              Entregues
            </FilterPill>
            <FilterPill
              $active={filterStatus === 'Atrasados'}
              onClick={() => setFilterStatus('Atrasados')}
            >
              Atrasados
            </FilterPill>
          </FilterButtonsGroup>
        </FilterCard>

        {/* Tabela de Lista de Entregas */}
        <TableCard>
          <TableHeader>
            <TableTitle>Lista de Entregas</TableTitle>
            <TableTotal>Total: {deliveries.length} entregas</TableTotal>
          </TableHeader>

          <TableResponsiveWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <Th>Código</Th>
                  <Th>Rota</Th>
                  <Th>Motorista</Th>
                  <Th>Status</Th>
                  <Th>Previsão</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((item) => (
                  <Tr key={item.id}>
                    <Td>
                      <CodeText>{item.id}</CodeText>
                    </Td>
                    <Td>{item.route}</Td>
                    <Td style={{ fontWeight: 500, color: '#1e293b' }}>
                      {item.driver}
                    </Td>
                    <Td>
                      <StatusPill $status={item.status}>
                        {item.status}
                      </StatusPill>
                    </Td>
                    <Td style={{ color: item.status === 'ATRASADA' ? '#dc2626' : undefined, fontWeight: item.status === 'ATRASADA' ? 600 : undefined }}>
                      {item.eta}
                    </Td>
                    <Td>
                      {item.dbStatus !== 'ENTREGUE' && (
                        <StatusActionButton onClick={() => advanceStatus(item)}>
                          {item.dbStatus === 'AGUARDANDO' ? 'Iniciar' : 'Concluir'}
                        </StatusActionButton>
                      )}
                      <PhoneCallButton
                        onClick={() => alert(`Telefone do motorista ${item.driver}: ${item.phone}`)}
                        title={`Ligar para ${item.driver}`}
                      >
                        <Phone size={16} />
                      </PhoneCallButton>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </StyledTable>
          </TableResponsiveWrapper>

          {/* Paginação */}
          <PaginationWrapper>
            <PageNavButton disabled>◀ Anterior</PageNavButton>
            <PageNumberButton $active>1</PageNumberButton>
            <PageNavButton disabled>Próximo ▶</PageNavButton>
          </PaginationWrapper>
        </TableCard>
      </MainArea>
    </Layout>
  );
};
