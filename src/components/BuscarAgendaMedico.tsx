import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, Agendamento } from "@/lib/api";
import { ArrowLeft, Stethoscope, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BuscarAgendaMedicoProps {
  onBack: () => void;
}

const BuscarAgendaMedico = ({ onBack }: BuscarAgendaMedicoProps) => {
  const [crm, setCrm] = useState("");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleBuscar = async () => {
    if (!crm.trim()) return;

    setLoading(true);
    setSearched(true);

    const { data, error } = await api.getAgendaPorCrm(crm);

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
            <Stethoscope size={24} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Buscar Agenda do Médico
          </h2>
        </div>

        <div className="space-y-6">
          {/* CRM */}
          <div className="space-y-2">
            <Label htmlFor="crm">CRM do Médico</Label>
            <div className="flex gap-3">
              <Input
                id="crm"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                placeholder="Digite o CRM do médico"
                className="bg-background flex-1"
              />
              <Button onClick={handleBuscar} disabled={loading || !crm.trim()}>
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
                        CNPJ Clínica
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
                          {agendamento.cnpj}
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
              Nenhum agendamento encontrado para este CRM.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscarAgendaMedico;
