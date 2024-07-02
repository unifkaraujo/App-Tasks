import React, { Component } from 'react'
import {View, ActivityIndicator, StyleSheet} from 'react-native'

// API + AsyncStorage
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class AuthOrApp extends Component {
    
    componentDidMount = async () => {

    // Pegamos o JSON salvo no AsyncStorage
    const userDataJson = await AsyncStorage.getItem('userData')
    let userData = null

    // Caso o JSON esteja inválido, ao invés de retonar um erro, simplesmente cai no catch
    try {
        userData = JSON.parse(userDataJson)
    } catch(e) {
        // userData está inválido
    }

    // Se o AsyncStorage possui um JSON válido, verificamos se o usuario está ativo e vamos para a página das tasks
    if (userData) {
        
        await axios.get(`/users/${userData.id}.json`)
        .catch(err => {
            console.log(err);
        })
        .then(res => {
            const data = res.data;
                
            if (data.status == 'A') {
                this.props.navigation.navigate('Home', userData)
            }
            else {
                this.props.navigation.navigate('Auth')
            }
            
            })
        }
        else {
            this.props.navigation.navigate('Auth')
        }

    }

    render() {
        return (
            // Esse código fica rodando enquanto o componentDidMount finaliza
            <View style={styles.container}>
                <ActivityIndicator size='large' />
            </View>
    
        )
    }

}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    }
})