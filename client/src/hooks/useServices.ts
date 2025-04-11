import { useState } from "react";
import { Service, ServiceLog } from "../types";

// Helper to generate logs
const generateServiceLogs = (serviceType: string): ServiceLog[] => {
  const logs: ServiceLog[] = [];
  const types: Array<'info' | 'req' | 'res' | 'warn' | 'error'> = ['info', 'req', 'res', 'warn', 'error'];
  const now = new Date();
  
  // Generate random logs from the past hour
  for (let i = 0; i < 10; i++) {
    const pastTime = new Date(now.getTime() - Math.floor(Math.random() * 60 * 60 * 1000));
    const type = types[Math.floor(Math.random() * types.length)];
    
    let message = '';
    switch (type) {
      case 'info':
        message = [
          `${serviceType} service initialized`,
          `Configuration loaded successfully`,
          `Connected to database`,
          `${serviceType} worker pool started with 8 threads`,
          `Health check passed`
        ][Math.floor(Math.random() * 5)];
        break;
      case 'req':
        message = [
          `Received request GET /api/v1/${serviceType.toLowerCase()}/status`,
          `Received request POST /api/v1/${serviceType.toLowerCase()}/process`,
          `Received request PUT /api/v1/${serviceType.toLowerCase()}/config`,
          `Received request DELETE /api/v1/${serviceType.toLowerCase()}/cache`
        ][Math.floor(Math.random() * 4)];
        break;
      case 'res':
        message = [
          `Response sent: 200 OK (15ms)`,
          `Response sent: 201 Created (42ms)`,
          `Response sent: 204 No Content (8ms)`,
          `Response sent: 304 Not Modified (5ms)`
        ][Math.floor(Math.random() * 4)];
        break;
      case 'warn':
        message = [
          `High memory usage detected (82%)`,
          `Slow database query (325ms)`,
          `Rate limit approaching for client 192.168.1.42`,
          `Connection pool nearing capacity`
        ][Math.floor(Math.random() * 4)];
        break;
      case 'error':
        message = [
          `Failed to connect to cache server`,
          `Database query timeout after 5000ms`,
          `Invalid JSON in request body`,
          `Unauthorized access attempt from 203.0.113.42`
        ][Math.floor(Math.random() * 4)];
        break;
    }
    
    logs.push({
      type,
      message,
      timestamp: pastTime
    });
  }
  
  // Sort by timestamp, newest first
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const initialServices: Service[] = [
  {
    id: "auth-service",
    name: "Authentication Service",
    status: "online",
    uptime: "7d 12h 45m",
    logs: generateServiceLogs("Authentication"),
    stats: {
      "Avg. Response Time": "28ms",
      "Success Rate": "99.98%",
      "Requests/sec": "458",
      "Active Sessions": "24,582"
    },
    port: 9000
  },
  {
    id: "data-processor",
    name: "Data Processing Service",
    status: "online",
    uptime: "12d 5h 12m",
    logs: generateServiceLogs("DataProcessing"),
    stats: {
      "Avg. Processing Time": "125ms",
      "Queue Size": "42",
      "Jobs/hour": "3,854",
      "Worker Utilization": "76%"
    },
    port: 9001
  },
  {
    id: "api-gateway",
    name: "API Gateway",
    status: "online",
    uptime: "30d 8h 22m",
    logs: generateServiceLogs("Gateway"),
    stats: {
      "Avg. Response Time": "18ms",
      "Success Rate": "99.95%",
      "Requests/sec": "1,245",
      "Cached Responses": "68%"
    },
    port: 8080
  },
  {
    id: "cache-service",
    name: "Cache Service",
    status: "warning",
    uptime: "15d 3h 50m",
    logs: generateServiceLogs("Cache"),
    stats: {
      "Hit Rate": "85%",
      "Memory Usage": "78%",
      "Evictions/min": "24",
      "Avg. Lookup Time": "2ms"
    },
    port: 6379
  },
  {
    id: "search-engine",
    name: "Search Engine",
    status: "online",
    uptime: "6d 18h 10m",
    logs: generateServiceLogs("Search"),
    stats: {
      "Avg. Query Time": "72ms",
      "Index Size": "8.2GB",
      "Queries/min": "523",
      "Indexing Latency": "4s"
    },
    port: 9200
  },
  {
    id: "notif-service",
    name: "Notification Service",
    status: "error",
    uptime: "0d 1h 15m",
    logs: generateServiceLogs("Notification"),
    stats: {
      "Queue Size": "1,280+",
      "Delivery Rate": "0%",
      "Retry Count": "5/5",
      "Last Error": "Connection refused"
    },
    port: 8086
  }
];

export default function useServices() {
  const [services] = useState<Service[]>(initialServices);
  
  return {
    services
  };
}