import { useState } from "react";
import Header from "@/components/Header";
import MenuCard from "@/components/MenuCard";
import RedeAcolhimento from "@/components/RedeAcolhimento";
import AgendamentoOnline from "@/components/AgendamentoOnline";
import ConsultarAgendamento from "@/components/ConsultarAgendamento";
import BuscarAgendaMedico from "@/components/BuscarAgendaMedico";
import BuscarAgendaClinica from "@/components/BuscarAgendaClinica";
import ProntuarioCliente from "@/components/ProntuarioCliente";
import { CalendarPlus, Search, Stethoscope, Building2, FileText, Calendar, Heart } from "lucide-react";

type View = 
  | "menu" 
  | "rede-acolhimento"
  | "agendamento-online" 
  | "consultar-agendamento" 
  | "buscar-medico" 
  | "buscar-clinica" 
  | "prontuario";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("menu");

  const agendaItems = [
    {
      id: "agendamento-online",
      title: "Agendamento Online",
      description: "Agende uma nova consulta com médico e clínica",
      icon: <CalendarPlus size={24} />,
    },
    {
      id: "consultar-agendamento",
      title: "Consultar Agendamento",
      description: "Consulte e gerencie seus agendamentos",
      icon: <Search size={24} />,
    },
    {
      id: "buscar-medico",
      title: "Buscar Agenda do Médico",
      description: "Visualize a agenda de um médico específico",
      icon: <Stethoscope size={24} />,
    },
    {
      id: "buscar-clinica",
      title: "Buscar Agenda da Clínica",
      description: "Visualize a agenda de uma clínica específica",
      icon: <Building2 size={24} />,
    },
  ];

  const renderView = () => {
    switch (currentView) {
      case "rede-acolhimento":
        return <RedeAcolhimento onBack={() => setCurrentView("menu")} />;
      case "agendamento-online":
        return <AgendamentoOnline onBack={() => setCurrentView("menu")} />;
      case "consultar-agendamento":
        return <ConsultarAgendamento onBack={() => setCurrentView("menu")} />;
      case "buscar-medico":
        return <BuscarAgendaMedico onBack={() => setCurrentView("menu")} />;
      case "buscar-clinica":
        return <BuscarAgendaClinica onBack={() => setCurrentView("menu")} />;
      case "prontuario":
        return <ProntuarioCliente onBack={() => setCurrentView("menu")} />;
      default:
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Rede de Acolhimento Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-primary" size={24} />
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  Rede de Acolhimento
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MenuCard
                  title="Rede de Acolhimento"
                  description="Conheça nossos médicos e clínicas parceiras"
                  icon={<Heart size={24} />}
                  onClick={() => setCurrentView("rede-acolhimento")}
                  delay={0}
                />
              </div>
            </section>

            {/* Agenda Online Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-primary" size={24} />
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  Agenda Online
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agendaItems.map((item, index) => (
                  <MenuCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    onClick={() => setCurrentView(item.id as View)}
                    delay={(index + 1) * 100}
                  />
                ))}
              </div>
            </section>

            {/* Prontuário Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-primary" size={24} />
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  Prontuário
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MenuCard
                  title="Prontuário do Cliente"
                  description="Acesse e gerencie prontuários dos pacientes"
                  icon={<FileText size={24} />}
                  onClick={() => setCurrentView("prontuario")}
                  delay={400}
                />
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
