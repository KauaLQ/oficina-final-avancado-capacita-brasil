const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const { create } = require('domain');
const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// Middleware para processar dados de formulários (x-www-form-urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos da pasta 'assets'
app.use(express.static(path.join(__dirname, 'assets')));

// POST /api/alunos - Cria um novo aluno (recebe JSON no corpo da requisição)
app.post('/api/alunos', async (req, res) => {
    const { nome, email, idade, materias } = req.body;
    const getRandomNota = () => parseFloat((Math.random() * 10).toFixed(2));
    const numbers = materias.map(Number);

    try {
      const novoAluno = await prisma.Aluno.create({
        data: {
          nome,
          email,
          idade: parseInt(idade),
          boletins: {
            create: numbers.map(disciplinaId => ({
                disciplinaId,
                nota: getRandomNota(),
            })),
            },
        },
      });
      res.status(201).json(novoAluno);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar aluno' });
    }
});
  
// PUT /api/alunos/:id - Atualiza um aluno existente pelo ID
app.put('/api/alunos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, idade } = req.body;
    try {
      const alunoAtualizado = await prisma.Aluno.update({
        where: { id: parseInt(id) },
        data: {
          nome,
          email,
          idade: parseInt(idade)
        }
      });
      res.json(alunoAtualizado);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar aluno' });
    }
});

// DELETE /api/alunos/:id - Remove um aluno pelo ID
app.delete('/api/alunos/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.Aluno.delete({
        where: { id: parseInt(id) }
      });
      res.json({ message: 'Aluno removido com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover aluno' });
    }
});

//Rota raíz da URL
app.get('/',(req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Escola Digital</title>
        <link rel="stylesheet" type="text/css" href="/style.css" />
        <link rel="shortcut icon" type="image/png" href="/logo_escola.png">
        <script src="https://kit.fontawesome.com/a264ca8e95.js" crossorigin="anonymous"></script>
    </head>
    <body>
        <header>
            <div class="container">
                <div class="image">
                    <img src="/logo_escola.png" alt="logo da escola">
                </div>
                <div class="menu">
                    <nav>
                        <ul>
                            <li class="li-father"><i class="fa-solid fa-user"></i><a href='/alunos'>ALUNOS</a></li>
                            <li class="li-father"><i class="fa-solid fa-user-tie"></i><a href="#">PROFESSORES</a></li>
                            <li class="li-father"><i class="fa-solid fa-book"></i><a href="#">BOLETINS</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    </body>
    </html>
    `;
    res.send(html);
});

app.get('/alunos', async (req, res) => {
    try{
        const alunos = await prisma.Aluno.findMany();
        let html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Escola Digital</title>
            <link rel="stylesheet" type="text/css" href="/style.css" />
            <link rel="shortcut icon" type="image/png" href="/logo_escola.png">
            <script src="https://kit.fontawesome.com/a264ca8e95.js" crossorigin="anonymous"></script>
        </head>
        <body>
            <header id="header-alunos">
                <div class="container-header">
                    <div class="banner-wellcome">
                        <img src="/logo_escola.png" alt="logo da escola">
                        <div class="back">
                            <i class="fa-solid fa-square-xmark" onclick="location.href='/'"></i>
                            <p>ENCERRAR</p>
                            <p>SESSÃO</p>
                        </div>
                    </div>
                    <hr>
                    <div class="icon-name">
                        <i class="fa-solid fa-user"></i>
                        <p>GERENCIAMENTO DE ALUNOS</p>
                    </div>
                    <hr>
                    <div class="line"></div>
                </div>
            </header>

            <main>
                <p class="title">ALUNOS CADASTRADOS</p>

                <div class="topic-table">
                    <table border="1px">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Idade</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
        `;

        alunos.forEach(Aluno => {
            html += `
            <tr>
            <td>${Aluno.id}</td>
            <td>${Aluno.nome}</td>
            <td>${Aluno.email}</td>
            <td>${Aluno.idade}</td>
            <td>
                <div class="actions">
                    <i class="fa-solid fa-user-xmark" onclick="deleteAluno(${Aluno.id})"></i>
                    <i class="fa-solid fa-user-pen" onclick="editarCadastro(${Aluno.id})"></i>
                </div>
            </td>
            </tr>
            `;
        });

        html += `
                </tbody>
                    </table>
                </div>

                <p class="title">CADASTRAR NOVO ALUNO</p>

                <form action="#" class="create" id="novoAlunoForm">
                    <div class="informations">
                        <div class="fields">
                            <input type="text" name="nome" id="nome" placeholder="Nome" required>
                            <input type="email" name="email" id="email" placeholder="Email" required>
                            <input type="number" name="idade" id="idade" placeholder="Idade" required>
                        </div>

                        <fieldset class="subjects">
                            <legend>Matérias do Aluno:</legend>
                        
                            <div>
                            <input type="checkbox" id="1" name="mat_one" checked />
                            <label for="1">Informática Básica</label>
                            </div>
                        
                            <div>
                            <input type="checkbox" id="2" name="mat_two" />
                            <label for="2">Programação Orientada a Objetos</label>
                            </div>
            
                            <div>
                                <input type="checkbox" id="3" name="mat_three" />
                                <label for="3">Desenvolvimento Web</label>
                            </div>
            
                            <div>
                                <input type="checkbox" id="4" name="mat_four" />
                                <label for="4">Java com SpringBoot</label>
                            </div>
            
                            <div>
                                <input type="checkbox" id="5" name="mat_five" />
                                <label for="5">Banco de Dados</label>
                            </div>
                        </fieldset>
                    </div>
                    
                    <button type="submit" name="cadastrar" id="cadastrar">CRIAR<i class="fa-solid fa-user-plus"></i></button>
                </form>

                <br>
            </main>

            <div class="janela-modal" id="janela-modal">
                <form action="#" class="create" id="atualizarAlunoForm">
                    <div class="informations">
                        <div class="fields">
                            <input type="text" name="nome_new" id="nome_new" placeholder="Nome" required>
                            <input type="email" name="email_new" id="email_new" placeholder="Email" required>
                            <input type="number" name="idade_new" id="idade_new" placeholder="Idade" required>
                        </div> 
                    </div>
                    <button type="submit" name="cadastrar" id="cadastrar">ENVIAR<i class="fa-solid fa-user-plus"></i></button>
                </form>
            </div>

            <script>

                let alunoId = null; // Variável global para armazenar o ID do aluno

                function editarCadastro(id){
                    alunoId = id; // Armazena o ID do aluno para atualização
                    const modal = document.getElementById('janela-modal')
                    modal.classList.add('abrir')

                    modal.addEventListener('click', (e) => {
                        if(e.target.id == 'janela-modal'){
                            modal.classList.remove('abrir')
                        }
                    })
                }

                // Adicionar novo aluno via fetch API (POST)
                document.getElementById('novoAlunoForm').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const nome = document.getElementById('nome').value;
                    const email = document.getElementById('email').value;
                    const idade = document.getElementById('idade').value;

                    // Captura os checkboxes marcados e seus IDs
                    const materiasSelecionadas = [];
                    document.querySelectorAll('.subjects input[type="checkbox"]:checked').forEach(checkbox => {
                        materiasSelecionadas.push(checkbox.id); // Agora captura o ID do checkbox
                    });

                    const response = await fetch('/api/alunos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, idade, materias: materiasSelecionadas })
                    });
                    if (response.ok) {
                    window.location.reload();
                    } else {
                    alert('Erro ao adicionar aluno');
                    }
                });

                // Atualizar aluno via fetch API (PUT)
                document.getElementById('atualizarAlunoForm').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    if (!alunoId) {
                        alert('Erro: Nenhum aluno selecionado para atualização.');
                        return;
                    }
                    const nome = document.getElementById('nome_new').value;
                    const email = document.getElementById('email_new').value;
                    const idade = document.getElementById('idade_new').value;
                    const response = await fetch('/api/alunos/' + alunoId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome, email, idade })
                    });
                    if (response.ok) {
                    window.location.reload();
                    } else {
                    alert('Erro ao atualizar aluno');
                    }
                });

                // Remover aluno via fetch API (DELETE)
                async function deleteAluno(id) {
                    if (confirm('Deseja realmente remover este aluno?')) {
                    const response = await fetch('/api/alunos/' + id, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        window.location.reload();
                    } else {
                        alert('Erro ao remover aluno');
                    }
                    }
                }
            </script>
        </body>
        </html>
        `
        res.send(html);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar dados dos alunos.');
    }
})

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}/`);
});