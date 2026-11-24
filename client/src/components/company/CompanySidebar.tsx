import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { DeliveryTruckIcon } from '../DeliveryTruckIcon';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Truck,
  Car,
  UserCheck,
  LogOut,
} from 'lucide-react';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: #263544;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-height: 100vh;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 900px) {
    width: 72px;
  }
`;

const LogoSection = styled.div`
  padding: 1.5rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 900px) {
    padding: 1.25rem 0.75rem;
    justify-content: center;
  }
`;

const LogoTitle = styled.h1`
  font-size: 1.45rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  gap: 0.25rem;
  flex: 1;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.5rem;
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  position: relative;

  &:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.05);
  }

  &.active {
    color: #ffffff;
    background-color: #3b4d61;
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #38bdf8;
    }
  }

  @media (max-width: 900px) {
    padding: 0.9rem;
    justify-content: center;

    span {
      display: none;
    }
  }
`;

const FooterSection = styled.div`
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 900px) {
    padding: 1rem 0.5rem;
    display: flex;
    justify-content: center;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background-color: rgba(239, 68, 68, 0.12);
  }

  @media (max-width: 900px) {
    padding: 0.75rem;
    justify-content: center;

    span {
      display: none;
    }
  }
`;

export const CompanySidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarContainer>
      <LogoSection>
        <DeliveryTruckIcon size={36} />
        <LogoTitle>LogiSync</LogoTitle>
      </LogoSection>

      <NavList>
        <StyledNavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </StyledNavLink>

        <StyledNavLink to="/pedidos" className={({ isActive }) => (isActive ? 'active' : '')}>
          <Package size={20} />
          <span>Pedidos</span>
        </StyledNavLink>

        <StyledNavLink to="/entregas" className={({ isActive }) => (isActive ? 'active' : '')}>
          <Truck size={20} />
          <span>Entregas</span>
        </StyledNavLink>

        <StyledNavLink to="/veiculos" className={({ isActive }) => (isActive ? 'active' : '')}>
          <Car size={20} />
          <span>Veículos</span>
        </StyledNavLink>

        <StyledNavLink to="/motoristas" className={({ isActive }) => (isActive ? 'active' : '')}>
          <UserCheck size={20} />
          <span>Motoristas</span>
        </StyledNavLink>
      </NavList>

      <FooterSection>
        <LogoutButton onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sair da Conta</span>
        </LogoutButton>
      </FooterSection>
    </SidebarContainer>
  );
};
