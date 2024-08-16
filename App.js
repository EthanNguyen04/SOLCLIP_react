import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './screens/Wellcome';
import NewWallet from './screens/NewWallet';
import BottomTab from './screens/BottomTab';
import RecoverWallet from './screens/RecoverWallet';
import UploadUser from './screens/UploadUser';
import Wallet from './screens/Wallet';

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('WelcomeScreen');
  const [loading, setLoading] = useState(true); // Trạng thái tải

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const publicKey = await AsyncStorage.getItem('publicKey');
        const privateKey = await AsyncStorage.getItem('privateKey');
        const seedPhrase = await AsyncStorage.getItem('seedPhrase');

        if (publicKey !== null && privateKey !== null && seedPhrase !== null) {
          setInitialRoute('BottomTab');
        } else {
          setInitialRoute('WelcomeScreen');
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra AsyncStorage:', error);
        setInitialRoute('WelcomeScreen'); // Quay lại WelcomeScreen nếu có lỗi
      } finally {
        setLoading(false); // Đặt trạng thái tải là false khi hoàn thành
      }
    };

    checkStorage();
  }, []);

  if (loading) {
    // Có thể thêm một màn hình tải nếu cần thiết
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="NewWallet" component={NewWallet} />
        <Stack.Screen name="UploadUser" component={UploadUser} />
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="RecoverWallet" component={RecoverWallet} />
        <Stack.Screen name="Wallet" component={Wallet} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
