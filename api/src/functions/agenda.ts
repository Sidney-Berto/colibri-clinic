import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import pool from "../lib/database";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

// GET /api/agenda - Buscar agendamentos com filtros opcionais
app.http("agenda-get", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  route: "agenda",
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    try {
      const crm = request.query.get("crm");
      const cnpj = request.query.get("cnpj");
      const idCliente = request.query.get("id_cliente");

      let query = "SELECT id, id_cliente, crm, cnpj, data, hora FROM agenda";
      const params: string[] = [];
      const conditions: string[] = [];

      if (crm) {
        conditions.push(`crm = $${params.length + 1}`);
        params.push(crm);
      }
      if (cnpj) {
        conditions.push(`cnpj = $${params.length + 1}`);
        params.push(cnpj);
      }
      if (idCliente) {
        conditions.push(`id_cliente = $${params.length + 1}`);
        params.push(idCliente);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " ORDER BY data, hora";

      const result = await pool.query(query, params);

      return {
        status: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.rows)
      };
    } catch (error) {
      context.error("Erro ao buscar agenda:", error);
      return {
        status: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Erro interno do servidor" })
      };
    }
  }
});

// POST /api/agenda - Criar agendamento
app.http("agenda-post", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "agenda",
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    try {
      const body = await request.json() as {
        id_cliente: string;
        crm: string;
        cnpj: string;
        data: string;
        hora: string;
      };

      const { id_cliente, crm, cnpj, data, hora } = body;

      if (!id_cliente || !crm || !cnpj || !data || !hora) {
        return {
          status: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Campos obrigatórios: id_cliente, crm, cnpj, data, hora" })
        };
      }

      const result = await pool.query(
        `INSERT INTO agenda (id_cliente, crm, cnpj, data, hora) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, id_cliente, crm, cnpj, data, hora`,
        [id_cliente, crm, cnpj, data, hora]
      );

      return {
        status: 201,
        headers: corsHeaders,
        body: JSON.stringify(result.rows[0])
      };
    } catch (error) {
      context.error("Erro ao criar agendamento:", error);
      return {
        status: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Erro interno do servidor" })
      };
    }
  }
});

// DELETE /api/agenda/{id} - Deletar agendamento
app.http("agenda-delete", {
  methods: ["DELETE", "OPTIONS"],
  authLevel: "anonymous",
  route: "agenda/{id}",
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    try {
      const id = request.params.id;

      if (!id) {
        return {
          status: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "ID do agendamento é obrigatório" })
        };
      }

      const result = await pool.query(
        "DELETE FROM agenda WHERE id = $1 RETURNING id",
        [id]
      );

      if (result.rowCount === 0) {
        return {
          status: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Agendamento não encontrado" })
        };
      }

      return {
        status: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, message: "Agendamento cancelado" })
      };
    } catch (error) {
      context.error("Erro ao deletar agendamento:", error);
      return {
        status: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Erro interno do servidor" })
      };
    }
  }
});
