import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints for the portfolio project
  
  // Profile endpoint
  app.get('/api/profile', (req: Request, res: Response) => {
    res.json({
      id: "3.141592....",
      name: "Siddhant Shambharkar",
      email: "shambharkarsiddhant0698@gmail.com",
      role: "Software Developer",
      createdAt: "2023-01-15T08:30:00Z"
    });
  });
  
  // Projects endpoint
  app.get('/api/projects', (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string || 'completed';
    
    res.json({
      projects: [
        { id: "p-001", name: "Predictive StockTrader", status: "completed" },
        { id: "p-002", name: "NAS using Meta Heuristic Algorithms", status: "completed" },
        { id: "p-003", name: "ChatApp with Abusive Text Detection", status: "completed" },
        { id: "p-004", name: "Fake Face Detection using Haar", status: "completed" }
      ].filter(project => status === 'all' ? true : project.status === status).slice(0, limit),
      count: 4,
      total: 12
    });
  });
  
  // Skills endpoint
  app.get('/api/skills', (req: Request, res: Response) => {
    const category = req.query.category as string || 'all';
    
    const skills = [
      { name: "Python", category: "backend", level: 85 },
      { name: "AWS", category: "cloud", level: 90 },
      { name: "PostgreSQL", category: "database", level: 85 },
      { name: "Redis", category: "backend", level: 80 },
      { name: "Bash", category: "backend", level: 95 },
      { name: "API's", category: "backend", level: 95 },
      { name: "Kafke", category: "devops", level: 80},
      { name: "Shell Script", category: "backend", level: 90}
    ];
    
    res.json({
      skills: category === 'all' ? skills : skills.filter(skill => skill.category === category)
    });
  });
  
  // Contact endpoint
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // In a real app, you would save this to database or send an email
    res.status(201).json({
      success: true,
      messageId: "msg-" + Math.floor(10000 + Math.random() * 90000),
      status: "delivered"
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
