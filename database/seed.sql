-- =====================================================================
-- LogiSync - Carga inicial de dados para desenvolvimento e testes
-- Todos os dados são fictícios (CNPJ, CPF, CNH, placas e pessoas).
--
-- Senha de todos os usuários de teste: Teste@123
-- (armazenada como hash bcrypt, custo 10)
-- =====================================================================

SET NAMES utf8mb4;
USE logisync;

SET @senha = '$2b$10$SW1dXhAR5o2YeYgQotKsruE0aSmhpngKlXVhEcEBgjYfhUriGI8PO';

-- ---------------------------------------------------------------------
-- Empresas
-- ---------------------------------------------------------------------
INSERT INTO empresa (id_empresa, razao_social, cnpj, telefone, email, endereco) VALUES
  (1, 'TransRápido Logística Ltda',   '11.222.333/0001-44', '(11) 4002-1000', 'contato@transrapido.test', 'Av. Goiás, 1200 - São Caetano do Sul/SP'),
  (2, 'ABC Cargas e Encomendas ME',   '55.666.777/0001-88', '(11) 4433-2000', 'contato@abccargas.test',   'Rua das Flores, 45 - Santo André/SP');

-- ---------------------------------------------------------------------
-- Usuários (administrador do sistema, usuários das empresas e clientes)
-- ---------------------------------------------------------------------
INSERT INTO usuario (id_usuario, id_empresa, nome, cpf, email, telefone, senha, tipo) VALUES
  (1, 1,    'Ana Paula Ribeiro',   '111.111.111-11', 'admin@logisync.test',        '(11) 98888-0001', @senha, 'ADMIN'),
  (2, 1,    'Marcos Ferreira',     '222.222.222-22', 'marcos@transrapido.test',    '(11) 98888-0002', @senha, 'GERENTE'),
  (3, 1,    'Juliana Costa',       '333.333.333-33', 'juliana@transrapido.test',   '(11) 98888-0003', @senha, 'OPERADOR'),
  (4, 2,    'Carlos Henrique Almeida', '444.444.444-44', 'carlos@abccargas.test',  '(11) 98888-0004', @senha, 'GERENTE'),
  (5, NULL, 'Carlos Oliveira',     '555.555.555-55', 'carlos.oliveira@cliente.test', '(11) 97777-0005', @senha, 'CLIENTE'),
  (6, NULL, 'Beatriz Santos',      '666.666.666-66', 'beatriz@cliente.test',       '(11) 97777-0006', @senha, 'CLIENTE');

-- ---------------------------------------------------------------------
-- Motoristas
-- ---------------------------------------------------------------------
INSERT INTO motorista (id_motorista, id_empresa, nome, cpf, cnh, telefone, email, data_admissao, status) VALUES
  (1, 1, 'Carlos Silva',      '777.777.777-01', '01234567801', '(11) 96666-0001', 'carlos.silva@transrapido.test', '2019-03-11', 'EM_ROTA'),
  (2, 1, 'Roberto Lima',      '777.777.777-02', '01234567802', '(11) 96666-0002', NULL,                            '2021-07-01', 'EM_ROTA'),
  (3, 1, 'Fernanda Souza',    '777.777.777-03', '01234567803', '(11) 96666-0003', NULL,                            '2022-01-17', 'FOLGA'),
  (4, 2, 'José Pereira',      '777.777.777-04', '01234567804', '(11) 96666-0004', NULL,                            '2020-05-04', 'EM_ROTA');

-- ---------------------------------------------------------------------
-- Veículos
-- ---------------------------------------------------------------------
INSERT INTO veiculo (id_veiculo, id_empresa, id_motorista, placa, modelo, tipo, capacidade, ano, status, ultima_manutencao) VALUES
  (1, 1, 1,    'ABC1D23', 'Mercedes-Benz Accelo 1016', 'CAMINHAO',   6000.00, 2020, 'EM_TRANSITO', '2026-09-15'),
  (2, 1, 2,    'DEF4G56', 'Fiat Ducato Cargo',         'VAN',        1500.00, 2022, 'EM_TRANSITO', '2026-10-02'),
  (3, 1, NULL, 'GHI7J89', 'Renault Master',            'VAN',        1600.00, 2019, 'MANUTENCAO',  '2026-11-20'),
  (4, 2, 4,    'JKL0M12', 'Fiat Fiorino',              'UTILITARIO',  650.00, 2023, 'EM_TRANSITO', '2026-08-30');

-- ---------------------------------------------------------------------
-- Pedidos
-- ---------------------------------------------------------------------
INSERT INTO pedido (id_pedido, id_empresa, id_usuario, codigo_rastreamento, cliente, origem, destino, data_pedido, valor, prioridade, status, observacao) VALUES
  (1, 1, 5,    'LS2026110001', 'Carlos Oliveira',       'São Caetano do Sul/SP', 'Campinas/SP',      '2026-11-18 09:30:00', 350.00, 'ALTA',  'ENTREGUE',     NULL),
  (2, 1, 6,    'LS2026110002', 'Beatriz Santos',        'São Caetano do Sul/SP', 'Santos/SP',        '2026-11-20 14:10:00', 220.00, 'MEDIA', 'ENVIADO',      'Entregar em horário comercial'),
  (3, 1, 5,    'LS2026110003', 'Carlos Oliveira',       'São Caetano do Sul/SP', 'Sorocaba/SP',      '2026-11-21 10:00:00', 480.00, 'ALTA',  'ENVIADO',      NULL),
  (4, 1, NULL, 'LS2026110004', 'Mercado Bom Preço',     'São Caetano do Sul/SP', 'São Paulo/SP',     '2026-11-22 08:45:00', 150.00, 'BAIXA', 'EM_SEPARACAO', NULL),
  (5, 1, NULL, 'LS2026110005', 'Farmácia Vida',         'São Caetano do Sul/SP', 'Diadema/SP',       '2026-11-23 11:20:00',  90.00, 'MEDIA', 'PENDENTE',     NULL),
  (6, 2, NULL, 'LS2026110006', 'Loja Central Calçados', 'Santo André/SP',        'Mauá/SP',          '2026-11-22 16:00:00', 120.00, 'MEDIA', 'ENVIADO',      NULL);

-- ---------------------------------------------------------------------
-- Entregas (uma por pedido já despachado)
-- ---------------------------------------------------------------------
INSERT INTO entrega (id_entrega, id_pedido, id_motorista, id_veiculo, data_prevista, data_saida, data_entrega, status, recebedor, confirmada_em) VALUES
  (1, 1, 1, 1, '2026-11-19 18:00:00', '2026-11-19 08:00:00', '2026-11-19 15:40:00', 'ENTREGUE',    'Carlos Oliveira', '2026-11-19 15:40:00'),
  (2, 2, 2, 2, '2026-11-22 17:00:00', '2026-11-21 08:30:00', NULL,                  'EM_TRANSITO', NULL,              NULL),
  (3, 3, 1, 1, '2026-11-23 12:00:00', '2026-11-22 07:50:00', NULL,                  'EM_TRANSITO', NULL,              NULL),
  (4, 6, 4, 4, '2026-11-24 12:00:00', NULL,                  NULL,                  'AGUARDANDO',  NULL,              NULL);

-- ---------------------------------------------------------------------
-- Histórico de rastreamento
-- ---------------------------------------------------------------------
INSERT INTO rastreamento (id_entrega, data_hora, status, localizacao, latitude, longitude, observacao) VALUES
  (1, '2026-11-19 08:00:00', 'SAIU_PARA_ENTREGA', 'São Caetano do Sul/SP', -23.62270000, -46.55480000, NULL),
  (1, '2026-11-19 11:15:00', 'EM_TRANSITO',       'Jundiaí/SP',            -23.18640000, -46.88420000, NULL),
  (1, '2026-11-19 15:40:00', 'ENTREGUE',          'Campinas/SP',           -22.90560000, -47.06080000, 'Recebido pelo cliente'),
  (2, '2026-11-21 08:30:00', 'SAIU_PARA_ENTREGA', 'São Caetano do Sul/SP', -23.62270000, -46.55480000, NULL),
  (2, '2026-11-21 10:05:00', 'EM_TRANSITO',       'Cubatão/SP',            -23.89500000, -46.42500000, NULL),
  (3, '2026-11-22 07:50:00', 'SAIU_PARA_ENTREGA', 'São Caetano do Sul/SP', -23.62270000, -46.55480000, NULL),
  (3, '2026-11-23 09:20:00', 'EM_TRANSITO',       'Itu/SP',                -23.26420000, -47.29920000, 'Trânsito intenso na Castello Branco');

-- ---------------------------------------------------------------------
-- Ocorrências
-- ---------------------------------------------------------------------
INSERT INTO ocorrencia (id_entrega, tipo, justificativa, data_hora) VALUES
  (3, 'ATRASO', 'Congestionamento na Rodovia Castello Branco; nova previsão de entrega às 14h.', '2026-11-23 09:25:00');
