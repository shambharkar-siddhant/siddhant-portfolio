import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, Copy, Play, Server, Shield, Database, Code, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the parameter types
type EndpointParamWithDefault = {
  name: string;
  type: string;
  default: string | number;
  description: string;
};

type EndpointParamRequired = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

type EndpointParam = EndpointParamWithDefault | EndpointParamRequired;

// Define the endpoint type
type ApiEndpoint = {
  id: string;
  method: string;
  path: string;
  description: string;
  params: EndpointParam[];
  responseTime: number;
  responseStatus: number;
  response: any;
};

// Simulated API endpoints
const ENDPOINTS: ApiEndpoint[] = [
  {
    id: "get-profile",
    method: "GET",
    path: "/api/profile",
    description: "Retrieve user profile information",
    params: [],
    responseTime: 42,
    responseStatus: 200,
    response: {
      name: "Siddhant Shambharkar",
      email: "shambharkarsiddhant0698@gmail.com",
      role: "Backend Developer",
    }
  },
  {
    id: "get-projects",
    method: "GET",
    path: "/api/projects",
    description: "List all projects",
    params: [
      { name: "limit", type: "number", default: 10, description: "Number of projects to return" },
      { name: "status", type: "string", default: "active", description: "Filter by project status" }
    ],
    responseTime: 78,
    responseStatus: 200,
    response: {
      projects: [
        { id: "p-001", name: "Backend Optimization", status: "completed" },
        { id: "p-002", name: "Cloud Migration", status: "active" },
        { id: "p-003", name: "Performance Monitoring", status: "active" },
        { id: "p-004", name: "Scalability Framework", status: "planning" }
      ],
      count: 4,
      total: 12
    }
  },
  {
    id: "get-skills",
    method: "GET",
    path: "/api/skills",
    description: "List all skills with proficiency levels",
    params: [
      { name: "category", type: "string", default: "all", description: "Filter by skill category" }
    ],
    responseTime: 35,
    responseStatus: 200,
    response: {
      skills: [
        { name: "Python", category: "backend", level: 85 },
        { name: "AWS", category: "cloud", level: 90 },
        { name: "PostgreSQL", category: "database", level: 85 },
        { name: "Redis", category: "backend", level: 80 },
        { name: "Bash", category: "backend", level: 95 },
        { name: "API's", category: "backend", level: 95 },
        { name: "Kafke", category: "devops", level: 80},
        { name: "Shell Script", category: "backend", level: 90}
      ]
    }
  },
  {
    id: "post-contact",
    method: "POST",
    path: "/api/contact",
    description: "Send a contact message",
    params: [
      { name: "name", type: "string", required: true, description: "Your name" },
      { name: "email", type: "string", required: true, description: "Your email address" },
      { name: "message", type: "string", required: true, description: "Your message" }
    ],
    responseTime: 120,
    responseStatus: 201,
    response: {
      success: true,
      messageId: "msg-78901",
      status: "delivered"
    }
  }
];

export default function ApiPlayground() {
  const [activeEndpoint, setActiveEndpoint] = useState(ENDPOINTS[0]);
  const [params, setParams] = useState<{[key: string]: string | number}>({});
  const [response, setResponse] = useState<string>("");
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadTestRate, setLoadTestRate] = useState<number[]>([5]); // 5 req/sec by default
  const [isLoadTesting, setIsLoadTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("request");
  const [loadTestStats, setLoadTestStats] = useState({ 
    sent: 0, 
    success: 0, 
    error: 0, 
    avgResponseTime: 0 
  });
  
  const { setActiveView } = useAppContext();
  const { toast } = useToast();
  
  useEffect(() => {
    setActiveView('api');
    // Initialize params with defaults
    const defaultParams: {[key: string]: string | number} = {};
    activeEndpoint.params.forEach(param => {
      if ('default' in param) {
        defaultParams[param.name] = param.default;
      }
    });
    setParams(defaultParams);
  }, [activeEndpoint, setActiveView]);
  
  const handleParamChange = (name: string, value: string) => {
    setParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const executeRequest = async () => {
    setIsLoading(true);
    setResponse("");
    setResponseTime(null);
    setResponseStatus(null);
    
    const startTime = Date.now();
    
    try {
      // Construct the URL with query parameters for GET requests
      let url = activeEndpoint.path;
      if (activeEndpoint.method === 'GET' && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, String(value));
          }
        });
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      }
      
      // Make the actual API request
      const response = await fetch(url, {
        method: activeEndpoint.method,
        headers: activeEndpoint.method === 'POST' ? { 'Content-Type': 'application/json' } : {},
        body: activeEndpoint.method === 'POST' ? JSON.stringify(params) : undefined,
      });
      
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setResponseStatus(response.status);
      
      // Get the JSON response
      const responseData = await response.json();
      setResponse(JSON.stringify(responseData, null, 2));
      
      // Switch to response tab automatically
      setActiveTab("response");
    } catch (error) {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setResponseStatus(500);
      setResponse(JSON.stringify({ error: "An error occurred processing your request", details: String(error) }, null, 2));
      
      // Switch to response tab even on error
      setActiveTab("response");
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyResponse = () => {
    navigator.clipboard.writeText(response);
    toast({
      title: "Copied to clipboard",
      duration: 2000
    });
  };
  
  const startLoadTest = () => {
    if (isLoadTesting) return;
    
    setIsLoadTesting(true);
    setLoadTestStats({ sent: 0, success: 0, error: 0, avgResponseTime: 0 });
    
    let totalTime = 0;
    let requestsSent = 0;
    let requestsSucceeded = 0;
    let requestsFailed = 0;
    
    // Run for 10 seconds
    const endTime = Date.now() + 10000;
    
    const sendRequest = async () => {
      requestsSent++;
      
      // Construct the URL with query parameters for GET requests
      let url = activeEndpoint.path;
      if (activeEndpoint.method === 'GET' && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, String(value));
          }
        });
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      }
      
      const startTime = Date.now();
      try {
        // Make the actual API request
        const response = await fetch(url, {
          method: activeEndpoint.method,
          headers: activeEndpoint.method === 'POST' ? { 'Content-Type': 'application/json' } : {},
          body: activeEndpoint.method === 'POST' ? JSON.stringify(params) : undefined,
        });
        
        const endTime = Date.now();
        const requestTime = endTime - startTime;
        totalTime += requestTime;
        
        if (response.ok) {
          requestsSucceeded++;
        } else {
          requestsFailed++;
        }
        
        setLoadTestStats({
          sent: requestsSent,
          success: requestsSucceeded,
          error: requestsFailed,
          avgResponseTime: Math.round(totalTime / requestsSent)
        });
      } catch (error) {
        const endTime = Date.now();
        const requestTime = endTime - startTime;
        totalTime += requestTime;
        requestsFailed++;
        
        setLoadTestStats({
          sent: requestsSent,
          success: requestsSucceeded,
          error: requestsFailed,
          avgResponseTime: totalTime > 0 ? Math.round(totalTime / (requestsSucceeded + requestsFailed)) : 0
        });
      }
    };
    
    // Start load test
    const interval = setInterval(() => {
      // Check if we've reached the end time
      if (Date.now() >= endTime) {
        clearInterval(interval);
        setIsLoadTesting(false);
        return;
      }
      
      // Send requests at the specified rate
      for (let i = 0; i < loadTestRate[0]; i++) {
        sendRequest();
      }
    }, 1000); // Every second
    
    // Cleanup when component unmounts
    return () => clearInterval(interval);
  };
  
  const stopLoadTest = () => {
    setIsLoadTesting(false);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Explorer</h1>
        <p className="text-muted-foreground">
          Interact with the portfolio APIs and see real-time responses. Test performance and explore endpoints.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="h-5 w-5 mr-2" />
              Available Endpoints
            </CardTitle>
            <CardDescription>
              Select an endpoint to explore
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ENDPOINTS.map((endpoint) => (
                <Button
                  key={endpoint.id}
                  variant={activeEndpoint.id === endpoint.id ? "default" : "outline"}
                  className={`w-full justify-start text-left font-mono ${activeEndpoint.id === endpoint.id ? '' : 'text-muted-foreground'}`}
                  onClick={() => setActiveEndpoint(endpoint)}
                >
                  <span className={`mr-2 font-bold ${endpoint.method === 'GET' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                    {endpoint.method}
                  </span>
                  {endpoint.path}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Request Builder */}
        <Card className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-mono flex items-center text-xl">
                    <span className={`mr-2 font-bold ${activeEndpoint.method === 'GET' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                      {activeEndpoint.method}
                    </span>
                    {activeEndpoint.path}
                  </CardTitle>
                  <CardDescription>{activeEndpoint.description}</CardDescription>
                </div>
                <TabsList>
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="loadtest">Load Test</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="request" className="mt-0">
                <div className="space-y-4">
                  {activeEndpoint.params.length > 0 ? (
                    activeEndpoint.params.map((param) => (
                      <div key={param.name} className="space-y-2">
                        <Label htmlFor={param.name}>
                          {param.name}
                          {'required' in param && param.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <Input
                          id={param.name}
                          placeholder={param.description}
                          value={params[param.name] || ''}
                          onChange={(e) => handleParamChange(param.name, e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">{param.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No parameters required for this endpoint
                    </div>
                  )}
                  
                  <Button 
                    className="w-full mt-4"
                    onClick={executeRequest}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Execute Request
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="response" className="mt-0">
                <div className="space-y-4">
                  {responseStatus ? (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2 items-center">
                          <div className={`px-2 py-1 text-xs rounded-full font-medium ${
                            responseStatus >= 200 && responseStatus < 300 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            Status: {responseStatus}
                          </div>
                          {responseTime && (
                            <div className="text-xs text-muted-foreground">
                              Response time: {responseTime}ms
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm" onClick={copyResponse}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-[400px] text-sm text-black dark:text-white">
                        {response}
                      </pre>
                    </>
                  ) : (
                    <div className="py-16 text-center text-muted-foreground">
                      <Code className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Execute a request to see the response</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="loadtest" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <Label>Request Rate (requests/second)</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Slider
                        value={loadTestRate}
                        min={1}
                        max={25}
                        step={1}
                        onValueChange={setLoadTestRate}
                        disabled={isLoadTesting}
                        className="flex-1"
                      />
                      <div className="w-12 text-center font-medium">{loadTestRate[0]}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    {!isLoadTesting ? (
                      <Button onClick={startLoadTest}>
                        <Play className="mr-2 h-4 w-4" /> Start Load Test
                      </Button>
                    ) : (
                      <Button variant="destructive" onClick={stopLoadTest}>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Stop Test
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">Requests Sent</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-2xl font-bold">{loadTestStats.sent}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">Success Rate</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-2xl font-bold">
                          {loadTestStats.sent > 0 
                            ? `${Math.round((loadTestStats.success / loadTestStats.sent) * 100)}%` 
                            : "0%"}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">Errors</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-2xl font-bold">{loadTestStats.error}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">Avg Response</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-2xl font-bold">{loadTestStats.avgResponseTime}ms</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {loadTestStats.sent > 0 && !isLoadTesting && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-md">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-300">Load Test Complete</h4>
                          <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                            Test completed successfully with {loadTestStats.sent} total requests.
                            Average response time was {loadTestStats.avgResponseTime}ms with a {Math.round((loadTestStats.success / loadTestStats.sent) * 100)}% success rate.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Authentication
            </CardTitle>
            <CardDescription>
              API endpoints authentication information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This API playground uses simulated authentication. In a real API, you would need to:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Obtain an API key or token through the authentication process</li>
              <li>Include the token in the Authorization header</li>
              <li>Renew the token when it expires</li>
            </ul>
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
              <div className="text-black dark:text-white">Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Response Schema
            </CardTitle>
            <CardDescription>
              Understanding API response formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <p>
                All API responses follow a consistent structure:
              </p>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono">
                <pre className="text-black dark:text-white">{`{
  // Response data specific to the endpoint
  ...
  
  // For paginated responses
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10
  },
  
  // For error responses
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}