import React, { Component } from 'react'
import {
        View,
        ActivityIndicator,
        StyleSheet
    } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

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

            // Se o AsyncStorage possui um JSON válido, então setamos o header necessário da API para fazer as requisições e já vamos para a página das tasks
            if (userData && userData.token) {
                axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
                this.props.navigation.navigate('Home', userData)
            }
            else {
                this.props.navigation.navigate('Auth')
            }

        }

        render() {
            return (
                // Esse código fica rodando enquanto o componentDidMoun finaliza
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