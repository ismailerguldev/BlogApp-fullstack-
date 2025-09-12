import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import { Navigation } from './navigation';
import { AuthContext, AuthProvider } from './auth/authContext';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';

SplashScreen.preventAutoHideAsync();

const prefix = createURL('/');

export function App() {
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

  return (
      <GluestackUIProvider mode="system">
        <Provider store={store}>
          <AuthProvider>
            <Navigation
              theme={theme}
              linking={{
                enabled: 'auto',
                prefixes: [prefix],
              }}
              onReady={() => {
                SplashScreen.hideAsync(
                );
              }}
            />
          </AuthProvider>
        </Provider>
      </GluestackUIProvider>
  );
}
