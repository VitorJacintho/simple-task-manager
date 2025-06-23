# simple-task-manager

README introdutorio simples.

Baixe o Repositorio em
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

crie o arquivo .env contendo as informações do seu sql server
ex:
DATABASE_URL="sqlserver://ELDORADO:1433;database=GembaTaskManager;user=sa;password=zx862;encrypt=false;trustServerCertificate=true"
JWT_SECRET="minha_chave_secreta"
REACT_APP_API_URL=http://192.168.0.158:3000


Após a instalação abra o terminal em backend/api e execute:

$ npx prisma db push (cria o banco no sql server)
$ npm init (instala as dependencias)


$ npm run start:dev (Inicia o back)

abra o terminal em frontend e execute:

$ npm init (instala as dependencias)

$ npm run dev (Inicia o front)
