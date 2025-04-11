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
      return "backend-optimization\ncloud-migration\nperformance-monitoring\nscalability-framework\nsecurity-hardening";
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
      
Senior Backend Engineer with 8+ years of experience developing scalable microservice architectures.
Specialized in high-performance systems, distributed computing, and real-time data processing.

# TECHNICAL SKILLS
- Languages: Node.js, Python, Rust, Go
- Databases: PostgreSQL, MongoDB, Redis, Elasticsearch
- Cloud: AWS, GCP, Kubernetes, Docker
- Tools: Prometheus, Grafana, ELK Stack

# EXPERIENCE
Senior Backend Engineer at ScaleNet Systems (2021-Present)
- Designed and implemented a distributed processing system handling 10K+ events/sec
- Reduced service latency by 42% through optimization and caching strategies
- Led migration from monolith to microservices architecture

Backend Engineer at DataFlow Technologies (2018-2021)
- Built real-time data processing pipeline for financial transactions
- Implemented fault-tolerant job scheduling system with 99.99% uptime`;
    } else if (file === "skills.json") {
      return `{
  "backend": ["API Design", "Microservices", "Event-Driven Architecture", "Message Queues"],
  "databases": ["Query Optimization", "Sharding", "Replication", "ACID Compliance"],
  "devops": ["CI/CD", "Infrastructure as Code", "Monitoring", "Auto-scaling"],
  "languages": ["JavaScript/TypeScript", "Python", "Rust", "SQL", "Go"],
  "soft_skills": ["Technical Leadership", "Mentoring", "Problem Solving", "Documentation"]
}`;
    } else if (file === "contact.md") {
      return `# Contact Information
- Email: hello@microservicesymphony.com
- LinkedIn: linkedin.com/in/backendarchitect
- GitHub: github.com/microservicesymphony

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