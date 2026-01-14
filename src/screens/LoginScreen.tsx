import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import { AuthRoutes } from '../navigation/Routes';
import { login } from '../api/apiClient';
import { useAuthStore } from '../store/useAuthStore';

type LoginValues = {
  email: string;
  password: string
}

const LOGO_URI = 'https://images.icon-icons.com/2108/PNG/512/meetup_icon_130877.png'
const GOOGLE_ICON = 'https://upload.wikimedia.org/wikimedia/commons/5/53/Google_%22G%22_logo.svg'

const LoginScreen = () => {

  const navigation = useNavigation<any>()
  const {setAuth} = useAuthStore()
  const { control, handleSubmit, formState } = useForm<LoginValues>({
    defaultValues: { email: '', password: '' },
    mode: 'onChange'
  });

  const { errors, isValid } = formState;
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrroMessage] = useState<string | null>(null)

  const onSubmit = async (data: LoginValues) => {
    try {
      setErrroMessage(null)
      const { accessToken, refreshToken, user } = await login(data)
      setAuth(user,accessToken,refreshToken)
    } catch (error: any) {
      setErrroMessage(error.response?.data?.message || error.message)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView className='flex-1' contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 36
        }}>
          <TouchableOpacity className='w-9 h-9 rounded-full items-center justify-center mb-3'>
            <Ionicons name='arrow-back-outline' size={20} color={'#111287'} />
          </TouchableOpacity>

          <View className='items-center mb-6'>
            <Image source={{ uri: LOGO_URI }} className='w-24 h-24' resizeMode='contain' />
          </View>

          <TouchableOpacity className='rounded-xl border border-gray-200 py-3 mb-3 bg-white active:opacity-90'>
            <View className='flex-row items-center justify-center'>
              <View className='mr-3'>
                <Icon name='google' size={20} color={'#111287'} />
              </View>
              <Text className='font-medium text-base text-gray-800'>Sign in With Google </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className='rounded-xl border border-gray-200 py-3 mb-3 bg-white active:opacity-90'>
            <View className='flex-row items-center justify-center'>
              <View className='mr-3'>
                <Icon name='facebook' size={20} color={'#1877f2'} />
              </View>
              <Text className='font-medium text-base text-gray-800'>Sign in With Facebook </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className='rounded-xl border border-gray-200 py-3 mb-3 bg-blue-500 active:opacity-90'>
            <View className='items-center justify-center'>
              <Text className='font-medium text-base text-white'>Login with google</Text>
            </View>
          </TouchableOpacity>

          <Text className='text-center text-gray-400 my-3 font-medium'>OR</Text>

          <View className='mb-3'>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid Email',
                },
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <View className="mb-3">
                  <View className="bg-white rounded-xl border border-gray-200 px-4 py-2">
                    <TextInput
                      placeholder="Email"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      className="text-base text-gray-900"
                      placeholderTextColor="#9ca3af"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.email ? (
                    <Text className='text-sm text-red-600 mt-2'>{errors?.email?.message}</Text>
                  ) : null}
                </View>
              )}
            />
          </View>

          <View className='mb-2'>
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <View className="mb-3">
                  <View className="flex-row bg-white rounded-xl border border-gray-200 px-4 py-2">
                    <TextInput
                      placeholder="Password"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      className="text-base flex-1 text-gray-900"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                      <Feather
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color={'#111827'} />
                    </TouchableOpacity>
                  </View>
                  {errors.password ? (
                    <Text className='text-sm text-red-600 mt-2'>{errors?.password?.message}</Text>
                  ) : null}
                </View>
              )}
            />
          </View>

          <TouchableOpacity
            className='mb-4 items-end'
            onPress={() => navigation.navigate(AuthRoutes.ForgotPassword)}
          >
            <Text className='text-teal-600 font-semibold'>Forgot Password</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit(onSubmit)} className={`py-4 rounded-full mb-4 items-center ${isValid ? 'bg-gray-900' : 'bg-gray-200'}`}>
            <Text className={`text-lg font-semibold ${isValid ? 'text-white' : 'text-gray-500'}`}>Log In</Text>
          </TouchableOpacity>

          {errorMessage && (
            <Text className='text-center text-red-600 font-medium mb-4'>{errorMessage}</Text>
          )}

          <View className='items-center mb-6'>
            <Text className='text-gray-600'>Don't have an account <Text onPress={() => navigation.navigate(AuthRoutes.SignUp)} className='text-teal-600 font-medium'>Sign Up</Text> </Text>
          </View>

          <View className='border-t border-gray-100 pt-4'>
            <Text className='text-gray-500 text-sm leading-5 '>
              When you "Log In" yoy agree to Meetup's{" "}
              <Text className='text-teal-600 underline'>Terms of Services</Text>.
              we will manage information about you as described on our {" "}
              <Text className='text-teal-600 underline'>Privacy Policy</Text>,
              and <Text className='text-teal-600 underline'> Cookie Policy</Text>.
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})