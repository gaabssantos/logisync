-- =====================================================================
-- LogiSync - Script de criação do banco de dados (MySQL 8)
-- Modelo físico baseado na Figura 33 do relatório (Modelo do BD Relacional)
-- Regras de negócio indicadas por RFxx referem-se aos requisitos do cap. 6.1
-- =====================================================================

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS logisync
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE logisync;

-- ---------------------------------------------------------------------
-- EMPRESA: transportadoras/empresas que utilizam a plataforma
-- ---------------------------------------------------------------------
CREATE TABLE empresa (
  id_empresa    INT           NOT NULL AUTO_INCREMENT,
  razao_social  VARCHAR(100)  NOT NULL,
  cnpj          VARCHAR(18)   NOT NULL,              -- formato 00.000.000/0000-00
  telefone      VARCHAR(20)   NULL,
  email         VARCHAR(100)  NOT NULL,
  endereco      VARCHAR(150)  NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_empresa PRIMARY KEY (id_empresa),
  CONSTRAINT uq_empresa_cnpj UNIQUE (cnpj)          -- RF02: CNPJ não pode se repetir
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- USUARIO: contas de acesso. Usuários de empresa (ADMIN/GERENTE/OPERADOR)
-- possuem id_empresa; clientes finais (CLIENTE) não possuem.
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
  id_usuario    INT           NOT NULL AUTO_INCREMENT,
  id_empresa    INT           NULL,
  nome          VARCHAR(100)  NOT NULL,
  cpf           VARCHAR(14)   NULL,                  -- formato 000.000.000-00
  email         VARCHAR(100)  NOT NULL,
  telefone      VARCHAR(20)   NULL,
  senha         VARCHAR(255)  NOT NULL,              -- hash bcrypt, nunca a senha em texto puro
  tipo          ENUM('ADMIN','GERENTE','OPERADOR','CLIENTE') NOT NULL DEFAULT 'CLIENTE',
  ativo         TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
  CONSTRAINT uq_usuario_email UNIQUE (email),        -- RF01: e-mail não pode se repetir
  CONSTRAINT uq_usuario_cpf UNIQUE (cpf),
  CONSTRAINT fk_usuario_empresa FOREIGN KEY (id_empresa)
    REFERENCES empresa (id_empresa) ON DELETE RESTRICT,  -- sem ação referencial: a coluna é usada no CHECK abaixo
  -- RF03: perfis de empresa precisam estar vinculados a uma empresa
  CONSTRAINT ck_usuario_perfil CHECK (tipo = 'CLIENTE' OR id_empresa IS NOT NULL)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- TOKEN_RECUPERACAO: tokens temporários de redefinição de senha (RF04)
-- ---------------------------------------------------------------------
CREATE TABLE token_recuperacao (
  id_token      INT           NOT NULL AUTO_INCREMENT,
  id_usuario    INT           NOT NULL,
  token         CHAR(64)      NOT NULL,
  expira_em     DATETIME      NOT NULL,
  usado         TINYINT(1)    NOT NULL DEFAULT 0,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_token_recuperacao PRIMARY KEY (id_token),
  CONSTRAINT uq_token UNIQUE (token),
  CONSTRAINT fk_token_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- MOTORISTA
-- ---------------------------------------------------------------------
CREATE TABLE motorista (
  id_motorista  INT           NOT NULL AUTO_INCREMENT,
  id_empresa    INT           NOT NULL,
  nome          VARCHAR(100)  NOT NULL,
  cpf           VARCHAR(14)   NOT NULL,
  cnh           VARCHAR(20)   NOT NULL,
  telefone      VARCHAR(20)   NULL,
  email         VARCHAR(100)  NULL,
  data_admissao DATE          NULL,
  status        ENUM('DISPONIVEL','EM_ROTA','FOLGA') NOT NULL DEFAULT 'DISPONIVEL',
  ativo         TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_motorista PRIMARY KEY (id_motorista),
  CONSTRAINT uq_motorista_cpf UNIQUE (cpf),
  CONSTRAINT uq_motorista_cnh UNIQUE (cnh),
  CONSTRAINT fk_motorista_empresa FOREIGN KEY (id_empresa)
    REFERENCES empresa (id_empresa) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- VEICULO
-- ---------------------------------------------------------------------
CREATE TABLE veiculo (
  id_veiculo        INT           NOT NULL AUTO_INCREMENT,
  id_empresa        INT           NOT NULL,
  id_motorista      INT           NULL,               -- motorista responsável (RF13)
  placa             VARCHAR(10)   NOT NULL,
  modelo            VARCHAR(50)   NOT NULL,
  tipo              ENUM('CAMINHAO','VAN','UTILITARIO','CARRO','MOTO') NOT NULL,
  capacidade        DECIMAL(10,2) NOT NULL,           -- em kg
  ano               INT           NULL,
  status            ENUM('DISPONIVEL','EM_TRANSITO','MANUTENCAO') NOT NULL DEFAULT 'DISPONIVEL',
  ultima_manutencao DATE          NULL,
  ativo             TINYINT(1)    NOT NULL DEFAULT 1,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_veiculo PRIMARY KEY (id_veiculo),
  CONSTRAINT uq_veiculo_placa UNIQUE (placa),        -- RF12: placa não pode se repetir
  CONSTRAINT uq_veiculo_motorista UNIQUE (id_motorista), -- RF13: um veículo por motorista
  CONSTRAINT fk_veiculo_empresa FOREIGN KEY (id_empresa)
    REFERENCES empresa (id_empresa) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_veiculo_motorista FOREIGN KEY (id_motorista)
    REFERENCES motorista (id_motorista) ON DELETE SET NULL,
  CONSTRAINT ck_veiculo_capacidade CHECK (capacidade > 0),
  CONSTRAINT ck_veiculo_ano CHECK (ano IS NULL OR ano BETWEEN 1980 AND 2100)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- PEDIDO: solicitação de transporte registrada pela empresa (RF05)
-- ---------------------------------------------------------------------
CREATE TABLE pedido (
  id_pedido           INT           NOT NULL AUTO_INCREMENT,
  id_empresa          INT           NOT NULL,
  id_usuario          INT           NULL,             -- cliente final, quando cadastrado
  codigo_rastreamento VARCHAR(50)   NOT NULL,
  cliente             VARCHAR(100)  NOT NULL,
  origem              VARCHAR(150)  NOT NULL,
  destino             VARCHAR(150)  NOT NULL,
  data_pedido         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valor               DECIMAL(10,2) NOT NULL,
  prioridade          ENUM('BAIXA','MEDIA','ALTA') NOT NULL DEFAULT 'MEDIA',
  status              ENUM('PENDENTE','EM_SEPARACAO','ENVIADO','ENTREGUE','CANCELADO') NOT NULL DEFAULT 'PENDENTE',
  observacao          TEXT          NULL,
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_pedido PRIMARY KEY (id_pedido),
  CONSTRAINT uq_pedido_codigo UNIQUE (codigo_rastreamento), -- RF16: código único
  CONSTRAINT fk_pedido_empresa FOREIGN KEY (id_empresa)
    REFERENCES empresa (id_empresa) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_pedido_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario) ON DELETE SET NULL,
  CONSTRAINT ck_pedido_valor CHECK (valor >= 0)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- ENTREGA: execução do transporte de um pedido (RF08)
-- ---------------------------------------------------------------------
CREATE TABLE entrega (
  id_entrega      INT           NOT NULL AUTO_INCREMENT,
  id_pedido       INT           NOT NULL,
  id_motorista    INT           NOT NULL,
  id_veiculo      INT           NOT NULL,
  data_prevista   DATETIME      NOT NULL,
  data_saida      DATETIME      NULL,
  data_entrega    DATETIME      NULL,
  status          ENUM('AGUARDANDO','EM_TRANSITO','ENTREGUE','CANCELADA') NOT NULL DEFAULT 'AGUARDANDO',
  recebedor       VARCHAR(100)  NULL,                 -- RF18: confirmação digital
  confirmada_em   DATETIME      NULL,
  observacao      TEXT          NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_entrega PRIMARY KEY (id_entrega),
  CONSTRAINT uq_entrega_pedido UNIQUE (id_pedido),   -- um pedido gera uma entrega (1:1)
  CONSTRAINT fk_entrega_pedido FOREIGN KEY (id_pedido)
    REFERENCES pedido (id_pedido) ON DELETE RESTRICT,
  CONSTRAINT fk_entrega_motorista FOREIGN KEY (id_motorista)
    REFERENCES motorista (id_motorista) ON DELETE RESTRICT,
  CONSTRAINT fk_entrega_veiculo FOREIGN KEY (id_veiculo)
    REFERENCES veiculo (id_veiculo) ON DELETE RESTRICT,
  CONSTRAINT ck_entrega_datas CHECK (data_entrega IS NULL OR data_saida IS NULL OR data_entrega >= data_saida),
  -- RF18: só é concluída após a confirmação digital do recebimento
  CONSTRAINT ck_entrega_confirmacao CHECK (status <> 'ENTREGUE' OR (recebedor IS NOT NULL AND confirmada_em IS NOT NULL))
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- RASTREAMENTO: histórico de posições/status de uma entrega (RF09)
-- ---------------------------------------------------------------------
CREATE TABLE rastreamento (
  id_rastreamento INT           NOT NULL AUTO_INCREMENT,
  id_entrega      INT           NOT NULL,
  data_hora       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status          VARCHAR(30)   NOT NULL,
  localizacao     VARCHAR(150)  NULL,
  latitude        DECIMAL(10,8) NULL,
  longitude       DECIMAL(11,8) NULL,
  observacao      TEXT          NULL,
  CONSTRAINT pk_rastreamento PRIMARY KEY (id_rastreamento),
  CONSTRAINT fk_rastreamento_entrega FOREIGN KEY (id_entrega)
    REFERENCES entrega (id_entrega) ON DELETE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- OCORRENCIA: falhas e atrasos registrados nas entregas (RF10)
-- ---------------------------------------------------------------------
CREATE TABLE ocorrencia (
  id_ocorrencia   INT           NOT NULL AUTO_INCREMENT,
  id_entrega      INT           NOT NULL,
  tipo            ENUM('ATRASO','FALHA','AVARIA','EXTRAVIO') NOT NULL,
  justificativa   TEXT          NOT NULL,             -- RF10: justificativa obrigatória
  data_hora       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_ocorrencia PRIMARY KEY (id_ocorrencia),
  CONSTRAINT fk_ocorrencia_entrega FOREIGN KEY (id_entrega)
    REFERENCES entrega (id_entrega) ON DELETE CASCADE,
  CONSTRAINT ck_ocorrencia_justificativa CHECK (CHAR_LENGTH(TRIM(justificativa)) > 0)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- Índices para busca, filtros e paginação (RF07, RF19, RF20)
-- ---------------------------------------------------------------------
CREATE INDEX ix_pedido_empresa_status   ON pedido (id_empresa, status);
CREATE INDEX ix_pedido_data             ON pedido (data_pedido);
CREATE INDEX ix_entrega_status          ON entrega (status);
CREATE INDEX ix_motorista_empresa       ON motorista (id_empresa, status);
CREATE INDEX ix_veiculo_empresa_status  ON veiculo (id_empresa, status);
CREATE INDEX ix_rastreamento_entrega    ON rastreamento (id_entrega, data_hora);

-- ---------------------------------------------------------------------
-- Regras de negócio que dependem de outras tabelas (triggers)
-- ---------------------------------------------------------------------
DELIMITER $$

-- RF11: veículo inativo ou em manutenção não pode receber entrega
CREATE TRIGGER trg_entrega_veiculo_ativo
BEFORE INSERT ON entrega
FOR EACH ROW
BEGIN
  IF (SELECT ativo = 0 OR status = 'MANUTENCAO' FROM veiculo WHERE id_veiculo = NEW.id_veiculo) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Veículo inativo ou em manutenção não pode ser vinculado a uma entrega (RF11).';
  END IF;
END$$

-- RF06: apenas pedidos com status PENDENTE podem ser editados
CREATE TRIGGER trg_pedido_edicao_pendente
BEFORE UPDATE ON pedido
FOR EACH ROW
BEGIN
  IF OLD.status <> 'PENDENTE'
     AND (NEW.cliente <> OLD.cliente OR NEW.origem <> OLD.origem
          OR NEW.destino <> OLD.destino OR NEW.valor <> OLD.valor) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Somente pedidos com status PENDENTE podem ser editados (RF06).';
  END IF;
END$$

-- RF06: apenas pedidos com status PENDENTE podem ser excluídos
CREATE TRIGGER trg_pedido_exclusao_pendente
BEFORE DELETE ON pedido
FOR EACH ROW
BEGIN
  IF OLD.status <> 'PENDENTE' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Somente pedidos com status PENDENTE podem ser excluídos (RF06).';
  END IF;
END$$

DELIMITER ;
