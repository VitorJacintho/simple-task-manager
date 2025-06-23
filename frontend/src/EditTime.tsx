import { useState } from 'react';
import axios from 'axios';
import './TaskFormModal.css';

export default function EditTime({ onClose, cd_task }) {
  const [time, setTime] = useState('00:00:00'); // Alterado para um único campo de hora

  // Função para converter a string de tempo para milissegundos
  const convertTimeToMilliseconds = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const elapsed_ms = convertTimeToMilliseconds(time);

    // Agora usando o cd_task passado como prop
    await axios.patch(`http://192.168.0.158:3000/tasks/${cd_task}`, {
      elapsed_ms: elapsed_ms,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="form-create-task">
        <div className="title-wrapper">
          <img src="src/assets/TaskManager/time-task-icon.png" alt="Logo" className="title-logo" />
          <h3 className="text-xl font-bold">Editar tempo decorrido</h3>
        </div>

        <label htmlFor="warning">Atenção: Editar o tempo pode causar problemas nas interações, caso o tempo editado seja menor que o da última interação realizada.<br></br> Todas as demais funcionalidades funcionarão corretamente. </label>
        <div className="insert-task-elapsed">
          <input
            type="text"
            placeholder="HH:mm:ss"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="insert-task-elapsed-values"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="insert-task-save-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="insert-task-cancel-button"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
