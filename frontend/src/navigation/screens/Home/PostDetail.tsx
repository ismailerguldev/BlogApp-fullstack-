import { View, Text } from 'react-native'
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
        <Center style={{ backgroundColor: "#17181c", flex: 1 }}>
            <Post
                post={post} />
        </Center>
    )
}

export default BlogDetail