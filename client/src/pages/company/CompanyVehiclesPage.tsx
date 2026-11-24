import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  Search,
  PlusCircle,
  Pencil,
  Wrench,
  Trash2,
  X,
} from 'lucide-react';

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

/* 4 Cards de Métricas */
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.75rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
  }
`;

const IconBadge = styled.div<{ $bg: string; $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MetricInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetricValue = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
  line-height: 1.1;
`;

const MetricLabel = styled.p`
  font-size: 0.84rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 0.2rem;
`;

/* Barra de Filtros e Ações */
const FilterCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  padding: 0.6rem 1.25rem;
  width: 100%;
  max-width: 380px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #2580d3;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(37, 128, 211, 0.1);
  }

  input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.88rem;
    color: #1e293b;
    width: 100%;

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

const FilterButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterPill = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1.15rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
  background-color: ${({ $active }) => ($active ? '#2580d3' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#64748b')};
  border: 1px solid ${({ $active }) => ($active ? '#2580d3' : '#e2e8f0')};

  &:hover {
    background-color: ${({ $active }) => ($active ? '#1e70bb' : '#f8fafc')};
    color: ${({ $active }) => ($active ? '#ffffff' : '#1e293b')};
  }
`;

const AddVehicleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #10b981;
  color: #ffffff;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);

  &:hover {
    background-color: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
  }
`;

/* Grid de Cards dos Veículos */
const VehiclesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 950px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const VehicleCard = styled.div`
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  background-color: #f1f5f9;
  padding: 1.25rem 1.25rem 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-bottom: 1px solid #e2e8f0;
`;

const VehicleTypeBadge = styled.span`
  align-self: flex-start;
  background-color: #2580d3;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  text-transform: capitalize;
`;

const VehicleModel = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
`;

const PlateText = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82rem;
  color: #94a3b8;
`;

const CardBody = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  flex: 1;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.86rem;

  .label {
    color: #94a3b8;
  }

  .value {
    color: #334155;
    font-weight: 600;
  }
`;

const StatusBadge = styled.span<{
  $status: 'DISPONÍVEL' | 'EM TRÂNSITO' | 'MANUTENÇÃO';
}>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;

  ${({ $status }) => {
    switch ($status) {
      case 'DISPONÍVEL':
        return `
          background-color: #d1fae5;
          color: #059669;
        `;
      case 'EM TRÂNSITO':
        return `
          background-color: #fef3c7;
          color: #d97706;
        `;
      case 'MANUTENÇÃO':
        return `
          background-color: #fee2e2;
          color: #dc2626;
        `;
    }
  }}
`;

const CardActions = styled.div`
  padding: 1rem 1.25rem 1.25rem 1.25rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  border-top: 1px solid #f8fafc;
`;

const ActionBtn = styled.button<{
  $variant: 'edit' | 'maintenance' | 'delete';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.5rem 0.25rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  transition: all 0.15s ease;

  ${({ $variant }) => {
    switch ($variant) {
      case 'edit':
        return `
          background-color: #e0f2fe;
          color: #0284c7;
          &:hover {
            background-color: #bae6fd;
          }
        `;
      case 'maintenance':
        return `
          background-color: #ffedd5;
          color: #ea580c;
          &:hover {
            background-color: #fed7aa;
          }
        `;
      case 'delete':
        return `
          background-color: #fee2e2;
          color: #dc2626;
          &:hover {
            background-color: #fecaca;
          }
        `;
    }
  }}
`;

/* Modal de Novo Veículo */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
`;

const ModalCard = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
  }

  button {
    background: transparent;
    color: #94a3b8;
    &:hover {
      color: #1e293b;
    }
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.86rem;
    font-weight: 600;
    color: #334155;
  }

  input, select {
    padding: 0.75rem 1rem;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #1e293b;
    outline: none;

    &:focus {
      background-color: #ffffff;
      border-color: #2580d3;
    }
  }
`;

const ModalSubmitButton = styled.button`
  background-color: #10b981;
  color: #ffffff;
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: #059669;
  }
`;

interface VehicleItem {
  id: string;
  type: string;
  model: string;
  plate: string;
  status: 'DISPONÍVEL' | 'EM TRÂNSITO' | 'MANUTENÇÃO';
  driver: string;
  capacity: string;
  lastMaintenance: string;
}

export const CompanyVehiclesPage = () => {
  const [filterStatus, setFilterStatus] = useState<
    'Todos' | 'Disponíveis' | 'Em Trânsito' | 'Manutenção'
  >('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lista com dados e formato idênticos à imagem fornecida pelo usuário
  const [vehicles, setVehicles] = useState<VehicleItem[]>([
    {
      id: '1',
      type: 'Caminhão',
      model: 'Mercedes-Benz',
      plate: 'ABC-1234',
      status: 'DISPONÍVEL',
      driver: 'Marco Silva',
      capacity: '15 toneladas',
      lastMaintenance: '12/08/2025',
    },
    {
      id: '2',
      type: 'Caminhão',
      model: 'Mercedes-Benz',
      plate: 'ABC-1234',
      status: 'EM TRÂNSITO',
      driver: 'Marco Silva',
      capacity: '15 toneladas',
      lastMaintenance: '12/08/2025',
    },
    {
      id: '3',
      type: 'Caminhão',
      model: 'Mercedes-Benz',
      plate: 'ABC-1234',
      status: 'MANUTENÇÃO',
      driver: 'Marco Silva',
      capacity: '15 toneladas',
      lastMaintenance: '12/08/2025',
    },
    {
      id: '4',
      type: 'Caminhão',
      model: 'Mercedes-Benz',
      plate: 'ABC-1234',
      status: 'MANUTENÇÃO',
      driver: 'Marco Silva',
      capacity: '15 toneladas',
      lastMaintenance: '12/08/2025',
    },
  ]);

  // Form states novo veículo
  const [newModel, setNewModel] = useState('');
  const [newType, setNewType] = useState('Caminhão');
  const [newPlate, setNewPlate] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newCapacity, setNewCapacity] = useState('');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      let matchesStatus = true;
      if (filterStatus === 'Disponíveis') matchesStatus = v.status === 'DISPONÍVEL';
      else if (filterStatus === 'Em Trânsito') matchesStatus = v.status === 'EM TRÂNSITO';
      else if (filterStatus === 'Manutenção') matchesStatus = v.status === 'MANUTENÇÃO';

      const matchesSearch =
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.driver.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [vehicles, filterStatus, searchTerm]);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: VehicleItem = {
      id: String(Date.now()),
      type: newType,
      model: newModel,
      plate: newPlate.toUpperCase(),
      status: 'DISPONÍVEL',
      driver: newDriver || 'Não atribuído',
      capacity: newCapacity || '10 toneladas',
      lastMaintenance: new Date().toLocaleDateString('pt-BR'),
    };

    setVehicles([newVehicle, ...vehicles]);
    setIsModalOpen(false);
    setNewModel('');
    setNewPlate('');
    setNewDriver('');
    setNewCapacity('');
  };

  const handleDelete = (id: string, model: string, plate: string) => {
    if (confirm(`Remover veículo ${model} (${plate})?`)) {
      setVehicles(vehicles.filter((v) => v.id !== id));
    }
  };

  const handleToggleMaintenance = (id: string) => {
    setVehicles(
      vehicles.map((v) => {
        if (v.id === id) {
          const nextStatus =
            v.status === 'MANUTENÇÃO' ? 'DISPONÍVEL' : 'MANUTENÇÃO';
          return { ...v, status: nextStatus };
        }
        return v;
      })
    );
  };

  return (
    <Layout>
      <CompanySidebar />

      <MainArea>
        <CompanyHeader title="Veículos" />

        {/* 4 Cards de Métricas */}
        <MetricsGrid>
          <MetricCard>
            <IconBadge $bg="#ffedd5" $color="#ea580c">
              <Truck size={24} />
            </IconBadge>
            <MetricInfo>
              <MetricValue>12</MetricValue>
              <MetricLabel>Total de Veículos</MetricLabel>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#e0f2fe" $color="#0284c7">
              <CheckCircle2 size={24} />
            </IconBadge>
            <MetricInfo>
              <MetricValue>8</MetricValue>
              <MetricLabel>Disponíveis</MetricLabel>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#dcfce7" $color="#16a34a">
              <Truck size={24} />
            </IconBadge>
            <MetricInfo>
              <MetricValue>3</MetricValue>
              <MetricLabel>Em Trânsito</MetricLabel>
            </MetricInfo>
          </MetricCard>

          <MetricCard>
            <IconBadge $bg="#fee2e2" $color="#dc2626">
              <AlertTriangle size={24} />
            </IconBadge>
            <MetricInfo>
              <MetricValue>1</MetricValue>
              <MetricLabel>Manutenção</MetricLabel>
            </MetricInfo>
          </MetricCard>
        </MetricsGrid>

        {/* Barra de Filtros e Busca */}
        <FilterCard>
          <SearchInputWrapper>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Buscar por código, placa ou motorista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputWrapper>

          <FilterButtonsGroup>
            <FilterPill
              $active={filterStatus === 'Todos'}
              onClick={() => setFilterStatus('Todos')}
            >
              Todos
            </FilterPill>
            <FilterPill
              $active={filterStatus === 'Disponíveis'}
              onClick={() => setFilterStatus('Disponíveis')}
            >
              Disponíveis
            </FilterPill>
            <FilterPill
              $active={filterStatus === 'Em Trânsito'}
              onClick={() => setFilterStatus('Em Trânsito')}
            >
              Em Trânsito
            </FilterPill>
            <FilterPill
              $active={filterStatus === 'Manutenção'}
              onClick={() => setFilterStatus('Manutenção')}
            >
              Manutenção
            </FilterPill>
          </FilterButtonsGroup>

          <AddVehicleButton onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} />
            <span>Adicionar</span>
          </AddVehicleButton>
        </FilterCard>

        {/* Grid de Cards dos Veículos */}
        <VehiclesGrid>
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id}>
              <CardHeader>
                <VehicleTypeBadge>{vehicle.type}</VehicleTypeBadge>
                <VehicleModel>{vehicle.model}</VehicleModel>
                <PlateText>{vehicle.plate}</PlateText>
              </CardHeader>

              <CardBody>
                <InfoRow>
                  <span className="label">Status:</span>
                  <StatusBadge $status={vehicle.status}>
                    {vehicle.status}
                  </StatusBadge>
                </InfoRow>

                <InfoRow>
                  <span className="label">Motorista:</span>
                  <span className="value">{vehicle.driver}</span>
                </InfoRow>

                <InfoRow>
                  <span className="label">Capacidade:</span>
                  <span className="value">{vehicle.capacity}</span>
                </InfoRow>

                <InfoRow>
                  <span className="label">Última Manutenção:</span>
                  <span className="value">{vehicle.lastMaintenance}</span>
                </InfoRow>
              </CardBody>

              <CardActions>
                <ActionBtn
                  $variant="edit"
                  onClick={() => alert(`Editar veículo ${vehicle.model} (${vehicle.plate})`)}
                >
                  <Pencil size={13} />
                  <span>Editar</span>
                </ActionBtn>
                <ActionBtn
                  $variant="maintenance"
                  onClick={() => handleToggleMaintenance(vehicle.id)}
                  title="Alterar status de manutenção"
                >
                  <Wrench size={13} />
                  <span>Manutenção</span>
                </ActionBtn>
                <ActionBtn
                  $variant="delete"
                  onClick={() =>
                    handleDelete(vehicle.id, vehicle.model, vehicle.plate)
                  }
                >
                  <Trash2 size={13} />
                  <span>Excluir</span>
                </ActionBtn>
              </CardActions>
            </VehicleCard>
          ))}
        </VehiclesGrid>

        {/* Modal de Novo Veículo */}
        {isModalOpen && (
          <ModalOverlay onClick={() => setIsModalOpen(false)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h3>Adicionar Novo Veículo</h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </ModalHeader>

              <form onSubmit={handleAddVehicle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <FormGroup>
                    <label>Tipo de Veículo</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                    >
                      <option value="Caminhão">Caminhão</option>
                      <option value="Van">Van</option>
                      <option value="Furgão">Furgão</option>
                      <option value="Carreta">Carreta</option>
                    </select>
                  </FormGroup>

                  <FormGroup>
                    <label>Placa do Veículo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: ABC-1234"
                      value={newPlate}
                      onChange={(e) => setNewPlate(e.target.value)}
                    />
                  </FormGroup>
                </div>

                <FormGroup style={{ marginTop: '0.75rem' }}>
                  <label>Marca e Modelo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mercedes-Benz Accelo"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                  />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <FormGroup>
                    <label>Motorista Responsável</label>
                    <input
                      type="text"
                      placeholder="Ex: Marco Silva"
                      value={newDriver}
                      onChange={(e) => setNewDriver(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Capacidade de Carga</label>
                    <input
                      type="text"
                      placeholder="Ex: 15 toneladas"
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(e.target.value)}
                    />
                  </FormGroup>
                </div>

                <ModalSubmitButton type="submit" style={{ width: '100%', marginTop: '1.25rem' }}>
                  Cadastrar Veículo
                </ModalSubmitButton>
              </form>
            </ModalCard>
          </ModalOverlay>
        )}
      </MainArea>
    </Layout>
  );
};
