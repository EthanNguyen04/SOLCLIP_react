import React from 'react';
import { View, Image } from 'react-native'; // Thêm import cho Image
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VideoPlayer from './VideoPlayer';
import CreatVideo from './CreatVideo';
import Money from './Money';
import Feild from './Field';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const TabBotton = () => (
  <Tab.Navigator screenOptions={{
    headerShown: false, //an tat ca tabscreen header
    tabBarStyle:{
      backgroundColor: '#6E3D99',
      height:60, 
      position: 'absolute',
      bottom:2,
      right:16,
      left: 16,
      borderRadius: 10
    }
  }}>
    <Tab.Screen
      name="VideoPlayer"
      component={VideoPlayer}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../image/icons8-home-24.png')} // Đảm bảo đường dẫn đúng
            />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="CreatVideo"
      component={CreatVideo}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../image/icons8-home-24.png')} // Đảm bảo đường dẫn đúng
            />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Money"
      component={Money}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../image/icons8-home-24.png')} // Đảm bảo đường dẫn đúng
            />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Feild"
      component={Feild}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../image/icons8-home-24.png')} // Đảm bảo đường dẫn đúng
            />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../image/icons8-home-24.png')} // Đảm bảo đường dẫn đúng
            />
          </View>
        ),
      }}
    />
  </Tab.Navigator>
);

export default TabBotton;
