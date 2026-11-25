import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserDashboardPage } from './user/UserDashboardPage';

/**
 * MainDashboardDispatcher:
 * Clientes (perfil "usuario") veem o dashboard de rastreamento;
 * contas de empresa são levadas ao módulo de pedidos.
 */
export const MainDashboardDispatcher: React.FC = () => {
  const { user } = useAuth();
  if (user?.type === 'empresa') return <Navigate to="/pedidos" replace />;
  return <UserDashboardPage />;
};
