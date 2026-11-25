import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import { Search, PlusCircle, Pencil, Trash2, X } from 'lucide-react';
import { api, formatDate, formatMoney } from '../../services/api';
import { ErrorAlert } from '../../components/ErrorAlert';

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
  max-width: 440px;
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
`;

const FilterPill = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.86rem;
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

const NewOrderButton = styled.button`
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

/* Tabela de Lista de Pacotes */
const TableCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TableHeader = styled.div`
  padding: 1.5rem 1.75rem 1rem 1.75rem;
  border-bottom: 1px solid #f1f5f9;
`;

const TableTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
`;

const TableResponsiveWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 1rem 1.25rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  text-transform: capitalize;

  &:last-child {
    text-align: center;
  }
`;

const Tr = styled.tr`
  transition: background-color 0.15s ease;

  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }

  &:hover {
    background-color: #f8fafc;
  }
`;

const Td = styled.td`
  padding: 1.1rem 1.25rem;
  font-size: 0.88rem;
  color: #475569;
  vertical-align: middle;

  &:last-child {
    text-align: center;
  }
`;

const CodeText = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  color: #94a3b8;
`;

const STATUS_COLORS: Record<string, [string, string]> = {
  PENDENTE: ['#fee2e2', '#dc2626'],
  PREPARANDO: ['#dbeafe', '#2563eb'],
  ENVIADO: ['#ede9fe', '#7c3aed'],
  ENTREGUE: ['#dcfce7', '#16a34a'],
  CANCELADO: ['#f1f5f9', '#64748b'],
};

const StatusPill = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.28rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  background-color: ${({ $status }) => (STATUS_COLORS[$status] || STATUS_COLORS.CANCELADO)[0]};
  color: ${({ $status }) => (STATUS_COLORS[$status] || STATUS_COLORS.CANCELADO)[1]};
`;

const PriorityPill = styled.span<{ $priority: 'Alta' | 'Média' | 'Baixa' }>`
  display: inline-block;
  padding: 0.25rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;

  ${({ $priority }) => {
    switch ($priority) {
      case 'Alta':
        return `
          background-color: #fee2e2;
          color: #dc2626;
        `;
      case 'Média':
        return `
          background-color: #fef3c7;
          color: #d97706;
        `;
      case 'Baixa':
        return `
          background-color: #f3e8ff;
          color: #9333ea;
        `;
    }
  }}
`;

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $type: 'edit' | 'delete' }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  ${({ $type }) =>
    $type === 'edit'
      ? `
        background-color: #f97316;
        color: #ffffff;
        &:hover {
          background-color: #ea580c;
        }
      `
      : `
        background-color: #e2e8f0;
        color: #94a3b8;
        &:hover {
          background-color: #cbd5e1;
          color: #475569;
        }
      `}
`;

/* Paginação */
const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
`;

const PageNavButton = styled.button`
  padding: 0.4rem 0.8rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f8fafc;
    color: #1e293b;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNumberButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;

  ${({ $active }) =>
    $active
      ? `
        background-color: #2580d3;
        color: #ffffff;
      `
      : `
        background-color: #ffffff;
        color: #64748b;
        border: 1px solid #e2e8f0;
        &:hover {
          background-color: #f8fafc;
          color: #1e293b;
        }
      `}
`;

/* Modal de Novo Pedido */
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
  max-width: 500px;
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

interface OrderItem {
  dbId: number;
  id: string;
  client: string;
  origin: string;
  destination: string;
  status: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  date: string;
  value: string;
  rawValue: string;
}

interface PedidoApi {
  id: number; codigo: string; cliente: string; origem: string; destino: string;
  data: string; valor: string; prioridade: 'ALTA' | 'MEDIA' | 'BAIXA'; status: string;
}

// rótulos exibidos na tela para os valores gravados no banco
const STATUS_LABEL: Record<string, string> = {
  PENDENTE: 'PENDENTE', EM_SEPARACAO: 'PREPARANDO', ENVIADO: 'ENVIADO', ENTREGUE: 'ENTREGUE', CANCELADO: 'CANCELADO',
};
const PRIORIDADE_LABEL = { ALTA: 'Alta', MEDIA: 'Média', BAIXA: 'Baixa' } as const;
const PRIORIDADE_API = { Alta: 'ALTA', 'Média': 'MEDIA', Baixa: 'BAIXA' } as const;

export const CompanyOrdersPage = () => {
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'PENDENTE' | 'PREPARANDO'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pedidos carregados da API (RF07)
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      const rows = await api<PedidoApi[]>('/pedidos');
      setOrders(rows.map((r) => ({
        dbId: r.id,
        id: r.codigo,
        client: r.cliente,
        origin: r.origem,
        destination: r.destino,
        status: STATUS_LABEL[r.status] || r.status,
        priority: PRIORIDADE_LABEL[r.prioridade] || 'Média',
        date: formatDate(r.data),
        value: formatMoney(r.valor),
        rawValue: Number(r.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      })));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Form novo pedido
  const [newClient, setNewClient] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newPriority, setNewPriority] = useState<'Alta' | 'Média' | 'Baixa'>('Média');
  const [newValue, setNewValue] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        filterStatus === 'Todos' ? true : order.status === filterStatus;
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.destination.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, filterStatus, searchTerm]);

  // pedido em edição (null = novo pedido) e erro exibido dentro da janela
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState('');

  const openNewOrder = () => {
    setEditingId(null);
    setNewClient('');
    setNewOrigin('');
    setNewDestination('');
    setNewPriority('Média');
    setNewValue('');
    setFormError('');
    setIsModalOpen(true);
  };

  // RF06: edição de pedido (a API recusa pedidos que não estão pendentes)
  const openEditOrder = (order: OrderItem) => {
    setEditingId(order.dbId);
    setNewClient(order.client);
    setNewOrigin(order.origin);
    setNewDestination(order.destination);
    setNewPriority(order.priority);
    setNewValue(order.rawValue);
    setFormError('');
    setIsModalOpen(true);
  };

  // RF05/RF06: cadastro ou edição na API. Em caso de erro, a janela continua aberta
  // com os dados digitados, e a mensagem é exibida dentro dela.
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormError('');
    try {
      await api(editingId ? `/pedidos/${editingId}` : '/pedidos', {
        method: editingId ? 'PUT' : 'POST',
        body: { cliente: newClient, origem: newOrigin, destino: newDestination,
                valor: newValue, prioridade: PRIORIDADE_API[newPriority] },
      });
      setIsModalOpen(false);
      await loadOrders();
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  // RF06: exclusão (a API recusa pedidos que não estão pendentes)
  const handleDelete = async (dbId: number, client: string) => {
    if (!confirm(`Tem certeza que deseja remover o pedido de ${client}?`)) return;
    setError('');
    try {
      await api(`/pedidos/${dbId}`, { method: 'DELETE' });
      await loadOrders();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Layout>
      <CompanySidebar />

      <MainArea>
        <CompanyHeader title="Pedidos" />

        {/* Barra de Filtros e Ações */}
        {error && <ErrorAlert role="alert">{error}</ErrorAlert>}

        <FilterCard>
          <SearchInputWrapper>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Buscar por código, empresa, destinatário ou cidade..."
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
              $active={filterStatus === 'PENDENTE'}
              onClick={() => setFilterStatus('PENDENTE')}
            >
              Pendentes
            </FilterPill>
            <FilterPill
              $active={filterStatus === 'PREPARANDO'}
              onClick={() => setFilterStatus('PREPARANDO')}
            >
              Preparando
            </FilterPill>
          </FilterButtonsGroup>

          <NewOrderButton onClick={openNewOrder}>
            <PlusCircle size={18} />
            <span>Novo Pedido</span>
          </NewOrderButton>
        </FilterCard>

        {/* Tabela de Lista de Pacotes */}
        <TableCard>
          <TableHeader>
            <TableTitle>Lista de Pacotes</TableTitle>
          </TableHeader>

          <TableResponsiveWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <Th>Código</Th>
                  <Th>Cliente</Th>
                  <Th>Origem</Th>
                  <Th>Destino</Th>
                  <Th>Status</Th>
                  <Th>Prioridade</Th>
                  <Th>Data</Th>
                  <Th>Valor</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <Tr key={`${order.id}-${idx}`}>
                    <Td>
                      <CodeText>{order.id}</CodeText>
                    </Td>
                    <Td style={{ fontWeight: 500, color: '#1e293b' }}>
                      {order.client}
                    </Td>
                    <Td>{order.origin}</Td>
                    <Td>{order.destination}</Td>
                    <Td>
                      <StatusPill $status={order.status}>
                        {order.status}
                      </StatusPill>
                    </Td>
                    <Td>
                      <PriorityPill $priority={order.priority}>
                        {order.priority}
                      </PriorityPill>
                    </Td>
                    <Td>{order.date}</Td>
                    <Td style={{ fontWeight: 500, color: '#1e293b' }}>
                      {order.value}
                    </Td>
                    <Td>
                      <ActionsGroup>
                        <ActionButton
                          $type="edit"
                          onClick={() => openEditOrder(order)}
                          aria-label="Editar Pedido"
                        >
                          <Pencil size={15} />
                        </ActionButton>
                        <ActionButton
                          $type="delete"
                          onClick={() => handleDelete(order.dbId, order.client)}
                          aria-label="Excluir Pedido"
                        >
                          <Trash2 size={15} />
                        </ActionButton>
                      </ActionsGroup>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </StyledTable>
          </TableResponsiveWrapper>

          {/* Paginação */}
          <PaginationWrapper>
            <PageNavButton disabled>◀ Anterior</PageNavButton>
            <PageNumberButton $active>1</PageNumberButton>
            <PageNavButton disabled>Próximo ▶</PageNavButton>
          </PaginationWrapper>
        </TableCard>

        {/* Modal de Novo Pedido */}
        {isModalOpen && (
          <ModalOverlay onClick={() => setIsModalOpen(false)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <h3>{editingId ? 'Editar Pedido' : 'Criar Novo Pedido'}</h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </ModalHeader>

              <form onSubmit={handleSaveOrder}>
                {formError && <ErrorAlert role="alert">{formError}</ErrorAlert>}
                <FormGroup>
                  <label>Nome do Cliente</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Matheus Duarte"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                  />
                </FormGroup>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <FormGroup>
                    <label>Origem (Cidade, UF)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Curitiba, PR"
                      value={newOrigin}
                      onChange={(e) => setNewOrigin(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Destino (Cidade, UF)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: São Paulo, SP"
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                    />
                  </FormGroup>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <FormGroup>
                    <label>Prioridade</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as 'Alta' | 'Média' | 'Baixa')}
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <label>Valor (R$)</label>
                    <input
                      type="text"
                      required
                      inputMode="decimal"
                      placeholder="Ex: 1.234,56"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </FormGroup>
                </div>

                <ModalSubmitButton type="submit" style={{ width: '100%', marginTop: '1.25rem' }}>
                  {editingId ? 'Salvar Alterações' : 'Salvar Pedido'}
                </ModalSubmitButton>
              </form>
            </ModalCard>
          </ModalOverlay>
        )}
      </MainArea>
    </Layout>
  );
};
