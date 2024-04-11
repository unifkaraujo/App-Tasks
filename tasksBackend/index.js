// Express vai permitir ler as requisições e rodar as funções middleware
const express = require('express')

// App vai armazenar todo o estado da aplicação
const app = express()

// Importando a conexão com o banco de dados realizado
const db = require('./config/db')

// Consign é uma biblioteca que vai ajudar a importar e exportar códigos dentro do projeto de uma forma mais fácil de ser utilizada
const consign = require('consign')

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

// Permitindo utilizar o banco com app.db
app.db = db

app.listen(3000, () => {
    console.log('Backend executando...')
})