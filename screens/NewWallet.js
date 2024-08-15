import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config'; // Đường dẫn tới file config.js
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icon component

const NewWallet = ({ route, navigation }) => {
    const { publicKey, seedPhrase } = route.params || {}; // Lấy dữ liệu từ params
    const [isCopied, setIsCopied] = useState(false);
    const [privateKey, setPrivateKey] = useState('');

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

    const copyToClipboard = async (text) => {
        await Clipboard.setString(text);
        setIsCopied(true);
        Alert.alert('Seed phrase copied to clipboard!');
    };

    const handleContinue = async () => {
        if (seedPhrase) {
            try {
                const checkUserResponse = await fetch(`${BASE_URL}/api/check-user/${publicKey}`, {
                    method: 'GET'
                });
    
                const checkUserData = await checkUserResponse.json();
                if (checkUserData.exists === false) {
                    const response = await fetch(`${BASE_URL}/api/recover-wallet`, {
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
                        
                        // Sao chép private key vào clipboard
                        await Clipboard.setString(data.privateKey);
                        Alert.alert('Private key copied to clipboard!');
                        
                        navigation.navigate('UploadUser'); // Thay thế 'TabBotton' bằng tên màn hình tiếp theo
                    } else {
                        Alert.alert('Lỗi', 'Không thể lấy private key. Vui lòng thử lại.');
                    }
                } else if (checkUserData.exists === true) {
                    const response = await fetch(`${BASE_URL}/api/recover-wallet`, {
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
                        
                        // Sao chép private key vào clipboard
                        await Clipboard.setString(data.privateKey);
                        Alert.alert('Private key copied to clipboard!');
                        
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
            <Text style={styles.header}>Wallet Information</Text>
            <View style={styles.card}>
                <Text style={styles.infoText}>Public Key:</Text>
                <Text style={styles.info}>{publicKey}</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.infoText}>Seed Phrase:</Text>
                <Text style={styles.info}>{seedPhrase}</Text>
            </View>
            <LinearGradient
                colors={['#00FFA3', '#DC1FFF', '#00F5FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
            >
                <TouchableOpacity
                    onPress={() => copyToClipboard(seedPhrase)}
                    style={styles.copyButton}
                    activeOpacity={0.8}
                >
                    <Icon name="content-copy" size={24} color="#fff" /> 
                </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacity
                onPress={handleContinue}
                style={[styles.continueButton, !isCopied && styles.disabledButton]}
                activeOpacity={0.8}
                disabled={!isCopied}
            >
                <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e2639', // Dark background color
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00F5FF', // Light cyan color
        marginBottom: 30,
        textAlign: 'center', // Center align header
    },
    card: {
        backgroundColor: '#2D3A5F', // Slightly darker background for cards
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Slightly increased shadow
        shadowOpacity: 0.3, // Slightly increased shadow opacity
        shadowRadius: 6,
        elevation: 4,
        width: '100%',
        marginBottom: 20,
    },
    infoText: {
        fontSize: 18, // Slightly larger font size
        fontWeight: '700', // Bolder font weight
        color: '#DC1FFF', // Purple color
        marginBottom: 10,
        textAlign: 'center',
    },
    info: {
        fontSize: 16,
        color: '#FFF',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 5,
        backgroundColor: '#4E4E4E', // Gray background for info text
        textAlign: 'center',
    },
    button: {
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '15%',
    },
    copyButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#00FFA3', // Green border color
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    copyButtonText: {
        color: '#00FFA3', // Green text color
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    continueButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 20,
        backgroundColor: '#DC1FFF', // Purple background
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#777', // Darker gray for disabled state
    },
});

export default NewWallet;
