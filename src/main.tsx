// Silence unhelpful cross-origin errors stemming from embedded third-party widgets like Sketchfab
if (typeof window !== 'undefined') {
  const ignorePatterns = ['sketchfab', 'Script error.'];
  
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    const msgStr = String(message || '');
    const srcStr = String(source || '');
    const errorStack = error && error.stack ? String(error.stack) : '';
    
    const shouldIgnore = ignorePatterns.some(pattern => 
      msgStr.includes(pattern) || 
      srcStr.includes(pattern) || 
      errorStack.includes(pattern)
    );
    
    if (shouldIgnore) {
      console.warn('Suppressed cross-origin/Sketchfab widget error:', message);
      return true; // true prevents default browser/Vite error reporting
    }
    
    if (originalOnError) {
      return originalOnError.apply(window, arguments as any);
    }
    return false;
  };

  window.addEventListener('error', (event) => {
    const msgStr = String(event.message || '');
    const srcStr = String(event.filename || '');
    const errorStack = event.error && event.error.stack ? String(event.error.stack) : '';

    const shouldIgnore = ignorePatterns.some(pattern => 
      msgStr.includes(pattern) || 
      srcStr.includes(pattern) || 
      errorStack.includes(pattern)
    );

    if (shouldIgnore) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = event.reason ? String(event.reason.message || event.reason) : '';
    const errorStack = event.reason && event.reason.stack ? String(event.reason.stack) : '';

    const shouldIgnore = ignorePatterns.some(pattern => 
      reasonStr.includes(pattern) || 
      errorStack.includes(pattern)
    );

    if (shouldIgnore) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
