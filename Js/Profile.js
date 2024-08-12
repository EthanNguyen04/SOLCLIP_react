import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Profile = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Đây là trang Hồ Sơ
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Chiếm toàn bộ không gian màn hình
        justifyContent: 'center', // Căn giữa theo chiều dọc
        alignItems: 'center', // Căn giữa theo chiều ngang
    },
    text: {
        fontSize: 18, // Cỡ chữ
    },
});

export default Profile;
