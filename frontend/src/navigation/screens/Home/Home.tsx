import { Text } from '@react-navigation/elements';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Dimensions, FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { AuthContext } from '../../../auth/authContext';
import { useNavigation } from '@react-navigation/native';
import HeadingSection from '../../../components/HomeComponents/HeadingSection';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import Blog from '@/src/components/HomeComponents/Blog';
import { VStack } from '@/components/ui/vstack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IPost } from '@/src/models/PostModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
export function Home() {
  const insets = useSafeAreaInsets()
  const { width } = Dimensions.get("screen")
  const [token, setToken] = useState<string>()
  const [postFeed, setPostFeed] = useState<IPost[]>()
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    await getToken()
    setRefreshing(true);
    await getPosts();
    setRefreshing(false);
  }, []);
  const getToken = async () => {
    const token = await AsyncStorage.getItem("token")
    setToken(token!)
  }
  const getPosts = async () => {
    try {
      const page = 1
      const pageSize = 5
      const res = await fetch(`http://192.168.1.76:5000/post/getPosts/${page}/${pageSize}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      if (!res.ok) {
        console.log(await res.text())
        return
      }
      const posts = await res.json()
      setPostFeed(posts.data)
    } catch (error) {
      console.log("error!", error)
    }
  }
  useEffect(() => {
    (async () => {
      await getToken()
    })()
  }, [])
  useEffect(() => {
    if (token) {
      getPosts();
    }
  }, [token]);
  return (
    // <ScrollView style={{ paddingTop: insets.top, padding: 20, backgroundColor: "#17181c", }} contentContainerStyle={{ paddingBottom: insets.bottom }}>
    <View style={{ flex: 1, backgroundColor: "#17181c" }}>
      <FlatList data={postFeed} keyExtractor={(item) => item._id}
        ListHeaderComponent={HeadingSection}
        contentContainerStyle={{ paddingTop: insets.top * 1.4, padding: 20, paddingBottom: insets.bottom * 0.4 }}
        renderItem={({ item }) =>
          <Blog
            createdAt={item.createdAt}
            body={item.body}
            commentCount={item.commentCount}
            likeCount={item.likeCount}
            _id={item._id}
            title={item.title}
            username={item.username}
          />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
    // </ScrollView >
  );
}
