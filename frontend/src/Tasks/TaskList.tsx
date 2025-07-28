import { useEffect, useState } from 'react';
import axios from 'axios';
import TaskFormModal from './TaskFormModal.tsx';
import './TaskList.css'; 
import React from 'react';
import EditTime from './EditTime.tsx';
import DeleteTask from './DeleteTask.tsx';
import { Play, Pause, Info, Trash2, Check, ClipboardPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RegisterTask from './RegisterTask.tsx';


interface Task {
  cd_task: string;
  nm_title: string;
  ds_task?: string;
  nm_micro: string;
  goal_ms?: number;
  elapsed_ms?: number;
  tp_status: string;
  tp_situation?: string
  cd_client?: string; 
};


export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditTime, setShowEditTime] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [taskToRegister, setTaskToRegister] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<{ [key: string]: string } | null>(null);
  const [, setMicro] = useState('');

  // -- detalhes
  const [openTaskDetail, setOpenTaskDetail] = useState(null); 
  const [interactionsMap, setInteractionsMap] = useState({});
  const [newInteractionDesc, setNewInteractionDesc] = useState('');
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [clients, setClients] = useState<any[]>([]); 
  const [newClientName, setNewClientName] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [pendingStartTask, setPendingStartTask] = useState<Task | null>(null);
  const [tasksRunning, setTasksRunning] = useState<Task[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tasksRegistered, setTasksRegistered] = useState<Task[]>([]);



  // Retorna a Task e suas Informaões
  const fetchTasks = async () => {
    try {
      // pega o IP da máquina cliente
      const { data: { ip } } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/system/my-ip`);

      // envia o IP para resolver o hostname
      const { data: { hostname } } = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/system/resolve-hostname`, { ip });

      setMicro(hostname); 

      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks?nm_micro=${hostname}`);
      setTasks(res.data);
    } catch (error) {
      console.error('Erro ao buscar tasks por micro:', error);
    }
  };


  // Formata os valores de tempo que são definidos em ms
  const formatTime = (ms: number) => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const min = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    return `${hrs}:${min}:${sec}`;
  };


  // Inicia a Task
  const startTask = async (task: Task) => {
    // Ignora se já está rodando
    if (task.tp_status === 'S') return;

    // Filtra todas as tasks já rodando nesse micro
    //@ts-ignore
    const runningTasks = tasks.filter(t => t.tp_status === 'S');

    // Nenhuma rodando → pode iniciar direto
    if (runningTasks.length === 0) {
      await axios.patch(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${task.cd_task}/start`);
      fetchTasks();
      return;
    }

    // Há outras rodando → mostrar confirmação
    setPendingStartTask(task);
    setTasksRunning(runningTasks);
    setShowConfirmModal(true);
  };


  const handleConfirmStart = async (pauseOthers: boolean) => {
    if (!pendingStartTask) return;

    if (pauseOthers) {
      // Pausa todas as outras tarefas
      await Promise.all(
        tasksRunning.map(async t => {
          await axios.patch(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${t.cd_task}/pause`);
        })
      );
    }

    // Inicia a nova tarefa
    await axios.patch(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${pendingStartTask.cd_task}/start`);

    setPendingStartTask(null);
    setTasksRunning([]);
    setShowConfirmModal(false);
    fetchTasks();
  };



  // Pausa a Task
  const pauseTask = async (task: Task) => {
    await axios.patch(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${task.cd_task}/pause`);
    fetchTasks();

    fetchTasks(); 
  };


  // Calcula a barra de Progresso
  // @ts-ignore
  const getProgress = (task) => {
    const elapsed = task.elapsed_ms || 0;

    const percent = task.goal_ms
      ? Math.min((elapsed / task.goal_ms) * 100, 100)
      : 0;

    return {
      percent,
      elapsed: formatTime(elapsed),
      goalTime: task.goal_ms ? formatTime(task.goal_ms) : 'Indefinido'
    };
  };


  // --- Detail ---

  // Abre os detalhes da Task
  // @ts-ignore
  const toggleTaskDetails = (task) => {
    
    if (openTaskDetail === task.cd_task) {
      setOpenTaskDetail(null); 
    } else {
      setOpenTaskDetail(task.cd_task); 
    }

    if (openTaskDetail !== task.cd_task) {
      setEditingTask(task);  
      setSelectedClient(task.cd_client || ''); 

    }
  };


  // Abre o menu de interações
  // @ts-ignore
  const toggleTaskInteractions = async (task) => {

      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks-interactions?cd_task=${task.cd_task}`);
      setInteractionsMap(prev => ({ ...prev, [task.cd_task]: res.data }));
  
  };


  // Salva os detalhes da Task
  const handleSave = async () => {
    if (!editingTask) return; 

    const { cd_task, nm_title, tp_situation, ds_task } = editingTask;

    try {
      await axios.patch(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${cd_task}`, {nm_title, tp_situation, ds_task, cd_client: selectedClient });
      setEditingTask({cd_task});  
      fetchTasks();
    } catch (error) {
      console.error("Erro ao salvar a tarefa:", error);
    }
  };


  // Desfaz as alterações dos detalhes da Task
  const handleCancel = () => {
    setEditingTask(null);  
  };


  // @ts-ignore
  // adiciona uma Interação
  const handleAddInteraction = async (task) => {
    const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${task.cd_task}`);
    const timeElapsed = res.data.elapsed_ms;

    const tempoAtual = timeElapsed
    // @ts-ignore
    const interacoes = interactionsMap[task.cd_task] || [];
    const ordemInteracao = interacoes.length + 1;
    // @ts-ignore
    const tempoTotalInteracoes = interacoes.reduce((acc, cur) => acc + cur.tm_elapsed, 0);
    const tempoDiferenca = tempoAtual - tempoTotalInteracoes;

    await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks-interactions/${task.cd_task}/interactions`, {
      cd_task: task.cd_task,
      ds_interaction: newInteractionDesc,
      tm_elapsed: tempoDiferenca,
      vl_order: ordemInteracao,
    });

    setNewInteractionDesc('');
    setShowInteractionForm(false);
    toggleTaskInteractions(task)
    fetchTasks();
  };


  // Busca pelos clientes cadastrados
  const fetchClients = async () => {
    const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/clients`);
    setClients(res.data);
  };


  // Função para criar um novo cliente
  const handleAddClient = async () => {
    const res = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/clients`, {
      nm_client: newClientName,
    });
    setClients((prevClients) => [...prevClients, res.data]);
    setNewClientName('');
    setSelectedClient(res.data.cd_client);
  };

  //formata a data para padrao dd/mm/aaaa
  const formattaskDate = (taskDate: string) => {
    const date = new Date(taskDate);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks();
    }, 1000);

    return () => clearInterval(interval);
  }, []);



  // Função para baixar o Arquivo .txt contendo as informações da task
  function download(filename: string, text: string) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }


  // Carrega todas as informações da tarefa que serão adicionadas ao arquivo .txt
  async function textToExport(taskCode: string) {
    const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks/${taskCode}`);
  // @ts-ignore 
    const resInteractions = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks-interactions?cd_task=${res.data.cd_task}`);

    const resClient = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/clients/${res.data.cd_client}`);

    const elapsedTime =  formatTime(res.data.elapsed_ms);
    const goalTime =  formatTime(res.data.goal_ms);

    let situationValue = "Indefinido"

    if (res.data.tp_situation == "P")
      situationValue = "Pendente";
    else if (res.data.tp_situation == "F")
      situationValue = "Finalizado";
    // @ts-ignore
    const interacoes = interactionsMap[res.data.cd_task]
    // @ts-ignore
      ?.map((i, idx) => `  ${idx + 1}. ${formatTime(i.tm_elapsed)}: ${i.ds_interaction}`)
      .join('\n') || '  (sem interações registradas)';


    const textoParaExportar = `
Tarefa: ${res.data.nm_title}
Tempo Realizado: ${elapsedTime}
Tempo Maximo: ${goalTime}
Cliente: ${resClient.data.nm_client}
Situação: ${situationValue}

Descrição: ${res.data.ds_task || '(sem descrição)'}

---------- Interações ----------

${interacoes || 'Sem Interações'} 
`;

  download(`${res.data.nm_title} - ${resClient.data.nm_client}.txt`,  textoParaExportar);
  }

  // Busca pelas tarefas, clientes e tarefas registradas
  useEffect(() => {
    fetchTasks();
    fetchClients();
    fetchRegisteredTasks();

  }, []);


  //Busca as tarefas registradas como pendente
  const fetchRegisteredTasks = async () => {
    try {
      const { data: { ip } } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/system/my-ip`);
      const { data: { hostname } } = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/system/resolve-hostname`, { ip });

      const res = await axios.get(  `${import.meta.env.VITE_REACT_APP_API_URL}/tasks-register/pending?nm_micro=${hostname}`);
      setTasksRegistered(res.data);
    } catch (error) {
      console.error('Erro ao buscar tasks registradas:', error);
    }
  };

  //Recupera as tasks registradas como pendente
  const handleRecoverTask = async (cd_task: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks-register/${cd_task}/recover`);
      fetchRegisteredTasks();
      fetchTasks();
    } catch (error) {
      console.error('Erro ao recuperar task:', error);
    }
  };


  const toggleTaskDetailsRegister = (task: Task) => {
    if (openTaskDetail === task.cd_task) {
      setOpenTaskDetail(null);
    } else { //@ts-ignore
      setOpenTaskDetail(task.cd_task);//@ts-ignore
      setEditingTask(task);
      setSelectedClient(task.cd_client || '');
    }
  };

  //registra as Interações da tarefa registrada
  const toggleTaskInteractionsRegister = async (task: Task) => {
    const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks-interactions-register?cd_task=${task.cd_task}`);
    setInteractionsMap((prev) => ({
      ...prev,
      [task.cd_task]: res.data,
    }));
  };

  
// @ts-ignore
  return (// @ts-ignore
    // @ts-ignore
    <div className="w-full max-w-[1900px] mx-auto p-10 min-h-screen bg-white rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Cronometro</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          onClick={() => setShowModal(true)}
        >
          Criar Tarefa
        </button>
      </div>

      {showModal && <TaskFormModal onClose={() => { setShowModal(false); fetchTasks(); }} />}
      <table className="w-full text-sm text-center bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <thead className="bg-gray-100 text-gray-700 font-semibold">
        <tr>
          <th className="p-3">Título</th>
          <th className="p-3">Data</th>
          <th className="p-3">Progresso</th>
          <th className="p-3">Tempo</th>
          <th className="p-3">Tempo Máximo</th>
          <th className="p-3">Iniciar</th>
          <th className="p-3">Pausar</th>
          <th className="p-3">Info</th>
          <th className="p-3">Excluir</th>
          <th className="p-3">Registrar</th>
        </tr>
      </thead>
        <tbody>
          {tasks.map((task) => {
            const { percent } = getProgress(task);
            
            const color =
              // @ts-ignore
              task.tp_status === 'S' ? 'green' :
              // @ts-ignore
              task.tp_status === 'P' ? 'orange' :
              // @ts-ignore
              task.tp_status === 'F' ? 'red' : 'gray';

            return (
              // @ts-ignore
              <React.Fragment key={task.cd_task}>
                <tr>
                  <td>{
                    // @ts-ignore
                    task.nm_title
                  }
                  </td>
                  <td>{
                    //@ts-ignore
                    formattaskDate(task.createdAt)
                    }
                  </td>

                  <td>
                    <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full transition-all duration-300 rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
                    </div>
                  </td>
                  <td>{
                    // @ts-ignore
                    formatTime(task.elapsed_ms)}</td>
                  <td>{
                    // @ts-ignore
                    formatTime(task.goal_ms)}</td>
                  <td>
                    <button
                      onClick={() => startTask(task)}
                      disabled={//@ts-ignore
                        task.tp_status === 'S'}
                      className="bg-green-500 hover:bg-green-600 text-white rounded p-2 transition disabled:opacity-50"
                    >
                      <Play size={18} />
                      
                    </button>
                      {showConfirmModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
                          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative">
                            {/* Botão fechar */}
                            <button
                              onClick={() => setShowConfirmModal(false)}
                              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                              <div className="flex items-center justify-center bg-blue-100 rounded-full p-2">
                                <ClipboardPlus className="text-blue-600 w-6 h-6" />
                              </div>
                              <h2 className="text-2xl font-semibold text-gray-800">
                                Tarefas em andamento
                              </h2>
                            </div>

                            <p className="text-gray-700 mb-4">
                              As seguintes tarefas já estão iniciadas:
                            </p>

                            <ul className="mb-6 list-disc list-inside text-gray-700 space-y-1">
                              {tasksRunning.map((t) => (
                                <li key={t.cd_task}>
                                  <span className="font-medium text-gray-800">{t.nm_title}</span>
                                </li>
                              ))}
                            </ul>

                            <p className="text-gray-700 mb-6">
                              Deseja pausá-las para iniciar a tarefa <strong>{pendingStartTask?.nm_title}</strong>?
                            </p>

                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => handleConfirmStart(true)}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                              >
                                Sim, pausar
                              </button>
                              <button
                                onClick={() => handleConfirmStart(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                              >
                                Não, iniciar sem pausar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                  </td>

                  <td>
                    <button
                      onClick={() => pauseTask(task)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white rounded p-2 transition"
                    >
                      <Pause size={18} />
                    </button>
                  </td>

                  <td>
                    <button
                      onClick={() => { toggleTaskDetails(task); toggleTaskInteractions(task); }}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded p-2 transition"
                    >
                      <Info size={18} />
                    </button>
                  </td>

                  <td>
                    <button
                      onClick={//@ts-ignore
                        () => setTaskToDelete(task.cd_task)}
                      className="bg-red-500 hover:bg-red-600 text-white rounded p-2 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>

                  {taskToDelete && (
                      <DeleteTask
                        cd_task={taskToDelete}
                        onClose={() => {
                          setTaskToDelete(null);
                          fetchTasks();
                        }}
                      />
                    )}

                  <td>
                    <td>
                      <button
                        onClick={() => 
                          //@ts-ignore
                          setTaskToRegister(task.cd_task)} //@ts-ignore
                          disabled={task.tp_situation === 'I'} //@ts-ignore
                        className={`bg-indigo-500 hover:bg-indigo-600 text-white rounded p-2 transition ${task.tp_situation === 'I' ? 'opacity-50 cursor-not-allowed' : ''}`} //@ts-ignore
                        title={task.tp_situation === 'I' ? 'Não é possível registrar tarefas indefinidas.' : ''}
                      >
                        <Check size={18} />
                      </button>
                    </td>
                  </td> 
                  {taskToRegister && (
                      <RegisterTask
                        cd_task={taskToRegister}
                        onClose={() => {
                          setTaskToRegister(null);
                          fetchTasks();
                          fetchRegisteredTasks();
                        }}
                      />
                    )}
                    
                </tr>

                {/* Renderiza os detalhes da tarefa somente se a tarefa estiver aberta */}
                <AnimatePresence>
                  {//@ts-ignore
                  openTaskDetail === task.cd_task && (
                    <motion.tr
                      key={//@ts-ignore
                        `detail-${task.cd_task}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td colSpan={9} className="overflow-hidden"> 
                      <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                        <div className="flex gap-6 flex-wrap">
                          {/* Coluna 1: Edição */}
                          <div className="flex flex-col gap-4 w-full md:w-[40%]">
                            <label className="font-semibold text-sm text-gray-700">Título:</label>
                            <textarea
                              className="p-2 border rounded bg-gray-100"
                              value={//@ts-ignore
                                editingTask?.nm_title || task.nm_title}
                              onChange={e => setEditingTask({ ...editingTask, nm_title: e.target.value })}
                            />

                            <label className="font-semibold text-sm text-gray-700">Situação:</label>
                            <select
                              className="p-2 border rounded bg-gray-100"
                              value={//@ts-ignore
                                editingTask?.tp_situation || task.tp_situation}
                              onChange={e => setEditingTask({ ...editingTask, tp_situation: e.target.value })}
                            >
                              <option value="P">Pendente</option>
                              <option value="F">Finalizado</option>
                              <option value="I">Indefinido</option>
                            </select>

                            <label className="font-semibold text-sm text-gray-700">Cliente:</label>
                            <select
                              className="p-2 border rounded bg-gray-100"
                              value={selectedClient}
                              onChange={e => setSelectedClient(e.target.value)}
                            >
                              <option value="">Selecione um cliente</option>
                              {clients.map((client) => (
                                <option key={client.cd_client} value={client.cd_client}>{client.nm_client}</option>
                              ))}
                              <option value="new">Adicionar Novo Cliente</option>
                            </select>

                            {selectedClient === 'new' && (
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  placeholder="Nome do novo cliente"
                                  className="p-2 border rounded"
                                  value={newClientName}
                                  onChange={(e) => setNewClientName(e.target.value)}
                                />
                                <button onClick={handleAddClient} className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded">
                                  Adicionar Cliente
                                </button>
                              </div>
                            )}

                            <label className="font-semibold text-sm text-gray-700">Descrição:</label>
                            <textarea
                              className="p-2 border rounded bg-gray-100 min-h-[120px]"
                              value={//@ts-ignore
                                editingTask?.ds_task || task.ds_task}
                              onChange={e => setEditingTask({ ...editingTask, ds_task: e.target.value })}
                            />
                            
                            <div className="flex flex-wrap gap-3 mt-4">
                              <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">Salvar</button>
                              <button onClick={handleCancel} className="bg-gray-400 text-white px-3 py-2 rounded">Desfazer</button>
                              <button onClick={//@ts-ignore
                                () => textToExport(task.cd_task)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded">Exportar</button>
                              <button onClick={() => setShowEditTime(true)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded">Editar Tempo</button>
                               {showEditTime && (
                                <EditTime 
                                  onClose={() => { setShowEditTime(false); fetchTasks(); }} 
                                  // @ts-ignore
                                  cd_task={task.cd_task}  
                                />
                              )}
                            </div>
                          </div>

                          {/* Coluna 2: Interações */}
                          <div className="w-full md:w-[55%] bg-white border rounded-lg p-4 overflow-y-auto max-h-[400px]">
                            <div className="font-semibold border-b pb-2 mb-2 text-gray-800 flex justify-between">
                              <span>Tempo</span>
                              <span>Descrição</span>
                            </div>
                            {//@ts-ignore
                            interactionsMap[task.cd_task]?.map((interacao) => (
                              <div className="flex justify-between text-sm mb-2" key={interacao.cd_task_interaction}>
                                <span className="text-gray-700">{formatTime(interacao.tm_elapsed)}</span>
                                <span className="text-gray-600">{interacao.ds_interaction}</span>
                              </div>
                            ))}

                            {showInteractionForm ? (
                              <div className="mt-4 flex flex-col gap-2">
                                <textarea
                                  className="p-2 border rounded bg-gray-100"
                                  placeholder="Descrição da interação"
                                  value={newInteractionDesc}
                                  onChange={(e) => setNewInteractionDesc(e.target.value)}
                                />
                                <button
                                  onClick={() => handleAddInteraction(task)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                                >
                                  Salvar Interação
                                </button>
                              </div>
                            ) : (
                              <button
                                className="mt-3 text-sm text-blue-600 hover:underline"
                                onClick={() => setShowInteractionForm(true)}
                              >
                                + Nova Interação
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence> 
              </React.Fragment>
            );
          })}
          
        </tbody>   
      </table>

        {/* Tarefas Registradas Como Pendente */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tarefas Registradas Como Pendente
          </h2>

          <table className="w-full text-sm text-center bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-3">Título</th>
                <th className="p-3">Data</th>
                <th className="p-3">Progresso</th>
                <th className="p-3">Tempo</th>
                <th className="p-3">Tempo Máximo</th>
                <th className="p-3">Info</th>
                <th className="p-3">Recuperar</th>
              </tr>
            </thead>
            <tbody>
              {tasksRegistered.map((task) => {
                const { percent } = getProgress(task);
                return (
                  <React.Fragment key={task.cd_task}>
                    <tr>
                      <td>{task.nm_title}</td>
                      <td>{ //@ts-ignore
                        formattaskDate(task.createdAt)}</td>
                      <td>
                        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-300 rounded-full"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: 'blue',
                            }}
                          ></div>
                        </div>
                      </td>
                      <td>{//@ts-ignore
                        formatTime(task.elapsed_ms)}</td>
                      <td>{//@ts-ignore
                        formatTime(task.goal_ms)}</td>
                      <td>
                        <button
                          onClick={() => {
                            toggleTaskDetailsRegister(task);
                            toggleTaskInteractionsRegister(task);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded p-2 transition"
                        >
                          <Info size={18} />
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleRecoverTask(task.cd_task)}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded p-2 transition"
                        >
                          <Check size={18} />
                        </button>
                      </td>
                    </tr>

                    <AnimatePresence>
                      {openTaskDetail === task.cd_task && (
                        <motion.tr
                          key={`detail-${task.cd_task}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan={10} className="overflow-hidden">
                            <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                              <div className="flex gap-6 flex-wrap">
                                {/* Coluna 1: Detalhes básicos */}
                                <div className="flex flex-col gap-4 w-full md:w-[40%]">
                                  <label className="font-semibold text-sm text-gray-700">
                                    Título:
                                  </label>
                                  <textarea
                                    className="p-2 border rounded bg-gray-100"
                                    value={editingTask?.nm_title || task.nm_title}
                                    readOnly
                                  />

                                  <label className="font-semibold text-sm text-gray-700">
                                    Situação:
                                  </label>
                                  <input
                                    className="p-2 border rounded bg-gray-100"
                                    value={editingTask?.tp_situation || task.tp_situation}
                                    readOnly
                                  />

                                  <label className="font-semibold text-sm text-gray-700">
                                    Descrição:
                                  </label>
                                  <textarea
                                    className="p-2 border rounded bg-gray-100 min-h-[120px]"
                                    value={editingTask?.ds_task || task.ds_task}
                                    readOnly
                                  />
                                </div>

                                {/* Coluna 2: Interações */}
                                <div className="w-full md:w-[55%] bg-white border rounded-lg p-4 overflow-y-auto max-h-[400px]">
                                  <div className="font-semibold border-b pb-2 mb-2 text-gray-800 flex justify-between">
                                    <span>Tempo</span>
                                    <span>Descrição</span>
                                  </div> 
                                  {//@ts-ignore
                                    interactionsMap[task.cd_task]?.map((interacao) => (
                                    <div
                                      className="flex justify-between text-sm mb-2"
                                      key={interacao.cd_register}
                                    >
                                      <span className="text-gray-700">
                                        {formatTime(interacao.tm_elapsed)}
                                      </span>
                                      <span className="text-gray-600">
                                        {interacao.ds_interaction}
                                      </span>
                                    </div>
                                  ))}

                                  {//@ts-ignore
                                    interactionsMap[task.cd_task]?.length === 0 && (
                                    <p className="text-gray-500 text-sm">
                                      Nenhuma interação registrada.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>


      <br></br>

      <table>
        <div className='InfoHover_byClient'>
          
        </div>
      </table>
    </div>

    
  );
}
