import { useContext, useState } from 'react';
import { Dimensions, StyleSheet, View, Text, Image, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from '../../../auth/authContext';
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { AlertCircleIcon, LockIcon, MailIcon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Center } from '@/components/ui/center';
import { TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { User } from "lucide-react-native"
import { useNavigation } from '@react-navigation/native';
export function AuthScreen() {
  const { width, height } = Dimensions.get("screen")
  const { signIn } = useContext(AuthContext)
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isInvalid, setIsInvalid] = useState<boolean>(false)
  const [isSignUp, setIsSignUp] = useState<boolean>(true)
  const navigation = useNavigation()
  const logIn = async () => {
    await signIn(email, password).then((data) => navigation.navigate("AuthStack", { screen: "EmailVerificationScreen", params: { user_id: data.user_id } })).catch(error => console.log(error))
  }
  return (
    <Center className='w-full h-full' style={{ backgroundColor: "#17181c" }}>
      <KeyboardAvoidingView behavior='padding'>
        <VStack className='gap-10 justify-center items-center'>
          <VStack className='gap-4 justify-center items-center'>
            <Image source={require("../../../assets/favicon.png")} style={{ width: 60, height: 60 }} />
            <Heading className='text-white text-4xl'>Welcome</Heading>
            <Heading className='text-2xl' style={{ color: "gray" }}>Sign {isSignUp ? "Up" : "In"} to enter world!</Heading>
          </VStack>
          <FormControl
            isInvalid={isInvalid}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
            className='gap-5 mt-7 p-6'
            style={{ width: width * 0.85, backgroundColor: "#27292d", borderRadius: 20 }}
          >
            <VStack className='gap-2'>
              {
                isSignUp && <Box>
                  <FormControlLabel>
                    <FormControlLabelText size="lg" className='text-white'>Username</FormControlLabelText>
                  </FormControlLabel>
                  <Input className="my-1" size="xl" variant="underlined">
                    <InputSlot>
                      <InputIcon as={User} />
                    </InputSlot>
                    <InputField
                      type="text"
                      placeholder="Username"
                      placeholderTextColor="white"
                      className='text-black pl-3'
                      value={username}
                      onChangeText={(text) => setUsername(text)}
                    />
                  </Input>
                </Box>
              }
              <FormControlLabel>
                <FormControlLabelText size="lg" className='text-white'>Email</FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1" size="xl" variant="underlined">
                <InputSlot>
                  <InputIcon as={MailIcon} />
                </InputSlot>
                <InputField
                  type="text"
                  placeholder="E-mail"
                  className='text-black pl-3'
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
              </Input>
              <FormControlLabel>
                <FormControlLabelText size="lg" className='text-white'>Password</FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1 border-black outline-black" variant="underlined" size="xl">
                <InputSlot>
                  <InputIcon as={LockIcon} />
                </InputSlot>
                <InputField
                  type="password"
                  placeholder="Password"
                  className='text-black pl-3'
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText>
                  Must be at least 6 characters.
                </FormControlHelperText>
              </FormControlHelper>
            </VStack>
            <VStack>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                <FormControlErrorText className="text-red-500">
                  {
                    !email.includes("@") && !email.includes(".") ? "Invalid Email. Please fill correctly." : password.length < 6 && "Atleast 6 characters are required"
                  }
                </FormControlErrorText>
              </FormControlError>
            </VStack>
          </FormControl>
          <VStack className='gap-4'>
            <TouchableOpacity onPress={logIn} style={{ width: width * 0.6, justifyContent: "center", alignItems: "center", backgroundColor: "#2E2E2E", borderRadius: 5, alignSelf: "center", padding: 15 }}>
              <Text className='text-white'>{isSignUp ? "Sign Up" : "Sign In"}</Text>
            </TouchableOpacity>
            <TouchableOpacity className='self-center p-3' onPress={() => setIsSignUp(value => !value)}>
              <Text className='text-white'>{isSignUp ? "Already have an account? Sign In!" : "Don't have an account? Sign Up!"}</Text>
            </TouchableOpacity>
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </Center>
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
