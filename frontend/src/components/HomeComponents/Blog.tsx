import { View, Text, Image, Dimensions } from 'react-native'
import React, { memo } from 'react'
import { HStack } from '@/components/ui/hstack'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { VStack } from '@/components/ui/vstack'
import { EllipsisVertical, Heart, MessageCircle } from 'lucide-react-native'
import { IPost } from '@/src/models/PostModel'
const Blog = ({ username, title, body, commentCount, likeCount, createdAt }: IPost) => {
    const { width, height } = Dimensions.get("screen")
    return (
        <VStack className='p-5 gap-5 self-center mt-5 rounded-2xl' style={{ width: width * 0.9, backgroundColor: "#27292d" }}>
            <HStack className='justify-between items-center'>
                <HStack className='justify-center items-center gap-5'>
                    <Avatar size="md">
                        <AvatarFallbackText>{username}</AvatarFallbackText>
                        <AvatarImage
                            source={require("../../assets/favicon.png")}
                        />
                    </Avatar>
                    <VStack>
                        <Text className='font-bold text-xl text-white '>{username}</Text>
                        {/* <Text className='font-bold text-lg text-gray-400'>{createdAt.toLocaleDateString("en-US", { timeZone: "UTC", hourCycle: 'h24', })}</Text> */}
                    </VStack>
                </HStack>
                <EllipsisVertical color={"white"} />
            </HStack>
            <Image source={{ uri: "https://picsum.photos/1000" }} style={{ height: height * 0.25, borderRadius: 15, }} />
            <Text className='text-white'>{body}</Text>
            <HStack className='items-center gap-4'>
                <HStack className='items-center justify-center gap-2 p-3 rounded-3xl' style={{ backgroundColor: "#363538", borderWidth: 0.2, borderColor: "gray" }}>
                    <Heart color={"gray"} size={24} />
                    <Text style={{ color: "gray" }} className='text-xl font-bold'>{likeCount}</Text>
                </HStack>
                <HStack className='items-center justify-center gap-2 p-3 rounded-3xl' style={{ backgroundColor: "#363538", borderWidth: 0.2, borderColor: "gray" }}>
                    <MessageCircle color={"gray"} size={24} />
                    <Text style={{ color: "gray" }} className='text-xl font-bold'>{commentCount}</Text>
                </HStack>
            </HStack>
        </VStack>
    )
}

export default memo(Blog)