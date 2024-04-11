import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Platform, Alert } from 'react-native' 

import todayImage from '../../assets/assets/imgs/today.jpg'
import tomorrowImage from '../../assets/assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/assets/imgs/week.jpg'
import monthImage from '../../assets/assets/imgs/month.jpg'

import moment from 'moment'
import 'moment/locale/pt-br'

import commonStyles from '../commonStyles'

import Task from '../components/Task'
import AddTask from './AddTask'

import AsyncStorage from '@react-native-async-storage/async-storage'

import axios from 'axios'

/* Biblioteca de icones do fontawesome, adicionando manualmente a biblioteca, pois referenciando diretamente não estava funcionando */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCreativeCommonsRemix, fab } from '@fortawesome/free-brands-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
library.add(fab, faCheck, faEye, faEyeSlash, faPlus, faTrash, faBars)

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { server, showError } from '../common'

const initialState = {
    showDoneTasks: true,
    showAddTask: false,
    visibleTasks: [],
    tasks: []
}

export default class TaskList extends Component {

    state = {
        ...initialState
    }

    componentDidMount = async () => {
        // Recuperando algumas variaveis de estado armazenadas no AsyncStorage (localmente)
        const stateString = await AsyncStorage.getItem('tasksState')
        const savedState = JSON.parse(stateString) || initialState
        this.setState({
            showDoneTasks: savedState.showDoneTask
        }, this.filterTasks)

        this.loadTasks()
    }

    loadTasks = async() => {
        try {
            // Formatando a data como esperado pela API
            const maxDate = 
            moment()
            .add({ days: this.props.daysAhead })
            .format('YYYY-MM-DD 23:59:59')
            // Enviando a requisição com parâmetros na query string
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            // Armazenando em tasks a res.data (lista)
            console.log(res.data)
            this.setState({ tasks: res.data }, this.filterTasks)
        } catch(e) {
            showError(e)
        }
    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
    }

    filterTasks = () => {
        let visibleTasks = null
        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({ visibleTasks })

        // Armazenando apenas a variavel de estados que exibe/oculta as tasks finalizadas
        AsyncStorage.setItem('tasksState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }))
    }

    toggleTask = async taskId => {
        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            this.loadTasks()
        } catch(e) {
            showError(e)
        }
    }

    addTask = async newTask => {

        if (!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return
        }

       try {
        await axios.post(`${server}/tasks`, {
            desc: newTask.desc,
            estimateAt: newTask.date
        })

        this.setState({ showAddTask: false }, this.loadTasks)
       } catch(e) {
            showError(e)
       }
    }

    deleteTask = async taskId => {
        try {
            await axios.delete(`${server}/tasks/${taskId}`)
            this.loadTasks()
        } catch(e) {
            showError(e)
        }
    }

    getImage = () => {
        switch(this.props.daysAhead) {
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            default: return monthImage
        }
    }

    getColor = () => {
        switch(this.props.daysAhead) {
            case 0: return commonStyles.colors.today
            case 1: return commonStyles.colors.tomorrow
            case 7: return commonStyles.colors.week
            default: return commonStyles.colors.month
        }
    }

    getTitle = () => {
        switch(this.props.daysAhead) {
            case 0: return 'Hoje'
            case 1: return 'Amanhã'
            case 7: return 'Semana'
            default: return 'Mês'
        }
    }

    render() {

        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

        return (

            <View style={styles.container}>

                <AddTask isVisible={this.state.showAddTask} 
                    onCancel={() => this.setState({ showAddTask: false }) }
                    onSave={this.addTask} />

                <ImageBackground source={this.getImage()}
                    style={styles.background} >
                    
                    <View style={styles.iconBar} >

                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <FontAwesomeIcon icon='fa-bars'
                                size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.toggleFilter}>
                            <FontAwesomeIcon icon={this.state.showDoneTasks ? 'fa-eye' : 'fa-eye-slash'} 
                                size={20} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                
                    <View style={styles.titleBar} >
                        <Text style={styles.title}> {this.getTitle()} </Text>
                        <Text style={styles.subtitle}> {today} </Text>
                    </View>
                
                </ImageBackground>

               <View style={styles.taskList}>
                    <FlatList data={this.state.visibleTasks}
                        keyExtractor={item => item.id.toString()}
                        // desestrutura o item (que é o elemento que armazena individualmente os valores do array)
                        // passa o spread de cada item para criar uma Task
                        // o spread serve para enviar todos os parametros de uma vez só 
                        renderItem={({item}) => <Task {...item} onToggleTask = {this.toggleTask} onDelete = {this.deleteTask} /> }
                    />
               </View>

               <TouchableOpacity style={[styles.addButton, {backgroundColor: this.getColor()}]}
                    activeOpacity={0.7}
                    onPress={() => this.setState( {showAddTask: true} )}>
                    <FontAwesomeIcon icon="fa-plus" size={20} color={commonStyles.colors.secondary} />
               </TouchableOpacity>

            </View>

        )

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3
    },
    taskList: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center' 
    }
})