module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)

    // Liberando a requisição em /tasks
    app.route('/tasks')
        // Todas as requisições que possuirem /tasks, irão autenticar a chave
        .all(app.config.passport.authenticate())
        // Se for uma requisição get, vai retornar as tasks, se for post, salva uma task nova
        .get(app.api.task.getTasks)
        .post(app.api.task.save)

    app.route('/tasks/:id')
        .all(app.config.passport.authenticate())
        .delete(app.api.task.remove)

    
    app.route('/tasks/:id/toggle')
        .all(app.config.passport.authenticate())
        .put(app.api.task.toggleTask)

}