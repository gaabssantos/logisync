import React from 'react';
import styled from 'styled-components';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import { Construction } from 'lucide-react';

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
`;

const PlaceholderCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  color: #64748b;

  h3 {
    color: #1e293b;
    font-size: 1.35rem;
  }
`;

interface PlaceholderProps {
  title: string;
}

export const CompanyPlaceholderPage: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <Layout>
      <CompanySidebar />
      <MainArea>
        <CompanyHeader title={title} />
        <PlaceholderCard>
          <Construction size={48} color="#2580d3" />
          <h3>Módulo de {title}</h3>
          <p>Esta seção está em desenvolvimento e será integrada em breve ao LogiSync.</p>
        </PlaceholderCard>
      </MainArea>
    </Layout>
  );
};
