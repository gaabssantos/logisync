import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import { AuthBanner } from '../components/AuthBanner';
import { RegisterForm } from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext';

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  padding: 0;

  @media (min-width: 900px) {
    padding: 2rem;
  }
`;

const CardContainer = styled.main`
  display: grid;
  grid-template-columns: 45% 55%;
  width: 100%;
  max-width: 1060px;
  min-height: 640px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04);
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 500px;
    border-radius: 12px;
    margin: 1rem;
    min-height: auto;
  }
`;

const FormSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2.5rem;
  background-color: #ffffff;

  @media (max-width: 600px) {
    padding: 2rem 1.25rem;
  }
`;

export const RegisterPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <PageWrapper>
      <CardContainer>
        <AuthBanner />
        <FormSection>
          <RegisterForm />
        </FormSection>
      </CardContainer>
    </PageWrapper>
  );
};
