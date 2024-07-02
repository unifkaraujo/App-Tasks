import { Alert } from 'react-native'

function showError(err) {
    if (err.response && err.response.data) {
        Alert.alert('Ops! Ocorreu um problema!', `Mensagem: ${err.response.data}`)
    } else {
        Alert.alert('Ops! Ocorreu um problema!', `Mensagem: ${err}`)
    }
}

function showSucess(msg) {
    Alert.alert('Sucesso!',msg)
}

export { showError, showSucess }