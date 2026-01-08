import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthRoutes, AuthStackParamList } from '../Routes'
import LoginScreen from '../../screens/LoginScreen';
import SignUpScreen from '../../screens/SignUpScreen';

const Stack =  createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name={AuthRoutes.Login} component={LoginScreen} />
        <Stack.Screen name={AuthRoutes.SignUp} component={SignUpScreen} />
    </Stack.Navigator>
  )
}

export default AuthNavigator

const styles = StyleSheet.create({})