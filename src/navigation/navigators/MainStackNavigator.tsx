import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MainStackParamList } from '../Routes'
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='MainTabs' component={MainTabNavigator} />
        </Stack.Navigator>
    )
}

export default MainStackNavigator

const styles = StyleSheet.create({})