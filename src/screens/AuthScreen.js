import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native-web';
import { Button, TextInput } from 'react-native-paper';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const AuthScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { username, password });
      navigation.navigate('NodeList');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '登录失败',
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="用户名"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        label="密码"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button mode="contained" onPress={handleLogin}>
        登录
      </Button>
      <Button onPress={() => navigation.navigate('Register')}>
        注册新账户
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default AuthScreen;
