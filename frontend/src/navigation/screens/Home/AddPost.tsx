import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import AddPostPreview from '@/src/components/HomeComponents/AddPostPreview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text/';
export function AddPost() {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showAlertDialog2, setShowAlertDialog2] = useState(false)
  const handleClose = () => setShowAlertDialog(false);
  const handleClose2 = () => setShowAlertDialog2(false)
  const [title, setTitle] = useState<string>("Lorem ipsum dolor sit amet!")
  const [body, setBody] = useState<string>("Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis odit labore sapiente deserunt. Repellat placeat facilis quod, blanditiis sed possimus, nesciunt necessitatibus neque repudiandae, sequi ut beatae eveniet enim maxime")
  const addPost = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      await fetch("http://192.168.1.76:5000/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, body })
      }).then(() => {
        setShowAlertDialog(false)
        setShowAlertDialog2(true)
      })
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
  return (
    <VStack style={styles.container}>
      <Text style={{ fontSize: 24, color: "white" }}>Share a Post!</Text>
      <Divider />
      <AddPostPreview title={title} body={body} setTitle={setTitle} setBody={setBody} />
      <TouchableOpacity onPress={() => setShowAlertDialog(true)} style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#3f3f3f", borderRadius: 5, alignSelf: "center", padding: 15, width: "50%" }}>
        <Text style={{ color: "white" }}>Share!</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 15, color: "gray" }}>This is what your post will look like after it's shared.</Text>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="lg">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Are you sure you want to share this post?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogFooter className="">
            <Button
              variant="outline"
              action="secondary"
              onPress={handleClose}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={() => addPost()}>
              <ButtonText>Share</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog isOpen={showAlertDialog2} onClose={handleClose2} size="lg">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Your post shared successfully!
            </Heading>
          </AlertDialogHeader>
          <AlertDialogFooter className="">
            <Button size="sm" onPress={handleClose2}>
              <ButtonText>Close</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
