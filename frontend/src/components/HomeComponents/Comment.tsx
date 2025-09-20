import { View, Text, Image } from 'react-native'
import React from 'react'
import { VStack } from '@/components/ui/vstack'
import { HStack } from '@/components/ui/hstack'
import { Divider } from '@/components/ui/divider'
import { IComment } from '@/src/models/CommentModel'

const Comment = ({ comment }: { comment: IComment }) => {
    return (
        <VStack style={{ width: "100%", height: 140, gap: 10, padding: 5 }}>
            <HStack style={{ alignItems: "center", gap: 10 }}>
                <Image source={{ uri: "https://picsum.photos/1000" }} style={{ width: 50, height: 50, borderRadius: 25, }} />
                <Text style={{ color: "white", fontSize: 16, }}>{comment.username}</Text>
            </HStack>
            <Text style={{ color: "white" }}>
                {comment.commentText}
            </Text>
            <Divider />
        </VStack>
    )
}

export default Comment