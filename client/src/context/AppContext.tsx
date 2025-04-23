import { createContext, useContext, useState, ReactNode } from "react";
import { Meeting, Partner, Service, TerminalCommand } from "../types";
import { initialServices } from "../hooks/useServices";
import { initialMeetings } from "../hooks/useMeetings";

interface AppContextType {
  services: Service[];
  meetings: Meeting[];
  partners: Partner[];
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  selectedService: string | null;
  setSelectedService: (service: string | null) => void;
  activeView: 'dashboard' | 'terminal' | 'api' | null;
  setActiveView: (view: 'dashboard' | 'terminal' | 'api' | null) => void;
  terminalHistory: TerminalCommand[];
  addTerminalCommand: (command: string, output: string) => void;
  clearTerminal: () => void;
  isLoadTesting: boolean;
  setIsLoadTesting: (isLoading: boolean) => void;
  activeServiceTab: string;
  setActiveServiceTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialPartners: Partner[] = [
  {
    id: 1,
    name: "Miguel Rodriguez",
    languages: [
      { code: "es", name: "Spanish", level: "Intermediate" },
      { code: "en", name: "English", level: "Advanced" }
    ],
    timezone: "CEST"
  },
  {
    id: 2,
    name: "Yuki Tanaka",
    languages: [
      { code: "ja", name: "Japanese", level: "Native" },
      { code: "en", name: "English", level: "Intermediate" }
    ],
    timezone: "JST"
  },
  {
    id: 3,
    name: "Marie Dubois",
    languages: [
      { code: "fr", name: "French", level: "Native" },
      { code: "en", name: "English", level: "Advanced" }
    ],
    timezone: "CET"
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [services] = useState<Service[]>(initialServices);
  const [meetings] = useState<Meeting[]>(initialMeetings);
  const [partners] = useState<Partner[]>(initialPartners);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'terminal' | 'api'>('dashboard');
  const [terminalHistory, setTerminalHistory] = useState<TerminalCommand[]>([]);
  const [isLoadTesting, setIsLoadTesting] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState('overview');

  const addTerminalCommand = (command: string, output: string) => {
    setTerminalHistory(prev => [
      ...prev,
      {
        command,
        output,
        timestamp: new Date()
      }
    ]);
  };

  const clearTerminal = () => {
    setTerminalHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        services,
        meetings,
        partners,
        isModalOpen,
        setModalOpen,
        selectedService,
        setSelectedService,
        activeView,
        setActiveView,
        terminalHistory,
        addTerminalCommand,
        clearTerminal,
        isLoadTesting,
        setIsLoadTesting,
        activeServiceTab,
        setActiveServiceTab
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
