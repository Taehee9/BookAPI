import React, { Component } from "react";
import NaverScreen from "./screen/NaverScreen";
import NaverBookScreen from "./screen/NaverBookScreen";
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import DetailScreen from "./screen/DetailScreen";
import BarcodeScreen from "./screen/BarcodeScreen";
import FavoriteBookScreen from "./screen/FavoriteBookScreen";
import SettingScreen from "./screen/SettingScreen";
import { Ionicons } from '@expo/vector-icons';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
// web일 경우엔 localStorage, react-native일 경우 AsyncStorage를 사용해라
import storage from 'redux-persist/lib/storage';
//index.js가 기본 값! 여러 가지 파일이 있어도 reducers/이부분에 아무것도 안적혀 있으면 index를 찾아라
import rootReducer from './reducers';

//값을 저장할 때 key에 써져있는 이름으로 AsyncStorage를 저장해라 라고 지정해주는 객체!
//즉, root라는 이름의 AsyncStorage에 저장된 것이기 때문에 이름은 아무거나 해도됨!
const persistConfig = {
  key: 'root',
  storage,
}

//index에 써져 있는 내용을 persistConfig의 객체 내용으로 persistedReducer에 저장됨
//AsyncStorage는 값이 바뀔 때마다 차곡차곡 저장되는 형태! 
//createStore할 때 이 저장된 값의 제일 끝에 있는 값이 (최근 값) 불러와지는 것!
const persistedReducer = persistReducer(persistConfig, rootReducer)
//createStore할 때 초기값을 넘겨줌! 그 초기값이 persistedReducer에 들어있음!  
let store = createStore(persistedReducer)
// 초기값을 넘겨줬는지 안넘겨줬는지 확인하는 애! 
// 얘가 있어야 AsyncStorage가 됨! 왜??? 
let persistor = persistStore(store)


// AsyncStorage 안쓰고 redux 사용하려면 하는 부분!
// import { createStore } from "redux";
// import { Provider } from 'react-redux';

// import reducer from "./reducers";
// let store = createStore(reducer);

const AppNavigator = createStackNavigator({
  Home: {
    //screen: NaverBookScreen, - redux 안 쓴 버전
    screen: NaverScreen, //redux 쓴 버전
    navigationOptions: {
      header: null
    }
  },
  detail: {
    screen: DetailScreen,
    navigationOptions: {
      header: null
    }
  }
})

const FavoriteNavigator = createStackNavigator({
  FavoriteHome: {
    screen: FavoriteBookScreen
  }
})
const SettingNavigator = createStackNavigator({
  SettingHome: {
    screen: SettingScreen
  }
})
const TabNavigator = createBottomTabNavigator({
  Home: AppNavigator,
  List: FavoriteNavigator,
  Settings: SettingNavigator,
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-book`;
        } else if (routeName === 'List') {
          iconName = `ios-bookmark`;
        } else if (routeName === 'Settings') {
          iconName = `ios-construct`;
        }
        return <Ionicons name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#ff6666',
      inactiveTintColor: 'gray',
    },
  }
);
const RootStack = createStackNavigator(
  {
    Main: {
      screen: TabNavigator,
    },
    MyModal: {
      screen: BarcodeScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);
const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return (
      //위에 있는 persistor라는 변수를 사용! 제대로 loading이 되면 그 안에 있는 AppContainer를 불러오고 
      //실패시에는 loading에 null을 넣고 기다려라! persistor가 올 때까지
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    )
  }
}
