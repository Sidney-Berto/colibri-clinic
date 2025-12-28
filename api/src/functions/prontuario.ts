import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import pool from "../lib/database";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

// GET /api/prontuario/{idCliente} - Buscar prontuário por cliente
app.http("prontuario-get", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  route: "prontuario/{idCliente}",
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    try {
      const idCliente = request.params.idCliente;

      if (!idCliente) {
        return {
          status: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "ID do cliente é obrigatório" })
        };
      }

      const result = await pool.query(
        "SELECT id, id_cliente, descricao, created_at, updated_at FROM prontuario WHERE id_cliente = $1",
        [decodeURIComponent(idCliente)]
      );

      if (result.rows.length === 0) {
        return {
          status: 200,
          headers: corsHeaders,
          body: JSON.stringify(null)
        };
      }

      return {
        status: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.rows[0])
      };
    } catch (error) {
      context.error("Erro ao buscar prontuário:", error);
      return {
        status: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Erro interno do servidor" })
      };
    }
  }
});

// PUT /api/prontuario - Criar ou atualizar prontuário
app.http("prontuario-put", {
  methods: ["PUT", "OPTIONS"],
  authLevel: "anonymous",
  route: "prontuario",
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    try {
      const body = await request.json() as {
        id_cliente: string;
        descricao: string;
      };

      const { id_cliente, descricao } = body;

      if (!id_cliente) {
        return {
          status: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Campo id_cliente é obrigatório" })
        };
      }

      // Upsert: inserir ou atualizar se já existir
      const result = await pool.query(
        `INSERT INTO prontuario (id_cliente, descricao, updated_at) 
         VALUES ($1, $2, NOW()) 
         ON CONFLICT (id_cliente) 
         DO UPDATE SET descricao = $2, updated_at = NOW()
         RETURNING id, id_cliente, descricao, created_at, updated_at`,
        [id_cliente, descricao || ""]
      );

      return {
        status: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.rows[0])
      };
    } catch (error) {
      context.error("Erro ao salvar prontuário:", error);
      return {
        status: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Erro interno do servidor" })
      };
    }
  }
});
