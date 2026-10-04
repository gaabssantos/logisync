import styled from 'styled-components';
import { DeliveryTruckIcon } from './DeliveryTruckIcon';
import { Check } from 'lucide-react';

const BannerContainer = styled.aside`
  background: linear-gradient(165deg, #2484d8 0%, #1a6cb8 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 2.5rem;
  position: relative;
  overflow: hidden;
  min-height: 100%;

  @media (max-width: 900px) {
    padding: 2.5rem 1.5rem;
    min-height: auto;
  }
`;

const TruckWrapper = styled.div`
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
  animation: float 4s ease-in-out infinite;

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }
`;

const Title = styled.h1`
  font-size: 2.85rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.88);
  font-weight: 400;
  margin-bottom: 2.75rem;
  text-align: center;
`;

const BenefitsList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  width: 100%;
  max-width: 320px;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 0.98rem;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.15px;
`;

const CheckCircle = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
`;

export const AuthBanner = () => {
  const benefits = [
    'Rastreamento em tempo real',
    'Gestão completa de frotas',
    'Relatórios detalhados',
    'Interface moderna e intuitiva',
  ];

  return (
    <BannerContainer>
      <TruckWrapper>
        <DeliveryTruckIcon size={76} />
      </TruckWrapper>

      <Title>LogiSync</Title>
      <Subtitle>Sistema completo de gestão logística</Subtitle>

      <BenefitsList>
        {benefits.map((benefit, index) => (
          <BenefitItem key={index}>
            <CheckCircle>
              <Check size={14} color="#ffffff" strokeWidth={3} />
            </CheckCircle>
            <span>{benefit}</span>
          </BenefitItem>
        ))}
      </BenefitsList>
    </BannerContainer>
  );
};
