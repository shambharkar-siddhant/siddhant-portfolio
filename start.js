// Enhanced script to start the application with better error handling
import { spawn } from 'child_process';

console.log('Starting the application with detailed logging...');

// Use spawn instead of exec to get better control over the process
const childProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'pipe', // Pipe the child's stdio to the parent
  shell: true
});

// Log when server starts
let serverStarted = false;

childProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  // Check if server started message appears
  if (output.includes('serving on port')) {
    serverStarted = true;
    console.log('✅ SERVER SUCCESSFULLY STARTED!');
  }
});

childProcess.stderr.on('data', (data) => {
  console.error('SERVER ERROR:', data.toString());
});

childProcess.on('error', (error) => {
  console.error('Failed to start server process:', error);
});

childProcess.on('exit', (code, signal) => {
  if (code !== 0) {
    console.error(`Server process exited with code ${code} and signal ${signal}`);
  } else {
    console.log(`Server process exited normally with code ${code}`);
  }
  
  if (!serverStarted) {
    console.error('⚠️ WARNING: Server never printed a startup message before exiting');
  }
});

// Keep the process running
process.stdin.resume();

// Handle app termination
process.on('SIGINT', () => {
  console.log('Stopping server...');
  childProcess.kill('SIGINT');
  process.exit();
});