import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Alert } from 'react-native';
import { BASE_URL } from '../config'; // Đường dẫn tới file config.js
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList } from 'react-native-gesture-handler';


const Wallet = ({ route, navigation }) => {
    return(
        <View>
            <FlatList>
                
            </FlatList>
        </View>
    );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1e2639',
},
overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
},
logo: {

    width: 150, // Kích thước của logo
    height: 150,
},
button: {
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 50,
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
transparentButton: {
    backgroundColor: 'transparent', // Không có màu nền
    borderWidth: 1, // Thêm viền nếu cần
    borderColor: '#6E3D99', // Màu viền
    height: 50,
    width: '90%',
    justifyContent: 'center', // Căn giữa nội dung
    borderRadius: 5,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
},
title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
},
subtitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ddd',
    marginBottom: 20,
},
});

export default Wallet;
