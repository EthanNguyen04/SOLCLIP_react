import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WalletH = ({ route, navigation }) => {
    const { publicKey, seedPhrase } = route.params || {}; // Lấy dữ liệu từ params
    const [isCopied, setIsCopied] = useState(false);

    // Lưu dữ liệu vào AsyncStorage khi component được render
    useEffect(() => {
        const saveData = async () => {
            try {
                await AsyncStorage.setItem('publicKey', publicKey);
                await AsyncStorage.setItem('seedPhrase', seedPhrase);
                console.log('Data saved successfully');
            } catch (error) {
                console.error('Error saving data:', error);
            }
        };

        if (publicKey && seedPhrase) {
            saveData();
        }
    }, [publicKey, seedPhrase]);

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        setIsCopied(true);
        Alert.alert('Seed phrase copied to clipboard!');
    };

    const handleContinue = async () => {
        if (isCopied) {//d eday lay chop
            try {
                // Gọi API kiểm tra người dùng
                const checkUserResponse = await fetch(`http://192.168.1.18:3000/api/check-user/${publicKey}`, {
                    method: 'GET'
                });
    
                const checkUserData = await checkUserResponse.json();
                console.log(checkUserData.exists)
                if (checkUserData.exists === false) {
                    // Người dùng không tồn tại, chuyển sang màn hình upload thông tin
                    navigation.navigate('uploadUser'); // Thay thế 'UploadInfoScreen' bằng tên màn hình upload của bạn
                } else if (checkUserData.exists === true) {
                    // Người dùng đã tồn tại, tiếp tục xử lý tiếp
                    const response = await fetch('http://192.168.1.18:3000/api/recover-wallet', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ seedPhrase }), 
                    });
    
                    const data = await response.json();
    
                    if (response.ok && data.privateKey) {
                        await AsyncStorage.setItem('privateKey', data.privateKey);
                        console.log('Private key saved to AsyncStorage:', data.privateKey);
                        navigation.navigate('TabBotton'); // Thay thế 'TabBotton' bằng tên màn hình tiếp theo
                    } else {
                        Alert.alert('Lỗi', 'Không thể lấy private key. Vui lòng thử lại.');
                    }
                }
            } catch (error) {
                Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gọi API. Vui lòng thử lại.');
                console.error('Error calling API:', error);
            }
        } else {
            Alert.alert('Cần sao chép mã của bạn trước khi tiếp tục.');
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Đây là WalletH</Text>
            <Text style={styles.text}>Public Key: {publicKey}</Text>
            <Text style={styles.text}>Seed Phrase: {seedPhrase}</Text>
            <TouchableOpacity
                onPress={() => copyToClipboard(seedPhrase)}
                style={styles.copyButton}
                activeOpacity={0.8}
            >
                <Text style={styles.copyButtonText}>Copy Seed Phrase</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleContinue}
                style={[styles.continueButton, !isCopied && styles.disabledButton]}
                activeOpacity={0.8}
                disabled={!isCopied}
            >
                <Text style={styles.continueButtonText}>Tiếp tục</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Chiếm toàn bộ không gian màn hình
        justifyContent: 'center', // Căn giữa theo chiều dọc
        alignItems: 'center', // Căn giữa theo chiều ngang
    },
    text: {
        fontSize: 18, // Cỡ chữ
        marginBottom: 10, // Khoảng cách giữa các dòng
    },
    copyButton: {
        backgroundColor: '#6E3D99', // Màu nền cho nút
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    copyButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    continueButton: {
        backgroundColor: '#6E3D99', // Màu nền cho nút tiếp tục
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: '#aaa', // Màu nền cho nút khi bị vô hiệu hóa
    },
});

export default WalletH;
