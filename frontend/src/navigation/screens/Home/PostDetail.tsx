import { View, Text, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { StaticScreenProps } from '@react-navigation/native';
import { Center } from '@/components/ui/center';
import Post from '@/src/components/HomeComponents/Post';
import { IPost } from '@/src/models/PostModel';

type Props = StaticScreenProps<{
    Post: IPost;
}>;
const BlogDetail = ({ route }: Props) => {
    const post = route.params.Post
    return (
        <KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor: "#17181c", justifyContent:"center", alignItems:"center" }}>
                <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>Your Post Detail</Text>
                <Post
                    post={post} />
        </KeyboardAvoidingView>
    )
}

export default BlogDetail