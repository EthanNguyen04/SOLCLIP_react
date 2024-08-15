import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config'; // Đường dẫn tới file config.js
const RecoverWallet = ({ navigation }) => {
    const [seedPhrase, setSeedPhrase] = useState('');

    const handleRecover = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/recover-wallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ seedPhrase }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('seedPhrase', seedPhrase);
                await AsyncStorage.setItem('publicKey', data.publicKey);
                await AsyncStorage.setItem('privateKey', data.privateKey);

                // Hiển thị thông báo với publicKey và điều hướng nếu người dùng chọn OK
                Alert.alert(
                    'Thông báo',
                    `Ví của bạn: ${data.publicKey}`,
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('BottomTab'), // Điều hướng tới TabBotton
                        },
                    ]
                );
            } else {
                Alert.alert('Lỗi', 'Không thể khôi phục ví. Vui lòng kiểm tra seed phrase và thử lại.');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gọi API. Vui lòng thử lại.');
            console.error('Error calling API:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Nhập Seed Phrase của bạn:</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập seed phrase"
                value={seedPhrase}
                onChangeText={setSeedPhrase}
            />
            <TouchableOpacity
                onPress={handleRecover}
                style={styles.button}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Khôi phục Ví</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Chiếm toàn bộ không gian màn hình
        justifyContent: 'center', // Căn giữa theo chiều dọc
        alignItems: 'center', // Căn giữa theo chiều ngang
        padding: 20,
    },
    text: {
        fontSize: 18, // Cỡ chữ
        marginBottom: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6E3D99', // Màu nền cho nút
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default RecoverWallet;
