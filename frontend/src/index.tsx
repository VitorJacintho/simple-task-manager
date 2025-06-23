import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // ou qualquer outro arquivo de estilo que você esteja usando
import TaskList from './TaskList'; // Importando o componente TaskList
import { BrowserRouter as Router } from 'react-router-dom'; // Se você estiver usando rotas

// Definindo o elemento raiz para a renderização
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <TaskList /> {/* Renderizando o componente TaskList */}
    </Router>
  </React.StrictMode>
);
