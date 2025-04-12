import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import useTerminal from "@/hooks/useTerminal";
import { useAppContext } from "@/context/AppContext";

export default function Terminal() {
  const [input, setInput] = useState("");
  const { commands, executeCommand, getPreviousCommand, getNextCommand } = useTerminal();
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setActiveView } = useAppContext();

  // Set the active view to terminal when this component mounts
  useEffect(() => {
    setActiveView('terminal');
    
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Scroll to the bottom of the terminal when commands are added
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [commands, setActiveView]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevCommand = getPreviousCommand();
      if (prevCommand) {
        setInput(prevCommand);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextCommand = getNextCommand();
      setInput(nextCommand || "");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-100">Command Line Interface</h1>
        <p className="text-muted-foreground">
          Interact with the system through a terminal interface. Type 'help' to see available commands.
        </p>
      </div>

      <Card className="border-gray-800 dark:border-gray-700 bg-black text-green-400 font-mono">
        <CardContent className="p-4">
          <div className="terminal-header border-b border-gray-700 pb-2 mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-center text-xs text-gray-500 -mt-3">backend-terminal ~ system-access</div>
          </div>
          
          <div className="min-h-[500px] max-h-[500px] overflow-y-auto p-1" onClick={() => inputRef.current?.focus()}>
            <div className="mb-4 px-2 py-1 bg-green-950/30 rounded border border-green-900/50 text-green-300">
              <p>Welcome to the Backend Ecosystem Terminal.</p>
              <p>Type 'help' to see available commands.</p>
            </div>
            
            {commands.map((cmd, index) => (
              <div key={index} className="mb-4">
                <div className="flex">
                  <span className="text-blue-400 mr-2">$</span>
                  <span>{cmd.command}</span>
                </div>
                <div className="ml-4 mt-1 whitespace-pre-wrap">{cmd.output}</div>
              </div>
            ))}
            
            <div ref={terminalEndRef}></div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex items-center mt-4 border-t border-gray-700 pt-4">
            <span className="text-blue-400 mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none"
              autoFocus
              aria-label="Terminal input"
            />
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-8 p-4 border border-gray-200 dark:border-gray-800 rounded-md bg-gray-50 dark:bg-gray-900">
        <h3 className="text-lg font-semibold mb-3">Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Basic Commands</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-primary">help</code> - Show all commands</li>
              <li><code className="text-primary">ls</code> - List items in current directory</li>
              <li><code className="text-primary">status</code> - Show system status</li>
              <li><code className="text-primary">clear</code> - Clear terminal</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">Advanced Commands</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-primary">ping &lt;service-id&gt;</code> - Test service connectivity</li>
              <li><code className="text-primary">service --logs &lt;service-id&gt;</code> - View service logs</li>
              <li><code className="text-primary">cat &lt;filename&gt;</code> - View file contents</li>
              <li><code className="text-primary">deploy &lt;service-id&gt;</code> - Deploy a service</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}