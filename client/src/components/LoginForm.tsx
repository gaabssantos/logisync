import { useState } from 'react';
import styled from 'styled-components';
import { Building2, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FormContainer = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.25rem;
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
  margin-bottom: 1.85rem;
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

  svg {
    transition: transform 0.2s ease;
  }

  &:active svg {
    transform: scale(0.95);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  font-size: 0.88rem;
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
  padding: 0.85rem 1rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.92rem;
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

const OptionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
  cursor: pointer;
  user-select: none;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: #2580d3;
    cursor: pointer;
  }
`;

const ForgotPasswordLink = styled.a`
  color: #2580d3;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.15s;

  &:hover {
    color: #1a62a7;
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.9rem;
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
  margin-top: 1.75rem;
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

export const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login } = useAuth();

  const currentTab = (searchParams.get('tipo') as 'empresa' | 'usuario') || 'empresa';
  const [accountType, setAccountType] = useState<'empresa' | 'usuario'>(currentTab);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTabChange = (type: 'empresa' | 'usuario') => {
    setAccountType(type);
    setSearchParams({ tipo: type });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: accountType === 'empresa' ? (identifier.split('@')[0] || 'Empresa LogiSync') : (identifier || 'Usuário LogiSync'),
      email: identifier,
      type: accountType,
    });
    navigate('/', { replace: true });
  };

  return (
    <FormContainer>
      <Header>
        <Greeting>Bem-vindo!</Greeting>
        <Subtitle>Faça login para acessar sua conta</Subtitle>
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

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="identifier">
            {accountType === 'empresa' ? 'Email Corporativo' : 'E-mail ou CPF'}
          </Label>
          <InputWrapper>
            <StyledInput
              id="identifier"
              type={accountType === 'empresa' ? 'email' : 'text'}
              placeholder={
                accountType === 'empresa'
                  ? 'Digite seu email corporativo'
                  : 'Digite seu E-mail ou Cpf'
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Senha</Label>
          <InputWrapper>
            <StyledInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </PasswordToggle>
          </InputWrapper>
        </FormGroup>

        <OptionsRow>
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Lembrar de mim</span>
          </CheckboxLabel>

          <ForgotPasswordLink
            href="#esqueceu-senha"
            onClick={(e) => {
              e.preventDefault();
              alert('Instruções de recuperação de senha enviadas!');
            }}
          >
            Esqueceu sua senha?
          </ForgotPasswordLink>
        </OptionsRow>

        <SubmitButton type="submit">Entrar</SubmitButton>
      </form>

      <FooterText>
        Não tem uma conta?
        {accountType === 'empresa' ? (
          <button
            type="button"
            onClick={() => navigate('/cadastro?tipo=empresa')}
          >
            Cadastre sua empresa aqui
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/cadastro?tipo=usuario')}
          >
            Cadastre-se como cliente
          </button>
        )}
      </FooterText>
    </FormContainer>
  );
};
