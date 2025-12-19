-- Tabela de Médicos
CREATE TABLE public.medicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crm TEXT NOT NULL UNIQUE,
  nome_medico TEXT NOT NULL,
  especialidade TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Clínicas
CREATE TABLE public.clinicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cnpj TEXT NOT NULL UNIQUE,
  nome_clinica TEXT NOT NULL,
  endereco TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Agenda
CREATE TABLE public.agenda (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_cliente TEXT NOT NULL,
  crm TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  data DATE NOT NULL,
  hora TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Prontuário
CREATE TABLE public.prontuario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  id_cliente TEXT NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prontuario ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para leitura (app interno da clínica)
CREATE POLICY "Permitir leitura de médicos" ON public.medicos FOR SELECT USING (true);
CREATE POLICY "Permitir leitura de clínicas" ON public.clinicas FOR SELECT USING (true);
CREATE POLICY "Permitir todas operações em agenda" ON public.agenda FOR ALL USING (true);
CREATE POLICY "Permitir todas operações em prontuário" ON public.prontuario FOR ALL USING (true);

-- Inserir dados de exemplo
INSERT INTO public.medicos (crm, nome_medico, especialidade) VALUES
  ('CRM-12345', 'Dr. Carlos Silva', 'Cardiologista'),
  ('CRM-67890', 'Dra. Maria Santos', 'Dermatologista'),
  ('CRM-11111', 'Dr. João Oliveira', 'Ortopedista');

INSERT INTO public.clinicas (cnpj, nome_clinica, endereco) VALUES
  ('12.345.678/0001-90', 'Life Clinic Centro', 'Av. Principal, 100 - Centro'),
  ('98.765.432/0001-10', 'Life Clinic Norte', 'Rua das Flores, 500 - Zona Norte');