import axios from 'axios';
axios.defaults.baseURL = 'https://tasks-105c2-default-rtdb.firebaseio.com/';

//import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import Navigator from './src/Navigator';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Navigator);