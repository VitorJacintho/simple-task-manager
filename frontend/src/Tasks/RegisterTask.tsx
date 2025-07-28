import { ClipboardPlus, X } from 'lucide-react';
import axios from 'axios';

// @ts-ignore
export default function RegisterTask({ onClose, cd_task }) {

  //Registra uma tarefa
  const registerTask = async (id: string) => {
    await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks-register/${id}`);
  };

  //Coleta o codigo da tarefa e executa a funçao de registrar tarefa
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    registerTask(cd_task);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center bg-indigo-100 rounded-full p-2">
            <ClipboardPlus className="text-indigo-500 w-6 h-6" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">
            Registrar tarefa
          </h3>
        </div>

        <p className="text-gray-700 mb-6">
          Ao prosseguir, a tarefa será salva no histórico e não aparecerá mais na lista ativa. 
          <span className="text-red-600 font-semibold"> Atenção:</span> esta ação finaliza a tarefa permanentemente.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}
