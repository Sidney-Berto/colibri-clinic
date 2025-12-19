import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Stethoscope, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface RedeAcolhimentoProps {
  onBack: () => void;
}

const RedeAcolhimento = ({ onBack }: RedeAcolhimentoProps) => {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [selectedMedico, setSelectedMedico] = useState<Medico | null>(null);
  const [selectedClinica, setSelectedClinica] = useState<Clinica | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: medicosData } = await supabase
        .from("medicos")
        .select("*")
        .order("nome_medico");

      const { data: clinicasData } = await supabase
        .from("clinicas")
        .select("*")
        .order("nome_clinica");

      if (medicosData) setMedicos(medicosData);
      if (clinicasData) setClinicas(clinicasData);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar ao Menu
      </Button>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-primary flex items-center gap-2">
            <Stethoscope className="h-6 w-6" />
            Rede de Acolhimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Médicos Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Médicos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Selecione um Médico
                </label>
                <div className="border rounded-lg bg-background max-h-60 overflow-y-auto">
                  {medicos.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">
                      Nenhum médico cadastrado
                    </p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {medicos.map((medico) => (
                        <li
                          key={medico.id}
                          onClick={() => setSelectedMedico(medico)}
                          className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
                            selectedMedico?.id === medico.id
                              ? "bg-primary/10 border-l-4 border-primary"
                              : ""
                          }`}
                        >
                          <p className="font-medium text-foreground">
                            {medico.nome_medico}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            CRM: {medico.crm}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Especialidade
                </label>
                <div className="border rounded-lg bg-muted/50 p-4 min-h-[100px]">
                  {selectedMedico ? (
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">
                        {selectedMedico.nome_medico}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        CRM: {selectedMedico.crm}
                      </p>
                      <p className="text-primary">
                        {selectedMedico.especialidade || "Especialidade não informada"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Selecione um médico para ver a especialidade
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clínicas Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Clínicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Selecione uma Clínica
                </label>
                <div className="border rounded-lg bg-background max-h-60 overflow-y-auto">
                  {clinicas.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">
                      Nenhuma clínica cadastrada
                    </p>
                  ) : (
                    <ul className="divide-y divide-border">
                      {clinicas.map((clinica) => (
                        <li
                          key={clinica.id}
                          onClick={() => setSelectedClinica(clinica)}
                          className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
                            selectedClinica?.id === clinica.id
                              ? "bg-primary/10 border-l-4 border-primary"
                              : ""
                          }`}
                        >
                          <p className="font-medium text-foreground">
                            {clinica.nome_clinica}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            CNPJ: {clinica.cnpj}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Endereço
                </label>
                <div className="border rounded-lg bg-muted/50 p-4 min-h-[100px]">
                  {selectedClinica ? (
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">
                        {selectedClinica.nome_clinica}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        CNPJ: {selectedClinica.cnpj}
                      </p>
                      <p className="text-primary">
                        {selectedClinica.endereco || "Endereço não informado"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Selecione uma clínica para ver o endereço
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RedeAcolhimento;
