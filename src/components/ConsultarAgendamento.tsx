import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Search, X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Agendamento {
  id: string;
  id_cliente: string;
  crm: string;
  cnpj: string;
  data: string;
  hora: string;
}

interface ConsultarAgendamentoProps {
  onBack: () => void;
}

const ConsultarAgendamento = ({ onBack }: ConsultarAgendamentoProps) => {
  const [nomeCliente, setNomeCliente] = useState("");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleBuscar = async () => {
    if (!nomeCliente.trim()) return;

    setLoading(true);
    setMessage(null);
    setSearched(true);

    const { data, error } = await supabase
      .from("agenda")
      .select("*")
      .eq("id_cliente", nomeCliente);

    setLoading(false);

    if (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setAgendamentos([]);
    } else if (data && data.length > 0) {
      setAgendamentos(data);
    } else {
      setAgendamentos([]);
      setMessage({ type: "error", text: "Agendamento não localizado" });
    }
  };

  const handleCancelar = async (agendamento: Agendamento) => {
    setMessage(null);

    const { error } = await supabase
      .from("agenda")
      .delete()
      .eq("id_cliente", agendamento.id_cliente)
      .eq("data", agendamento.data)
      .eq("hora", agendamento.hora);

    if (error) {
      setMessage({ type: "error", text: "Erro no cancelamento" });
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível cancelar o agendamento.",
      });
    } else {
      setMessage({ type: "success", text: "Agendamento cancelado" });
      toast({
        title: "Sucesso",
        description: "Agendamento cancelado com sucesso!",
      });
      // Atualizar lista
      setAgendamentos(agendamentos.filter(a => a.id !== agendamento.id));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span>Voltar ao menu</span>
      </button>

      <div className="bg-card rounded-lg border border-border shadow-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
            <Search size={24} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Consultar Agendamento
          </h2>
        </div>

        <div className="space-y-6">
          {/* Nome do Cliente */}
          <div className="space-y-2">
            <Label htmlFor="nomeCliente">Nome do Cliente</Label>
            <div className="flex gap-3">
              <Input
                id="nomeCliente"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                placeholder="Digite o nome do cliente"
                className="bg-background flex-1"
              />
              <Button onClick={handleBuscar} disabled={loading || !nomeCliente.trim()}>
                {loading ? "Buscando..." : "Buscar Agendamentos"}
              </Button>
            </div>
          </div>

          {/* Mensagem */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-success/10 text-success border border-success/30"
                  : "bg-destructive/10 text-destructive border border-destructive/30"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Lista de Agendamentos */}
          {agendamentos.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Agendamentos encontrados:</h3>
              {agendamentos.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4">
                    <Calendar className="text-primary" size={20} />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">
                        {formatDate(agendamento.data)} às {agendamento.hora}
                      </p>
                      <p className="text-muted-foreground">
                        CRM: {agendamento.crm} | CNPJ: {agendamento.cnpj}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelar(agendamento)}
                    className="flex items-center gap-1"
                  >
                    <X size={16} />
                    Cancelar
                  </Button>
                </div>
              ))}
            </div>
          )}

          {searched && agendamentos.length === 0 && !message && (
            <p className="text-muted-foreground text-center py-8">
              Nenhum agendamento encontrado para este cliente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultarAgendamento;
