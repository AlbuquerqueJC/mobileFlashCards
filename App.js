import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import Decks from './components/Decks'
import AddDeck from './components/AddDeck'
import AddCard from './components/AddCard'
import Deck from './components/Deck'
import Quiz from './components/Quiz'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { setLocalNotification } from './utils/helpers'
import {blue, white} from './utils/colors'
import {FontAwesome, Ionicons} from '@expo/vector-icons'
import {View} from "react-native";
import Constants from 'expo-constants';

const Tab = createBottomTabNavigator()
const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01
    }
}
const Stack = createStackNavigator()

function MyStatusBar({ backgroundColor, ...props }) {
    return (
        <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
            <StatusBar translucent backgroundColor={backgroundColor} {...props} />
        </View>
    );
}

function MyStack() {
  return (
      <Stack.Navigator
          initialRouteName="DecksView"
          headerMode="screen"
          screenOptions={{
            headerTintColor: white,
            headerStyle: { backgroundColor: blue }
          }}
          options={{
            transitionSpec: {
              open: config,
              close: config
            }
          }}
      >
        <Stack.Screen
            name="DecksView"
            component={Decks}
            options={{
              title: 'Decks',
              transitionSpec: {
                open: config,
                close: config
              }
            }}
        />
        <Stack.Screen
            name="DeckDetails"
            component={Deck}
            options={{
              title: 'Deck details',
              transitionSpec: {
                open: config,
                close: config
              }
            }}
        />
        <Stack.Screen
            name="Quiz"
            component={Quiz}
            options={{
              title: 'Quiz',
              transitionSpec: {
                open: config,
                close: config
              }
            }}
        />
        <Stack.Screen
            name="AddCard"
            component={AddCard}
            options={{
              title: 'Add question',
              transitionSpec: {
                open: config,
                close: config
              }
            }}
        />
      </Stack.Navigator>
  )
}

export default function App() {
  useEffect(() =>{
    setLocalNotification()
  })

  return (
      <Provider store={createStore(reducer)}>
          <MyStatusBar backgroundColor={blue} barStyle='light' />
          <NavigationContainer>
              <Tab.Navigator
                  screenOptions={({ route }) => ({
                      tabBarIcon: ({ focused, color, size }) => {
                          let iconName;

                          if (route.name === 'Decks') {
                              iconName = focused ? 'md-list-circle': 'md-list';
                          } else {
                              iconName = focused ? 'md-add-circle' : 'md-add';
                          }

                          // You can return any component that you like here!
                          return <Ionicons name={iconName} size={size} color={color} />;
                      },
                  })}
                  tabBarOptions={{
                      activeTintColor: 'tomato',
                      inactiveTintColor: 'gray',
                  }}
              >
                <Tab.Screen name="Decks" component={MyStack} />
                <Tab.Screen name="Add deck" component={AddDeck} />
              </Tab.Navigator>
          </NavigationContainer>
      </Provider>
  )
}