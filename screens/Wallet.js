import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, FlatList, TextInput, Modal, TouchableOpacity, Clipboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { LinearGradient } from 'expo-linear-gradient';

const Wallet = ({ navigation }) => {
    const [publicKey, setPublicKey] = useState('');
    const [tokens, setTokens] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [seedPhrase, setSeedPhrase] = useState('');
    const [privateKey, setPrivateKey] = useState('');

    useEffect(() => {
        const loadPublicKey = async () => {
            try {
                const storedPublicKey = await AsyncStorage.getItem('publicKey');
                if (storedPublicKey) {
                    setPublicKey(storedPublicKey);
                    fetchTokens(storedPublicKey);
                }
            } catch (error) {
                console.error('Lỗi khi tải public key:', error);
            }
        };

        const fetchTokens = async (key) => {
            try {
                const response = await fetch(`${BASE_URL}/api/get_branch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ publicKey: key }),
                });
                const data = await response.json();
                if (response.ok) {
                    setTokens(data.result);
                } else {
                    console.error('Failed to fetch tokens:', data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu token:', error);
            }
        };

        loadPublicKey();
    }, []);

    const fetchStoredData = async () => {
        try {
            const storedSeedPhrase = await AsyncStorage.getItem('seedPhrase');
            const storedPrivateKey = await AsyncStorage.getItem('privateKey');
            if (storedSeedPhrase && storedPrivateKey) {
                setSeedPhrase(storedSeedPhrase);
                setPrivateKey(storedPrivateKey);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ bộ nhớ:', error);
        }
    };

    const showModal = () => {
        fetchStoredData();
        setModalVisible(true);
    };

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        alert('Đã sao chép vào clipboard!');
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('publicKey');
            await AsyncStorage.removeItem('seedPhrase');
            await AsyncStorage.removeItem('privateKey');
            
            // Chuyển hướng đến WelcomeScreen và ngăn quay lại các màn hình trước
            navigation.reset({
                index: 0,
                routes: [{ name: 'WelcomeScreen' }],
            });
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    const renderToken = ({ item }) => {
        const tokenName = item.info.name === 'Unknown Token' ? 'SOLC' : item.info.name;
        const tokenImage = item.info.image && item.info.image.trim() !== '' 
            ? { uri: item.info.image } 
            : require('../image/Logohoanthien.png'); 

        return (
            <View style={styles.tokenContainer}>
                <Image source={tokenImage} style={styles.tokenImage} />
                <View style={styles.tokenDetailsContainer}>
                    <Text style={styles.tokenText}>{item.balance}</Text>
                    <Text style={styles.tokenText}>{tokenName}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={publicKey}
                editable={false} 
                style={styles.input}
                selectTextOnFocus={false} 
            />
            <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => copyToClipboard(publicKey)}
                        >
                            <Text style={styles.modalButtonText}>Sao chép PublicKey</Text>
                        </TouchableOpacity>
            <LinearGradient
                colors={['#00FFA3', '#DC1FFF', '#00F5FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.securityButton}
            >
                <TouchableOpacity
                    onPress={showModal}
                    style={styles.buttonContent}
                >
                    <Text style={styles.buttonText}>Bảo mật</Text>
                </TouchableOpacity>
            </LinearGradient>
            <FlatList
                data={tokens}
                renderItem={renderToken}
                keyExtractor={(item) => item.address}
            />
            <LinearGradient
                colors={['#00FFA3', '#DC1FFF', '#00F5FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.logoutButton}
            >
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            'Đăng xuất',
                            'Bạn có chắc chắn muốn đăng xuất?',
                            [
                                {
                                    text: 'Hủy',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Đăng xuất',
                                    onPress: handleLogout,
                                },
                            ],
                            { cancelable: false }
                        );
                    }}
                    style={styles.buttonContent}
                >
                    <Text style={styles.buttonText}>Đăng xuất</Text>
                </TouchableOpacity>
            </LinearGradient>
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Seed Phrase:</Text>
                        <TextInput
                            value={seedPhrase}
                            editable={false}
                            style={styles.modalInput}
                            multiline={true}
                        />
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => copyToClipboard(seedPhrase)}
                        >
                            <Text style={styles.modalButtonText}>Sao chép Seed Phrase</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalText}>Private Key:</Text>
                        <TextInput
                            value={privateKey}
                            editable={false}
                            style={styles.modalInput}
                            multiline={true}
                        />
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => copyToClipboard(privateKey)}
                        >
                            <Text style={styles.modalButtonText}>Sao chép Private Key</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    tokenContainer: {
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    tokenDetailsContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 10,
    },
    tokenText: {
        fontWeight: 'bold', // Chữ đậm hơn
        marginLeft: 5,
        fontSize: 14,
        // color:'white'
    },
    tokenImage: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    input: {
        marginTop: 100,
        width: '80%',
        fontSize: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        color: 'blue'
    },
    securityButton: {
        
        position: 'absolute',
        top: 30, 
        right: 20,
        
        paddingHorizontal: 20,
        borderRadius: 5,
        width:80,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButton: {
        marginTop: 20,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        width: '80%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 14,
        marginBottom: 10,
    },
    modalInput: {
        width: '100%',
        height: 100,
        fontSize: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f5f5f5',
        textAlignVertical: 'top',
        color: 'blue',
    },
    modalButton: {
        padding: 10,
        backgroundColor: '#6200EE',
        borderRadius: 5,
        marginVertical: 5,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 12,
    },
});

export default Wallet;
