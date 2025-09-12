import { View, Text, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import { Center } from '@/components/ui/center'
import { Heading } from '@/components/ui/heading'
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { HStack } from '@/components/ui/hstack'
import { Accordion, AccordionContent, AccordionContentText, AccordionHeader, AccordionIcon, AccordionItem, AccordionTitleText, AccordionTrigger } from '@/components/ui/accordion'
import { Bell, Box, ChevronDownIcon, ChevronUpIcon, Search } from 'lucide-react-native'
import { Divider } from '@/components/ui/divider'
import { VStack } from '@/components/ui/vstack'
import { useAppSelector } from '@/src/redux/hooks'
import { useNavigation } from '@react-navigation/native'
const HeadingSection = () => {
    const { width, height } = Dimensions.get("screen")
    const user = useAppSelector((state) => state.user)
    const navigation = useNavigation()
    return (
        <HStack className='justify-between items-center p-5 rounded-xl' style={{ backgroundColor: "#272727" }}>
            <HStack className='gap-5 items-center'>
                <Avatar size="lg">
                    <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                    <AvatarImage
                        source={{
                            uri: 'https://picsum.photos/1000',
                        }}
                    />
                </Avatar>
                <VStack className='gap-2'>
                    <Text className='text-xl text-gray-500 font-bold'>Hey,</Text>
                    <Text className='text-2xl font-bold text-white'>{user.username}</Text>
                </VStack>
            </HStack>
            <HStack className='gap-5'>
                <Search size={28} color={"white"} onPress={() => navigation.navigate("HomeStack", { screen: "HomeTabs", params: { screen: "Search" } })} />
                <Bell size={28} color={"white"} />
            </HStack>
        </HStack>
    )
}

export default HeadingSection