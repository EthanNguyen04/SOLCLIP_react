import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabBotton from './Js/TabBotton';
import WelcomeScreen from './Js/WelcomeScreen';
import WalletH from './Js/WalletH';
import Recoverwallet from './Js/Recoverwallet';
import WalletCopyScreen from './Js/WalletCopyScreen';
import uploadUser from './Js/uploadUser';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="TabBotton" component={TabBotton} />
        <Stack.Screen name="WalletH" component={WalletH} />
        <Stack.Screen name="Recoverwallet" component={Recoverwallet} />
        <Stack.Screen name="WalletCopyScreen" component={WalletCopyScreen} />
        <Stack.Screen name="uploadUser" component={uploadUser} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
