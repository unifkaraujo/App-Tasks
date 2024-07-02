import React, { Component } from 'react'
import { ImageBackground, Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native'

// Componentes
import AuthInput from '../components/AuthInput'

// Estilização
import backgroundImage from '../../assets/assets/imgs/login.jpg'
import commonStyles from '../commonStyles'

import { showError, showSucess } from '../common'

// API + AsyncStorage
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
}

export default class Auth extends Component {

    state = {
        ...initialState
    }

    signinOrSignup = () => {
        if (this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    signup = async() => {
        const email_key = this.state.email.replace("@", "_at_").replaceAll(".", "_dot_")
        try {

            const response = await axios.get(`/users/${email_key}.json`);
            if (response.data) {
                Alert.alert('Email já cadastrado')
            }
            else {
                await axios.put(`/users/${email_key}.json`, {
                    name: this.state.name,
                    password: this.state.password,
                    status: 'A'
                })
                showSucess('Usuário cadastrado!')
                this.setState({...initialState})
            }
        } catch (e) {
            showError(e)
        }
    }

    signin = async() => {
        const email_key = this.state.email.replace("@", "_at_").replace(".", "_dot_")
        try {
            
            await axios.get(`/users/${email_key}.json`)
            .catch(err => {
                console.log(err);
              })
            .then(res => {
                const data = res.data;
                
                const dataSave = {
                    name: data.name,
                    password: data.password,
                    status: data.status,
                    id: email_key 
                }

                if (data && data.status=='A') {
                    
                    if (data.password == this.state.password) {
                        AsyncStorage.setItem('userData', JSON.stringify(dataSave))
                        this.props.navigation.navigate('Home', dataSave)
                    }
                    else {
                        Alert.alert("Senha incorreta")
                    }

                }
    
                else {
                    Alert.alert('Usuário não localizado')
                }

            })

        } catch (e) {
            showError(e)
        }
    }

    render() {

        // Validações para entrar ou cadastrar o usuario
        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if (this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim().length>=3)
            validations.push(this.state.password === this.state.confirmPassword)
        }

        const validForm = validations.reduce((t,a) => t && a) // Esse reduce verifica se o array não possui nenhum false preenchido
        
        return (

            <ImageBackground source={backgroundImage}
                style={styles.background}>
                
                <Text style={styles.title}> Tasks </Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}> 
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'} 
                    </Text>
                    {this.state.stageNew &&
                        <AuthInput icon='person' placeholder='Nome' value={this.state.name}
                        style={styles.input} onChangeText={name => this.setState({name})} />
                    }
                    <AuthInput icon='mail' placeholder='E-mail' value={this.state.email}
                        style={styles.input} onChangeText={email => this.setState({email})} />
                    <AuthInput icon='key' placeholder='Senha' value={this.state.password}
                        style={styles.input} onChangeText={password => this.setState({password})} />

                    {this.state.stageNew &&
                        <AuthInput icon='key' placeholder='Confirmação de Senha' value={this.state.confirmPassword}
                        style={styles.input} onChangeText={confirmPassword => this.setState({confirmPassword})} />
                    }

                    <TouchableOpacity onPress={this.signinOrSignup}
                        disabled={!validForm}>
                        <View style={[styles.button, validForm ? {} : {backgroundColor: '#AAA'}]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>

            </ImageBackground>

        )

    }

}

const styles = StyleSheet.create ({

    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },

    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center'
    },

    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%'
    },

    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },

    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 7
    },

    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }

})