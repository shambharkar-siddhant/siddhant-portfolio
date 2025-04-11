import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ServerCrash } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] py-16 px-4 text-center">
      <ServerCrash className="h-24 w-24 text-muted-foreground mb-8" />
      <h1 className="text-4xl md:text-5xl font-bold mb-4">404 Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        The service or resource you're looking for could not be found or is temporarily unavailable.
      </p>
      <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex">
        <Link href="/">
          <Button size="lg">
            Return to Dashboard
          </Button>
        </Link>
        <Link href="/terminal">
          <Button variant="outline" size="lg">
            Open Terminal
          </Button>
        </Link>
      </div>
      <div className="mt-12 p-4 border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900 max-w-md mx-auto">
        <code className="text-sm font-mono">
          <div className="text-red-500">Error: ServiceNotFoundError</div>
          <div className="text-muted-foreground mt-2">
            at RequestHandler.resolve (server.js:256:22)<br />
            at async ServiceLocator.find (registry.js:124:10)
          </div>
        </code>
      </div>
    </div>
  );
}