import { Text } from '@react-navigation/elements';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { AuthContext } from '../../../auth/authContext';
import { useNavigation } from '@react-navigation/native';
import HeadingSection from '../../../components/HomeComponents/HeadingSection';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import Post from '@/src/components/HomeComponents/Post';
import { VStack } from '@/components/ui/vstack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IPost } from '@/src/models/PostModel';
import { Spinner } from '@/components/ui/spinner';
import AsyncStorage from "@react-native-async-storage/async-storage"
export function Home() {
  const insets = useSafeAreaInsets()
  const [postFeed, setPostFeed] = useState<IPost[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1)
  const [loadingMore, setLoadingMore] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1)
    setPostFeed([])
    await getPosts();
    setRefreshing(false);
  }, []);
  const getToken = async () => {
    const token = await AsyncStorage.getItem("token")
    return token
  }
  const getPosts = async () => {
    if (loadingMore) return
    setLoadingMore(true)
    try {
      const token = await getToken()
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
      setPostFeed((prev) => [...prev, ...posts.data]);
      setPage(prev => prev + 1)
      if (page === posts.totalPages) {
        setLoadingMore(false)
      }
    } catch (error) {
      console.log("error!", error)
    } finally {
      setLoadingMore(false)
    }
  }
  useEffect(() => {
    (async () => {
      await getPosts()
    })()
  }, [])
  return (
    <View style={{ flex: 1, backgroundColor: "#17181c" }}>
      <FlatList data={postFeed} keyExtractor={(item) => item._id}
        ListHeaderComponent={HeadingSection}
        contentContainerStyle={{ paddingTop: insets.top * 1.4, padding: 20, paddingBottom: insets.bottom * 0.4 }}
        renderItem={({ item }) =>
          <Post
            post={item}
          />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={getPosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <Spinner size="large" color="grey" />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
