const moment = require('moment')

module.exports = app => {

    // Função middleware, recebe requisições para manipular dados das tasks
    const getTasks = (req, res) => {

        // Se não for enviado uma data na requisição, pegamos o dia atual
        // Um detalhe é que essas requisições já passaram pelo passport de segurança, ele que vai enviar as requisições
        const date = req.query.date ? req.query.date :
            moment().endOf('day').toDate()

        // retorna todos os registros da tabela tasks (array de objetos) onde a data estimada é menor do que a enviada, ordenando a resposta por data estimada 
        // req.user é o usuario que está conectado com o token
        app.db('tasks')
            .where({ userId: req.user.id })
            .where('estimateAt', '<=', date)
            .orderBy('estimateAt')
            .then(tasks => res.json(tasks) )
    }

    // Função middleware que vai salvar uma nova task
    const save = (req, res) => {

        // verificamos se a descrição da task está preenchida
        if (!req.body.desc.trim()) {
            return res.status(400).send('Descrição é um campo obrigatório')
        }

        // userID não vai vir do body, portanto temos que denifir manualmente
        // pegamos o id do usuario que está conectado
        req.body.userId = req.user.id

        app.db('tasks')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    // Deleta a task
    const remove = (req, res) => {
        app.db('tasks')
            // pegando a task que tem o id enviado por URL e que o usuario que a criou seja o mesmo que está tentando deletar
            .where({id: req.params.id, userId : req.user.id})
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrada task com id ${req.params.id}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))

    }

    // Altera a task para concluido / pendente
    const updateTaskDoneAt = (req, res, doneAt) => {
        app.db('tasks')
            .where({id: req.params.id, userId: req.user.id})
            .update({doneAt})
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const toggleTask = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {
                
                if (!task) {
                    const msg = `Task com id ${req.params.id} não encontrada`
                    return res.status(400).send(msg)
                }

                const doneAt = task.doneAt ? null : new Date()
                updateTaskDoneAt(req, res, doneAt)

            })
            .catch(err => res.status(400).json(err))
    }

    return { getTasks, save, remove, toggleTask }

}