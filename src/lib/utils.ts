import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from 'sonner';

export const errorToast = (message: string, options = {}) => {
  if (!message) return;
  toast.error(message, options);
  
  let logData = {
    type: 'frontend-toast',
    message: message.trim().replace(/[^ -~]+/g, ''), // Remove non-ASCII
    stack_trace: options.stack || '',
    severity: options.severity || 'medium',
    user_id: options.userId || null
  };
  
  try {
    const jsonBody = JSON.stringify(logData);
    console.log('POST body:', jsonBody);
    
    fetch('http://localhost/ai_workforce/api/errors/log.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonBody,
    }).then(res => res.json()).then(data => {
      if (!data.success) console.error(data.error);
    }).catch(e => console.error('Fetch err:', e));
  } catch (e) {
    console.error('Stringify failed:', e);
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
