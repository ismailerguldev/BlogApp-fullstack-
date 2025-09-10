import { View, Text, Image, Dimensions, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { HStack } from '@/components/ui/hstack'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { VStack } from '@/components/ui/vstack'
import { EllipsisVertical, Heart, MessageCircle } from 'lucide-react-native'
import { TextareaInput } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppSelector } from '@/src/redux/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
const AddPostPreview = ({ setTitle, setBody, body, title }: any) => {
    const { width, height } = Dimensions.get("screen")
    const [imageLoaded, set] = useState<boolean>(false)
    const user = useAppSelector((state) => state.user)
    return (
        <VStack className='p-5 gap-5 self-center mt-5 rounded-2xl' style={{ width: width * 0.9, backgroundColor: "#27292d" }}>
            <HStack className='justify-between items-center'>
                <HStack className='justify-center items-center gap-5'>
                    <Avatar size="md">
                        <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                        <AvatarImage
                            source={require("../../assets/favicon.png")}
                        />
                    </Avatar>
                    <VStack>
                        <Text className='font-bold text-xl text-white '>{user.username}</Text>
                        <Text className='font-bold text-lg text-gray-400'>When uploaded</Text>
                    </VStack>
                </HStack>
                <EllipsisVertical color={"white"} />
            </HStack>
            <TextInput maxLength={35} onChangeText={(text) => setTitle(text)}>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{title}</Text>
            </TextInput>
            {
                imageLoaded ? <Image source={{ uri: "https://picsum.photos/1000" }} style={{ height: height * 0.25, borderRadius: 15, }} /> : <Skeleton speed={15} variant="sharp" style={{ height: height * 0.25, borderRadius: 15 }} />
            }
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <TextInput maxLength={230} multiline onChangeText={(text) => setBody(text)}>
                    <Text className='text-white'>{body}</Text>
                </TextInput>
            </TouchableWithoutFeedback>
            <HStack className='items-center gap-4'>
                <HStack className='items-center justify-center gap-2 p-3 rounded-3xl' style={{ backgroundColor: "#363538", borderWidth: 0.2, borderColor: "gray" }}>
                    <Heart color={"gray"} size={24} />
                    <Text style={{ color: "gray" }} className='text-xl font-bold'>5</Text>
                </HStack>
                <HStack className='items-center justify-center gap-2 p-3 rounded-3xl' style={{ backgroundColor: "#363538", borderWidth: 0.2, borderColor: "gray" }}>
                    <MessageCircle color={"gray"} size={24} />
                    <Text style={{ color: "gray" }} className='text-xl font-bold'>7</Text>
                </HStack>
            </HStack>
        </VStack>
    )
}

export default AddPostPreview