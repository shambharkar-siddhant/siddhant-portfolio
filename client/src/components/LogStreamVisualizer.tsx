import React, { useState, useEffect, useRef } from 'react';
import { ServiceLog } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Clipboard, Download, Filter, Info, AlertCircle, CheckCircle2, AlertTriangle, LucideIcon, X, Search, Pause, Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface LogStreamVisualizerProps {
  logs: ServiceLog[];
  serviceName: string;
  autoScroll?: boolean;
}

type LogType = 'info' | 'req' | 'res' | 'warn' | 'error';
type LogFilter = LogType | 'all';  

// Format timestamp to a readable format
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
};

const LogStreamVisualizer: React.FC<LogStreamVisualizerProps> = ({ 
  logs, 
  serviceName,
  autoScroll = true
}) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<LogFilter>('all');
  const [search, setSearch] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [displayLogs, setDisplayLogs] = useState<ServiceLog[]>([]);
  const [activeTab, setActiveTab] = useState('live');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Generate a continuous stream of logs by adding a new log every few seconds
  const [streamedLogs, setStreamedLogs] = useState<ServiceLog[]>(logs);
  
  // Filter logs based on type and search term
  useEffect(() => {
    let filtered = streamedLogs;
    
    if (filter !== 'all') {
      filtered = filtered.filter(log => log.type === filter);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchLower) || 
        log.type.toLowerCase().includes(searchLower)
      );
    }
    
    setDisplayLogs(filtered);
  }, [streamedLogs, filter, search]);
  
  // Simulate real-time log streaming
  useEffect(() => {
    if (isPaused || activeTab !== 'live') return;
    
    // Randomly select log templates based on log type
    const infoMessages = [
      "Service initialized successfully",
      "Connection pool established",
      "Cache refreshed",
      "Background task completed",
      "Metrics snapshot captured",
      "Health check passed",
      "Config loaded from environment",
      "Scheduled job started",
      "Worker process spawned",
      "Memory usage optimized"
    ];
    
    const reqMessages = [
      "GET /api/users",
      "POST /api/auth/login",
      "PUT /api/items/1234",
      "DELETE /api/sessions/abc123",
      "GET /api/status",
      "POST /api/uploads",
      "GET /api/metrics",
      "PATCH /api/profiles/user123",
      "OPTIONS /api/permissions",
      "HEAD /api/heartbeat"
    ];
    
    const resMessages = [
      "200 OK - Response time: 42ms",
      "201 Created - User registered successfully",
      "204 No Content - Resource deleted",
      "206 Partial Content - Streaming initiated",
      "304 Not Modified - Using cached data",
      "400 Bad Request - Invalid parameters",
      "401 Unauthorized - Authentication required",
      "403 Forbidden - Insufficient permissions",
      "404 Not Found - Resource unavailable",
      "500 Internal Server Error - Database connection failed"
    ];
    
    const warnMessages = [
      "High memory usage detected (78%)",
      "Slow query executed (342ms)",
      "Rate limit approaching (85/100)",
      "Deprecated API call detected",
      "Connection retries increasing",
      "Cache hit ratio dropping (65%)",
      "Unusual traffic pattern detected",
      "Background task taking longer than expected",
      "Stale configuration detected",
      "Resource pool near capacity"
    ];
    
    const errorMessages = [
      "Database connection failed after 5 retries",
      "Uncaught exception in request handler",
      "API rate limit exceeded",
      "Authentication service unreachable",
      "File system permission denied",
      "Memory limit exceeded",
      "Deadlock detected in transaction",
      "TLS handshake failed with remote service",
      "Invalid state in message processor",
      "Critical security constraint violation"
    ];
    
    // Simulate random log generation
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // Only generate a new log 30% of the time to prevent flooding
        const logType: LogType = (() => {
          const rand = Math.random();
          if (rand < 0.45) return 'info';
          if (rand < 0.65) return 'req';
          if (rand < 0.85) return 'res';
          if (rand < 0.95) return 'warn';
          return 'error';
        })();
        
        let message = '';
        switch (logType) {
          case 'info':
            message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
            break;
          case 'req':
            message = reqMessages[Math.floor(Math.random() * reqMessages.length)];
            break;
          case 'res':
            message = resMessages[Math.floor(Math.random() * resMessages.length)];
            break;
          case 'warn':
            message = warnMessages[Math.floor(Math.random() * warnMessages.length)];
            break;
          case 'error':
            message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            break;
        }
        
        const newLog: ServiceLog = {
          type: logType,
          message: message,
          timestamp: new Date()
        };
        
        setStreamedLogs(prev => [...prev, newLog].slice(-500)); // Keep the last 500 logs
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [logs, isPaused, activeTab]);
  
  // Auto-scroll to the bottom when new logs appear
  useEffect(() => {
    if (autoScroll && !isPaused && scrollAreaRef.current && activeTab === 'live') {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [displayLogs, autoScroll, isPaused, activeTab]);
  
  // Log type to badge variant and icon mapping
  const logTypeInfo: Record<LogType, { color: string, icon: LucideIcon, label: string }> = {
    'info': { color: 'bg-blue-500', icon: Info, label: 'Info' },
    'req': { color: 'bg-violet-500', icon: Clipboard, label: 'Request' },
    'res': { color: 'bg-green-500', icon: CheckCircle2, label: 'Response' },
    'warn': { color: 'bg-yellow-500', icon: AlertTriangle, label: 'Warning' },
    'error': { color: 'bg-red-500', icon: AlertCircle, label: 'Error' }
  };
  
  // Copy logs to clipboard
  const copyLogsToClipboard = () => {
    const logText = displayLogs.map(log => 
      `[${formatTime(log.timestamp)}] [${log.type.toUpperCase()}] ${log.message}`
    ).join('\n');
    
    navigator.clipboard.writeText(logText).then(() => {
      toast({
        title: "Logs copied to clipboard",
        description: `${displayLogs.length} log entries copied`,
      });
    });
  };
  
  // Download logs as file
  const downloadLogs = () => {
    const logText = displayLogs.map(log => 
      `[${log.timestamp.toISOString()}] [${log.type.toUpperCase()}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serviceName.toLowerCase().replace(/\s+/g, '-')}-logs-${new Date().toISOString().slice(0, 10)}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Logs downloaded",
      description: `${displayLogs.length} log entries saved to file`,
    });
  };
  
  // Clear search filter
  const clearSearch = () => {
    setSearch('');
  };
  
  // Log level count for statistics
  const logCounts = {
    all: streamedLogs.length,
    info: streamedLogs.filter(log => log.type === 'info').length,
    req: streamedLogs.filter(log => log.type === 'req').length,
    res: streamedLogs.filter(log => log.type === 'res').length,
    warn: streamedLogs.filter(log => log.type === 'warn').length,
    error: streamedLogs.filter(log => log.type === 'error').length,
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{serviceName} Logs</CardTitle>
            <CardDescription>
              Real-time log streaming and analysis
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Resume log stream" : "Pause log stream"}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={copyLogsToClipboard}
              title="Copy logs to clipboard"
            >
              <Clipboard className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={downloadLogs}
              title="Download logs as file"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="live">Live Stream</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <div className="relative w-60">
                <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9"
                />
                {search && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 absolute right-2 top-2.5 text-muted-foreground"
                    onClick={clearSearch}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="flex">
                <Button 
                  variant={filter === 'all' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFilter('all')}
                  className="h-9 rounded-r-none rounded-l-md"
                >
                  All
                </Button>
                <Button 
                  variant={filter === 'info' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFilter('info')}
                  className="h-9 rounded-none border-l-0"
                >
                  Info
                </Button>
                <Button 
                  variant={filter === 'req' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFilter('req')}
                  className="h-9 rounded-none border-l-0"
                >
                  Req
                </Button>
                <Button 
                  variant={filter === 'res' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFilter('res')}
                  className="h-9 rounded-none border-l-0"
                >
                  Res
                </Button>
                <Button 
                  variant={filter === 'warn' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFilter('warn')}
                  className="h-9 rounded-none border-l-0"
                >
                  Warn
                </Button>
                <Button 
                  variant={filter === 'error' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setFilter('error')}
                  className="h-9 rounded-l-none rounded-r-md border-l-0"
                >
                  Error
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="live" className="m-0">
            <ScrollArea 
              className="h-[450px] border rounded-md bg-black/10 dark:bg-white/5 font-mono text-sm p-4"
              ref={scrollAreaRef}
            >
              {isPaused && (
                <div className="sticky top-0 w-full bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded mb-2 flex items-center">
                  <Pause className="h-3 w-3 mr-1" />
                  Log streaming paused
                </div>
              )}
              
              {displayLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Filter className="h-12 w-12 mb-4 opacity-20" />
                  <p className="mb-2">No logs match the current filter</p>
                  {filter !== 'all' && (
                    <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
                      Clear filter
                    </Button>
                  )}
                </div>
              ) : (
                displayLogs.map((log, index) => {
                  const { color, icon: Icon } = logTypeInfo[log.type];
                  return (
                    <div key={index} className="mb-1 flex">
                      <div className="opacity-50 w-16 tabular-nums">
                        {formatTime(log.timestamp)}
                      </div>
                      <div className={`rounded-sm px-1.5 text-xs font-semibold flex items-center ${color} text-white w-20 justify-center mr-3`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {log.type.toUpperCase()}
                      </div>
                      <div className="flex-1">{log.message}</div>
                    </div>
                  );
                })
              )}
            </ScrollArea>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <div>Displaying {displayLogs.length} of {streamedLogs.length} logs</div>
              <div>
                {filter !== 'all' && (
                  <span className="italic">Filtered by: {filter}</span>
                )}
                {search && (
                  <span className="italic ml-2">Search: "{search}"</span>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="m-0 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {(Object.keys(logCounts) as Array<keyof typeof logCounts>).map(type => {
                const count = logCounts[type];
                const percentage = type !== 'all' 
                  ? Math.round((count / Math.max(logCounts.all, 1)) * 100) 
                  : 100;
                
                let bgColor = 'bg-gray-100 dark:bg-gray-800';
                if (type !== 'all') {
                  const { color } = type in logTypeInfo ? logTypeInfo[type as LogType] : { color: '' };
                  bgColor = `${color}/10`;
                }
                
                return (
                  <div key={type} className={`p-4 rounded-lg ${bgColor}`}>
                    <div className="text-sm font-medium capitalize">{type}</div>
                    <div className="text-2xl font-bold mt-1">{count}</div>
                    {type !== 'all' && (
                      <div className="text-xs text-muted-foreground mt-1">{percentage}% of total</div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Distribution by Log Type</div>
              <div className="flex h-4 rounded-full overflow-hidden">
                {logCounts.all > 0 ? (
                  <>
                    <div 
                      className="bg-blue-500" 
                      style={{ width: `${(logCounts.info / logCounts.all) * 100}%` }}
                      title={`Info: ${logCounts.info} (${Math.round((logCounts.info / logCounts.all) * 100)}%)`}
                    ></div>
                    <div 
                      className="bg-violet-500" 
                      style={{ width: `${(logCounts.req / logCounts.all) * 100}%` }}
                      title={`Request: ${logCounts.req} (${Math.round((logCounts.req / logCounts.all) * 100)}%)`}
                    ></div>
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${(logCounts.res / logCounts.all) * 100}%` }}
                      title={`Response: ${logCounts.res} (${Math.round((logCounts.res / logCounts.all) * 100)}%)`}
                    ></div>
                    <div 
                      className="bg-yellow-500" 
                      style={{ width: `${(logCounts.warn / logCounts.all) * 100}%` }}
                      title={`Warning: ${logCounts.warn} (${Math.round((logCounts.warn / logCounts.all) * 100)}%)`}
                    ></div>
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${(logCounts.error / logCounts.all) * 100}%` }}
                      title={`Error: ${logCounts.error} (${Math.round((logCounts.error / logCounts.all) * 100)}%)`}
                    ></div>
                  </>
                ) : (
                  <div className="bg-gray-200 dark:bg-gray-700 w-full"></div>
                )}
              </div>
              <div className="flex text-xs justify-between mt-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                  <span>Info</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mr-1"></div>
                  <span>Request</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  <span>Response</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                  <span>Error</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm font-medium">Recent Error Logs</div>
              <div className="border rounded-md p-3 space-y-2">
                {streamedLogs.filter(log => log.type === 'error').slice(-3).map((log, index) => (
                  <div key={index} className="text-sm flex items-start">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{log.message}</div>
                      <div className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                {streamedLogs.filter(log => log.type === 'error').length === 0 && (
                  <div className="text-sm text-muted-foreground flex items-center justify-center py-6">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    No errors detected in current log stream
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LogStreamVisualizer;