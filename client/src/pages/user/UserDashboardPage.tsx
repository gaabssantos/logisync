import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DeliveryTruckIcon } from '../../components/DeliveryTruckIcon';
import { useAuth } from '../../context/AuthContext';
import { api, formatDate, formatDateTime } from '../../services/api';
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  Zap,
  MessageSquare,
  Calculator,
  History,
  User,
  LogOut,
} from 'lucide-react';

const PageBackground = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #9333ea 100%);
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 1rem;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1180px;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

/* Header Superior Flutuante */
const TopHeader = styled.header`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 1rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoText = styled.h1`
  font-size: 1.55rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
`;

const UserProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  text-align: right;
  line-height: 1.25;

  .name {
    font-size: 0.98rem;
    font-weight: 700;
    color: #1e293b;
  }

  .email {
    font-size: 0.8rem;
    color: #94a3b8;
  }
`;

const UserAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #0284c7;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35);
`;

const LogoutMiniBtn = styled.button`
  background: transparent;
  color: #94a3b8;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #ef4444;
    background-color: #fee2e2;
  }
`;

/* Grid Principal em 2 Colunas */
const MainGrid = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.75rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

/* Cards Brancos */
const WhiteCard = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
`;

/* Card: Rastrear Encomenda */
const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;

  h2 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #1e293b;
  }
`;

const TrackingInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  padding: 0.35rem 0.5rem 0.35rem 1.25rem;
  transition: all 0.2s;

  &:focus-within {
    border-color: #2580d3;
    box-shadow: 0 0 0 3px rgba(37, 128, 211, 0.12);
  }

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.88rem;
    color: #1e293b;

    &::placeholder {
      color: #94a3b8;
      font-size: 0.82rem;
    }
  }
`;

const TrackButton = styled.button`
  background-color: #0284c7;
  color: #ffffff;
  padding: 0.55rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #0369a1;
  }
`;

/* Cards de Métricas Centralizadas */
const MetricCenteredCard = styled(WhiteCard)`
  align-items: center;
  justify-content: center;
  padding: 2.25rem 1.5rem;
  text-align: center;
  gap: 0.75rem;
`;

const MetricIconCircle = styled.div<{ $bg: string; $color: string }>`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
`;

const MetricBigNumber = styled.span`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
`;

const MetricLabelText = styled.span`
  font-size: 0.88rem;
  color: #94a3b8;
  font-weight: 500;
`;

/* Card: Meus Envios */
const ShipmentsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const ShipmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ShipmentItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 1.15rem;

  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }
`;

const ShipmentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  .code {
    font-size: 0.88rem;
    font-weight: 700;
    color: #2563eb;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  .location-row {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: #475569;
    font-weight: 500;
  }

  .date {
    font-size: 0.78rem;
    color: #94a3b8;
  }
`;

const StatusPill = styled.span`
  background-color: #fef3c7;
  color: #d97706;
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

/* Card: Acesso Rápido */
const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
`;

const QuickAccessButton = styled.button`
  background-color: #f5f3ff;
  color: #7c3aed;
  border-radius: 12px;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: #ede9fe;
    transform: translateY(-2px);
  }
`;

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: 'PENDENTE', EM_SEPARACAO: 'EM SEPARAÇÃO', ENVIADO: 'ENVIADO', AGUARDANDO: 'AGUARDANDO COLETA',
  EM_TRANSITO: 'EM TRÂNSITO', ENTREGUE: 'ENTREGUE', SAIU_PARA_ENTREGA: 'SAIU PARA ENTREGA', CANCELADO: 'CANCELADO', CANCELADA: 'CANCELADA',
};

interface Envio { codigo: string; destino: string; data: string; status: string }
interface Rastreio {
  codigo: string; origem: string; destino: string; statusPedido: string; statusEntrega: string | null; previsao: string | null;
  historico: { dataHora: string; status: string; localizacao: string | null }[];
}

export const UserDashboardPage = () => {
  const { user, logout } = useAuth();
  const [trackingCode, setTrackingCode] = useState('');
  const [tracking, setTracking] = useState<{ ok: boolean; lines: string[] } | null>(null);

  // RF17: envios do cliente carregados da API
  const [shipments, setShipments] = useState<Envio[]>([]);
  useEffect(() => {
    api<Envio[]>('/meus-envios').then(setShipments).catch(() => setShipments([]));
  }, []);

  const displayName = user?.name || 'Cliente LogiSync';
  const displayEmail = user?.email || '';
  const initials = displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const delivered = shipments.filter((s) => s.status === 'ENTREGUE').length;

  // RF16: rastreamento pelo código
  const handleTrack = async () => {
    if (!trackingCode.trim()) {
      setTracking({ ok: false, lines: ['Informe o código de rastreamento.'] });
      return;
    }
    try {
      const r = await api<Rastreio>(`/rastreamento/${encodeURIComponent(trackingCode.trim())}`);
      const status = STATUS_LABEL[r.statusEntrega || r.statusPedido] || r.statusEntrega || r.statusPedido;
      setTracking({
        ok: true,
        lines: [
          `Encomenda ${r.codigo}: ${status}`,
          `${r.origem} → ${r.destino}${r.previsao ? ` · previsão ${formatDateTime(r.previsao)}` : ''}`,
          ...r.historico.map((h) => `${formatDateTime(h.dataHora)} · ${STATUS_LABEL[h.status] || h.status}${h.localizacao ? ` · ${h.localizacao}` : ''}`),
        ],
      });
    } catch (err) {
      setTracking({ ok: false, lines: [(err as Error).message] });
    }
  };

  return (
    <PageBackground>
      <ContentContainer>
        {/* Header Superior */}
        <TopHeader>
          <LogoArea>
            <DeliveryTruckIcon size={38} />
            <LogoText>LogiSync</LogoText>
          </LogoArea>

          <UserProfileArea>
            <UserInfo>
              <div className="name">{displayName}</div>
              <div className="email">{displayEmail}</div>
            </UserInfo>
            <UserAvatar>{initials}</UserAvatar>
            <LogoutMiniBtn onClick={logout} title="Sair da conta">
              <LogOut size={18} />
            </LogoutMiniBtn>
          </UserProfileArea>
        </TopHeader>

        {/* Grid Principal */}
        <MainGrid>
          {/* Coluna Esquerda */}
          <LeftColumn>
            {/* Card: Rastrear Encomenda */}
            <WhiteCard>
              <CardHeader>
                <Search size={20} color="#94a3b8" />
                <h2>Rastrear Encomenda</h2>
              </CardHeader>
              <TrackingInputWrapper>
                <input
                  type="text"
                  placeholder="Digite o código de rastreamento (Ex.: LS2026110003)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                />
                <TrackButton onClick={handleTrack}>Rastrear</TrackButton>
              </TrackingInputWrapper>

              {tracking && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: tracking.ok ? '#ecfdf5' : '#fef2f2',
                    color: tracking.ok ? '#065f46' : '#991b1b',
                    fontSize: '0.85rem',
                    border: `1px solid ${tracking.ok ? '#a7f3d0' : '#fecaca'}`,
                  }}
                >
                  {tracking.lines.map((l, i) => (
                    <div key={i} style={{ fontWeight: i === 0 ? 700 : 400, marginTop: i > 1 ? 4 : 0 }}>{l}</div>
                  ))}
                </div>
              )}
            </WhiteCard>

            {/* Card: Total de Envios */}
            <MetricCenteredCard>
              <MetricIconCircle $bg="#0284c7" $color="#ffffff">
                <Package size={26} />
              </MetricIconCircle>
              <MetricBigNumber>{shipments.length}</MetricBigNumber>
              <MetricLabelText>Total de Envios</MetricLabelText>
            </MetricCenteredCard>

            {/* Card: Entregues */}
            <MetricCenteredCard>
              <MetricIconCircle $bg="#10b981" $color="#ffffff">
                <CheckCircle2 size={26} />
              </MetricIconCircle>
              <MetricBigNumber>{delivered}</MetricBigNumber>
              <MetricLabelText>Entregues</MetricLabelText>
            </MetricCenteredCard>
          </LeftColumn>

          {/* Coluna Direita */}
          <RightColumn>
            {/* Card: Meus Envios */}
            <WhiteCard>
              <ShipmentsHeader>
                <CardHeader style={{ marginBottom: 0 }}>
                  <Truck size={22} color="#94a3b8" />
                  <h2>Meus Envios</h2>
                </CardHeader>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                  Adicionados automaticamente
                </span>
              </ShipmentsHeader>

              <ShipmentsList>
                {shipments.length === 0 && (
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Nenhum envio vinculado à sua conta.</span>
                )}
                {shipments.map((shipment) => (
                  <ShipmentItem key={shipment.codigo}>
                    <ShipmentDetails>
                      <span className="code">{shipment.codigo}</span>
                      <div className="location-row">
                        <MapPin size={15} color="#ef4444" />
                        <span>{shipment.destino}</span>
                      </div>
                      <span className="date">Enviado em {formatDate(shipment.data)}</span>
                    </ShipmentDetails>
                    <StatusPill>{STATUS_LABEL[shipment.status] || shipment.status}</StatusPill>
                  </ShipmentItem>
                ))}
              </ShipmentsList>
            </WhiteCard>

            {/* Card: Acesso Rápido */}
            <WhiteCard>
              <CardHeader>
                <Zap size={20} color="#94a3b8" />
                <h2>Acesso Rápido</h2>
              </CardHeader>

              <QuickAccessGrid>
                <QuickAccessButton onClick={() => alert('Abrindo canal de suporte LogiSync...')}>
                  <MessageSquare size={22} />
                  <span>Suporte</span>
                </QuickAccessButton>

                <QuickAccessButton onClick={() => alert('Calculadora de frete e prazos')}>
                  <Calculator size={22} />
                  <span>Calcular Frete</span>
                </QuickAccessButton>

                <QuickAccessButton onClick={() => alert('Histórico completo de entregas e pedidos')}>
                  <History size={22} />
                  <span>Histórico</span>
                </QuickAccessButton>

                <QuickAccessButton onClick={() => alert('Configurações de perfil do usuário')}>
                  <User size={22} />
                  <span>Perfil</span>
                </QuickAccessButton>
              </QuickAccessGrid>
            </WhiteCard>
          </RightColumn>
        </MainGrid>
      </ContentContainer>
    </PageBackground>
  );
};
