import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyles';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MainDashboardDispatcher } from './pages/MainDashboardDispatcher';
import { CompanyDriversPage } from './pages/company/CompanyDriversPage';
import { CompanyOrdersPage } from './pages/company/CompanyOrdersPage';
import { CompanyDeliveriesPage } from './pages/company/CompanyDeliveriesPage';
import { CompanyVehiclesPage } from './pages/company/CompanyVehiclesPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalStyle />
        <Routes>
          {/* Rotas Públicas de Autenticação */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />

          {/* Rota Unificada do Dashboard (identifica empresa, usuário ou motorista) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainDashboardDispatcher />
              </ProtectedRoute>
            }
          />

          {/* Módulos do Menu Lateral */}
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute>
                <CompanyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entregas"
            element={
              <ProtectedRoute>
                <CompanyDeliveriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/veiculos"
            element={
              <ProtectedRoute>
                <CompanyVehiclesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/motoristas"
            element={
              <ProtectedRoute>
                <CompanyDriversPage />
              </ProtectedRoute>
            }
          />

          {/* Redirecionamento da raiz protegida para /dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          {/* Redirecionamento retrocompatível */}
          <Route path="/empresa/dashboard" element={<Navigate to="/dashboard" replace />} />

          {/* Fallback de rotas desconhecidas */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
