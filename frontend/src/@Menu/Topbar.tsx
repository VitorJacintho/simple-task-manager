import { useEffect, useState } from "react";
import axios from "axios";
import { UserCircle2 } from "lucide-react"; 

export function Topbar() {
  const [micro, setMicro] = useState("");


  useEffect(() => {
    async function getMicro() {
      try {
        const { data: { ip } } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/system/my-ip`);
        const { data: { hostname } } = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/system/resolve-hostname`, { ip });
        setMicro(hostname);
      } catch (err) {
        console.error("Erro ao buscar micro:", err);
      }
    }

    getMicro();
  }, []);

  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <img src="/frontend/src/assets/GembaMill.png" alt="Logo" className="h-10 w-auto" />
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Gemba System Manager</h1>
      </div>

      <div className="flex items-center space-x-2 text-gray-700">
        <UserCircle2 className="w-5 h-5 text-gray-500" />
        <span className="text-sm md:text-base font-medium">Bem-vindo, {micro.toUpperCase()}!</span>
      </div>
    </header>
  );
}
