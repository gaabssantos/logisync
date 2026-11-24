import styled from 'styled-components';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import { ClipboardList, Banknote, Package, Truck } from 'lucide-react';

const DashboardLayout = styled.div`
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

/* Cards de Métricas */
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

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
  padding: 1.35rem 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
  }
`;

const IconBadge = styled.div<{ $bg: string; $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricValue = styled.h3`
  font-size: 1.65rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
  line-height: 1.1;
`;

const MetricLabel = styled.p`
  font-size: 0.84rem;
  color: #94a3b8;
  font-weight: 500;
`;

/* Tabela de Pedidos Recentes */
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
`;

const TableTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
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
    font-weight: 500;
    color: #1e293b;
  }
`;

const CodeBadge = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  color: #94a3b8;
`;

const StatusBadge = styled.span<{ $status: 'ENTREGUE' | 'EM TRÂNSITO' | 'PENDENTE' }>`
  display: inline-block;
  padding: 0.28rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  ${({ $status }) => {
    switch ($status) {
      case 'ENTREGUE':
        return `
          background-color: #d1fae5;
          color: #059669;
        `;
      case 'EM TRÂNSITO':
        return `
          background-color: #fef3c7;
          color: #d97706;
        `;
      case 'PENDENTE':
        return `
          background-color: #fee2e2;
          color: #dc2626;
        `;
    }
  }}
`;

interface Order {
  id: string;
  client: string;
  destination: string;
  status: 'ENTREGUE' | 'EM TRÂNSITO' | 'PENDENTE';
  value: string;
}

export const CompanyDashboardPage = () => {
  const orders: Order[] = [
    {
      id: '#001',
      client: 'João Silva',
      destination: 'Rio de Janeiro, RJ',
      status: 'ENTREGUE',
      value: 'R$ 125,00',
    },
    {
      id: '#002',
      client: 'Maria Oliveira',
      destination: 'Brasília, DF',
      status: 'EM TRÂNSITO',
      value: 'R$ 89,90',
    },
    {
      id: '#003',
      client: 'Pedro Costa',
      destination: 'Rio de Janeiro, RJ',
      status: 'PENDENTE',
      value: 'R$ 167,00',
    },
    {
      id: '#004',
      client: 'Ana Santos',
      destination: 'Fortaleza, CE',
      status: 'ENTREGUE',
      value: 'R$ 58,90',
    },
    {
      id: '#005',
      client: 'Ana Santos',
      destination: 'Fortaleza, CE',
      status: 'EM TRÂNSITO',
      value: 'R$ 58,90',
    },
    {
      id: '#006',
      client: 'Ana Santos',
      destination: 'Fortaleza, CE',
      status: 'PENDENTE',
      value: 'R$ 58,90',
    },
  ];

  return (
    <DashboardLayout>
      <CompanySidebar />

      <MainArea>
        <CompanyHeader title="Dashboard" />

        {/* 4 Cards de Métricas do Topo */}
        <MetricsGrid>
          <MetricCard>
            <IconBadge $bg="#ffedd5" $color="#ea580c">
              <ClipboardList size={22} />
            </IconBadge>
            <div>
              <MetricValue>156</MetricValue>
              <MetricLabel>Pedidos do Mês</MetricLabel>
            </div>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#dcfce7" $color="#16a34a">
              <Banknote size={22} />
            </IconBadge>
            <div>
              <MetricValue>R$ 28.450</MetricValue>
              <MetricLabel>Receita Mensal</MetricLabel>
            </div>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#e0f2fe" $color="#0284c7">
              <Package size={22} />
            </IconBadge>
            <div>
              <MetricValue>142</MetricValue>
              <MetricLabel>Entregas Realizadas</MetricLabel>
            </div>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#f3e8ff" $color="#9333ea">
              <Truck size={22} />
            </IconBadge>
            <div>
              <MetricValue>8</MetricValue>
              <MetricLabel>Veículos Ativos</MetricLabel>
            </div>
          </MetricCard>
        </MetricsGrid>

        {/* Tabela de Pedidos Recentes */}
        <TableCard>
          <TableHeader>
            <TableTitle>Pedidos Recentes</TableTitle>
          </TableHeader>

          <TableResponsiveWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <Th>Código</Th>
                  <Th>Cliente</Th>
                  <Th>Destino</Th>
                  <Th>Status</Th>
                  <Th>Valor</Th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <Tr key={order.id}>
                    <Td>
                      <CodeBadge>{order.id}</CodeBadge>
                    </Td>
                    <Td style={{ fontWeight: 500 }}>{order.client}</Td>
                    <Td>{order.destination}</Td>
                    <Td>
                      <StatusBadge $status={order.status}>
                        {order.status}
                      </StatusBadge>
                    </Td>
                    <Td>{order.value}</Td>
                  </Tr>
                ))}
              </tbody>
            </StyledTable>
          </TableResponsiveWrapper>
        </TableCard>
      </MainArea>
    </DashboardLayout>
  );
};
