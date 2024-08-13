import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleLogout = async () => {
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
                    onPress: async () => {
                        try {
                            // Xóa toàn bộ dữ liệu đã lưu
                            await AsyncStorage.clear();
                            // Điều hướng đến màn hình WelcomeScreen
                            navigation.navigate('WelcomeScreen');
                        } catch (error) {
                            console.error('Lỗi khi đăng xuất:', error);
                            Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng xuất.');
                        }
                    },
                },
            ]
        );
    };

    // Collapse menu when the screen loses focus
    useFocusEffect(
        useCallback(() => {
            return () => {
                setShowMenu(false);
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={toggleMenu}
                style={styles.menuButton}
                activeOpacity={0.8}
            >
                <Text style={styles.menuButtonText}>Menu</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Đây là trang Hồ Sơ</Text>
            {showMenu && (
                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('WalletCopyScreen')}
                        style={styles.menuItem}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.menuItemText}>Ví</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => alert('Thông tin')}
                        style={styles.menuItem}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.menuItemText}>Thông tin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => alert('Đơn Hàng')}
                        style={styles.menuItem}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.menuItemText}>Đơn Hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={styles.menuItem}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.menuItemText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
    },
    menuButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#6E3D99',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    menuButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    menuContainer: {
        marginTop: 60, // Điều chỉnh nếu cần
        position: 'absolute',
        top: 60, // Điều chỉnh nếu cần
        right: 20,
    },
    menuItem: {
        backgroundColor: '#6E3D99',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    menuItemText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Profile;
