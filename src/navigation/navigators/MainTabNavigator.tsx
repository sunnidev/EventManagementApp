import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MainRoutes, MainTabParamList } from '../Routes'
import ExploreScreen from '../../screens/ExploreScreen';
import MessageScreen from '../../screens/MessageScreen';
import Ionicons from 'react-native-vector-icons/Ionicons'
import HomeScreen from '../../screens/HomeScreen';
import NotificationScreen from '../../screens/NotificationScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName={MainRoutes.Home} screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
                let iconName = 'home';
                if (route?.name == MainRoutes.Home) iconName = 'home';
                else if (route.name == MainRoutes.Explore) iconName = 'search'
                else if (route.name == MainRoutes.Notifications) iconName = 'notifications'
                else if (route.name == MainRoutes.Message) iconName = 'chatbubble'
                return <Ionicons name={iconName as any} size={size} color={color} />
            },
            tabBarActiveTintColor:'#14b8a6',
            tabBarInactiveTintColor:'gray',
            tabBarStyle:{backgroundColor:'#fff', borderTopWidth:0},
            tabBarLabelStyle:{fontSize:12}
        })}>
            <Tab.Screen name={MainRoutes.Home} component={HomeScreen} />
            <Tab.Screen name={MainRoutes.Explore} component={ExploreScreen} />
            <Tab.Screen name={MainRoutes.Notifications} component={NotificationScreen} />
            <Tab.Screen name={MainRoutes.Message} component={MessageScreen} />
        </Tab.Navigator>
    )
}

export default MainTabNavigator

const styles = StyleSheet.create({})