import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("Index.tsx: Booting (Step 1)");
document.body.style.border = '5px solid #FB8C00';
document.body.style.boxSizing = 'border-box';

window.onerror = (message, source, lineno, colno, error) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="background: white; color: black; padding: 40px; font-family: 'Poppins', sans-serif; text-align: center; height: 100vh; display: flex; flex-col; items-center; justify-center;">
        <div style="max-width: 500px">
          <h1 style="font-weight: 900; font-size: 2rem; margin-bottom: 20px">Ops! Algo deu errado ⚓</h1>
          <p style="color: #666; margin-bottom: 20px">Ocorreu um erro ao iniciar o app. Tente limpar o cache ou recarregar.</p>
          <pre style="background: #f8f9fa; padding: 20px; border-radius: 1rem; text-align: left; font-size: 10px; overflow: auto; max-height: 200px">
            Error: ${message}
            Source: ${source}
            Line: ${lineno}:${colno}
          </pre>
          <button onclick="localStorage.clear(); window.location.reload();" style="margin-top: 20px; padding: 12px 24px; background: #FB8C00; color: white; border: none; border-radius: 1rem; font-weight: bold; cursor: pointer">
            Restaurar App (Limpar tudo)
          </button>
        </div>
      </div>
    `;
  }
};

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