import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Medico {
  id: string;
  crm: string;
  nome_medico: string;
  especialidade: string | null;
}

interface Clinica {
  id: string;
  cnpj: string;
  nome_clinica: string;
  endereco: string | null;
}

interface AgendamentoOnlineProps {
  onBack: () => void;
}

const horarios = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

const AgendamentoOnline = ({ onBack }: AgendamentoOnlineProps) => {
  const [nomeCliente, setNomeCliente] = useState("");
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [selectedClinica, setSelectedClinica] = useState<Clinica | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedHorario, setSelectedHorario] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchMedicos();
    fetchClinicas();
  }, []);

  const fetchMedicos = async () => {
    const { data, error } = await supabase.from("medicos").select("*");
    if (data) setMedicos(data);
    if (error) console.error("Erro ao buscar médicos:", error);
  };

  const fetchClinicas = async () => {
    const { data, error } = await supabase.from("clinicas").select("*");
    if (data) setClinicas(data);
    if (error) console.error("Erro ao buscar clínicas:", error);
  };

  const handleMedicoChange = (crm: string) => {
    const medico = medicos.find(m => m.crm === crm);
    setSelectedMedico(medico || null);
  };

  const handleClinicaChange = (cnpj: string) => {
    const clinica = clinicas.find(c => c.cnpj === cnpj);
    setSelectedClinica(clinica || null);
  };

  const isFormValid = nomeCliente && selectedMedico && selectedClinica && selectedDate && selectedHorario;

  const handleAgendar = async () => {
    if (!isFormValid || !selectedDate) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.from("agenda").insert({
      id_cliente: nomeCliente,
      crm: selectedMedico!.crm,
      cnpj: selectedClinica!.cnpj,
      data: format(selectedDate, "yyyy-MM-dd"),
      hora: selectedHorario,
    });

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: "Erro no agendamento" });
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível realizar o agendamento.",
      });
    } else {
      setMessage({ type: "success", text: "Agendamento efetuado" });
      toast({
        title: "Sucesso",
        description: "Agendamento realizado com sucesso!",
      });
      // Reset form
      setNomeCliente("");
      setSelectedMedico(null);
      setSelectedClinica(null);
      setSelectedDate(undefined);
      setSelectedHorario("");
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
            <CalendarPlus size={24} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Agendamento Online
          </h2>
        </div>

        <div className="space-y-6">
          {/* Nome do Cliente */}
          <div className="space-y-2">
            <Label htmlFor="nomeCliente">Nome do Cliente</Label>
            <Input
              id="nomeCliente"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              placeholder="Digite o nome do cliente"
              className="bg-background"
            />
          </div>

          {/* Médico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Médico</Label>
              <Select onValueChange={handleMedicoChange} value={selectedMedico?.crm || ""}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione o médico" />
                </SelectTrigger>
                <SelectContent>
                  {medicos.map((medico) => (
                    <SelectItem key={medico.id} value={medico.crm}>
                      {medico.crm} - {medico.nome_medico}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Especialidade</Label>
              <Input
                value={selectedMedico?.especialidade || ""}
                readOnly
                placeholder="Especialidade do médico"
                className="bg-muted"
              />
            </div>
          </div>

          {/* Clínica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Clínica</Label>
              <Select onValueChange={handleClinicaChange} value={selectedClinica?.cnpj || ""}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione a clínica" />
                </SelectTrigger>
                <SelectContent>
                  {clinicas.map((clinica) => (
                    <SelectItem key={clinica.id} value={clinica.cnpj}>
                      {clinica.cnpj} - {clinica.nome_clinica}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input
                value={selectedClinica?.endereco || ""}
                readOnly
                placeholder="Endereço da clínica"
                className="bg-muted"
              />
            </div>
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Data</Label>
              <div className="border border-border rounded-lg p-4 bg-background">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  disabled={(date) => date < new Date()}
                  className="mx-auto"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Horário</Label>
              <Select onValueChange={setSelectedHorario} value={selectedHorario}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {horarios.map((hora) => (
                    <SelectItem key={hora} value={hora}>
                      {hora}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          {/* Botão Agendar */}
          <Button
            onClick={handleAgendar}
            disabled={!isFormValid || loading}
            className="w-full h-12 text-lg font-semibold"
          >
            {loading ? "Agendando..." : "Agendar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoOnline;
