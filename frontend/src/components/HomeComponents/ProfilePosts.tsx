import { View, Text, Image, Dimensions } from 'react-native'
import React from 'react'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'

const ProfilePosts = () => {
    const { width, height } = Dimensions.get("screen")
    return (
        <VStack className='p-5 gap-3 self-center mt-5 rounded-2xl' style={{ width: width * 0.9, backgroundColor: "#27292d" }}>
            <HStack className='gap-4'>
                <Image source={{ uri: "https://picsum.photos/1000" }} style={{ height: height * 0.1, borderRadius: 5, width: "40%" }} />
                <Text className='text-white' style={{ width: "60%" }}> Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugitdeserunt minus iusto praesentium sapiente. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed, modi. </Text>
            </HStack>
        </VStack>
    )
}

export default ProfilePosts