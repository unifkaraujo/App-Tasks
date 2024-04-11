import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default props => {
    return (
        <View style={[styles.container, props.style]}>
            <Ionicons name={props.icon} size={20} style={styles.icon} />
            <TextInput {...props} style={styles.input} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: '#EEE',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        color: '#333',
        marginLeft: 20
    },
    input: {
        marginLeft: 20,
        width: '70%',
    }
})