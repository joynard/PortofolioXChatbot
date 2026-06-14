import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// DevTools Protection & Owner Credit (Active only in Production Build)
if (import.meta.env.PROD) {
  // Prevent right-click context menu
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Prevent keyboard shortcuts for DevTools and source inspection
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
    }
    // Ctrl+Shift+I (Inspect Element)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
      e.preventDefault();
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
      e.preventDefault();
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
    }
  });

  // Print owner credits to console
  const printConsoleCredit = () => {
    console.clear();
    console.log(
      `%c🤖 DevHub.AI %cCreated by @joynard`,
      "color: #f59e0b; font-size: 20px; font-weight: bold; background: #1c1410; padding: 6px 12px; border-radius: 4px; text-shadow: 0 0 8px rgba(245, 158, 11, 0.3);",
      "color: #ffedd5; font-size: 14px; font-weight: 600;"
    );
    console.log(
      "%cAll rights reserved. Code inspection and right-click have been disabled on this production build.",
      "color: #a8a29e; font-size: 11px; font-style: italic;"
    );
  };

  // Run infinite debugger loops to break the developer tools inspector
  setInterval(() => {
    printConsoleCredit();
    (function() {
      return false;
    }['constructor']('debugger')());
  }, 1000);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
