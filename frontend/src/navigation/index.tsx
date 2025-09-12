import { createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Home } from './screens/Home/Home';
import { Search } from './screens/Home/Search';
import { AddPost } from './screens/Home/AddPost';
import { AuthScreen } from './screens/Auth/AuthScreen';
import { useContext } from 'react';
import { AuthContext } from '../auth/authContext';
import GreetingPage from './screens/Auth/GreetingPage';
import { Dimensions, StatusBar } from 'react-native';
import Profile from './screens/Home/Profile';
import { User } from 'lucide-react-native';
import EmailVerificationScreen from './screens/Auth/EmailVerificationScreen';
import BlogDetail from './screens/Home/PostDetail';

const useIsSignedIn = () => {
  const { isAuth, isVerified } = useContext(AuthContext)
  return isAuth && isVerified
}
const useIsSignedOut = () => {
  return !useIsSignedIn()
}
const { height } = Dimensions.get('screen')
const HomeTabs = createBottomTabNavigator({
  screenOptions: {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: { backgroundColor: "#27292d", borderTopWidth: 0, height: height * 0.11, paddingTop: 5, },
  },
  screens: {
    Home: {
      screen: Home,
      options: {
        tabBarIcon: ({ color, size }) => (
          <Foundation name="home" size={size} color={color} />
        ),
      },
    },
    Search: {
      screen: Search,
      options: {
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="search" size={size} color={color} />
        ),
      },
    },
    AddPost: {
      screen: AddPost,
      options: {
        tabBarIcon: ({ color, size }) => <MaterialIcons name="add-circle-outline" size={size} color={color} />
      }
    },
    Profile: {
      screen: Profile,
      options: {
        tabBarIcon: ({ color, size }) => <User color={color} size={size} />
      }
    }
  },
});
const AuthStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false
  },
  screens: {
    GreetingPage: {
      if: useIsSignedOut,
      screen: GreetingPage,
      linking: {
        path: '*',
      },
    },
    AuthScreen: {
      options: {
        animation: 'slide_from_right'
      },
      screen: AuthScreen,
      linking: {
        path: "*"
      }
    },
    EmailVerificationScreen: {
      screen: EmailVerificationScreen
    }
  }
})
const HomeStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false
  },
  screens: {
    HomeTabs: {
      screen: HomeTabs,
    },
    BlogDetail: {
      screen: BlogDetail
    }
  }
})
const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false
  },
  screens: {
    HomeStack: {
      if: useIsSignedIn,
      screen: HomeStack,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
    AuthStack: {
      if: useIsSignedOut,
      screen: AuthStack,
    }
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
