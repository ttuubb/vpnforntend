import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthContext } from './contexts/AuthContext';
import SQLite from 'react-native-sqlite-storage';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 导入页面组件
import AuthScreen from './screens/AuthScreen'; // 登录页面
import NodeListScreen from './screens/NodeListScreen'; // 节点列表页面
import RegisterScreen from './screens/RegisterScreen'; // 注册页面

// 初始化数据库
const db = SQLite.openDatabase(
  { name: 'vpnapp.db', location: 'default' },
  () => console.log('Database connected'), // 数据库连接成功时的回调
  error => console.error('Database error', error) // 数据库连接失败时的回调
);

const Stack = createNativeStackNavigator(); // 创建导航栈

export default function App() {
  // 全局认证状态管理
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN': // 登录操作
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT': // 登出操作
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true, // 初始加载状态
      isSignout: false, // 是否已登出
      userToken: null, // 用户令牌
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
        console.warn('Auth state recovery failed'); // 认证状态恢复失败
      }
    };

    bootstrapAsync();
  }, []);

  // 认证上下文方法
  const authContext = React.useMemo(
    () => ({
      signIn: async (token) => { // 登录方法
        await AsyncStorage.setItem('userToken', token); // 存储用户令牌
        dispatch({ type: 'SIGN_IN', token });
      },
      signOut: async () => { // 登出方法
        await AsyncStorage.removeItem('userToken'); // 移除用户令牌
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
    dark: true, // 启用深色模式
  };

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.background, // 导航栏背景色
              },
              headerTintColor: theme.colors.text, // 导航栏文字颜色
            }}
          >
            {state.userToken ? (
              // 如果用户已登录，显示节点列表页面
              <Stack.Screen
                name="NodeList"
                component={NodeListScreen}
                options={{ title: '节点列表' }}
              />
            ) : (
              // 如果用户未登录，显示登录和注册页面
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
        <Toast /> {/* 全局Toast提示组件 */}
      </AuthContext.Provider>
    </PaperProvider>
  );
}