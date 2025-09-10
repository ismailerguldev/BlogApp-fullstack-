import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import AddPostPreview from '@/src/components/HomeComponents/AddPostPreview';
import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function AddPost() {
  return (
    <VStack style={styles.container}>
      <Text style={{ fontSize: 24, color: "white" }}>Share a Post!</Text>
      <Divider />
      <AddPostPreview />
      <Text style={{ fontSize: 15, color: "gray" }}>This is what your post will look like after it's shared.</Text>
      <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#3f3f3f", borderRadius: 5, alignSelf: "center", padding: 15, width: "50%" }}>
        <Text style={{ color: "white" }}>Share!</Text>
      </TouchableOpacity>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    backgroundColor: "#17181c",
    padding: 20,
  },
});
