// Importamos nossa chave secreta, definida no outro arquivo
const { authSecret } = require('../.env')
// jwt vai adicionar a segurança para os dados serem acessados 
const jwt = require('jwt-simple')
// Faremos a comparação da chave hash com o bcrypt
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    // vamos validar o login feito pelo usuario
    const signin = async (req, res) => {
        // se não foi digitado umas das informações, não pode ser logado
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Dados incompletos')
        }
    
        // fazemos a seleção da tabela users, com o email digitado na requisição
        const user = await app.db('users')
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
            .first()
        
        // se encontrado, então vamos comparar se a senha está correta
        if (user) {
            // verificamos a senha por chave hash
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    // se não encontrou, retorna erro
                    return res.status(401).send('A senha informada é inválida')
                }
                // payload serve para adicionarmos a segurança jwt
                const payload = { id: user.id }

                // se tudo deu certo, retornamos o json com os dados do usuario, e o token jwt com segurança adicionada
                // esse token será necessario para fazer todas as outras requisições quando o usuario já estiver logado
                res.json({
                    name: user.name,
                    email: user.email,
                    token: jwt.encode(payload, authSecret)
                })
            })
        } else {
            res.status(400).send('Usuário não localizado')
        }
    }
    return { signin }
}