import React from 'react';
import { View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VideoPlayer from './VideoPlayer';
import CreatVideo from './CreatVideo';
import Money from './Money';
import Field from './Field';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const TabBotton = () => (
  <Tab.Navigator screenOptions={{
    headerShown: false, 
    tabBarStyle:{
      backgroundColor: '#6E3D99',
      height:'7%', 
      position: 'absolute',
      bottom: 2,
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
              style={{ 
                width: focused ? 28 : 20, // Tăng kích thước khi tab được chọn
                height: focused ? 28 : 20,
              }}
              source={require('../image/icons8-home-24.png')}
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
              style={{ 
                width: focused ? 28 : 20, 
                height: focused ? 28 : 20,
              }}
              source={require('../image/icons8-add-50.png')}
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
              style={{ 
                width: focused ? 28 : 20, 
                height: focused ? 28 : 20,
              }}
              source={require('../image/icons8-money-50.png')}
            />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Field"
      component={Field}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <View>
            <Image
              style={{ 
                width: focused ? 28 : 20, 
                height: focused ? 28 : 20,
              }}
              source={require('../image/icons8-bag-50.png')}
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
              style={{ 
                width: focused ? 28 : 20, 
                height: focused ? 28 : 20,
              }}
              source={require('../image/icons8-home-24.png')}
            />
          </View>
        ),
      }}
    />
  </Tab.Navigator>
);

export default TabBotton;
