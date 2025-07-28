import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TaskList from './Tasks/TaskList'; // Importando o componente TaskList
import { BrowserRouter as Router } from 'react-router-dom'; // Se você estiver usando rotas


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <TaskList /> 
    </Router>
  </React.StrictMode>
);
