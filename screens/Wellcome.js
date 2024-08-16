import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { BASE_URL } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const Wellcome = ({ route, navigation }) => {
  const handleStartPress = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/create-wallet`, {
            method: 'GET', // Hoặc 'POST' nếu bạn cần gửi dữ liệu
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('API response:', data);

        // Điều hướng đến WalletH và truyền dữ liệu
        navigation.navigate('NewWallet', {
            publicKey: data.publicKey,
            seedPhrase: data.seedPhrase,
        });
    } catch (error) {
        console.error('Error calling API:', error);
        Alert.alert('Error', 'Có lỗi xảy ra khi gọi API');
    }
};
return (
    <View style={styles.container}>
        <View style={styles.overlay}>
            <Image 
                source={require('../image/Logohoanthien.png')} // Đảm bảo đường dẫn đúng
                style={styles.logo}
                resizeMode="contain" // Điều chỉnh theo tỷ lệ gốc của hình ảnh
            />            
            <Svg  style={styles.svg}>
                <Defs>
                    <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#00FFA3" stopOpacity="1" />
                    <Stop offset="0.5" stopColor="#DC1FFF" stopOpacity="1" />
                    <Stop offset="1" stopColor="#00F5FF" stopOpacity="1" />
                    </SvgLinearGradient>
                </Defs>
           
                <SvgText
                    fill="url(#grad)"
                    fontSize="16"
                    fontWeight="bold"
                    x="5"
                    y="20"
                >
                    SolClips is an entertainment platform
                </SvgText>
                <SvgText
                    fill="url(#grad)"
                    fontSize="16"
                    fontWeight="bold"
                    x="0"
                    y="40"
                >
                    consisting of short videos you can
                </SvgText>
                <SvgText
                    fill="url(#grad)"
                    fontSize="16"
                    fontWeight="bold"
                    x="0"
                    y="60"
                >
                    mine our SOLC token creating
                </SvgText>
                <SvgText
                    fill="url(#grad)"
                    fontSize="16"
                    fontWeight="bold"
                    x="0"
                    y="80"
                >
                    videos that attract viewers or
                </SvgText>
                <SvgText
                    fill="url(#grad)"
                    fontSize="16"
                    fontWeight="bold"
                    x="0"
                    y="100"
                >
                   you can watch videos to earn SOLC daily.
                </SvgText>

            </Svg>
            <LinearGradient
                colors={['#00FFA3', '#DC1FFF', '#00F5FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
            >
                <TouchableOpacity
                onPress={handleStartPress}
                style={styles.buttonContent}
                activeOpacity={0.8}
                >
                <Text style={styles.buttonText}>Bắt đầu</Text>
                </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacity
                onPress={() => navigation.navigate('RecoverWallet')}
                style={styles.transparentButton}
                activeOpacity={0.8} // Hiệu ứng nhấn
            >
                <Text style={styles.buttonText}>Nhập ví đang có</Text>
            </TouchableOpacity>
        </View>
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

    width: 300, // Kích thước của logo
    height: 300,
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
svg:{
    height:150,
     width:300,
     alignItems: 'center',
     justifyContent: 'center'
}
});

export default Wellcome;
