import { useState } from 'react';
import styled from 'styled-components';
import { Building2, User, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, type User as AuthUser } from '../context/AuthContext';
import { api } from '../services/api';
import { ErrorAlert } from './ErrorAlert';

const FormContainer = styled.div`
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.75rem;
`;

const Greeting = styled.h2`
  font-size: 1.65rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.35rem;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #64748b;
`;

const TabGroup = styled.div`
  display: flex;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.75rem 0.5rem;
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? '#2580d3' : 'transparent')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#64748b')};
  font-weight: 600;
  font-size: 0.92rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ $active }) => ($active ? '#ffffff' : '#1e293b')};
    background-color: ${({ $active }) => ($active ? '#2173be' : '#f8fafc')};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.86rem;
  font-weight: 600;
  color: #334155;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem 0.95rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1e293b;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    background-color: #ffffff;
    border-color: #2580d3;
    box-shadow: 0 0 0 3px rgba(37, 128, 211, 0.15);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: transparent;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  &:hover {
    color: #475569;
  }
`;

const TwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  margin-top: 0.5rem;
  background-color: #2580d3;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(37, 128, 211, 0.25);
  transition: all 0.2s ease;

  &:hover {
    background-color: #1e70bb;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(37, 128, 211, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FooterText = styled.p`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.88rem;
  color: #64748b;

  button {
    background: transparent;
    color: #2580d3;
    font-weight: 600;
    margin-left: 0.25rem;
    transition: color 0.15s;

    &:hover {
      text-decoration: underline;
      color: #1a62a7;
    }
  }
`;

const SuccessAlert = styled.div`
  background-color: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
  font-size: 0.88rem;
`;

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login } = useAuth();

  const currentTab = (searchParams.get('tipo') as 'empresa' | 'usuario') || 'empresa';
  const [accountType, setAccountType] = useState<'empresa' | 'usuario'>(currentTab);

  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleTabChange = (type: 'empresa' | 'usuario') => {
    setAccountType(type);
    setSearchParams({ tipo: type });
    setSuccess(false);
  };

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    try {
      const data = await api<{ token: string; user: AuthUser }>('/auth/register', {
        method: 'POST',
        body: { tipo: accountType, nome: name, documento: document, email, telefone: phone, senha: password },
      });
      setSuccess(true);
      setTimeout(() => {
        login(data.user, data.token);
        navigate(data.user.type === 'empresa' ? '/pedidos' : '/dashboard', { replace: true });
      }, 1200);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <FormContainer>
      <Header>
        <Greeting>
          {accountType === 'empresa' ? 'Cadastro de Empresa' : 'Cadastro de Usuário'}
        </Greeting>
        <Subtitle>Preencha os dados abaixo para criar sua conta</Subtitle>
      </Header>

      <TabGroup>
        <TabButton
          type="button"
          $active={accountType === 'empresa'}
          onClick={() => handleTabChange('empresa')}
        >
          <Building2 size={20} />
          <span>Empresa</span>
        </TabButton>
        <TabButton
          type="button"
          $active={accountType === 'usuario'}
          onClick={() => handleTabChange('usuario')}
        >
          <User size={20} />
          <span>Usuário</span>
        </TabButton>
      </TabGroup>

      {error && <ErrorAlert role="alert">{error}</ErrorAlert>}

      {success && (
        <SuccessAlert>
          <CheckCircle size={18} color="#059669" />
          <span>Cadastro realizado com sucesso! Acessando sistema...</span>
        </SuccessAlert>
      )}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="reg-name">
            {accountType === 'empresa' ? 'Razão Social / Nome da Empresa' : 'Nome Completo'}
          </Label>
          <InputWrapper>
            <StyledInput
              id="reg-name"
              type="text"
              placeholder={
                accountType === 'empresa' ? 'Ex: LogiTech Transportes Ltda' : 'Ex: Gabriel Silva'
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputWrapper>
        </FormGroup>

        <TwoCols>
          <FormGroup>
            <Label htmlFor="reg-doc">{accountType === 'empresa' ? 'CNPJ' : 'CPF'}</Label>
            <InputWrapper>
              <StyledInput
                id="reg-doc"
                type="text"
                placeholder={
                  accountType === 'empresa' ? '00.000.000/0001-00' : '000.000.000-00'
                }
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="reg-phone">Telefone / WhatsApp</Label>
            <InputWrapper>
              <StyledInput
                id="reg-phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>
        </TwoCols>

        <FormGroup>
          <Label htmlFor="reg-email">
            {accountType === 'empresa' ? 'Email Corporativo' : 'E-mail'}
          </Label>
          <InputWrapper>
            <StyledInput
              id="reg-email"
              type="email"
              placeholder={
                accountType === 'empresa' ? 'contato@empresa.com' : 'seuemail@exemplo.com'
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputWrapper>
        </FormGroup>

        <TwoCols>
          <FormGroup>
            <Label htmlFor="reg-password">Senha</Label>
            <InputWrapper>
              <StyledInput
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="reg-confirm-password">Confirmar Senha</Label>
            <InputWrapper>
              <StyledInput
                id="reg-confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repita sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </InputWrapper>
          </FormGroup>
        </TwoCols>

        <SubmitButton type="submit">
          {accountType === 'empresa' ? 'Cadastrar Empresa' : 'Criar Conta'}
        </SubmitButton>
      </form>

      <FooterText>
        Já tem uma conta?
        <button
          type="button"
          onClick={() => navigate(`/login?tipo=${accountType}`)}
        >
          Faça login aqui
        </button>
      </FooterText>
    </FormContainer>
  );
};
