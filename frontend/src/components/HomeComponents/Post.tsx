import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { memo, useState } from 'react'
import { HStack } from '@/components/ui/hstack'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { VStack } from '@/components/ui/vstack'
import { EllipsisVertical, Heart, MessageCircle } from 'lucide-react-native'
import { IPost } from '@/src/models/PostModel'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Post = ({ post }: { post: IPost }) => {
    const { width, height } = Dimensions.get("screen")
    const [like, setLike] = useState<number>(post.likeCount)
    const getToken = async () => {
        const token = await AsyncStorage.getItem("token")
        return token
    }
    const handleLike = async () => {
        try {
            const token = await getToken()
            await fetch(`http://192.168.1.76:5000/post/${post._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => res.json()).then(data => setLike(data.like))
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <VStack className='p-5 gap-5 self-center mt-5 rounded-2xl' style={{ width: width * 0.9, backgroundColor: "#27292d" }}>
            <HStack className='justify-between items-center'>
                <HStack className='justify-center items-center gap-5'>
                    <Avatar size="md">
                        <AvatarFallbackText>{post.username}</AvatarFallbackText>
                        <AvatarImage
                            source={require("../../assets/favicon.png")}
                        />
                    </Avatar>
                    <VStack>
                        <Text className='font-bold text-xl text-white '>{post.username}</Text>
                    </VStack>
                </HStack>
                <EllipsisVertical color={"white"} />
            </HStack>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{post.title}</Text>
            <Image source={{ uri: "https://picsum.photos/1000" }} style={{ height: height * 0.25, borderRadius: 15, }} />
            <Text className='text-white'>{post.body}</Text>
            <HStack className='items-center gap-4'>
                <TouchableOpacity onPress={handleLike}>
                    <HStack className='items-center justify-center gap-2 p-3 rounded-3xl' style={{ backgroundColor: "#363538", borderWidth: 0.2, borderColor: "gray" }}>
                        <Heart color={"gray"} size={24} />
                        <Text style={{ color: "gray" }} className='text-xl font-bold'>{like}</Text>
                    </HStack>
                </TouchableOpacity>
                <HStack className='items-center justify-center gap-2 p-3 rounded-3xl' style={{ backgroundColor: "#363538", borderWidth: 0.2, borderColor: "gray" }}>
                    <MessageCircle color={"gray"} size={24} />
                    <Text style={{ color: "gray" }} className='text-xl font-bold'>{post.commentCount}</Text>
                </HStack>
            </HStack>
        </VStack>
    )
}

export default memo(Post)