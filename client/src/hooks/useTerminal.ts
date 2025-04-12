import { useState } from "react";
import { TerminalCommand } from "../types";
import { initialServices } from "./useServices";

const initialCommands: TerminalCommand[] = [
  {
    command: "system --status",
    output: "All systems operational. 5/6 services online. 1 service in degraded state.",
    timestamp: new Date(Date.now() - 60000)
  }
];

// Command handlers
const commandHandlers = {
  help: () => 
    `Available commands:
    help                   - Show this help message
    ls [services|projects] - List services or projects
    status                 - Show system status
    ping <service-id>      - Ping a service
    cat <filename>         - Display content of a file
    service --logs <id>    - Show logs for a service
    clear                  - Clear terminal
    deploy <service-id>    - Deploy or restart a service`,
  
  ls: (args: string[]) => {
    if (args.includes("services")) {
      return initialServices.map(s => `${s.id} (${s.status})`).join("\n");
    } else if (args.includes("projects")) {
      return "Network Architecture Search Using Meta Hueristics Algorithm\nPredictive StockTrader\nFake Face Detection\nChat Application with Abusive Text Detection";
    } else {
      return "services/  projects/  resume.txt  skills.json  contact.md";
    }
  },
  
  status: () => {
    const online = initialServices.filter(s => s.status === "online").length;
    const warning = initialServices.filter(s => s.status === "warning").length;
    const error = initialServices.filter(s => s.status === "error").length;
    return `System Status: Operational\nServices: ${online} online, ${warning} degraded, ${error} offline\nSystem Load: 42%\nMemory Usage: 68%\nNetwork I/O: 240 Mbps`;
  },
  
  cat: (args: string[]) => {
    const file = args[0];
    
    if (file === "resume.txt") {
      return `# PROFESSIONAL PROFILE
      
Backend Engineer, developing scalable microservice architectures.
Specialized in high-performance systems, distributed computing, and real-time data processing.

# TECHNICAL SKILLS
- Languages: Node.js, Python, C++, SQL
- Databases: PostgreSQL, Redis, MongoDB
- Cloud: AWS, Docker
- Tools: Prometheus, Grafana, Postman

# EXPERIENCE
Senior Backend Engineer at Aparoksha Financial Services Private Limited (2024-Present)
- Created an efficient loan processing system for two-wheelers using Python and Falcon, which cut transaction times by
30% and improved system security.
- Developed a scalable integration pipeline with Bash and Python across distributed platforms, which doubled the rate of
new lender additions and greatly enhanced business scalability.
- Guided a team in building a de-duplication server to combat loan fraud, leading to an 80% reduction in duplicate
applications and significantly strengthening data integrity. Encouraged strong collaboration among team members to
enhance project delivery.

Full-Stack Developer at Expert Script Soft-Solutions (2020-2022)
- Created a product recommendation system using React and Machine learning, resulting in a 20% increase in user
engagement.
- Achieved 99.9% system reliability and uptime by integrating Apache Kafka for efficient real-time data synchronization
and inter-service communication.`;
    } else if (file === "skills.json") {
      return `{
  "backend": ["API Design", "Microservices", "Event-Driven Architecture", "Message Queues"],
  "databases": ["Query Optimization", "Replication", "ACID Compliance"],
  "devops": ["CI/CD", "Monitoring", "Auto-scaling"],
  "languages": ["Python", "C++", "SQL", "Shell Scripting"],
  "soft_skills": ["Technical Leadership", "Problem Solving", "Documentation"]
}`;
    } else if (file === "contact.md") {
      return `# Contact Information
- Email: shambharkarsiddhant0698@gmail.com
- LinkedIn: https://www.linkedin.com/in/siddhant-shambharkar/
- GitHub: https://github.com/shambharkar-siddhant/siddhant-portfolio

Feel free to reach out for collaboration opportunities or to discuss backend architecture challenges!`;
    } else {
      return `Error: File '${file}' not found.`;
    }
  },
  
  ping: (args: string[]) => {
    const serviceId = args[0];
    const service = initialServices.find(s => s.id === serviceId);
    
    if (!service) {
      return `Error: Service '${serviceId}' not found.`;
    }
    
    if (service.status === "error") {
      return `Error: Cannot ping ${service.name}. Service is currently unavailable.`;
    }
    
    const pingTime = service.status === "warning" ? Math.floor(Math.random() * 100) + 150 : Math.floor(Math.random() * 50) + 10;
    return `Pinging ${service.name} (${service.id})...\nResponse time: ${pingTime}ms\nStatus: ${service.status}`;
  },
  
  service: (args: string[]) => {
    if (args[0] === "--logs" && args[1]) {
      const serviceId = args[1];
      const service = initialServices.find(s => s.id === serviceId);
      
      if (!service) {
        return `Error: Service '${serviceId}' not found.`;
      }
      
      return service.logs.map(log => 
        `[${log.timestamp.toLocaleTimeString()}] [${log.type.toUpperCase()}] ${log.message}`
      ).join("\n");
    } else {
      return "Usage: service --logs <service-id>";
    }
  },
  
  deploy: (args: string[]) => {
    const serviceId = args[0];
    const service = initialServices.find(s => s.id === serviceId);
    
    if (!service) {
      return `Error: Service '${serviceId}' not found.`;
    }
    
    return `Deploying ${service.name}...\n` +
      `Pulling latest version...\n` +
      `Building container...\n` +
      `Starting service on port ${service.port}...\n` +
      `Deployment complete! Service is ${service.status}.`;
  }
};

export default function useTerminal() {
  const [commands, setCommands] = useState<TerminalCommand[]>(initialCommands);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const executeCommand = (input: string) => {
    const timestamp = new Date();
    
    // Empty command
    if (!input.trim()) {
      return;
    }
    
    // Add to history
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    
    // Parse command and arguments
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    let output = "";
    
    // Process commands
    if (command === "clear") {
      setCommands([]);
      return;
    } else if (command === "help") {
      output = commandHandlers.help();
    } else if (command === "ls") {
      output = commandHandlers.ls(args);
    } else if (command === "status") {
      output = commandHandlers.status();
    } else if (command === "cat") {
      output = commandHandlers.cat(args);
    } else if (command === "ping") {
      output = commandHandlers.ping(args);
    } else if (command === "service") {
      output = commandHandlers.service(args);
    } else if (command === "deploy") {
      output = commandHandlers.deploy(args);
    } else {
      output = `Command not found: ${command}. Type 'help' for available commands.`;
    }
    
    setCommands(prev => [...prev, { command: input, output, timestamp }]);
  };
  
  const getPreviousCommand = () => {
    if (commandHistory.length === 0) return "";
    
    const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
    setHistoryIndex(newIndex);
    return commandHistory[commandHistory.length - 1 - newIndex];
  };
  
  const getNextCommand = () => {
    if (historyIndex <= 0) {
      setHistoryIndex(-1);
      return "";
    }
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    return commandHistory[commandHistory.length - 1 - newIndex];
  };
  
  return {
    commands,
    executeCommand,
    getPreviousCommand,
    getNextCommand
  };
}