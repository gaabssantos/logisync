import styled from 'styled-components';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import { Plus, Search, Phone } from 'lucide-react';

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

export const CompanyDriversPage = () => {
  const drivers: Driver[] = [
    {
      id: 'MOT-01',
      name: 'Carlos Eduardo Lima',
      phone: '(11) 98765-4321',
      vehicle: 'Mercedes Sprinter (ABC-1234)',
      status: 'EM ROTA',
      deliveriesToday: 14,
    },
    {
      id: 'MOT-02',
      name: 'Ricardo Souza',
      phone: '(21) 97654-3210',
      vehicle: 'VW Delivery (XYZ-5678)',
      status: 'DISPONÍVEL',
      deliveriesToday: 8,
    },
    {
      id: 'MOT-03',
      name: 'Marcos Vinicius',
      phone: '(31) 96543-2109',
      vehicle: 'Renault Master (KJH-9876)',
      status: 'EM ROTA',
      deliveriesToday: 19,
    },
    {
      id: 'MOT-04',
      name: 'Felipe Alencar',
      phone: '(85) 95432-1098',
      vehicle: 'Iveco Daily (BRA-2E19)',
      status: 'DISPONÍVEL',
      deliveriesToday: 11,
    },
    {
      id: 'MOT-05',
      name: 'Lucas Martins',
      phone: '(41) 94321-0987',
      vehicle: 'Em manutenção',
      status: 'FOLGA',
      deliveriesToday: 0,
    },
  ];

  return (
    <Layout>
      <CompanySidebar />

      <MainArea>
        <CompanyHeader title="Gestão de Motoristas" />

        <TopActions>
          <SearchBox>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Buscar por nome, placa ou ID..." />
          </SearchBox>

          <AddButton onClick={() => alert('Cadastrar novo motorista')}>
            <Plus size={18} />
            <span>Novo Motorista</span>
          </AddButton>
        </TopActions>

        <TableCard>
          <TableHeader>
            <TableTitle>Motoristas Cadastrados</TableTitle>
            <TotalBadge>{drivers.length} ativos</TotalBadge>
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
