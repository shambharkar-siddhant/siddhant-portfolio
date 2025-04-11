import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, AlertTriangle, CheckCircle, ClockIcon, Zap as ZapIcon, Server, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import ServiceArchitectureDiagram from "@/components/ServiceArchitectureDiagram";
import LogStreamVisualizer from "@/components/LogStreamVisualizer";
import LoadTestSimulator from "@/components/LoadTestSimulator";

const statusColors = {
  online: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500"
};

const statusIcons = {
  online: CheckCircle,
  warning: AlertTriangle,
  error: XCircle
};

// Generate mock performance data
const generatePerformanceData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    cpu: Math.floor(Math.random() * 40) + 20,
    memory: Math.floor(Math.random() * 30) + 40,
    requests: Math.floor(Math.random() * 500) + 100
  }));
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Service distribution data for pie chart
const serviceDistributionData = [
  { name: 'Authentication', value: 25 },
  { name: 'Logging', value: 15 },
  { name: 'API Gateway', value: 20 },
  { name: 'Cache', value: 5 },
  { name: 'Data Processing', value: 35 }
];

export default function Dashboard() {
  const { 
    services, 
    setSelectedService, 
    selectedService,
    isModalOpen,
    setModalOpen,
    isLoadTesting,
    setIsLoadTesting,
    activeServiceTab,
    setActiveServiceTab
  } = useAppContext();
  
  const [performanceData] = useState(generatePerformanceData());
  const [serviceDetailsOpen, setServiceDetailsOpen] = useState(false);
  
  // Selected service data
  const selectedServiceData = selectedService 
    ? services.find(s => s.id === selectedService) || null 
    : null;
  
  const openServiceDetails = (serviceId: string) => {
    setSelectedService(serviceId);
    setServiceDetailsOpen(true);
  };
  
  // Reset active tab when service changes
  useEffect(() => {
    if (selectedService) {
      setActiveServiceTab('overview');
    }
  }, [selectedService, setActiveServiceTab]);
  
  const totalServices = services.length;
  const onlineServices = services.filter(s => s.status === "online").length;
  const warningServices = services.filter(s => s.status === "warning").length;
  const errorServices = services.filter(s => s.status === "error").length;
  
  // Calculate average response time from all services
  const avgResponseTime = services.reduce((total, service) => {
    const responseTime = service.stats["Avg. Response Time"];
    if (responseTime) {
      const value = parseInt(responseTime.replace(/[^0-9.]/g, ''));
      return total + value;
    }
    return total;
  }, 0) / services.length;
  
  // Calculate request rate
  const totalRequestRate = services.reduce((total, service) => {
    let requests = service.stats["Requests/min"] || service.stats["Requests/sec"] || service.stats["Jobs/hour"] || "0";
    requests = requests.replace(/[^0-9.]/g, '');
    return total + parseInt(requests);
  }, 0);
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-muted-foreground text-gray-100">
            A simulation of a high-performance microservices ecosystem. 
            Explore the system, monitor services, and interact with components.
          </p>
        </div>
        
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Services Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onlineServices}/{totalServices}</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  {onlineServices} Online
                </Badge>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                  {warningServices} Warning
                </Badge>
                <Badge variant="outline" className="bg-red-500/10 text-red-500">
                  {errorServices} Error
                </Badge>
              </div>
              <Progress 
                value={(onlineServices / totalServices) * 100} 
                className="h-2 mt-3" 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgResponseTime.toFixed(1)}ms</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all services
              </p>
              <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${avgResponseTime < 100 ? 'bg-green-500' : avgResponseTime < 200 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                  style={{ width: `${Math.min((avgResponseTime / 300) * 100, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Request Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequestRate.toLocaleString()}/min</div>
              <p className="text-xs text-muted-foreground mt-1">
                Combined from all services
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Activity className="h-4 w-4 text-green-500" />
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full">
                  <div className="bg-green-500 h-1 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Operational</div>
              <div className="flex items-center mt-2">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs">CPU</p>
                    <p className="text-xs font-medium">42%</p>
                  </div>
                  <Progress value={42} className="h-1" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs">Memory</p>
                    <p className="text-xs font-medium">68%</p>
                  </div>
                  <Progress value={68} className="h-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>
                Resource utilization and request volume over the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.split(':')[0]} 
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="cpu" 
                      name="CPU Usage (%)" 
                      stroke="#0088FE" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="memory" 
                      name="Memory Usage (%)" 
                      stroke="#00C49F" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="requests" 
                      name="Requests" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Service Distribution</CardTitle>
              <CardDescription>
                Workload allocation across services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {serviceDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* System Architecture Diagram */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Architecture</CardTitle>
            <CardDescription>
              Interactive visualization of how services interact within the ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServiceArchitectureDiagram 
              services={services} 
              onSelectService={openServiceDetails} 
            />
          </CardContent>
        </Card>
        
        {/* Services List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Microservices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const StatusIcon = statusIcons[service.status];
              return (
                <Card key={service.id} className="overflow-hidden">
                  <div className={`h-1 w-full ${statusColors[service.status]}`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge variant={service.status === 'online' ? 'default' : service.status === 'warning' ? 'outline' : 'destructive'} className="capitalize">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {service.status}
                      </Badge>
                    </div>
                    <CardDescription>ID: {service.id} | Port: {service.port}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(service.stats).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <div className="text-muted-foreground">{key}</div>
                            <div className="font-medium">{value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center text-sm space-x-1 text-muted-foreground">
                        <ClockIcon className="h-4 w-4" />
                        <span>Uptime: {service.uptime}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => openServiceDetails(service.id)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-none"
                          onClick={() => {
                            setSelectedService(service.id);
                            setIsLoadTesting(true);
                          }}
                        >
                          <ZapIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Service Details Dialog */}
      <Dialog open={serviceDetailsOpen} onOpenChange={setServiceDetailsOpen}>
        <DialogContent className="max-w-4xl">
          {selectedServiceData && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant={selectedServiceData.status === 'online' ? 'default' : selectedServiceData.status === 'warning' ? 'outline' : 'destructive'} className="capitalize">
                    {selectedServiceData.status}
                  </Badge>
                  <DialogTitle>{selectedServiceData.name}</DialogTitle>
                </div>
                <DialogDescription>
                  ID: {selectedServiceData.id} | Port: {selectedServiceData.port} | Uptime: {selectedServiceData.uptime}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs value={activeServiceTab} onValueChange={setActiveServiceTab}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="logs">Live Logs</TabsTrigger>
                  <TabsTrigger value="loadtest">Load Testing</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {Object.entries(selectedServiceData.stats).map(([key, value]) => (
                      <div key={key} className="p-4 border rounded-md">
                        <div className="text-sm text-muted-foreground">{key}</div>
                        <div className="text-2xl font-bold">{value}</div>
                      </div>
                    ))}
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Dependencies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-32 text-sm text-muted-foreground">Depends on:</div>
                          <div className="space-x-2">
                            {selectedServiceData.id === 'auth-service' && (
                              <>
                                <Badge variant="outline">Database</Badge>
                                <Badge variant="outline">Cache Service</Badge>
                              </>
                            )}
                            {selectedServiceData.id === 'data-processor' && (
                              <>
                                <Badge variant="outline">Cache Service</Badge>
                                <Badge variant="outline">Storage Service</Badge>
                              </>
                            )}
                            {selectedServiceData.id === 'api-gateway' && (
                              <>
                                <Badge variant="outline">Auth Service</Badge>
                                <Badge variant="outline">Data Processor</Badge>
                                <Badge variant="outline">Search Engine</Badge>
                              </>
                            )}
                            {selectedServiceData.id === 'cache-service' && (
                              <>
                                <Badge variant="outline">None</Badge>
                              </>
                            )}
                            {selectedServiceData.id === 'search-engine' && (
                              <>
                                <Badge variant="outline">Data Processor</Badge>
                                <Badge variant="outline">Database</Badge>
                              </>
                            )}
                            {selectedServiceData.id === 'notif-service' && (
                              <>
                                <Badge variant="outline">Auth Service</Badge>
                                <Badge variant="outline">Message Queue</Badge>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-32 text-sm text-muted-foreground">Used by:</div>
                          <div className="space-x-2">
                            {selectedServiceData.id === 'auth-service' && (
                              <>
                                <Badge variant="outline">API Gateway</Badge>
                                <Badge variant="outline">All Services</Badge>
                              </>
                            )}
                            {selectedServiceData.id === 'data-processor' && (
                              <>
                                <Badge variant="outline">API Gateway</Badge>
                                <Badge variant="outline">Search Engine</Badge>
                              </>
                            )}
                            {selectedServiceData.id === 'api-gateway' && (
                              <>
                                <Badge variant="outline">Client Applications</Badge>
                                <Badge variant="outline">External APIs</Badge>
                              </>
                            )}
                            {selectedServiceData.id === 'cache-service' && (
                              <>
                                <Badge variant="outline">Auth Service</Badge>
                                <Badge variant="outline">Data Processor</Badge>
                                <Badge variant="outline">API Gateway</Badge>
                              </>
                            )}
                            {selectedServiceData.id === 'search-engine' && (
                              <>
                                <Badge variant="outline">API Gateway</Badge>
                              </>
                            )}
                            {selectedServiceData.id === 'notif-service' && (
                              <>
                                <Badge variant="outline">Auth Service</Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveServiceTab('logs')}>
                      View Live Logs
                    </Button>
                    <Button variant="default" onClick={() => setActiveServiceTab('loadtest')}>
                      <ZapIcon className="h-4 w-4 mr-2" />
                      Test Service Performance
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="logs">
                  <div className="mt-4">
                    <LogStreamVisualizer 
                      logs={selectedServiceData.logs} 
                      serviceName={selectedServiceData.name}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="loadtest">
                  <div className="mt-4">
                    <LoadTestSimulator 
                      service={selectedServiceData}
                      isLoadTesting={isLoadTesting}
                      setIsLoadTesting={setIsLoadTesting}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}