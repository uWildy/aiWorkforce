import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'; // New component

// Global JS error handler
window.onerror = (message, source, lineno, colno, error) => {
  fetch('http://localhost/ai_workforce/api/errors/log.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'frontend',
      message: message.toString(),
      stack_trace: `Source: ${source} Line: ${lineno}:${colno} Error: ${error?.stack || ''}`,
      severity: 'high'
    }),
  }).catch(console.error); // Async, non-blocking
};

// Unhandled promise rejections
window.onunhandledrejection = (event) => {
  fetch('http://localhost/ai_workforce/api/errors/log.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'frontend',
      message: event.reason?.message || 'Unhandled rejection',
      stack_trace: event.reason?.stack || '',
      severity: 'medium'
    }),
  }).catch(console.error);
};

window.onerror = (msg, url, line, col, error) => { fetch('http://localhost/ai_workforce/api/errors/log.php', { method: 'POST', body: JSON.stringify({ type: 'frontend', message: msg, stack_trace: error?.stack }) }); };

createRoot(document.getElementById("root")!).render(<App />);
