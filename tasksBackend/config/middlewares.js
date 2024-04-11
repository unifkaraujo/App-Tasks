// Body Parser vai permitir ler parametros enviados pelo body da requisição
const bodyParser = require('body-parser')

// Cors vai permitir que a API seja executada de outras origens, não apenas da maquina loca 
const cors = require('cors')

// Exportando o módulo como função arrow, pois o consign exige que seja dessa forma
module.exports = app => {
    // Interpretando entradas json pelo body da requisição
    app.use(bodyParser.json())
    // Permitindo outras origens executem a URL
    app.use(cors({
        origin: '*'
    }))

}