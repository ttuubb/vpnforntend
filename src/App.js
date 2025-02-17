import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthContext } from './contexts/AuthContext';
import SQLite from 'react-native-sqlite-storage';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 导入页面组件
import AuthScreen from './screens/AuthScreen';
import NodeListScreen from './screens/NodeListScreen';
import RegisterScreen from './screens/RegisterScreen';

// 初始化数据库
const db = SQLite.openDatabase(
  { name: 'vpnapp.db', location: 'default' },
  () => console.log('Database connected'),
  error => console.error('Database error', error)
);

const Stack = createNativeStackNavigator();

export default function App() {
  // 全局认证状态
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  // 初始化认证状态
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // 检查本地存储的登录状态
        const userToken = await AsyncStorage.getItem('userToken');
        dispatch({ type: 'SIGN_IN', token: userToken });
      } catch (e) {
        console.warn('Auth state recovery failed');
      }
    };

    bootstrapAsync();
  }, []);

  // 认证上下文方法
  const authContext = React.useMemo(
    () => ({
      signIn: async (token) => {
        await AsyncStorage.setItem('userToken', token);
        dispatch({ type: 'SIGN_IN', token });
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userToken');
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    []
  );

  // 配置主题
  const theme = {
    ...PaperProvider.defaultProps.theme,
    colors: {
      ...PaperProvider.defaultProps.theme.colors,
      primary: '#2196F3',  // 淡蓝色主题
      background: '#121212', // 深色背景
      text: '#FFFFFF', // 白色文字
    },
    dark: true,
  };

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTintColor: theme.colors.text,
            }}
          >
            {state.userToken ? (
              <Stack.Screen
                name="NodeList"
                component={NodeListScreen}
                options={{ title: '节点列表' }}
              />
            ) : (
              <>
                <Stack.Screen
                  name="Auth"
                  component={AuthScreen}
                  options={{ title: '登录' }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{ title: '注册' }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </AuthContext.Provider>
    </PaperProvider>
  );
}