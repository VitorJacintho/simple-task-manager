import './Home.css'
import dayjs from 'dayjs';

import {
  Users,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from 'axios';
import ReactECharts from 'echarts-for-react';


export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataMicro, setDataMicro] = useState([]);
  const [tasksByClient, setTasksByClient] = useState({});//@ts-ignore
  const [tasksByMicro, setTasksByMicro] = useState({});
  const [microStats, setMicroStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMicro, setFilterMicro] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [usersMicro, setUsersMicro] = useState([]);
  const [loadingUsersMicro, setLoadingUsersMicro] = useState(true);
  const [selectedClientName, setSelectedClientName] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM')); 
  const [microStopTimes, setMicroStopTimes] = useState({});
  const chartClientesRef = useRef<ReactECharts>(null);
  const chartMicroRef = useRef<ReactECharts>(null);
  const [legendClientesSelected, setLegendClientesSelected] = useState({});
  const [legendMicroSelected, setLegendMicroSelected] = useState({});


  //@ts-ignore
  // Converte o Código do cliente para o nome do cliente
  async function fetchClientName(cd_client) {
    if (!cd_client) {
      return "Sem cliente";
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/clients/${cd_client}`
      );
      return res.data.nm_client || "Sem cliente";
    } catch (e) {
      console.error(e);
      return "Sem cliente";
    }
  }

  //Busca todos os usuarios e Micros cadastrados 
  async function fetchUsersMicro() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/users-micro`);
      setUsersMicro(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsersMicro(false);
    }
  }


  //Busca as tarefas registradas
  async function fetchTasks() {
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks-register`);
      const json = await res.json();

      const startOfMonth = dayjs(selectedMonth + "-01").startOf('month');

      //@ts-ignore
      const filtered = json.filter((task) => {
        const dt = dayjs(task.createdAt || task.created_at);
        return dt.isSame(startOfMonth, 'month');
      });

      const group = {};
      //@ts-ignore
      filtered.forEach((task) => {
        const client = task.cd_client ? String(task.cd_client) : "Sem cliente";
        //@ts-ignore
        if (!group[client]) {
          //@ts-ignore
          group[client] = {
            client,
            totalElapsed: 0,
            tasks: []
          };
        }//@ts-ignore
        group[client].totalElapsed += task.elapsed_ms;//@ts-ignore
        group[client].tasks.push(task);
      });

      const groupValues = Object.values(group);

      const names = await Promise.all(//@ts-ignore
        groupValues.map((item) => fetchClientName(item.client))
      );

      const chartData = groupValues.map((item, idx) => ({
        name: names[idx],//@ts-ignore
        clientId: item.client,//@ts-ignore
        value: +(item.totalElapsed / (1000 * 60 * 60)).toFixed(2) // Horas
      }));
      //@ts-ignore
      setData(chartData);
      setTasksByClient(group);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }


  //Busca as tarefas registradas por micro
  async function fetchTasksByMicro() {
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/tasks-register`);
      const json = await res.json();

      const startOfMonth = dayjs(selectedMonth + "-01").startOf('month');

      //@ts-ignore
      const filtered = json.filter((task) => {
        const dt = dayjs(task.createdAt || task.created_at);
        return dt.isSame(startOfMonth, 'month');
      });

      const group = {};//@ts-ignore
      filtered.forEach((task) => {
        const micro = task.nm_micro ? String(task.nm_micro) : "Sem Micro";//@ts-ignore
        if (!group[micro]) {//@ts-ignore
          group[micro] = {
            micro,
            totalElapsed: 0,
            tasks: []
          };
        }                                                           //@ts-ignore
        group[micro].totalElapsed += task.elapsed_ms;               //@ts-ignore
        group[micro].tasks.push(task);
      });

      const groupValues = Object.values(group);

      const names = await Promise.all(                              //@ts-ignore
        groupValues.map((item) => item.micro)
      );

      const chartData = groupValues.map((item, idx) => ({
        name: names[idx],                                           //@ts-ignore
        microId: item.micro,                                        //@ts-ignore
        value: +(item.totalElapsed / (1000 * 60 * 60)).toFixed(2) // horas
      }));

      const microStats = {};
      groupValues.forEach((item) => {                               //@ts-ignore
        microStats[item.micro] = {                                  //@ts-ignore
          totalElapsed: item.totalElapsed,                          //@ts-ignore
          taskCount: item.tasks.length
        };
      });
      setMicroStats(microStats);                                    //@ts-ignore
                                                                    
      setDataMicro(chartData);
      setTasksByMicro(group);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Busca o tempo de parada por micro (Requisção é feita atravez do andon)
  async function fetchMicroStops() {
    try {
      
      const res = await axios.get("http://michegan:3031/andon/History");
      return res.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }


  //@ts-ignore
  // Carrega o tempo de parada dos micros
  async function loadMicroStopTimes(selectedMonth) {
    const stops = await fetchMicroStops();

    const monthStart = dayjs(selectedMonth + "-01").startOf("month");

    const grouped = {};
    //@ts-ignore
    stops.forEach((item) => {
      const dt = dayjs(item.stop_time);
      if (dt.isSame(monthStart, "month")) {
        const micro = item.micro_name?.toUpperCase();
        const durationMs = parseRunningTime(item.running_time);
                                        //@ts-ignore
        if (!grouped[micro]) {          //@ts-ignore
          grouped[micro] = 0;
        }                               //@ts-ignore
        grouped[micro] += durationMs;
      }
    });

    return grouped;
  }


  //@ts-ignore
  // Converte o tempo enviado pelo Andon para milisegundos
  function parseRunningTime(str) {
    if (!str) return 0;

    const regex = /(\d+)\s*(s|m|h)/i;
    const match = str.match(regex);
    if (!match) return 0;

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    switch (unit) {
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      default:
        return 0;
    }
  }

  // Filtros para a tabela de Micros e Usuarios
  const filteredUsersMicro = usersMicro
  .filter((item) => {                                                    //@ts-ignore
    // Filtro Micro 
    if (filterMicro && item.nm_micro !== filterMicro) return false;      //@ts-ignore

    // Filtro Usuário
    if (filterUser && item.nm_user !== filterUser) return false;

    return true;
  })
  .filter((item) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    return (                                                                                    //@ts-ignore
      item.nm_micro?.toLowerCase().includes(term) ||                                            //@ts-ignore
      item.nm_user?.toLowerCase().includes(term) ||                                             //@ts-ignore
      (microStats[item.nm_micro]?.taskCount?.toString() || "").includes(term) ||                //@ts-ignore
      (microStats[item.nm_micro]                                                                //@ts-ignore
        ? (microStats[item.nm_micro].totalElapsed / 1000 / 60).toFixed(2)
        : ""
      ).includes(term)
    );                                                                                          //@ts-ignore
  }).sort((a, b) => a.nm_micro.localeCompare(b.nm_micro));;


  // Diminui o Mes
  const handlePrevMonth = () => {
    setSelectedMonth((prev) =>
      dayjs(prev + "-01").subtract(1, "month").format("YYYY-MM")
    );
  };

  // Aumenta o Mes
  const handleNextMonth = () => {
    setSelectedMonth((prev) =>
      dayjs(prev + "-01").add(1, "month").format("YYYY-MM")
    );
  };

  //@ts-ignore
  // Clique para os detalhes do grafico
  const handleClick = async (params) => {
    const clientId = params.clientId;
    setSelectedClient(clientId);
    const name = await fetchClientName(clientId);
    setSelectedClientName(name);
  };

  useEffect(() => {
    fetchTasks();
    fetchTasksByMicro();
    loadMicroStopTimes(selectedMonth).then(setMicroStopTimes);
  }, [selectedMonth]);


  useEffect(() => {
    fetchUsersMicro();
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchTasksByMicro();
    loadMicroStopTimes(selectedMonth).then(setMicroStopTimes);

  }, [selectedMonth]);


const optionClientes = useMemo(() => ({
  color: [
  '#FF6B6B',
  '#FFD93D',
  '#6BCB77',
  '#4D96FF',
  '#FF9F1C',
  '#C74B50',
  '#FF5D8F',
  '#845EC2',
  '#FF9671',
  '#2C73D2'
],
  title: {
    left: 'center',
    top: 100,
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'item',
    //@ts-ignore
    formatter: (params) => {
      if (params.percent < 3) return '';
      return `${params.name}\n${params.percent.toFixed(2)}%\n(${params.value} h)`;
    }
  },
  legend: {
    type: 'scroll',
    orient: 'horizontal',
    bottom: 0,
    left: 'center',
    selected: legendClientesSelected

  },
  series: [
    {
      name: 'Tempo (h)',
      type: 'pie',
      radius: ['30%', '70%'],
      avoidLabelOverlap: true,
      minAngle: 5,
      labelLayout: {
        hideOverlap: false
      },
      label: {
        show: true,
        //@ts-ignore
        formatter: (params) => {
          if (params.percent < 3) return '';
          return `${params.name}\n${params.percent.toFixed(2)}%\n(${params.value} h)`;
        },
        fontSize: 12,
        color: '#333'
      },
      labelLine: {
        show: true
      },
      data: data.map((item) => ({//@ts-ignore
        value: item.value,//@ts-ignore
        name: item.name,//@ts-ignore
        clientId: item.clientId
      })),
      emphasis: {
        scale: true,
        itemStyle: {
          shadowBlur: 20,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ],
  animation: true,
  animationDuration: 1500,
  animationEasing: 'cubicOut'

}), [data, legendClientesSelected]);

const optionMicro = useMemo(() => ({
  color: [
  '#2C73D2',
  '#FF9F1C',
  '#845EC2',
  '#6BCB77',
  '#FF6B6B',
  '#FFD93D',
  '#4D96FF',
  '#C74B50',
  '#FF5D8F',
  '#FF9671',
],
  title: {
    left: 'center',
    top: 30,
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'item',
    //@ts-ignore
    formatter: (params) => {
      if (params.percent < 3) return '';
      return `${params.name}\n${params.percent.toFixed(2)}%\n(${params.value} h)`;
    }
  },
  legend: {
    type: 'scroll',
    orient: 'horizontal',
    bottom: 0,
    left: 'center',
    selected: legendMicroSelected

  },
  series: [
    {
      name: 'Tempo (h)',
      type: 'pie',
      radius: ['30%', '70%'],
      avoidLabelOverlap: true,
      labelLayout: {
        hideOverlap: true
      },
      label: {
        show: true,//@ts-ignore
        formatter: (params) => {
          if (params.percent < 3) return '';
          return `${params.name}\n${params.percent.toFixed(2)}%\n(${params.value} h)`;
        },
        fontSize: 12,
        color: '#333'
      },
      labelLine: {
        show: true
      },
      data: dataMicro.map((item) => ({//@ts-ignore
        value: item.value,//@ts-ignore
        name: item.name,//@ts-ignore
        microId: item.microId
      })),
      emphasis: {
        scale: true,
        itemStyle: {
          shadowBlur: 20,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ],
  animation: true,
  animationDuration: 1500,
  animationEasing: 'cubicOut'
}), [data, legendClientesSelected]);




  return (
    <div className="w-full max-w-[1900px] mx-auto p-10 min-h-screen bg-white rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Bem vindo ao Gemba System Manager!
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-3 py-2 rounded"
          >
            ←
          </button>
          <span className="text-gray-800 text-lg font-semibold w-40 text-center">
            {dayjs(selectedMonth + "-01").format("MMMM, YYYY")}
          </span>
          <button
            onClick={handleNextMonth}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-3 py-2 rounded"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Painel 1 - Atividades por cliente*/}
        <div className="border border-gray-300 rounded-lg p-4 flex flex-col h-[400px] bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-md text-gray-700 font-bold">
              Atividades registradas por cliente
            </span>
          </div>

          {loading && <p>Carregando...</p>}

          {!loading && data.length === 0 && (
            <p className="text-gray-600 text-center mt-10">Sem dados.</p>
          )}

          {!loading && data.length > 0 && (
            <div className="w-full h-full">
              <ReactECharts
                ref={chartClientesRef}
                option={optionClientes}
                style={{ height: '100%', width: '100%' }}
                onEvents={{ //@ts-ignore
                  legendselectchanged: (params) => {
                    setLegendClientesSelected(params.selected);
                  },//@ts-ignore
                  click: (params) => {
                    handleClick({
                      clientId: params.data.clientId,
                      name: params.data.name
                    });
                  }
                }}
              />
            </div>

          )}
        </div>

        {/* Painel 2 - atividades por micro */}
        <div className="border border-gray-300 rounded-lg p-4 flex flex-col h-[400px] bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-md text-gray-700 font-bold">
              Atividades registradas por Micro
            </span>

          </div>

          {loading && <p>Carregando...</p>}

          {!loading && dataMicro.length === 0 && (
            <p className="text-gray-600 text-center mt-10">Sem dados.</p>
          )}

          {!loading && dataMicro.length > 0 && (
            <div className="w-full h-full">
              <ReactECharts
                ref={chartMicroRef}
                option={optionMicro}
                style={{ height: '100%', width: '100%' }}
                  onEvents={{//@ts-ignore
                    legendselectchanged: (params) => {
                      setLegendMicroSelected(params.selected);
                    },//@ts-ignore
                    click: (params) => {
                      handleClick({
                        clientId: params.data.microId,
                        name: params.data.name
                      });
                    }
                  }}
              />

            </div>
          )}
        </div>
          
        </div>
        {/* Lista de tarefas do cliente selecionado */}
        {selectedClient && (
          <div className="mt-8 bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-600 flex items-center gap-2 border-b border-gray-500 pb-2 mb-4">
              Atividades do cliente: {selectedClientName || selectedClient}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4 uppercase text-xs font-bold text-gray-600 tracking-wider">Título</th>
                    <th className="text-left py-3 px-4 uppercase text-xs font-bold text-gray-600 tracking-wider">Situação</th>
                    <th className="text-left py-3 px-4 uppercase text-xs font-bold text-gray-600 tracking-wider">Tempo</th>
                    <th className="text-left py-3 px-4 uppercase text-xs font-bold text-gray-600 tracking-wider">Micro</th>
                  </tr>
                </thead>
                <tbody>
                  {//@ts-ignore
                  tasksByClient[selectedClient]?.tasks
                    //@ts-ignore
                    .map((task) => (
                    <tr
                      key={task.cd_register}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-2 px-4">{task.nm_title}</td>
                      <td className="py-2 px-4">
                        {task.tp_situation === 'F'
                          ? 'Finalizado'
                          : task.tp_situation === 'P'
                            ? 'Pendente'
                            : task.tp_situation === 'I'
                              ? 'Indefinido'
                              : task.tp_situation}
                      </td>
                      <td className="py-2 px-4">
                        {(task.elapsed_ms / (1000 * 60 * 60)).toFixed(2)} h
                      </td>
                      <td className="py-2 px-4">{task.nm_micro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
              onClick={() => setSelectedClient(null)}
            >
              Fechar
            </button>
          </div>
        )}
       <br></br>
        {/* Painel 3 - Lista de micros */}
        <div className="border border-gray-300 rounded-lg p-4 flex flex-col h-[400px] bg-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">
                <Users className="w-5 h-5 text-black" />
              </span>
              <span className="text-md text-gray-700 font-bold">
                Micro e Usuários
              </span>
            </div>
          </div>

          {loadingUsersMicro && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Carregando dados...</p>
            </div>
          )}

          {!loadingUsersMicro && usersMicro.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Nenhum dado encontrado.</p>
            </div>
          )}

          {!loadingUsersMicro && usersMicro.length > 0 && dataMicro.length > 0 && (
            <div className="flex-1 overflow-y-auto max-h-[300px] rounded border border-gray-200">

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none"
                />

                <select
                  value={filterMicro}
                  onChange={(e) => setFilterMicro(e.target.value)}
                  className="px-2 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Micro</option>
                  {//@ts-ignore
                    [...new Set(usersMicro.map((u) => u.nm_micro))].sort((a, b) =>
                      a.localeCompare(b)
                  ).map((micro) => (
                    <option key={micro} value={micro}>
                      {micro}
                    </option>
                  ))}
                </select>

                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="px-2 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Usuário</option>
                  {//@ts-ignore
                    [...new Set(usersMicro.map((u) => u.nm_user))].sort((a, b) =>
                      a.localeCompare(b)
                  ).map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterMicro("");
                    setFilterUser("");
                  }}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                >
                  Limpar
                </button>
              </div>

              <table className="min-w-full text-sm text-gray-800">
                <thead className="sticky top-0 bg-gray-100 shadow text-gray-600">
                  <tr>
                    <th className="text-left py-2 px-4 border-b border-gray-300 font-semibold">
                      Nome Micro
                    </th>
                    <th className="text-left py-2 px-4 border-b border-gray-300 font-semibold">
                      Nome Usuário
                    </th>
                    <th className="text-left py-2 px-4 border-b border-gray-300 font-semibold">
                      Atividades Registradas
                    </th>
                    <th className="text-left py-2 px-4 border-b border-gray-300 font-semibold">
                      Tempo de Atividade
                    </th>
                    <th className="text-left py-2 px-4 border-b border-gray-300 font-semibold">
                      Tempo Parado
                    </th>
                  </tr>
                </thead>
                  <tbody>
                    {filteredUsersMicro.map((item, index) => (
                      <tr
                        //@ts-ignore
                        key={item.id || `${item.nm_micro}-${item.nm_user}-${index}`}
                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-100 hover:bg-gray-100`}
                      >
                        <td className="py-2 px-4 font-medium text-gray-700">
                          {//@ts-ignore
                          item.nm_micro}
                        </td>
                        <td className="py-2 px-4 text-gray-700">
                          {//@ts-ignore
                          item.nm_user}
                        </td>
                        <td className="py-2 px-4 text-gray-700 text-right">
                          {//@ts-ignore
                          microStats[item.nm_micro]?.taskCount || 0}
                        </td>
                        <td className="py-2 px-4 text-gray-700 text-right">
                          {//@ts-ignore
                          microStats[item.nm_micro]
                            ? `${//@ts-ignore
                              (microStats[item.nm_micro].totalElapsed / (1000 * 60 * 60)).toFixed(2)} h`
                            : '0.00 Min'}
                        </td>
                          <td className="py-2 px-4 text-gray-700 text-right">
                            {//@ts-ignore
                            microStopTimes[item.nm_micro] //@ts-ignore
                              ? `${(microStopTimes[item.nm_micro] / (1000 * 60 * 60)).toFixed(2)} h`
                              : "0.00 Min"}
                          </td>
                      </tr>
                    ))}
                  </tbody> 
              </table>
            </div>
          )}


      </div>
    </div>
  );

}
