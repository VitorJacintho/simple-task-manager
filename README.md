# Simple Task Manager

**Equipe:** Ísis Enya e Vitor Cittadin  

##  Tema / Problema

**Gerenciador de Tarefas Simplificado para Controle de Horas e Atividades**

Muitas empresas de tecnologia enfrentam dificuldades no controle preciso de horas trabalhadas em cada tarefa ou projeto. Ferramentas como **Artia**, **Jira**, **ClickUp** e **Runrun.it** são frequentemente complexas, caras e robustas demais para pequenas equipes ou para quem busca uma solução mais enxuta.

**Nosso objetivo:** desenvolver uma versão **simples, leve e objetiva** de um gerenciador de tarefas com:

- Controle de tempo em tempo real por tarefa
- Acompanhamento de status
- Registro de interações

---

##  Tecnologias Utilizadas

- **Node.js (NestJS)**
- **React.js**
- **React Router**
- **Prisma ORM**
- **SQL Server**
- **Vitest**

---

##  Limitações do Projeto

A aplicação requer que o usuário tenha um **SQL Server (SSMS)** configurado e em execução localmente para conectar-se ao banco de dados.

---

##  Entidades do Sistema

### TASK

| Campo        | Tipo      | Descrição                                      |
| ------------ | --------- | ---------------------------------------------- |
| `cd_task`    | UUID      | Identificador único da tarefa                  |
| `nm_title`   | String    | Título da tarefa                               |
| `ds_task`    | String?   | Descrição opcional da tarefa                   |
| `tp_situation` | Char(1) | Situação: `'I'` (Indefinida), `'P'`, `'F'`     |
| `cd_user`    | String    | ID do usuário que criou a tarefa               |
| `elapsed_ms` | Int       | Tempo decorrido (em milissegundos)            |
| `goal_ms`    | Int?      | Meta de tempo para a tarefa                    |
| `tp_status`  | Char(1)   | Status: `'O'` (On), `'S'`, `'P'`, `'F'`        |
| `cd_client`  | String?   | Cliente associado (se houver)                  |
| `createdAt`  | DateTime  | Data de criação                                |

### TASK_INTERACTIONS

| Campo               | Tipo    | Descrição                           |
| -------------------| ------- | ----------------------------------- |
| `cd_task_interaction` | Int  | ID da interação (auto incremento)   |
| `cd_task`           | String  | ID da tarefa relacionada            |
| `ds_interaction`    | String? | Descrição da interação              |
| `tm_elapsed`        | Int     | Tempo acumulado até essa interação  |
| `vl_order`          | Int     | Ordem de exibição na linha do tempo |

### CLIENTS

| Campo       | Tipo   | Descrição                      |
| ----------- | ------ | ------------------------------ |
| `cd_client` | UUID   | Identificador único do cliente |
| `nm_client` | String | Nome do cliente                |

---

##  Como Executar o Projeto Localmente

1. Instale o **SQL Server Management Studio (SSMS)**, crie um usuário e um banco chamado `TaskManager`.

2. Clone o repositório:

- git clone (URL-do-repositório)

3. Acesse a pasta do projeto:
- cd simple-task-manager

4. Instale as dependências do backend e frontend:
- cd backend
- cd api
npm install

- cd frontend
- npm install

5. Configure o banco de dados no arquivo .env (exemplo de conexão com SQL Server):

- DATABASE_URL="sqlserver://usuario:senha@localhost:1433;database=TaskManager"
JWT_SECRET="hh74o23nd84n"


6. Execute as migrations com Prisma:

- cd backend
- cd api
- npx prisma migrate dev


7. Inicie o back-end:

- cd backend
- cd api
- npm run start:dev

8. Inicie o front-end:

- cd frontend
- npm run dev

---

## Outros conteúdos relevantes implementados no projeto:

- Timer de tarefas com controle de tempo decorrido
- Painel de edição de tarefas com combobox e descrição
- Edição do tempo decorrido.
- exportar dados da tarefa
