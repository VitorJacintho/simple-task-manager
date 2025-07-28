import { useEffect, useState } from 'react';
import axios from 'axios';
import { FilePlus } from 'lucide-react';

export default function TaskFormModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState('00:00:00');
  const [micro, setMicro] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [newClientName, setNewClientName] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  //Converte o Tempo Em Milisegundos
  const convertTimeToMilliseconds = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  };


  useEffect(() => {
    const fetchMicro = async () => {
      const { data: { ip } } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/system/my-ip`);
      const { data: { hostname } } = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/system/resolve-hostname`, { ip });
      setMicro(hostname);
    };

    //Busca os clientes
    const fetchClients = async () => {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/clients`);
      setClients(res.data);
    };

    fetchMicro();
    fetchClients();
  }, []);

  // Adiciona um novo Cliente
  const handleAddClient = async () => {
    const res = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/clients`, {
      nm_client: newClientName,
    });
    setClients((prevClients) => [...prevClients, res.data]);
    setNewClientName('');
    setSelectedClient(res.data.cd_client);
  };

  //Coleta os valores inseridos e cria a nova tarefa
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const goal_ms = convertTimeToMilliseconds(time);

    await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks`, {
      nm_title: title,
      ds_task: desc,
      nm_micro: micro,
      cd_client: selectedClient,
      elapsed_ms: 0,
      goal_ms: goal_ms > 0 ? goal_ms : null,
      tp_status: "O"
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl space-y-4"
      >
        <div className="flex items-center gap-3">
          <FilePlus className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Nova Tarefa</h3>
        </div>

        <input
          className="w-full p-2 border rounded bg-gray-100"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 border rounded bg-gray-100"
          placeholder="Descrição"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full p-2 border rounded bg-gray-100"
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => (
              <option key={client.cd_client} value={client.cd_client}>
                {client.nm_client}
              </option>
            ))}
            <option value="new">Adicionar Novo Cliente</option>
          </select>

          {selectedClient === 'new' && (
            <div className="mt-2 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Nome do novo cliente"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="p-2 border rounded bg-gray-100"
              />
              <button
                type="button"
                onClick={handleAddClient}
                className="self-start px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Adicionar Cliente
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tempo Máximo (HH:mm:ss)</label>
          <input
            type="text"
            placeholder="HH:mm:ss"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Criar
          </button>
        </div>
      </form>
    </div>
  );
}
