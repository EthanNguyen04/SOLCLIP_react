import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Clipboard, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WalletCopyScreen = ({ navigation }) => {
    const [seedPhrase, setSeedPhrase] = useState('');

    // Lấy dữ liệu từ AsyncStorage khi component được render
    useEffect(() => {
        const loadSeedPhrase = async () => {
            try {
                const storedSeedPhrase = await AsyncStorage.getItem('seedPhrase');
                if (storedSeedPhrase) {
                    setSeedPhrase(storedSeedPhrase);
                }
            } catch (error) {
                console.error('Lỗi khi tải mã seed phrase:', error);
            }
        };

        loadSeedPhrase();
    }, []);

    const copyToClipboard = () => {
        Clipboard.setString(seedPhrase);
        Alert.alert('Thông báo', 'Mã seed phrase đã được sao chép vào clipboard!');
    };

    // Chia mã seed phrase thành các từ
    const words = seedPhrase ? seedPhrase.split(' ') : [];

    // Chia các từ thành các hàng với 3 từ mỗi hàng
    const rows = [];
    for (let i = 0; i < words.length; i += 3) {
        rows.push(words.slice(i, i + 3));
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Mã Seed Phrase</Text>
            <View style={styles.wordsContainer}>
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((word, index) => (
                            <View key={index} style={styles.wordContainer}>
                                <Text style={styles.wordNumber}>{rowIndex * 3 + index + 1}</Text>
                                <Text style={styles.wordText}>{word}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
            <TouchableOpacity
                onPress={copyToClipboard}
                style={styles.copyButton}
                activeOpacity={0.8}
            >
                <Text style={styles.copyButtonText}>Sao Chép Seed Phrase</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                activeOpacity={0.8}
            >
                <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    wordsContainer: {
        marginBottom: 20,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Đảm bảo các từ được bao bọc và phân phối đều
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    wordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '30%', // Chiếm 1/3 của hàng để đảm bảo 3 từ mỗi hàng
        marginBottom: 10,
    },
    wordNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#6E3D99',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 30,
        marginRight: 10,
        fontSize: 16,
    },
    wordText: {
        fontSize: 18,
    },
    copyButton: {
        backgroundColor: '#6E3D99',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
    },
    copyButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    backButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default WalletCopyScreen;
