<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=430858&height=120&section=header"/>

# Oficina 2 - Módulo Avançado | Capacita Brasil <img width='100' heigth='100' src="assets/logo_escola.png" />

**Olá, _WebDev's!_** Sejam bem-vindos ao repositório da Oficina 02, onde construímos um servidor Node.js conectado a um banco de dados escolar! Neste projeto, você encontrará um sistema completo para gestão de alunos, professores e boletins, incluindo uma interface web para manipular essas informações de forma intuitiva.

### 🚀 O que esse projeto faz?
#### Nosso sistema permite:
- Visualizar todos os dados cadastrados dos alunos
- Adicionar, atualizar e remover alunos e professores
- Visualizar notas através da página boletins
- Interface web para facilitar a administração

### 🛠️ Tecnologias Utilizadas
#### Este projeto foi desenvolvido com as seguintes tecnologias:
- Node.js - Servidor backend (utilizado também para criar a interface web de maneira estática)
- Express.js - Framework para API REST
- PostgreSQL - Banco de dados relacional
- Prisma - ORM para interação com o banco de dados

### 👨‍💻 Como Rodar o Projeto
1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
```
2. Instale as dependências:
```bash
cd nome-do-repositorio
npm install
```
3. Configure o Banco de Dados:
- Crie um banco de dados e configure o arquivo .env com as credenciais corretas.
- Rode as migrações para criar as tabelas:
```bash
npx prisma migrate dev --name init
```
4. Inicie o Servidor:
```bash
node app.js
```
O servidor estará rodando em http://localhost:3000

### 🔍 Estrutura do Banco de Dados
#### Nosso banco de dados possui as seguintes tabelas:
- Aluno: id, nome, email, idade, data de criação, e é relacionado a tabela **boletins**.
- Professor: id, nome, email, idade, data de criação, e é relacionado a tabela **disciplinas**.
- Boletim: id, aluno_id (chave estrangeira), disciplina_id (chave estrangeira), nota (gerada aleatoriamente na criação).
- Disciplina: id, nome, e é relacionado a tabela **boletins** e **professores**.

#### Fique à vontade para contribuir! Basta forkar o repositório, criar um branch e enviar um pull request. Sugestões são sempre bem-vindas.

#

### _Gostou do meu perfil? Você pode saber mais sobre mim em:_ &nbsp;&nbsp;[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kaualimaq/)
### _Ou me contatar através do:_ &nbsp;&nbsp;[![Gmail](https://img.shields.io/badge/Gmail-333333?style=for-the-badge&logo=gmail&logoColor=red)](mailto:limakaua610@gmail.com)
