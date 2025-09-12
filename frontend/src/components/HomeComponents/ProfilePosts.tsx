import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { useNavigation } from '@react-navigation/native'
import { IPost } from '@/src/models/PostModel'

const ProfilePosts = ({ post }: { post: IPost }) => {
    const { width, height } = Dimensions.get("screen")
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={() => (
            navigation.navigate("HomeStack", {
                screen: "BlogDetail",
                params: {
                    Post: post
                }
            })
        )}>
            <VStack className='p-5 gap-3 self-center mt-5 rounded-2xl' style={{ width: width * 0.9, backgroundColor: "#27292d" }}>
                <HStack className='gap-4 justify-center items-center'>
                    <Image source={{ uri: "https://picsum.photos/1000" }} style={{ height: height * 0.1, borderRadius: 5, width: "40%" }} />
                    <Text className='text-white' style={{ width: "60%" }}>{post.body}</Text>
                </HStack>
            </VStack>
        </TouchableOpacity>
    )
}

export default ProfilePosts