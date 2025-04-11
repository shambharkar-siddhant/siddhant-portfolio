export interface Service {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'error';
  uptime: string;
  logs: ServiceLog[];
  stats: {
    [key: string]: string;
  };
  port: number;
}

export interface ServiceLog {
  type: 'info' | 'req' | 'res' | 'warn' | 'error';
  message: string;
  timestamp: Date;
}

export interface Meeting {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  partnerTimezone: string;
  languages: string[];
  levels: string[];
  partnerId: number;
  partnerName: string;
}

export interface Partner {
  id: number;
  name: string;
  languages: Array<{code: string, name: string, level: string}>;
  timezone: string;
}

export interface TerminalCommand {
  command: string;
  output: string;
  timestamp: Date;
}
