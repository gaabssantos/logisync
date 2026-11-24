import { useState, useMemo } from 'react';
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

const PageEllipsis = styled.span`
  color: #94a3b8;
  font-size: 0.85rem;
  padding: 0 0.25rem;
`;

interface DeliveryItem {
  id: string;
  route: string;
  driver: string;
  status: 'AGUARDANDO' | 'ENTREGUE' | 'EM TRÂNSITO' | 'ATRASADA';
  eta: string;
}

export const CompanyDeliveriesPage = () => {
  const [filterStatus, setFilterStatus] = useState<
    'Todos' | 'Aguardando' | 'Em Trânsito' | 'Entregues' | 'Atrasados'
  >('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Lista com dados fiéis à imagem fornecida
  const deliveries: DeliveryItem[] = [
    {
      id: '#ENT01',
      route: 'Santo André - São Paulo',
      driver: 'João Silva',
      status: 'AGUARDANDO',
      eta: 'Quarta-feira 16:30',
    },
    {
      id: '#ENT02',
      route: 'Santo André - São Paulo',
      driver: 'Ana Santos',
      status: 'ENTREGUE',
      eta: 'Concluído',
    },
    {
      id: '#ENT03',
      route: 'Santo André - São Paulo',
      driver: 'Carlos Mendes',
      status: 'EM TRÂNSITO',
      eta: 'Amanhã 12:00',
    },
    {
      id: '#ENT04',
      route: 'Santo André - São Paulo',
      driver: 'Fernanda Lima',
      status: 'ATRASADA',
      eta: 'Atrasada 2h',
    },
    {
      id: '#ENT05',
      route: 'Santo André - São Paulo',
      driver: 'Roberto Alves',
      status: 'EM TRÂNSITO',
      eta: 'Amanhã 19:30',
    },
    {
      id: '#ENT06',
      route: 'Santo André - São Paulo',
      driver: 'Roberto Alves',
      status: 'ENTREGUE',
      eta: 'Concluído',
    },
  ];

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
              <MetricValue>12</MetricValue>
              <MetricLabel>Aguardando Coleta</MetricLabel>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#e0f2fe" $color="#0284c7">
              <Truck size={24} />
            </IconBadge>
            <MetricInfo>
              <MetricValue>8</MetricValue>
              <MetricLabel>Em Trânsito</MetricLabel>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#dcfce7" $color="#16a34a">
              <CheckCircle2 size={24} />
            </IconBadge>
            <MetricInfo>
              <MetricValue>142</MetricValue>
              <MetricLabel>Concluídos</MetricLabel>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#fee2e2" $color="#dc2626">
              <AlertTriangle size={24} />
            </IconBadge>
            <MetricInfo>
              <MetricValue>3</MetricValue>
              <MetricLabel>Atrasados</MetricLabel>
            </MetricInfo>
          </MetricCard>
        </MetricsGrid>

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
            <TableTotal>Total: 20 entregas</TableTotal>
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
                      <PhoneCallButton
                        onClick={() =>
                          alert(`Ligando para o condutor da entrega ${item.id} (${item.driver})...`)
                        }
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
            <PageNavButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ◀ Anterior
            </PageNavButton>

            <PageNumberButton
              $active={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              1
            </PageNumberButton>
            <PageNumberButton
              $active={currentPage === 2}
              onClick={() => setCurrentPage(2)}
            >
              2
            </PageNumberButton>
            <PageNumberButton
              $active={currentPage === 3}
              onClick={() => setCurrentPage(3)}
            >
              3
            </PageNumberButton>

            <PageEllipsis>...</PageEllipsis>

            <PageNumberButton
              $active={currentPage === 63}
              onClick={() => setCurrentPage(63)}
            >
              63
            </PageNumberButton>

            <PageNavButton onClick={() => setCurrentPage((p) => p + 1)}>
              Próximo ▶
            </PageNavButton>
          </PaginationWrapper>
        </TableCard>
      </MainArea>
    </Layout>
  );
};
