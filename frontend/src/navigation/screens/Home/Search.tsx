import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import SearchResult from '@/src/components/HomeComponents/SearchResult';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Search() {
  const insets = useSafeAreaInsets()
  return (
    <ScrollView style={{ paddingTop: insets.top * 1.4, paddingLeft: 15, paddingRight: 15, flex: 1, backgroundColor: "#17181c" }} contentContainerStyle={{ gap: 15, paddingBottom: insets.bottom * 1.4, }}>
      <Text style={{ fontSize: 24, color: "white" }}>Search</Text>
      <Center style={{ backgroundColor: "#272727", flex: 1, padding: 7, borderRadius: 15, }}>
        <Input
          variant="disable outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputField placeholder="Enter Text here..." />
        </Input>
      </Center>
      <Divider />
      <VStack>
        <SearchResult />
        <SearchResult />
        <SearchResult />
        <SearchResult />
      </VStack>
    </ScrollView>
  );
}

