import  { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ClipboardList, Bot, Menu } from "lucide-react";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside className={`h-screen bg-gray-100 shadow-md transition-all duration-300 flex flex-col ${isCollapsed ? "w-16" : "w-60"}`}>
      <div className="flex justify-end p-2">
      <button 
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-gray-800 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
      >
        <Menu className="h-6 w-6" />
      </button>
      </div>

      {!isCollapsed && <h2 className="text-xl font-bold px-4 py-2 text-gray-700">Menu</h2>}

      <nav className="flex flex-col space-y-1 px-2">
        <Link to="/home" className="flex items-center gap-3 p-2 rounded hover:bg-gray-200 text-gray-800 transition-all">
          <Home size={20} />
          {!isCollapsed && <span>Início</span>}
        </Link>
        <Link to="/tasks" className="flex items-center gap-3 p-2 rounded hover:bg-gray-200 text-gray-800 transition-all">
          <ClipboardList size={20} />
          {!isCollapsed && <span>Cronometro</span>}
        </Link>
        <Link to="/assistente" className="flex items-center gap-3 p-2 rounded hover:bg-gray-200 text-gray-800 transition-all">
          <Bot size={20} />
          {!isCollapsed && <span>Assistente</span>}
        </Link>
      </nav>
    </aside>
  );
}
