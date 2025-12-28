import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import pool from "../lib/database";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

app.http("clinicas", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    try {
      const result = await pool.query(
        "SELECT id, cnpj, nome_clinica, endereco FROM clinicas ORDER BY nome_clinica"
      );

      return {
        status: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.rows)
      };
    } catch (error) {
      context.error("Erro ao buscar clínicas:", error);
      return {
        status: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Erro interno do servidor" })
      };
    }
  }
});
