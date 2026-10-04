import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { DeliveryTruckIcon } from '../components/DeliveryTruckIcon';
import { LogOut, Package, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
`;

const Navbar = styled.nav`
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoText = styled.span`
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
`;

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const UserBadge = styled.div`
  text-align: right;
  line-height: 1.2;
`;

const UserName = styled.p`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
`;

const UserRole = styled.span`
  font-size: 0.78rem;
  color: #64748b;
  text-transform: capitalize;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #fee2e2;
  color: #ef4444;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fecaca;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, #2580d3 0%, #1a62a7 100%);
  border-radius: 16px;
  padding: 2.5rem;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 25px -5px rgba(37, 128, 211, 0.3);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
`;

const BannerText = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.05rem;
    color: rgba(255, 255, 255, 0.9);
    max-width: 550px;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const MetricCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const IconCircle = styled.div<{ $bg: string; $color: string }>`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricInfo = styled.div`
  span {
    font-size: 0.82rem;
    color: #64748b;
    font-weight: 500;
  }
  h3 {
    font-size: 1.5rem;
    color: #1e293b;
    font-weight: 700;
    margin-top: 0.2rem;
  }
`;

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <Container>
      <Navbar>
        <LogoArea>
          <DeliveryTruckIcon size={36} />
          <LogoText>LogiSync</LogoText>
        </LogoArea>
        <UserArea>
          <UserBadge>
            <UserName>{user?.name || 'Usuário Logado'}</UserName>
            <UserRole>{user?.type === 'empresa' ? 'Conta Corporativa' : 'Conta Pessoal'}</UserRole>
          </UserBadge>
          <LogoutButton onClick={logout}>
            <LogOut size={16} />
            <span>Sair</span>
          </LogoutButton>
        </UserArea>
      </Navbar>

      <MainContent>
        <WelcomeBanner>
          <BannerText>
            <h1>Painel de Controle LogiSync</h1>
            <p>
              Bem-vindo ao centro integrado de operações e gestão de entregas em tempo real.
            </p>
          </BannerText>
          <DeliveryTruckIcon size={90} />
        </WelcomeBanner>

        <MetricsGrid>
          <MetricCard>
            <IconCircle $bg="#eff6ff" $color="#2580d3">
              <Package size={26} />
            </IconCircle>
            <MetricInfo>
              <span>Entregas em Rota</span>
              <h3>42</h3>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconCircle $bg="#ecfdf5" $color="#10b981">
              <TrendingUp size={26} />
            </IconCircle>
            <MetricInfo>
              <span>Eficiência Logística</span>
              <h3>98.4%</h3>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconCircle $bg="#f5f3ff" $color="#8b5cf6">
              <Users size={26} />
            </IconCircle>
            <MetricInfo>
              <span>Motoristas Ativos</span>
              <h3>18</h3>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconCircle $bg="#fffbeb" $color="#f59e0b">
              <ShieldCheck size={26} />
            </IconCircle>
            <MetricInfo>
              <span>Status Operacional</span>
              <h3>100% OK</h3>
            </MetricInfo>
          </MetricCard>
        </MetricsGrid>
      </MainContent>
    </Container>
  );
};
