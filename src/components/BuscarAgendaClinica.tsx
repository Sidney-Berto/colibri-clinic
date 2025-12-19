import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Building2, Calendar } from "lucide-react";
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

interface BuscarAgendaClinicaProps {
  onBack: () => void;
}

const BuscarAgendaClinica = ({ onBack }: BuscarAgendaClinicaProps) => {
  const [cnpj, setCnpj] = useState("");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleBuscar = async () => {
    if (!cnpj.trim()) return;

    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from("agenda")
      .select("*")
      .eq("cnpj", cnpj)
      .order("data", { ascending: true });

    setLoading(false);

    if (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setAgendamentos([]);
    } else {
      setAgendamentos(data || []);
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
            <Building2 size={24} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Buscar Agenda da Clínica
          </h2>
        </div>

        <div className="space-y-6">
          {/* CNPJ */}
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ da Clínica</Label>
            <div className="flex gap-3">
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="Digite o CNPJ da clínica"
                className="bg-background flex-1"
              />
              <Button onClick={handleBuscar} disabled={loading || !cnpj.trim()}>
                {loading ? "Buscando..." : "Buscar Agendamentos"}
              </Button>
            </div>
          </div>

          {/* Lista de Agendamentos */}
          {agendamentos.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">
                Agendamentos encontrados ({agendamentos.length}):
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-3 text-left text-sm font-semibold text-foreground border-b border-border">
                        Data
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-foreground border-b border-border">
                        Hora
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-foreground border-b border-border">
                        Cliente
                      </th>
                      <th className="p-3 text-left text-sm font-semibold text-foreground border-b border-border">
                        CRM Médico
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.map((agendamento, index) => (
                      <tr
                        key={agendamento.id}
                        className={index % 2 === 0 ? "bg-background" : "bg-muted/50"}
                      >
                        <td className="p-3 text-sm text-foreground border-b border-border">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary" />
                            {formatDate(agendamento.data)}
                          </div>
                        </td>
                        <td className="p-3 text-sm text-foreground border-b border-border">
                          {agendamento.hora}
                        </td>
                        <td className="p-3 text-sm text-foreground border-b border-border">
                          {agendamento.id_cliente}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground border-b border-border">
                          {agendamento.crm}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {searched && agendamentos.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Nenhum agendamento encontrado para este CNPJ.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscarAgendaClinica;
