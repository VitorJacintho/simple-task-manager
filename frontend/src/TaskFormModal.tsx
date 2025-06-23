import { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskFormModal.css';

// @ts-ignore
export default function TaskFormModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [userId, setUserId] = useState('');
  const [time, setTime] = useState('00:00:00'); // Alterado para um único campo de hora

  const [clients, setClients] = useState<any[]>([]); // Lista de clientes
  const [newClientName, setNewClientName] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  // Função para converter a string de tempo para milissegundos
  const convertTimeToMilliseconds = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  };


    // Carregar clientes ao abrir o modal
  useEffect(() => {
    const fetchClients = async () => {
      const res = await axios.get('http://192.168.0.158:3000/clients');
      setClients(res.data);
    };

    fetchClients();
  }, []);

  // Função para criar um novo cliente
  const handleAddClient = async () => {
    const res = await axios.post('http://192.168.0.158:3000/clients', {
      nm_client: newClientName,
    });
    setClients((prevClients) => [...prevClients, res.data]);
    setNewClientName('');
    setSelectedClient(res.data.cd_client);
  };



  // @ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();

    const goal_ms = convertTimeToMilliseconds(time);

    await axios.post('http://192.168.0.158:3000/tasks', {
      nm_title: title,
      ds_task: desc,
      cd_user: "1",
      cd_client: selectedClient,
      elapsed_ms: 0,
      goal_ms: goal_ms > 0 ? goal_ms : null,
      tp_status: "O"
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="form-create-task">
        <div className="title-wrapper">
          <img src="src/assets/TaskManager/new-task-icon.png" alt="Logo" className="title-logo" />
          <h3 className="text-xl font-bold">Nova Tarefa</h3>
        </div>

        <input
          className="insert-task-title"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="insert-task-description"
          placeholder="Descrição"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* <input
          className="insert-task-user"
          placeholder="ID do Usuário"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        /> */}

        <div className="insert-task-client">
          <label htmlFor="client-select">Selecione um Cliente</label>
          <select
            id="client-select"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            {clients.map((client) => (
              <option key={client.cd_client} value={client.cd_client}>
                {client.nm_client}
              </option>
            ))}
            <option value="">Selecione um cliente</option>
            <option value="new">Adicionar Novo Cliente</option>
          </select>

          {/* Formulário para adicionar um novo cliente */}
          {selectedClient === 'new' && (
            <div className="new-client-form">
              <input
                type="text"
                placeholder="Nome do novo cliente"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
              />
              <button type="button" onClick={handleAddClient}>
                Adicionar Cliente
              </button>
            </div>
          )}
        </div>

        <div className="insert-task-goal">
          <input
            type="text"
            placeholder="HH:mm:ss"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="insert-task-goal-values"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="insert-task-create-button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="insert-task-cancel-button"
          >
            Criar
          </button>
        </div>
      </form>
    </div>
  );
}
