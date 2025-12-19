import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Search, Save } from "lucide-react";

interface ProntuarioClienteProps {
  onBack: () => void;
}

const ProntuarioCliente = ({ onBack }: ProntuarioClienteProps) => {
  const [nomeCliente, setNomeCliente] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleBuscarProntuario = async () => {
    if (!nomeCliente.trim()) return;

    setLoading(true);
    setMessage(null);
    setSearched(true);

    const { data, error } = await supabase
      .from("prontuario")
      .select("*")
      .eq("id_cliente", nomeCliente)
      .maybeSingle();

    setLoading(false);

    if (error) {
      console.error("Erro ao buscar prontuário:", error);
      setDescricao("");
    } else if (data) {
      setDescricao(data.descricao || "");
    } else {
      setDescricao("");
    }
  };

  const handleAtualizarProntuario = async () => {
    if (!nomeCliente.trim()) return;

    setLoading(true);
    setMessage(null);

    // Tentar atualizar primeiro
    const { data: existingData, error: selectError } = await supabase
      .from("prontuario")
      .select("id")
      .eq("id_cliente", nomeCliente)
      .maybeSingle();

    if (selectError) {
      console.error("Erro ao verificar prontuário:", selectError);
    }

    let success = false;

    if (existingData) {
      // Atualizar registro existente
      const { error: updateError } = await supabase
        .from("prontuario")
        .update({
          descricao: descricao,
          updated_at: new Date().toISOString(),
        })
        .eq("id_cliente", nomeCliente);

      if (!updateError) {
        success = true;
      }
    } else {
      // Inserir novo registro
      const { error: insertError } = await supabase
        .from("prontuario")
        .insert({
          id_cliente: nomeCliente,
          descricao: descricao,
        });

      if (!insertError) {
        success = true;
      }
    }

    setLoading(false);

    if (success) {
      toast({
        title: "Sucesso",
        description: "Prontuário atualizado com sucesso!",
      });
      setMessage({ type: "success", text: "Prontuário atualizado com sucesso" });
    } else {
      setMessage({ type: "error", text: "Erro na atualização do prontuário" });
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o prontuário.",
      });
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
            <FileText size={24} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Prontuário do Cliente
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

          {/* Botões de ação */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleBuscarProntuario}
              disabled={loading || !nomeCliente.trim()}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Search size={18} />
              {loading ? "Buscando..." : "Buscar Prontuário"}
            </Button>
            <Button
              onClick={handleAtualizarProntuario}
              disabled={loading || !nomeCliente.trim()}
              className="flex items-center gap-2"
            >
              <Save size={18} />
              {loading ? "Salvando..." : "Atualizar Prontuário"}
            </Button>
          </div>

          {/* Área de descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Prontuário</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder={searched ? "Prontuário vazio. Digite as informações do paciente." : "Busque um prontuário ou digite as informações do paciente."}
              className="bg-background min-h-[300px] resize-y"
            />
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
        </div>
      </div>
    </div>
  );
};

export default ProntuarioCliente;
