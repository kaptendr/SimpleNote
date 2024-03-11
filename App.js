import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import InputScreen from './src/screens/InputScreen';
import ViewScreen from './src/screens/ViewScreen';

const HomeStack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="home" component={HomeScreen} />
        <HomeStack.Screen name="input" component={InputScreen} />
        <HomeStack.Screen name="view" component={ViewScreen} />
      </HomeStack.Navigator>
    </NavigationContainer>
  )
}

export default App;