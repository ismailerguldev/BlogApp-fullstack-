import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { memo, useState } from 'react'
import { HStack } from '@/components/ui/hstack'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { VStack } from '@/components/ui/vstack'
import { EllipsisVertical, EyeOff, Heart, MessageCircle, Pencil, Trash2, X } from 'lucide-react-native'
import { IPost } from '@/src/models/PostModel'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    Actionsheet,
    ActionsheetContent,
    ActionsheetItem,
    ActionsheetItemText,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
    AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';
import { Heading } from '@/components/ui/heading'
import { Button, ButtonText } from '@/components/ui/button';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppSelector } from '@/src/redux/hooks'
const Post = ({ post }: { post: IPost }) => {
    const { width, height } = Dimensions.get("screen")
    const [like, setLike] = useState<number>(post.likeCount)
    const [showDetails, setShowDetails] = useState(false);
    const [isEditable, setIsEditable] = useState(false)
    const [currentTitle, setCurrentTitle] = useState(post.title)
    const [currentBody, setCurrentBody] = useState(post.body)
    const [tempTitle, setTempTitle] = useState<string>(currentTitle)
    const [tempBody, setTempBody] = useState<string>(currentBody)
    const [showSure, setShowSure] = useState<boolean>(false)
    const username = useAppSelector((state) => state.user.username)
    const insets = useSafeAreaInsets()
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
    const updatePost = async () => {
        const token = await AsyncStorage.getItem("token") as string
        try {
            await fetch(`http://192.168.1.76:5000/post/${post._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title: currentTitle, body: currentBody })
            }).then((res) => {
                if (!res.ok) {
                    console.error(res.text())
                    return
                }
                return res.json()
            }
            )
                .then(data => console.log(data)).catch(error => console.error(error))
        } catch (error) {
            throw new Error(`an error occured while updating post, ${error}`)
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
                <HStack>
                    {
                        isEditable && <TouchableOpacity onPress={() => {
                            setTempTitle(currentTitle)
                            setTempBody(currentBody)
                            setIsEditable(false)
                        }
                        }>
                            <X color={"red"} />
                        </TouchableOpacity>
                    }
                    {
                        post.username === username && <TouchableOpacity onPress={() => setShowDetails(true)}>
                            <EllipsisVertical color={"white"} />
                        </TouchableOpacity>
                    }
                </HStack>
                <Actionsheet isOpen={showDetails} onClose={() => setShowDetails(false)}>
                    <ActionsheetBackdrop />
                    <ActionsheetContent style={{ paddingBottom: insets.bottom * 1.2 }}>
                        <ActionsheetDragIndicatorWrapper>
                            <ActionsheetDragIndicator />
                        </ActionsheetDragIndicatorWrapper>
                        <ActionsheetItem onPress={() => { setIsEditable(true); setShowDetails(false) }}>
                            <Pencil color={"white"} size={17} />
                            <ActionsheetItemText>Edit Post</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => setShowDetails(false)}>
                            <EyeOff color={"white"} size={20} />
                            <ActionsheetItemText>Set private</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem isDisabled onPress={() => setShowDetails(false)}>
                            <Trash2 color={"red"} size={20} />
                            <ActionsheetItemText>Delete Post</ActionsheetItemText>
                        </ActionsheetItem>
                    </ActionsheetContent>
                </Actionsheet>
            </HStack>
            <TextInput editable={isEditable} maxLength={35} onChangeText={(text) => setTempTitle(text)}>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{tempTitle}</Text>
            </TextInput>
            <Image source={{ uri: "https://picsum.photos/1000" }} style={{ height: height * 0.25, borderRadius: 15, }} />
            <TextInput editable={isEditable} multiline maxLength={230} onChangeText={(text) => setTempBody(text)}>
                <Text className='text-white'>{tempBody}</Text>
            </TextInput>
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
            {
                isEditable &&
                <TouchableOpacity onPress={() => {
                    setCurrentTitle(tempTitle)
                    setCurrentBody(tempBody)
                    setShowSure(true)

                }} style={{ width: width * 0.6, justifyContent: "center", alignItems: "center", backgroundColor: "#2E2E2E", borderRadius: 5, alignSelf: "center", padding: 15 }}>
                    <Text style={{ color: "white" }}>Save Changes</Text>
                </TouchableOpacity>
            }
            <AlertDialog isOpen={showSure} onClose={() => setShowSure(false)} size="md">
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading className="text-typography-950 font-semibold" size="md">
                            Are you sure you want to update this post?
                        </Heading>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={() => setShowSure(false)}
                            size="sm"
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button size="sm" onPress={async () => {
                            await updatePost()
                            setShowSure(false)
                        }}>
                            <ButtonText>Update</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </VStack>
    )
}

export default memo(Post)