import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feather from 'react-native-vector-icons/Feather'

type FormValues = {
  name: string,
  email: string,
  password: string,
  location: string,
  isAdult: boolean,
  captcha: boolean
}

const SignUpScreen = () => {

  const { control, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      location: 'Karachi Pakistan',
      isAdult: false,
      captcha: false
    },
    mode: "onChange"
  })

  const { errors, isValid } = formState
  const password = watch('password', "")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrroMessage] = useState<string | null>(null)

  const passwordBars = useMemo(() => {
    const len = password.length;
    const thresholds = [3, 6, 8, 10]
    return thresholds.map((t) => len >= t)
  }, [password])

  return (
    <SafeAreaView className='flex-1 bg-[#fbfbfb]'>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{
          padding: 20
        }}>
          <View className='items-center mb-6'>
            <View className='w-16 h-16 rounded-full bg-pink-400 items-center justify-center mb-3'>
              <Text className='text-white font-bold text-xl'>m</Text>
            </View>
            <Text className='text-3xl font-extrabold text-gray-900'>Finish signing up</Text>
          </View>

          <View className='mb-4'>
            <Text className='text-base font-semibold text-gray-900 mb-2'>Your Name</Text>
            <Controller
              control={control}
              name='name'
              rules={{ required: 'Name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className='bg-white rounded-xl border border-gray-300 p-2.5'>
                  <TextInput
                    placeholder='Your full name'
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholderTextColor={'#9ca3af'}
                  />
                </View>
              )}
            />
            {errors.name ? (
              <Text className='text-sm text-red-600 mt-2'>{errors?.name?.message}</Text>
            ) : (
              <Text className='text-sm text-gray-500 mt-2'>Your name will be public in your Meetup Profile</Text>
            )}
          </View>

          <View className='mb-4'>
            <Text className='text-base font-semibold text-gray-900 mb-2'>Your Email Address</Text>
            <Controller
              control={control}
              name='email'
              rules={{
                required: 'email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid Email',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className='bg-white rounded-xl border border-gray-300 p-2.5'>
                  <TextInput
                    placeholder='example@gmail.com'
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholderTextColor={'#9ca3af'}
                    keyboardType='email-address'
                    autoCapitalize='none'
                  />
                </View>
              )}
            />
            {errors.email ? (
              <Text className='text-sm text-red-600 mt-2'>{errors?.email?.message}</Text>
            ) : (
              <Text className='text-sm text-gray-500 mt-2'>we'll use your email to send you updates and to verify your account</Text>
            )}
          </View>

          <View className='mb-4'>
            <Text className='text-base font-semibold text-gray-900 mb-2'>Your Password</Text>
            <Controller
              control={control}
              name='password'
              rules={{
                required: 'password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className='bg-white flex-row rounded-xl border border-gray-300 p-2.5'>
                  <TextInput
                    placeholder='password'
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholderTextColor={'#9ca3af'}
                    className='flex-1'
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                    <Feather
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={'#111827'} />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password ? (
              <Text className='text-sm text-red-600 mt-2'>{errors?.password?.message}</Text>
            ) : (
              <Text className='text-sm text-gray-500 mt-2'>At least 10 characters are required</Text>
            )}
            <View className='flex-row items-center justify-between mt-3 mb-1'>
              {
                passwordBars?.map((filled, i) => (
                  <View key={i} className={`h-2 rounded-full flex-1 mx-1 ${filled ? 'bg-green-400' : 'bg-gray-200'}`} />
                ))
              }
            </View>
          </View>

          <View className='mb-4'>
            <Text className='text-base font-semibold text-gray-900 mb-2'>Location</Text>
            <Controller
              control={control}
              name='location'
              rules={{
                required: 'Location is required',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className='bg-white flex-row rounded-xl border border-gray-300 p-2.5'>
                  <Text className='mr-3 text-xl'>📍</Text>
                  <TextInput
                    placeholder=''
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholderTextColor={'#9ca3af'}
                    className='flex-1 text-base'
                  />
                </View>
              )}
            />
            {errors.location ? (
              <Text className='text-sm text-red-600 mt-2'>{errors?.location?.message}</Text>
            ) : (
              <Text className='text-sm text-gray-500 mt-2'>we'll use your location to show Meetup event near you</Text>
            )}
          </View>

          <View className='flex-row items-start mb-4'>
            <Controller
              control={control}
              name='isAdult'
              rules={{
                validate: (v) => v == true || 'You must be 18 years or older'
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity onPress={() => onChange(!value)}
                    className={`w-6 h-6 rounded-sm mr-3 items-center justify-center border ${value ? 'bg-teal-600' : 'border-r-gray-500'}`}>
                    {value ? <Text>✅</Text> : null}
                  </TouchableOpacity>
                  <View className='flex-1'>
                    <Text className='font-semibold text-gray-900'>I am 18 years of age or older</Text>
                    {errors?.isAdult ? (
                      <Text className='text-sm text-red-600 mt-1'>{errors?.isAdult?.message}</Text>
                    ) : (
                      null
                    )}
                  </View>
                </>
              )}
            />
          </View>

          <View className=' mb-6'>
            <Controller
              control={control}
              name='captcha'
              rules={{
                validate: (v) => v == true || 'Please confirm reCAPTCHA'
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity onPress={() => onChange(!value)} className='rounded-md border border-gray-300 p-3 bg-white'>
                    <View className='flex-row items-center'>
                      <View className={`w-6 h-6 mr-3 border ${value ? 'bg-teal-600' : 'border-gray-300'} `} />
                      <Text className='text-base'>I am not a Robot</Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            />
            {errors?.captcha ? (
              <Text className='text-red-600 mt-2 text-sm'>{errors?.captcha?.message}</Text>
            ) : (
              null
            )}
          </View>

          <TouchableOpacity className={`py-4 rounded-full mb-4 items-center ${isValid ? 'bg-gray-900' : 'bg-gray-200'}`}>
            <Text>Sign Up</Text>
          </TouchableOpacity>

          {errorMessage && (
            <Text className='text-red-600 text-center mb-4'>{errorMessage}</Text>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({})