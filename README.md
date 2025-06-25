# simple-task-manager

Equipe: Ísis Enya e Vitor Cittadin

Gerenciador de Tarefas Simplificado para Controle de Horas e Atividades

Em muitas empresas de tecnologia, há uma dificuldade comum no controle preciso de horas trabalhadas em cada tarefa ou projeto. Embora existam ferramentas como Artia, Jira, ClickUp e Runrun.it, essas soluções muitas vezes são complexas, caras e excessivamente robustas para equipes menores ou com necessidades mais simples.

Nosso objetivo foi desenvolver uma versão simplificada e objetiva de um gerenciador de tarefas com foco no controle de tempo real por tarefa, acompanhamento de status, e interações registradas, proporcionando uma solução leve, personalizável e fácil de usar.

Tecnologias utilizadas:
Node.js (NestJS)
React.js
React Router
Prisma ORM
SQL Server
Vitest

Limitações do projeto:
A aplicação requer que o usuário possua um SQL Server (SSMS) em execução para conectar com o banco de dados.

#=====================================================================================================================

Descrição das entidades e suas propriedades:

TASK
| Campo         | Tipo     | Descrição                                      |
| ------------- | -------- | ---------------------------------------------- |
| cd_task       | UUID     | Identificador único da tarefa                  |
| nm_title      | String   | Título da tarefa                               |
| ds_task       | String?  | Descrição opcional da tarefa                   |
| tp_situation  | Char(1)  | Situação da tarefa: 'I' (Indefinida), 'P', 'F' |
| cd_user       | String   | ID do usuário que criou a tarefa               |
| elapsed_ms    | Int      | Tempo decorrido (em milissegundos)             |
| goal_ms       | Int?     | Meta de tempo para a tarefa                    |
| tp_status     | Char(1)  | Status da tarefa: 'O' (On), 'S', 'P', 'F'      |
| cd_client     | String?  | Cliente associado (se houver)                  |
| createdAt     | DateTime | Data de criação da tarefa                      |

Task_Interactions

| Campo                 | Tipo    | Descrição                           |
| --------------------- | ------- | ----------------------------------- |
| cd_task_interaction   | Int     | ID da interação (auto incremento)   |
| cd_task               | String  | ID da tarefa relacionada            |
| ds_interaction        | String? | Descrição da interação              |
| tm_elapsed            | Int     | Tempo acumulado até essa interação  |
| vl_order              | Int     | Ordem de exibição na linha do tempo |

Clients

| Campo      | Tipo   | Descrição                      |
| ---------- | ------ | ------------------------------ |
| cd_client  | UUID   | Identificador único do cliente |
| nm_client  | String | Nome do cliente                |

#=====================================================================================================================

Como executar o projeto localmente:
Instalar o SSMS, criar um usuario e um repositorio.


Clone o repositório
git clone <URL-do-repo>

Acesse a pasta do projeto
cd simple-task-manager

Instale as dependências do backend e frontend
cd backend
cd api
npm install

cd frontend
npm install


Configure o banco de dados no arquivo .env (exemplo de conexão com SQL Server):

DATABASE_URL="sqlserver://usuario:senha@localhost:1433;database=TaskManager"
JWT_SECRET="hh74o23nd84n"


Execute as migrations com Prisma

cd backend
cd api
npx prisma migrate dev


Inicie o back-end

cd backend
cd api
npm run start:dev

Inicie o front-end

cd frontend
npm run dev

#=====================================================================================================================

Outros conteúdos relevantes implementados no projeto:

Timer de tarefas com controle de tempo decorrido
Painel de edição de tarefas com combobox e descrição
Edição do tempo decorrido.
exportar dados da tarefa
