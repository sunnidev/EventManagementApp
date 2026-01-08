import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootRoutes, RootStackParamList } from '../Routes'
import AuthNavigator from './AuthNavigator'
import MainStackNavigator from './MainStackNavigator'

const Stack = createNativeStackNavigator<RootStackParamList>()
const RootNavigator = () => {
    const isAuthenticated = true
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            {isAuthenticated ? (
                <Stack.Screen name={RootRoutes.MainTabs} component={MainStackNavigator} />
            ) : (
                <Stack.Screen name={RootRoutes.AuthStack} component={AuthNavigator} />
            )}
        </Stack.Navigator>
    )
}

export default RootNavigator

const styles = StyleSheet.create({})