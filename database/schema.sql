-- =============================================
-- Script de criação do banco de dados Hummingbird
-- Azure Database for PostgreSQL
-- =============================================

-- Tabela de médicos
CREATE TABLE IF NOT EXISTS medicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crm VARCHAR(20) NOT NULL UNIQUE,
    nome_medico VARCHAR(200) NOT NULL,
    especialidade VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de clínicas
CREATE TABLE IF NOT EXISTS clinicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    nome_clinica VARCHAR(200) NOT NULL,
    endereco VARCHAR(300),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de agenda
CREATE TABLE IF NOT EXISTS agenda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_cliente VARCHAR(200) NOT NULL,
    crm VARCHAR(20) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    data DATE NOT NULL,
    hora VARCHAR(5) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de prontuário
CREATE TABLE IF NOT EXISTS prontuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_cliente VARCHAR(200) NOT NULL UNIQUE,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_agenda_crm ON agenda(crm);
CREATE INDEX IF NOT EXISTS idx_agenda_cnpj ON agenda(cnpj);
CREATE INDEX IF NOT EXISTS idx_agenda_cliente ON agenda(id_cliente);
CREATE INDEX IF NOT EXISTS idx_prontuario_cliente ON prontuario(id_cliente);
