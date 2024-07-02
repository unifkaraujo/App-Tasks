import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

// Navegação
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

// Componentes
import Auth from './screens/Auth';
import TaskList from './screens/TaskList';
import AuthOrApp from './screens/AuthOrApp';

// Estilização
import commonStyles from './commonStyles'
import { Gravatar } from 'react-native-gravatar';
import Ionicons from 'react-native-vector-icons/Ionicons'

// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const TodayComponent = props => <TaskList title='Hoje' daysAhead={0} {...props} />;
const TomorrowComponent = props => <TaskList title='Amanhã' daysAhead={1} {...props} />;
const WeekComponent = props => <TaskList title='Semana' daysAhead={7} {...props} />;
const MonthComponent = props => <TaskList title='Mês' daysAhead={30} {...props} />;

const menuRoutes = {
  Today: {
    name: 'Today',
    component: TodayComponent,
    options: {
      title: 'Hoje'
    }
  },
  Tomorrow: {
    name: 'Tomorrow',
    component: TomorrowComponent,
    options: {
      title: 'Amanhã'
    }
  },
  Week: {
    name: 'Week',
    component: WeekComponent,
    options: {
      title: 'Semana'
    }
  },
  Month: {
    name: 'Month',
    component: MonthComponent,
    options: {
      title: 'Mês'
    }
  }
}

const HomeScreen = () => {
  return (
    <Drawer.Navigator 
      initialRouteName="Today" 
      screenOptions={{ 
        headerShown: false,
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen {...menuRoutes.Today} />
      <Drawer.Screen {...menuRoutes.Tomorrow} />
      <Drawer.Screen {...menuRoutes.Week} />
      <Drawer.Screen {...menuRoutes.Month} />
    </Drawer.Navigator>
  );
};
const CustomDrawerContent = (props) => {

  const logout = () => {
    AsyncStorage.removeItem('userData')
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'AuthOrApp' }],
    });
  }

  const [selectedItem, setSelectedItem] = React.useState('Today');

  const retornaCorSel = () => {
    if (selectedItem === 'Today') {
      return commonStyles.colors.today
    }
    if (selectedItem === 'Tomorrow') {
      return commonStyles.colors.tomorrow
    }
    if (selectedItem === 'Week') {
      return commonStyles.colors.week
    }
    if (selectedItem === 'Month') {
      return commonStyles.colors.month
    }
  }

  return (
    <DrawerContentScrollView {...props} style={{marginTop: -4}}>
      <View style={[styles.drawerHeader, {backgroundColor: retornaCorSel()}]}>
        <Gravatar style={styles.avatar} options={{ parameters: { size: '100', d: 'mm' }, secure: true }} />
        <Text style={styles.drawerHeaderText}></Text>
        <TouchableOpacity onPress={logout}>
          <Ionicons name='exit' size={30} color='white' />
        </TouchableOpacity>
      </View>
      <DrawerItem
        label="Hoje"
        onPress={() => {
          setSelectedItem('Today');
          props.navigation.navigate('Today');
        }}
        labelStyle={{ fontSize: 20, fontWeight: selectedItem === 'Today' ? 'bold' : 'normal', color: selectedItem === 'Today' ? retornaCorSel() : 'black' }} // Definir a cor com base no item selecionado
      />
      <DrawerItem
        label="Amanhã"
        onPress={() => {
          setSelectedItem('Tomorrow');
          props.navigation.navigate('Tomorrow');
        }}
        labelStyle={{ fontSize: 20, fontWeight: selectedItem === 'Tomorrow' ? 'bold' : 'normal', color: selectedItem === 'Tomorrow' ? retornaCorSel() : 'black' }} // Definir a cor com base no item selecionado
      />
      <DrawerItem
        label="Semana"
        onPress={() => {
          setSelectedItem('Week');
          props.navigation.navigate('Week');
        }}
        labelStyle={{ fontSize: 20, fontWeight: selectedItem === 'Week' ? 'bold' : 'normal', color: selectedItem === 'Week' ? retornaCorSel() : 'black' }} // Definir a cor com base no item selecionado
      />
      <DrawerItem
        label="Mês"
        onPress={() => {
          setSelectedItem('Month');
          props.navigation.navigate('Month');
        }}
        labelStyle={{ fontSize: 20, fontWeight: selectedItem === 'Month' ? 'bold' : 'normal', color: selectedItem === 'Month' ? retornaCorSel() : 'black' }} // Definir a cor com base no item selecionado
      />
    </DrawerContentScrollView>
  );
};

const mainRoutes = {
  AuthOrApp: {
    name: 'AuthOrApp',
    component: AuthOrApp
  },
  Auth: {
    name: 'Auth',
    component: Auth
  },
  Home: {
    name: 'Home',
    component: HomeScreen
  }
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthOrApp" screenOptions={{ headerShown: false }}>
        <Stack.Screen {...mainRoutes.AuthOrApp} />
        <Stack.Screen {...mainRoutes.Auth} />
        <Stack.Screen {...mainRoutes.Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  drawerHeader: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  drawerHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  }
});
