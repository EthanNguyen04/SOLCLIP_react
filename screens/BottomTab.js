import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng thư viện Ionicons cho icon
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';

import Home from '../tab/Home';
import Create from '../tab/Create';
import Nft from '../tab/Nft';
import Maket from '../tab/Maket';
import Profile from '../tab/Profile';
import Kol from '../tab/Kol';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              switch (route.name) {
                case 'Home':
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case 'Create':
                  iconName = focused ? 'add-circle-outline' : 'add-circle-outline';
                  break;
                case 'Kol':
                  iconName = focused ? 'person-circle' : 'person-circle-outline';
                  break;
                case 'Nft':
                  iconName = focused ? 'albums-outline' : 'albums-outline';
                  break;
                case 'Maket':
                  iconName = focused ? 'cart-outline' : 'cart-outline';
                  break;
                case 'Profile':
                  iconName = focused ? 'person-circle-outline' : 'person-circle-outline';
                  break;
                default:
                  iconName = 'alert-circle-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#00FFA3', // Màu sắc tab đang hoạt động (phù hợp với giao diện Solana)
            tabBarInactiveTintColor: '#a3a3a3', // Màu sắc tab không hoạt động
            tabBarStyle: {
              backgroundColor: '#1e2639', // Màu nền tối cho thanh tab
              borderTopWidth: 0, // Ẩn viền trên của thanh tab
            },
            tabBarLabelStyle: {
              fontSize: 12, // Kích thước chữ
            },
            tabBarShowLabel: true, // Hiển thị tên các tab
          })}
        >
          <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Tab.Screen name="Create" component={Create} options={{ headerShown: false }} />
          <Tab.Screen name="Kol" component={Kol} options={{ headerShown: false }} />
          <Tab.Screen name="Nft" component={Nft} options={{ headerShown: false }} />
          <Tab.Screen name="Maket" component={Maket} options={{ headerShown: false }} />
          <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </Tab.Navigator>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BottomTab;
