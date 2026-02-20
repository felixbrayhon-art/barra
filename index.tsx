import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("Index.tsx: EXECUTION START");
document.body.style.border = '10px solid yellow';
document.body.style.boxSizing = 'border-box';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Index.tsx: Could not find root element!");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Index.tsx: Render called.");
} catch (error) {
  console.error("Index.tsx: Fatal mount error:", error);
  rootElement.innerHTML = `<div style="color: white; padding: 20px; font-family: sans-serif;"><h1>Erro ao iniciar o aplicativo</h1><p>${error.message}</p></div>`;
}