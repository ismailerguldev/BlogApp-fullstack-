import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import SearchResult from '@/src/components/HomeComponents/SearchResult';
import { IPost } from '@/src/models/PostModel';
import { useCallback, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import debounce from "lodash.debounce"
export function Search() {
  const insets = useSafeAreaInsets()
  const [result, setResult] = useState<IPost[]>([])
  const debouncedFetch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm === "" || searchTerm.length === 0) {
        setResult([])
        return
      }
      await fetch(`http://192.168.1.76:5000/post/search?search=${searchTerm}`)
        .then(res => res.json()).then(data => setResult(data))
    }, 600), []
  )
  const search = async (searchTerm: string) => {
    try {
      await debouncedFetch(searchTerm)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    //<ScrollView style={{ paddingTop: insets.top * 1.4, paddingLeft: 15, paddingRight: 15, flex: 1, backgroundColor: "#17181c" }} contentContainerStyle={{ gap: 15, paddingBottom: insets.bottom * 1.4, }}>
    <FlatList style={{ paddingTop: insets.top * 1.4, paddingLeft: 15, paddingRight: 15, flex: 1, backgroundColor: "#17181c" }} contentContainerStyle={{ gap: 15, paddingBottom: insets.bottom * 1.4 }} data={result} keyExtractor={(item) => item._id} renderItem={({ item }) =>
      <SearchResult username={item.username} body={item.body} key={item._id} title={item.title} />
    }
      ListHeaderComponent={
        <View>
          <Text style={{ fontSize: 24, color: "white" }}>Search</Text>
          <Center style={{ backgroundColor: "#272727", flex: 1, padding: 7, borderRadius: 15, }}>
            <Input
              variant="disable outline"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
            >
              <InputField placeholder="Enter Text here..." onChangeText={(text) => { search(text) }} />
            </Input>
          </Center>
          <Divider />
        </View>
      }
    />
  );
}

