const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        // recebe a chave jwt da requisição pelo header
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }

    // Definindo a estratégia de autenticação que será utilizada
    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => {
                if (user) {
                    done(null, { id: user.id, email: user.email })
                } else {
                    done(null, false)
                }
            })
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return {
        // inicializa e autentica o usuario usando jwt
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', { session: false } )
    }

}