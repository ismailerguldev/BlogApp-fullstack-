import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { useNavigation } from '@react-navigation/native'
import { Divider } from '@/components/ui/divider'
import { Center } from '@/components/ui/center'
const GreetingPage = () => {
    const { width, height } = Dimensions.get("screen")
    const navigation = useNavigation()
    return (
        <Center className='w-full justify-center items-center h-full gap-9 px-7' style={{backgroundColor:"#17181c"}}>
            <Text style={{ fontSize: 36, fontWeight: "bold", color:"white" }}>Welcome to your Blog!</Text>
            <Divider className="my-0.5 bg-slate-600" />
            <Text className='text-lg text-white'>Share your profound ideas!</Text>
            <Image source={require("../../../assets/GreetingImage.png")} style={{ width: width * 0.9, height: width * 0.9 }} />
            <Button onPress={() => navigation.navigate("AuthStack", { screen: "AuthScreen" })} variant="outline" size="xl" action="primary" className='border-white w-2/3 mt-7'>
                <ButtonText className='text-white'>Get started</ButtonText>
            </Button>
        </Center>
    )
}

export default GreetingPage

const styles = StyleSheet.create({})