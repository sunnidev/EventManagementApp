import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { MainRoutes } from '../navigation/Routes'

const HomeScreen = () => {
  const navigation = useNavigation<any>()
  return (
   <SafeAreaView>
    <Pressable onPress={() => navigation.navigate(MainRoutes.Profile)}>
      <Text>Go to profile</Text>
    </Pressable>
   </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})