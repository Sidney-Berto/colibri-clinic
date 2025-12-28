// Cliente API para comunicação com Azure Functions
// Substitui o cliente Supabase

const API_URL = import.meta.env.VITE_API_URL || "";

// Tipos compartilhados
export interface Medico {
  id: string;
  crm: string;
  nome_medico: string;
  especialidade: string | null;
}

export interface Clinica {
  id: string;
  cnpj: string;
  nome_clinica: string;
  endereco: string | null;
}

export interface Agendamento {
  id: string;
  id_cliente: string;
  crm: string;
  cnpj: string;
  data: string;
  hora: string;
}

export interface Prontuario {
  id: string;
  id_cliente: string;
  descricao: string | null;
  created_at: string;
  updated_at: string;
}

// Funções auxiliares
async function handleResponse<T>(response: Response): Promise<{ data: T | null; error: Error | null }> {
  if (!response.ok) {
    const errorText = await response.text();
    return { data: null, error: new Error(errorText || `HTTP ${response.status}`) };
  }
  
  const data = await response.json();
  return { data, error: null };
}

// API de Médicos
export const api = {
  // ========== MÉDICOS ==========
  getMedicos: async (): Promise<{ data: Medico[] | null; error: Error | null }> => {
    try {
      const response = await fetch(`${API_URL}/api/medicos`);
      return handleResponse<Medico[]>(response);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // ========== CLÍNICAS ==========
  getClinicas: async (): Promise<{ data: Clinica[] | null; error: Error | null }> => {
    try {
      const response = await fetch(`${API_URL}/api/clinicas`);
      return handleResponse<Clinica[]>(response);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // ========== AGENDA ==========
  getAgendaPorCrm: async (crm: string): Promise<{ data: Agendamento[] | null; error: Error | null }> => {
    try {
      const response = await fetch(`${API_URL}/api/agenda?crm=${encodeURIComponent(crm)}`);
      return handleResponse<Agendamento[]>(response);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  getAgendaPorCnpj: async (cnpj: string): Promise<{ data: Agendamento[] | null; error: Error | null }> => {
    try {
      const response = await fetch(`${API_URL}/api/agenda?cnpj=${encodeURIComponent(cnpj)}`);
      return handleResponse<Agendamento[]>(response);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  getAgendaPorCliente: async (idCliente: string): Promise<{ data: Agendamento[] | null; error: Error | null }> => {
    try {
      const response = await fetch(`${API_URL}/api/agenda?id_cliente=${encodeURIComponent(idCliente)}`);
      return handleResponse<Agendamento[]>(response);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  criarAgendamento: async (agendamento: {
    id_cliente: string;
    crm: string;
    cnpj: string;
    data: string;
    hora: string;
  }): Promise<{ data: Agendamento | null; error: Error | null }> => {
    try {
      const response = await fetch(`${API_URL}/api/agenda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamento),
      });
      return handleResponse<Agendamento>(response);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  cancelarAgendamento: async (id: string): Promise<{ data: { success: boolean } | null; error: Error | null }> => {
    try {
      const response = await fetch(`${API_URL}/api/agenda/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      return handleResponse<{ success: boolean }>(response);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // ========== PRONTUÁRIO ==========
  getProntuario: async (idCliente: string): Promise<{ data: Prontuario | null; error: Error | null }> => {
    try {
      const response = await fetch(`${API_URL}/api/prontuario/${encodeURIComponent(idCliente)}`);
      return handleResponse<Prontuario>(response);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  salvarProntuario: async (prontuario: {
    id_cliente: string;
    descricao: string;
  }): Promise<{ data: Prontuario | null; error: Error | null }> => {
    try {
      const response = await fetch(`${API_URL}/api/prontuario`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prontuario),
      });
      return handleResponse<Prontuario>(response);
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },
};

export default api;
