import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import ProfilePosts from '@/src/components/HomeComponents/ProfilePosts';
import { Text } from '@/components/ui/text';
import { StaticScreenProps } from '@react-navigation/native';
import { HomeIcon, Lock, LogOut, Menu, ShoppingCart, User, Wallet } from 'lucide-react-native';
import { memo, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Pressable } from '@/components/ui/pressable';
import { Home } from './Home';
import { useAppSelector } from '@/src/redux/hooks';
type Props = StaticScreenProps<{
  user: string;
}>;
 function Profile({ route }: Props) {
  const { width, height } = Dimensions.get("screen")
  const { top, bottom } = useSafeAreaInsets()
  const [showDrawer, setShowDrawer] = useState(false);
  const user = useAppSelector((state) => state.user)
  return (
    <ScrollView style={{ backgroundColor: "#17181c", flex: 1 }} contentContainerStyle={{ paddingBottom: bottom * 0.1 }}>
      <VStack style={{ alignItems: "center", gap: 20, padding: 15, paddingTop: top * 1.4, }}>
        <Center className='w-full'>
          <Box style={{ width: 105, height: 105, backgroundColor: "#272727", position: "absolute", borderRadius: 60 }} />
          <Image source={{ uri: "https://picsum.photos/1000" }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          <Menu color={"white"} size={30} style={{ position: "absolute", right: 0, top: 0 }} onPress={() => setShowDrawer(true)} />
          <Drawer
            isOpen={showDrawer}
            onClose={() => {
              setShowDrawer(false);
            }}
            anchor={"right"}
          >
            <DrawerBackdrop />
            <DrawerContent className="w-[270px] md:w-[300px]" style={{ paddingTop: top * 1.4, paddingBottom: bottom * 1.3 }}>
              <DrawerHeader className="justify-center flex-col gap-2">
                <VStack className="justify-center items-center">
                  <Text size="lg">{user.username}</Text>
                  <Text size="sm" className="text-typography-600">
                    {user.email}
                  </Text>
                </VStack>
              </DrawerHeader>
              <Divider className="my-4" />
              <DrawerBody contentContainerClassName="gap-2">
                <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
                  <Icon as={User} size="lg" className="text-typography-600" />
                  <Text>Change Username</Text>
                </Pressable>
                <Pressable className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
                  <Icon as={Lock} size="lg" className="text-typography-600" />
                  <Text>Change Password</Text>
                </Pressable>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  className="w-full gap-2"
                  variant="outline"
                  action="secondary"
                >
                  <ButtonText>Logout</ButtonText>
                  <ButtonIcon as={LogOut} />
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Center>
        <Text style={{ color: "white", fontSize: 16, }}>{user.username}</Text>
        <HStack className='w-full' style={{ justifyContent: "space-around", padding: 15, backgroundColor: "#27292d", borderRadius: 15, }}>
          <VStack style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 16, }}>{user.totalPost}</Text>
            <Text style={{ color: "white", fontSize: 16, }}>Posts</Text>
          </VStack>
          <VStack style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 16, }}>{user.followers}</Text>
            <Text style={{ color: "white", fontSize: 16, }}>Followers</Text>
          </VStack>
          <VStack style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 16, }}>{user.followings}</Text>
            <Text style={{ color: "white", fontSize: 16, }}>Followings</Text>
          </VStack>
          <VStack style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 16, }}>{user.likeCount}</Text>
            <Text style={{ color: "white", fontSize: 16, }}>Likes</Text>
          </VStack>
        </HStack>
        <TouchableOpacity style={{ width: width * 0.6, justifyContent: "center", alignItems: "center", backgroundColor: "#2E2E2E", borderRadius: 5, alignSelf: "center", padding: 15 }}>
          <Text style={{ color: "white" }}>Follow</Text>
        </TouchableOpacity>
        <Divider />
        <VStack>
          <ProfilePosts />
          <ProfilePosts />
          <ProfilePosts />
          <ProfilePosts />
          <ProfilePosts />
          <ProfilePosts />
          <ProfilePosts />
          <ProfilePosts />
          <ProfilePosts />
          <ProfilePosts />
        </VStack>
      </VStack>
    </ScrollView >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
export default memo(Profile)
