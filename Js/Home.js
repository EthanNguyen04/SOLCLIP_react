import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './Profile';
import CreatVideo from './CreatVideo';
import Money from './Money';
import Feild from './Field';
import WelcomeScreen from './WelcomeScreen';
import VideoPlayer from './VideoPlayer';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for bottom tabs
const TabBotton = () => (
  <Tab.Navigator screenOptions={{
    headerShown: false, // Ẩn header
    tabBarStyle:{
      height:60,
      position: 'absolute',
      bottom: 16,
      right:16,
      left:16,
      borderRadius:10
    }
  }}>
    <Tab.Screen
      name="VideoPlayer"
      component={VideoPlayer}
      options={{
        tabBarIcon: ({ focused }) => (
          <View>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../image/icons8-home-24.png')} // Sửa đường dẫn đến icon của bạn
            />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="CreatVideo"
      component={CreatVideo}
      options={{
        tabBarIcon: ({ focused }) => (
          <View>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../image/icons8-add-50.png')} // Sửa đường dẫn đến icon của bạn
            />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Money"
      component={Money}
      options={{
        tabBarIcon: ({ focused }) => (
          <View>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../image/icons8-money-50.png')} // Sửa đường dẫn đến icon của bạn
            />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Feild"
      component={Feild}
      options={{
        tabBarIcon: ({ focused }) => (
          <View>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../image/icons8-bag-50.png')} // Sửa đường dẫn đến icon của bạn
            />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({ focused }) => (
          <View>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../image/icons8-home-24.png')} // Sửa đường dẫn đến icon của bạn
            />
          </View>
        ),
      }}
    />
  </Tab.Navigator>
);

// Main Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="TabBotton" component={TabBotton} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
