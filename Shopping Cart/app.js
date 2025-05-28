import React from "react";
import {View} from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductWrapper from './../../Shopping Cart/ProductWrapper'
import UserList from './../../Shopping Cart/UserList'
const Stack=createNativeStackNavigator()
const Apps=()=>{
  return(
    <Stack.Navigator 
    // screenOptions={{headerShown: false}}
    >
        <Stack.Screen name="Home" component={ProductWrapper}/>
        <Stack.Screen name="User" component={UserList}/>
      </Stack.Navigator>
  )

}
export default Apps;