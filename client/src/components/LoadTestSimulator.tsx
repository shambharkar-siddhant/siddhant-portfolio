import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { Play as PlayIcon, Square as StopIcon, Zap as ZapIcon, AlertTriangle, RefreshCw } from 'lucide-react';

interface LoadTestSimulatorProps {
  service: Service | null;
  isLoadTesting: boolean;
  setIsLoadTesting: (value: boolean) => void;
}

interface MetricReading {
  time: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
}

const LoadTestSimulator: React.FC<LoadTestSimulatorProps> = ({ 
  service, 
  isLoadTesting, 
  setIsLoadTesting 
}) => {
  const { toast } = useToast();
  const [concurrentUsers, setConcurrentUsers] = useState<number>(50);
  const [testDuration, setTestDuration] = useState<number>(30); // seconds
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [testTab, setTestTab] = useState<string>('performance');
  const [metrics, setMetrics] = useState<MetricReading[]>([]);
  const [peakValues, setPeakValues] = useState({
    responseTime: 0,
    throughput: 0,
    errorRate: 0,
    cpuUsage: 0,
    memoryUsage: 0
  });
  
  // Generate new metrics data every second during load testing
  useEffect(() => {
    if (!isLoadTesting || !service) return;
    
    const interval = setInterval(() => {
      // Update elapsed time
      setElapsedTime(prev => {
        const newElapsed = prev + 1;
        
        // Stop the test if duration is reached
        if (newElapsed >= testDuration) {
          setIsLoadTesting(false);
          toast({
            title: "Load test completed",
            description: `Test on ${service.name} completed successfully after ${testDuration} seconds.`,
          });
          return 0;
        }
        
        return newElapsed;
      });
      
      // Generate new metrics based on current settings
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      
      // Base values
      const baseResponseTime = service.status === 'online' ? 30 : service.status === 'warning' ? 80 : 200;
      const baseThroughput = service.status === 'online' ? 100 : service.status === 'warning' ? 70 : 20;
      const baseErrorRate = service.status === 'online' ? 0.5 : service.status === 'warning' ? 5 : 25;
      const baseCpuUsage = 30;
      const baseMemoryUsage = 40;
      
      // Calculate metrics based on concurrent users
      // More users = higher response time, throughput, resource usage & potentially error rate
      const userFactor = concurrentUsers / 50; // Normalize against default value
      
      // Add some randomness and calculate final values
      const randomVariance = () => (Math.random() * 0.3) + 0.85; // 0.85 to 1.15 range
      
      const responseTime = Math.min(baseResponseTime * userFactor * randomVariance(), 500);
      const throughput = Math.min(baseThroughput * Math.sqrt(userFactor) * randomVariance(), 1000);
      const errorRate = Math.min(baseErrorRate * (userFactor > 2 ? userFactor : 1) * randomVariance(), 100);
      const cpuUsage = Math.min(baseCpuUsage * userFactor * randomVariance(), 100);
      const memoryUsage = Math.min(baseMemoryUsage * Math.sqrt(userFactor) * randomVariance(), 100);
      
      const newReading = {
        time,
        responseTime,
        throughput,
        errorRate,
        cpuUsage,
        memoryUsage
      };
      
      // Update metrics history (keep last 30 readings)
      setMetrics(prev => {
        const updatedMetrics = [...prev, newReading].slice(-30);
        
        // Update peak values
        setPeakValues(peaks => ({
          responseTime: Math.max(peaks.responseTime, responseTime),
          throughput: Math.max(peaks.throughput, throughput),
          errorRate: Math.max(peaks.errorRate, errorRate),
          cpuUsage: Math.max(peaks.cpuUsage, cpuUsage),
          memoryUsage: Math.max(peaks.memoryUsage, memoryUsage)
        }));
        
        return updatedMetrics;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isLoadTesting, service, concurrentUsers, testDuration, setIsLoadTesting, toast]);
  
  // Start load test
  const startLoadTest = async () => {
    if (!service) return;
    
    // Reset metrics
    setMetrics([]);
    setPeakValues({
      responseTime: 0,
      throughput: 0,
      errorRate: 0,
      cpuUsage: 0,
      memoryUsage: 0
    });
    setElapsedTime(0);
    
    setIsLoadTesting(true);
    
    // Make a test call to the API to make sure it's working
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        toast({
          title: "API Connection Error",
          description: `Could not connect to API server. Status: ${response.status}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("API test call failed:", error);
      // Continue anyway for simulation purposes
    }
    
    toast({
      title: "Load test started",
      description: `Testing ${service.name} with ${concurrentUsers} concurrent users for ${testDuration} seconds.`,
    });
  };
  
  // Stop load test
  const stopLoadTest = () => {
    setIsLoadTesting(false);
    setElapsedTime(0);
    
    toast({
      title: "Load test stopped",
      description: "Test was manually interrupted before completion.",
      variant: "destructive"
    });
  };
  
  if (!service) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Load Test Simulator</CardTitle>
          <CardDescription>Select a service to run load tests</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p>No service selected</p>
            <p className="text-sm mt-2">Please select a service from the dashboard to run load tests.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Load Test Simulator</CardTitle>
            <CardDescription>
              Test {service.name} under simulated load conditions
            </CardDescription>
          </div>
          <Badge 
            variant={isLoadTesting ? "default" : "outline"}
            className="capitalize"
          >
            {isLoadTesting ? "Test in progress" : "Ready"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!isLoadTesting ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Concurrent Users</label>
                <span className="text-sm">{concurrentUsers}</span>
              </div>
              <Slider
                defaultValue={[50]}
                min={10}
                max={500}
                step={10}
                value={[concurrentUsers]}
                onValueChange={values => setConcurrentUsers(values[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10</span>
                <span>100</span>
                <span>250</span>
                <span>500</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Test Duration (seconds)</label>
                <span className="text-sm">{testDuration}</span>
              </div>
              <Slider
                defaultValue={[30]}
                min={10}
                max={120}
                step={5}
                value={[testDuration]}
                onValueChange={values => setTestDuration(values[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10s</span>
                <span>30s</span>
                <span>60s</span>
                <span>120s</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">Expected Impact</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="px-2 py-2 rounded-md bg-muted">
                  <div className="text-xs text-muted-foreground">Response Time</div>
                  <div className="font-mono text-sm">
                    {concurrentUsers < 100 ? 'Low' : concurrentUsers < 250 ? 'Medium' : 'High'}
                  </div>
                </div>
                <div className="px-2 py-2 rounded-md bg-muted">
                  <div className="text-xs text-muted-foreground">Throughput</div>
                  <div className="font-mono text-sm">
                    {concurrentUsers < 50 ? 'Low' : concurrentUsers < 200 ? 'Medium' : 'High'}
                  </div>
                </div>
                <div className="px-2 py-2 rounded-md bg-muted">
                  <div className="text-xs text-muted-foreground">CPU Usage</div>
                  <div className="font-mono text-sm">
                    {concurrentUsers < 100 ? 'Low' : concurrentUsers < 300 ? 'Medium' : 'High'}
                  </div>
                </div>
                <div className="px-2 py-2 rounded-md bg-muted">
                  <div className="text-xs text-muted-foreground">Error Rate</div>
                  <div className="font-mono text-sm">
                    {concurrentUsers < 150 ? 'Low' : concurrentUsers < 350 ? 'Medium' : 'High'}
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={startLoadTest}
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Start Load Test
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  <span className="font-medium">Test in progress</span>
                </div>
                <div className="text-sm">
                  {elapsedTime}s / {testDuration}s
                </div>
              </div>
              <Progress value={(elapsedTime / testDuration) * 100} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Testing with {concurrentUsers} concurrent users
              </div>
              <Button 
                variant="destructive" 
                onClick={stopLoadTest}
                size="sm"
              >
                <StopIcon className="h-4 w-4 mr-2" />
                Stop Test
              </Button>
            </div>
            
            <Tabs value={testTab} onValueChange={setTestTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance" className="pt-4">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => value.split(':')[2]} 
                      />
                      <YAxis 
                        yAxisId="left" 
                        orientation="left" 
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Requests/s', angle: 90, position: 'insideRight', fontSize: 10 }}
                      />
                      <Tooltip />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="responseTime" 
                        name="Response Time (ms)" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="throughput" 
                        name="Throughput (req/s)" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="errorRate" 
                        name="Error Rate (%)" 
                        stroke="#ff8042" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-xs text-muted-foreground">Avg. Response Time</div>
                    <div className="font-mono text-sm font-bold">
                      {metrics.length ? Math.round(metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length) : 0} ms
                    </div>
                    <div className="text-xs text-muted-foreground">Peak: {Math.round(peakValues.responseTime)} ms</div>
                  </div>
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-xs text-muted-foreground">Throughput</div>
                    <div className="font-mono text-sm font-bold">
                      {metrics.length ? Math.round(metrics.reduce((sum, m) => sum + m.throughput, 0) / metrics.length) : 0} req/s
                    </div>
                    <div className="text-xs text-muted-foreground">Peak: {Math.round(peakValues.throughput)} req/s</div>
                  </div>
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-xs text-muted-foreground">Error Rate</div>
                    <div className="font-mono text-sm font-bold">
                      {metrics.length ? (metrics.reduce((sum, m) => sum + m.errorRate, 0) / metrics.length).toFixed(2) : 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Peak: {peakValues.errorRate.toFixed(2)}%</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="pt-4">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="time"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => value.split(':')[2]}
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Usage %', angle: -90, position: 'insideLeft', fontSize: 10 }}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="cpuUsage" 
                        name="CPU Usage %" 
                        stroke="#0088FE" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="memoryUsage" 
                        name="Memory Usage %" 
                        stroke="#00C49F" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-xs text-muted-foreground">CPU Usage</div>
                    <div className="font-mono text-sm font-bold">
                      {metrics.length ? Math.round(metrics.reduce((sum, m) => sum + m.cpuUsage, 0) / metrics.length) : 0}%
                    </div>
                    <div className="flex items-center mt-1">
                      <Progress 
                        value={metrics.length ? metrics[metrics.length - 1]?.cpuUsage || 0 : 0} 
                        className="h-1" 
                      />
                    </div>
                  </div>
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-xs text-muted-foreground">Memory Usage</div>
                    <div className="font-mono text-sm font-bold">
                      {metrics.length ? Math.round(metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length) : 0}%
                    </div>
                    <div className="flex items-center mt-1">
                      <Progress 
                        value={metrics.length ? metrics[metrics.length - 1]?.memoryUsage || 0 : 0} 
                        className="h-1" 
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoadTestSimulator;