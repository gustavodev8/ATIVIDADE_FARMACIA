const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// Conexão direta com o banco do XAMPP
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'atividade_farmacia'
});

conexao.connect((err) => {
    if (err) console.log("Erro no banco: ", err);
    else console.log("Banco de Dados Conecctadoo");
});

// Rota de Cadastro do Site
app.post('/cadastrar', (req, res) => {
    const { nome, email, senha } = req.body;
    const senhaCripto = bcrypt.hashSync(senha, 10);
    
    // Todo cadastro pelo site já ganha a promoção (1 = true)
    const sql = "INSERT INTO usuarios (nome, email, senha, recebe_promocao) VALUES (?, ?, ?, 1)";
    
    conexao.query(sql, [nome, email, senhaCripto], (err) => {
        if (err) return res.status(500).send("Erro ao salvar");
        res.send({ mensagem: "Cadastrado com sucesso!" });
    });
});

// Rota de Login do App
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    conexao.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
        if (err || results.length === 0) return res.status(401).send("ssuário não existe");

        const usuario = results[0];
        const senhaOk = bcrypt.compareSync(senha, usuario.senha);

        if (senhaOk) {
            res.send(usuario); // Retorna os dados do usuário logado
        } else {
            res.status(401).send("Senha incorreta");
        }
    });
});

// Rota de Produtos
app.get('/produtos', (req, res) => {
    conexao.query("SELECT * FROM produtos", (err, results) => {
        res.send(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
