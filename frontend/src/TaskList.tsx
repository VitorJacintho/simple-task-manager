import { useEffect, useState } from 'react';
import axios from 'axios';
import TaskFormModal from './TaskFormModal.tsx';
import './TaskList.css'; // 👈 arquivo CSS tradicional
import React from 'react';
import EditTask from './EditTime.tsx';
import EditTime from './EditTime.tsx';

interface Task {
  cd_task: string;
  nm_title: string;
  ds_task?: string;
  cd_user: string;
  goal_ms?: number;
  elapsed_ms?: number;
  tp_status: string;
  tp_situation?: string
};


export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditTime, setShowEditTime] = useState(false);
  const [taskTimers, setTaskTimers] = useState<{ [cd_task: string]: { startedAt: number, localElapsed: number } }>({});
  const [editingTask, setEditingTask] = useState<{ [key: string]: string } | null>(null);

  // -- detalhes
  const [openTaskDetail, setOpenTaskDetail] = useState(null); // Guarda o código da tarefa aberta

  const [interactionsMap, setInteractionsMap] = useState({});
  const [newInteractionDesc, setNewInteractionDesc] = useState('');
  const [showInteractionForm, setShowInteractionForm] = useState(false);

    const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  


  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  

  // Retorna a Task e suas Informaões
  const fetchTasks = async () => {
    const res = await axios.get('http://192.168.0.158:3000/tasks');
    setTasks(res.data);
  };



  // define o formato do tempo, de milissegundo para minuto
const formatTime = (ms: number) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
  const min = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
  const sec = String(totalSec % 60).padStart(2, '0');
  return `${hrs}:${min}:${sec}`;
};

  // Inicia a Task
const startTask = async (task: Task) => {
  if (task.tp_status === 'S') return;

  const now = Date.now();

  setTaskTimers(prev => ({
    ...prev,
    [task.cd_task]: {
      startedAt: now,
      localElapsed: task.elapsed_ms || 0
    }
  }));

  await axios.patch(`http://192.168.0.158:3000/tasks/${task.cd_task}`, {
    tp_status: 'S'
  });

  fetchTasks(); // ou não, se quiser evitar sobrescrita
};





  // Pausa a Task
const pauseTask = async (task: Task) => {
  const timer = taskTimers[task.cd_task];
  if (!timer) return;

  const now = Date.now();
  const totalElapsed = timer.localElapsed + (now - timer.startedAt);

  await axios.patch(`http://192.168.0.158:3000/tasks/${task.cd_task}`, {
    tp_status: 'P',
    elapsed_ms: totalElapsed
  });

  setTaskTimers(prev => {
    const copy = { ...prev };
    delete copy[task.cd_task];
    return copy;
  });

  fetchTasks(); // ou apenas atualizar estado manualmente
};


  // Calcula a barra de Progresso
  // @ts-ignore
const getProgress = (task) => {
  const now = Date.now();
  const timer = taskTimers[task.cd_task];

  const localElapsed = timer ? timer.localElapsed : task.elapsed_ms || 0;
  const running = timer ? now - timer.startedAt : 0;
  const total = localElapsed + running;

  const percent = task.goal_ms
    ? Math.min((total / task.goal_ms) * 100, 100)
    : 0;

  return {
    percent,
    elapsed: formatTime(total),
    goalTime: task.goal_ms ? formatTime(task.goal_ms) : 'Indefinido'
  };
};



  // Deleta a Task
  const deleteTask = async (id: string) => {
    await axios.delete(`http://192.168.0.158:3000/tasks/${id}`);
    fetchTasks();
  };





  // --- Detail ---

  // Abre os detalhes da Task
  // @ts-ignore
  const toggleTaskDetails = (task) => {
    // Se a Task clicada for a mesma que já está aberta, feche-a
    if (openTaskDetail === task.cd_task) {
      setOpenTaskDetail(null); // Fecha os detalhes da Task
    } else {
      setOpenTaskDetail(task.cd_task); // Abre os detalhes da nova Task e fecha a anterior
    }

    // Quando a Task for selecionada, defina `editingTask` com a Task correta
    if (openTaskDetail !== task.cd_task) {
      setEditingTask(task);  // Define a Task como edição
    }
  };

  // @ts-ignore
  const toggleTaskInteractions = async (task) => {

      const res = await axios.get(`http://192.168.0.158:3000/tasks-interactions?cd_task=${task.cd_task}`);
      setInteractionsMap(prev => ({ ...prev, [task.cd_task]: res.data }));
  
  };

  // Salva os detalhes da Task
  const handleSave = async () => {
    if (!editingTask) return; // Evita salvar se não houver uma Task sendo editada

    const { cd_task, nm_title, tp_situation, ds_task } = editingTask;

    try {
      await axios.patch(`http://192.168.0.158:3000/tasks/${cd_task}`, {nm_title, tp_situation, ds_task });
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


const handleEditTime = () => {

}


  // @ts-ignore
  const handleAddInteraction = async (task) => {
    const res = await axios.get(`http://192.168.0.158:3000/tasks/${task.cd_task}`);
    const timeElapsed = res.data.elapsed_ms;

    const tempoAtual = timeElapsed
    // @ts-ignore
    const interacoes = interactionsMap[task.cd_task] || [];
    const ordemInteracao = interacoes.length + 1;
    // @ts-ignore
    const tempoTotalInteracoes = interacoes.reduce((acc, cur) => acc + cur.tm_elapsed, 0);
    const tempoDiferenca = tempoAtual - tempoTotalInteracoes;
    

    //if (tempoDiferenca <= 0 || newInteractionDesc.trim() === '') return;

    await axios.post(`http://192.168.0.158:3000/tasks-interactions/${task.cd_task}/interactions`, {
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




  
useEffect(() => {
  const interval = setInterval(() => {
    // @ts-ignore
    setTasks(prevTasks =>
      prevTasks.map(task => {
        // @ts-ignore
        const timer = taskTimers[task.cd_task];
        if (!timer) return task;

        const now = Date.now();
        const totalElapsed = timer.localElapsed + (now - timer.startedAt);

        // Atualiza no back-end
        // @ts-ignore
        axios.patch(`http://192.168.0.158:3000/tasks/${task.cd_task}`, {
          elapsed_ms: totalElapsed
        });

        // Atualiza o front-end
        return {
          // @ts-ignore
          ...task,
          elapsed_ms: totalElapsed
        };
      })
    );
  }, 1000);

  return () => clearInterval(interval);
}, [taskTimers]);




  // Pausar tarefas ao fechar ou recarregar a página
  useEffect(() => {
    const handleBeforeUnload = () => {
      tasks.forEach(async (task) => {
        // @ts-ignore
        if (task.tp_status === 'S') { 
          pauseTask(task)
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [tasks]);

  useEffect(() => {
  fetchTasks();
}, []);

  
// @ts-ignore
  return (// @ts-ignore
    // @ts-ignore
    <div className="page-wrapper">
      <div className="title-wrapper">
        <img src="src/assets/GembaMill.png" alt="Logo" className="title-logo" />
        <h1 className="title-text">Gemba Task Manager</h1>
      </div>
      <button className="btn btn-create" onClick={() => setShowModal(true)}>Criar Tarefa</button>
      {showModal && <TaskFormModal onClose={() => { setShowModal(false); fetchTasks(); }} />}
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Progresso</th>
            <th>Tempo</th>
            <th>Tempo Máximo</th>
            <th>Iniciar</th>
            <th>Pausar</th>
            <th>Info</th>
            <th>Excluir</th>
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
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${percent}%`, backgroundColor: color }}></div>
                    </div>
                  </td>
                  <td>{
                    // @ts-ignore
                    formatTime(task.elapsed_ms)}</td>
                  <td>{
                    // @ts-ignore
                    formatTime(task.goal_ms)}</td>
                  <td><button className="btn btn-start" onClick={() => startTask(task)} disabled={
                    // @ts-ignore
                    task.tp_status === 'S'}>▶</button></td>
                  <td><button className="btn btn-pause" onClick={() => pauseTask(task)}>❚❚</button></td>
                  <td><button className="btn btn-info" onClick={() => {toggleTaskDetails(task); toggleTaskInteractions(task);}}>ℹ</button></td>
                  <td><button className="btn btn-delete" onClick={
                    // @ts-ignore
                    () => deleteTask(task.cd_task)}>🗑</button></td>
                </tr>

                {/* Renderiza os detalhes da tarefa somente se a tarefa estiver aberta */}
                {
                  // @ts-ignore
                openTaskDetail === task.cd_task && (
                  <tr>
                    <td colSpan={8}> {/* Usando colSpan para que a div ocupe toda a largura da tabela */}
                      <div className="task-info">
                          <div className="task-detail-wrapper"> {/* NOVO WRAPPER FLEX */}

                          <div className="info-box">
                            <label htmlFor="title">Titulo:</label>
                            <textarea
                              id="title"
                              className="task-title-box"
                              // @ts-ignore
                              value={editingTask?.nm_title || task.nm_title}
                              onChange={e => setEditingTask({ ...editingTask, nm_title: e.target.value })}
                            ></textarea>


                            <label htmlFor="status">Situação:</label>
                            <select
                              id="status"
                              className="task-situation-combo"
                              // @ts-ignore
                              value={editingTask?.tp_situation || task.tp_situation}
                              onChange={e => setEditingTask({ ...editingTask, tp_situation: e.target.value })}
                            >
                              <option value="P">Pendente</option>
                              <option value="F">Finalizado</option>
                              <option value="I">Indefinido</option>
                            </select>

                            <label htmlFor="description">Descrição:</label>
                            <textarea
                              id="description"
                              className="task-description-box"
                              // @ts-ignore
                              value={editingTask?.ds_task || task.ds_task}
                              onChange={e => setEditingTask({ ...editingTask, ds_task: e.target.value })}
                            ></textarea>

                            <div className="action-buttons">
                              <button className="task-detail-save-button" onClick={handleSave}>Salvar</button>
                              <button className="task-detail-undo-button" onClick={handleCancel}>Desfazer</button>
                              <button className="task-export-button" >Exportar</button>

                              <button className="task-edit-time-button" onClick={() => setShowEditTime(true)}>Editar Tempo Descorrido</button>
                              {showEditTime && (
                                <EditTime 
                                  onClose={() => { setShowEditTime(false); fetchTasks(); }} 
                                  cd_task={task.cd_task}  // Passando cd_task para o modal
                                />
                              )}

                            </div>
                          </div>

                          <div className="interaction-info">
                            <div className="cabecalho-interacoes">
                              <span>Tempo</span>
                              <span>Descrição</span>
                            </div>
                            
                            {
                              // @ts-ignore
                            interactionsMap[task.cd_task]?.map((interacao) => (
                              <div className="linha-interacao" key={interacao.cd_task_interaction}>
                                <span>{formatTime(interacao.tm_elapsed)}</span>
                                <span>{interacao.ds_interaction}</span>
                              </div>
                            ))}

                            {showInteractionForm ? (
                              <div className="nova-interacao">
                                <textarea
                                  className="task-interaction-description-box"
                                  placeholder="Descrição da interação"
                                  value={newInteractionDesc}
                                  onChange={(e) => setNewInteractionDesc(e.target.value)}
                                />
                                <button className="task-interaction-button-save" onClick={() => handleAddInteraction(task)}>Salvar</button>
                              </div>
                            ) : (
                              <button className="botao-mais" onClick={() => setShowInteractionForm(true)}><img src="src/assets/TaskManager/new-task-interaction-icon.png" alt="Logo" className="title-logo" /></button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {/* <div className="buttons">
        <button className="btn" onClick={handleSignUpClick}>Criar Conta TESTE</button>
        <button className="btn" onClick={handleLoginClick}>Login TESTE</button>
      </div> */}
    </div>
  );
}
