import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.15rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.75rem;
`;

const PageTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.3px;
`;

const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AvatarCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #2580d3;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(37, 128, 211, 0.35);
`;

const ProfileName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #475569;
`;

interface CompanyHeaderProps {
  title?: string;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ title = 'Dashboard' }) => {
  const { user } = useAuth();
  const displayName = user?.name || 'Empresa';
  const initialLetter = displayName.charAt(0).toUpperCase() || 'E';

  return (
    <HeaderContainer>
      <PageTitle>{title}</PageTitle>

      <ProfileArea>
        <AvatarCircle>{initialLetter}</AvatarCircle>
        <ProfileName>{displayName}</ProfileName>
      </ProfileArea>
    </HeaderContainer>
  );
};
