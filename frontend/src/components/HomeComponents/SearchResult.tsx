import { View, Text, Image, Dimensions } from 'react-native'
import React from 'react'
import { HStack } from '@/components/ui/hstack'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { VStack } from '@/components/ui/vstack'
import { EllipsisVertical, Heart, MessageCircle } from 'lucide-react-native'
const SearchResult = ({ username, body, title }: { username: string, body: string, title:string }) => {
    const { width, height } = Dimensions.get("screen")
    return (
        <VStack className='p-5 gap-3 self-center mt-5 rounded-2xl' style={{ width: width * 0.9, backgroundColor: "#27292d" }}>
            <HStack className='justify-between items-center'>
                <HStack className='justify-center items-center gap-5'>
                    <Avatar size="md">
                        <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                        <AvatarImage
                            source={require("../../assets/favicon.png")}
                        />
                    </Avatar>
                    <VStack>
                        <Text className='font-bold text-xl text-white '>{username}</Text>
                    </VStack>
                </HStack>
            </HStack>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{title}</Text>
            <HStack className='gap-4'>
                <Image source={{ uri: "https://picsum.photos/1000" }} style={{ height: height * 0.1, borderRadius: 5, width: "40%" }} />
                <Text className='text-white' style={{ width: "60%" }}>{body}</Text>
            </HStack>
        </VStack>
    )
}

export default SearchResult