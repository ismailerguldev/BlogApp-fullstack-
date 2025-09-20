import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView, FlatList } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { HStack } from '@/components/ui/hstack'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { VStack } from '@/components/ui/vstack'
import { EllipsisVertical, EyeOff, Heart, MessageCircle, Pencil, SendHorizonal, Trash2, X } from 'lucide-react-native'
import { IPost } from '@/src/models/PostModel'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LogBox } from "react-native";

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
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading'
import { Button, ButtonText } from '@/components/ui/button';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks'
import { useNavigation } from '@react-navigation/native'
import { incPost } from '@/src/redux/slices/userSlice'
import { CloseIcon, Icon } from '@/components/ui/icon'
import Comment from './Comment'
import { Box } from '@/components/ui/box'
import { IComment } from '@/src/models/CommentModel'
import { Spinner } from '@/components/ui/spinner'
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
    const [deletePostModal, setDeletePostModal] = useState<boolean>(false)
    const insets = useSafeAreaInsets()
    const [isPrivate, setIsPrivate] = useState<boolean>(post.isPrivate ? true : false)
    const navigation = useNavigation()
    const dispatch = useAppDispatch()
    const [showComments, setShowComments] = useState<boolean>(false)
    const [comment, setComment] = useState<string>("")
    const [postComments, setPostComments] = useState<IComment[]>([])
    const [loadingMore, setLoadingMore] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    LogBox.ignoreLogs([
        "VirtualizedLists should never be nested"
    ]);
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
                .catch(error => console.error(error))
        } catch (error) {
            throw new Error(`an error occured while updating post, ${error}`)
        }
    }
    const handlePrivate = async () => {
        try {
            const token = await getToken()
            await fetch(`http://192.168.1.76:5000/post/${post._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                if (!res.ok) console.error(res.text())
                setIsPrivate(prev => !prev)
                return res.json()
            }).catch(error => console.error(error))
        } catch (error) {
            throw new Error(`an error occured while set private post ${error}`)
        }
    }
    const deletePost = async () => {
        const token = await getToken()
        try {
            await fetch(`http://192.168.1.76:5000/post/${post._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                if (!res.ok) {
                    console.error(res.text())
                    return
                } else {
                    return res
                }
            }).then(() => {
                dispatch(incPost(-1))
                setDeletePostModal(false)
                navigation.goBack()
            }).catch(error => console.error(error))
        } catch (error) {
            console.error("an error occured while deleting post", error)
        }
    }
    const sendComment = async () => {
        try {
            if (comment === "") {
                return
            }
            const token = await getToken()
            await fetch(`http://192.168.1.76:5000/post/${post._id}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ comment, username })
            }).then(() => setComment(""))
        } catch (error) {
            console.log(error)
        }
    }
    const getComments = async () => {
        if (loadingMore) return
        setLoadingMore(true)
        try {
            const token = await getToken()
            const pageSize = 5
            await fetch(`http://192.168.1.76:5000/post/comments/${post._id}/${page}/${pageSize}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then(async (res) => {
                if (!res.ok) {
                    console.log(await res.text())
                    return
                }
                return res.json()
            }).then((comments) => {
                setPostComments((prev) => [...prev, ...comments.data]);
                setPage(prev => prev + 1)
                if (page === comments.totalPages) {
                    setLoadingMore(false)
                }
                setShowComments(true)
            })
        } catch (error) {
            console.log("error!", error)
        } finally {
            setLoadingMore(false)
        }
    }
    return (
        <VStack className='p-5 gap-5 self-center mt-5 rounded-2xl' style={{ width: width * 0.9, backgroundColor: "#27292d" }}>
            <HStack className='justify-between items-center'>
                <TouchableOpacity onPress={() => navigation.navigate("HomeStack", { screen: 'UserProfile', params: { user_id: post.user_id } })}>
                    <HStack className='justify-center items-center gap-5'>
                        <Avatar size="md">
                            <AvatarFallbackText>{post.username}</AvatarFallbackText>
                            <AvatarImage
                                source={{ uri: "https://picsum.photos/1000" }}
                            />
                        </Avatar>
                        <VStack>
                            <Text className='font-bold text-xl text-white '>{post.username}</Text>
                        </VStack>
                    </HStack>
                </TouchableOpacity>
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
                        <ActionsheetItem onPress={handlePrivate}>
                            <EyeOff color={"white"} size={20} />
                            <ActionsheetItemText>{isPrivate ? "Set Un Private" : "Set Private"}</ActionsheetItemText>
                        </ActionsheetItem>
                        <ActionsheetItem onPress={() => setDeletePostModal(true)}>
                            <Trash2 color={"red"} size={20} />
                            <ActionsheetItemText>Delete Post</ActionsheetItemText>
                            <AlertDialog isOpen={deletePostModal} onClose={() => setDeletePostModal(false)} size="md">
                                <AlertDialogBackdrop />
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <Heading className="text-typography-950 font-semibold" size="md">
                                            Are you sure you want to delete this post?
                                        </Heading>
                                    </AlertDialogHeader>
                                    <AlertDialogBody className="mt-3 mb-4">
                                        <Text style={{ fontSize: 14, color: "white" }}>
                                            Deleting the post will remove it permanently and cannot be undone.
                                            Please confirm if you want to proceed.
                                        </Text>
                                    </AlertDialogBody>
                                    <AlertDialogFooter className="">
                                        <Button
                                            variant="outline"
                                            action="secondary"
                                            onPress={() => setDeletePostModal(false)}
                                            size="sm"
                                        >
                                            <ButtonText>Cancel</ButtonText>
                                        </Button>
                                        <Button size="sm" onPress={deletePost}>
                                            <ButtonText>Delete</ButtonText>
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
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
                <TouchableOpacity onPress={async () => await getComments()}>
                    <HStack className='items-center justify-center gap-2 p-3 rounded-3xl' style={{ backgroundColor: "#363538", borderWidth: 0.2, borderColor: "gray" }}>
                        <MessageCircle color={"gray"} size={24} />
                        <Text style={{ color: "gray" }} className='text-xl font-bold'>{post.commentCount}</Text>
                    </HStack>
                </TouchableOpacity>
                <Modal
                    isOpen={showComments}
                    onClose={() => {
                        setShowComments(false);
                    }}
                    size="lg"
                >
                    <ModalBackdrop />
                    <KeyboardAvoidingView behavior='padding' style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <ModalContent style={{ backgroundColor: "#17181c" }}>
                            <ModalHeader style={{ marginBottom: 20, }}>
                                <Heading size="lg">Comments</Heading>
                                <ModalCloseButton>
                                    <Icon as={CloseIcon} />
                                </ModalCloseButton>
                            </ModalHeader>
                            <ModalBody>
                                <FlatList
                                    data={postComments}
                                    keyExtractor={(item) => item._id}
                                    renderItem={({ item }) => <Comment comment={item} />}
                                    contentContainerStyle={{ gap: 20 }}
                                    style={{ width: "100%", height: 400 }}
                                    nestedScrollEnabled
                                    onEndReached={getComments}
                                    onEndReachedThreshold={0}
                                    ListFooterComponent={<Spinner color={"white"} />}
                                />
                            </ModalBody>
                            <ModalFooter style={{ alignItems: "center" }}>
                                <TextInput onChangeText={setComment} placeholder='Your Comment' placeholderTextColor={"gray"} style={{ width: "90%", height: "100%", borderRadius: 20, borderWidth: 1, borderColor: "#a0a0a0", paddingLeft: 20, fontSize: 14, color: "white" }} />
                                <TouchableOpacity onPress={sendComment}>
                                    <SendHorizonal size={24} color={"white"} />
                                </TouchableOpacity>
                            </ModalFooter>
                        </ModalContent>
                    </KeyboardAvoidingView>
                </Modal>
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
        </VStack >
    )
}

export default memo(Post)