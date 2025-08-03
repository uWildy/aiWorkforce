import React from 'react';

interface Props {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<Props> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    fetch('http://localhost/ai_workforce/api/errors/index.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'frontend-react',
        message: error.message,
        stack_trace: errorInfo.componentStack,
        severity: 'high'
      }),
    }).catch(console.error);
  }

  render() {
    return this.props.children;
  }
}

export default ErrorBoundary;