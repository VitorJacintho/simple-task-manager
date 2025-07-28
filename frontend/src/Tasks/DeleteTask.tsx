import { Trash2, X } from 'lucide-react';
import axios from 'axios';

// @ts-ignore
export default function DeleteTask({ onClose, cd_task }) {

  //Deleta a Tarefa
  const deleteTask = async (id: string) => {
    await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${id}`);
  };

  // coleta a tarefa e executa a ação de deletar
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    deleteTask(cd_task);
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
          <div className="flex items-center justify-center bg-red-100 rounded-full p-2">
            <Trash2 className="text-red-600 w-6 h-6" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">
            Excluir tarefa
          </h3>
        </div>

        <p className="text-gray-700 mb-6">
          Atenção: após a exclusão, não será possível recuperar os dados da tarefa. Essa ação é irreversível.
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
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
