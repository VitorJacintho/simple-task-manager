import { Timer, X } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

// @ts-ignore
export default function EditTime({ onClose, cd_task }) {
  const [time, setTime] = useState('00:00:00');

  //Converte o tempo inserido em milisegundos
  const convertTimeToMilliseconds = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  };

  //Coleta a tarefa e executa a função de editar o tempo
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const elapsed_ms = convertTimeToMilliseconds(time);

    await axios.patch(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${cd_task}`, {
      elapsed_ms,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center bg-blue-100 rounded-full p-2">
            <Timer className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">
            Editar tempo decorrido
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tempo (HH:mm:ss)
            </label>
            <input
              type="text"
              placeholder="00:00:00"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-gray-50"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
