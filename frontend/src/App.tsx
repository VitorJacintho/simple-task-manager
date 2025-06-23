// App.tsx
import TaskList from './TaskList'; // ajuste o caminho conforme sua pasta
import './index.css'; // ou 'tailwind.css' se estiver com arquivo próprio
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TaskList />
    </div>
  );
}

export default App;
