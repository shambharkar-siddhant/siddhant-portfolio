// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
async function registerRoutes(app2) {
  app2.get("/api/profile", (req, res) => {
    res.json({
      id: "3.141592....",
      name: "Siddhant Shambharkar",
      email: "shambharkarsiddhant0698@gmail.com",
      role: "Software Developer",
      createdAt: "2023-01-15T08:30:00Z"
    });
  });
  app2.get("/api/projects", (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "completed";
    res.json({
      projects: [
        { id: "p-001", name: "Predictive StockTrader", status: "completed" },
        { id: "p-002", name: "NAS using Meta Heuristic Algorithms", status: "completed" },
        { id: "p-003", name: "ChatApp with Abusive Text Detection", status: "completed" },
        { id: "p-004", name: "Fake Face Detection using Haar", status: "completed" }
      ].filter((project) => status === "all" ? true : project.status === status).slice(0, limit),
      count: 4,
      total: 12
    });
  });
  app2.get("/api/skills", (req, res) => {
    const category = req.query.category || "all";
    const skills = [
      { name: "Python", category: "backend", level: 85 },
      { name: "AWS", category: "cloud", level: 90 },
      { name: "PostgreSQL", category: "database", level: 85 },
      { name: "Redis", category: "backend", level: 80 },
      { name: "Bash", category: "backend", level: 95 },
      { name: "API's", category: "backend", level: 95 },
      { name: "Kafke", category: "devops", level: 80 },
      { name: "Shell Script", category: "backend", level: 90 }
    ];
    res.json({
      skills: category === "all" ? skills : skills.filter((skill) => skill.category === category)
    });
  });
  app2.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const combinedMessage = `Name: ${name}
Email: ${email}
Message: ${message}`;
    try {
      const formspreeRes = await fetch("https://formspree.io/f/mjkwvrvo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: combinedMessage,
          _replyto: email
        })
      });
      const result = await formspreeRes.json();
      if (formspreeRes.ok) {
        res.status(201).json({
          success: true,
          status: "delivered",
          formspree: result
        });
      } else {
        res.status(500).json({
          error: "Formspree failed",
          details: result
        });
      }
    } catch (error) {
      console.error("Error sending to Formspree:", error);
      res.status(500).json({
        error: "An error occurred sending to Formspree",
        details: error.message
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
