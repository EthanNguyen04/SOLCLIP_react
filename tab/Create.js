import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Platform, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BASE_URL } from '../config';
import { useFocusEffect } from '@react-navigation/native';
import { LogBox } from 'react-native';

// Tắt tất cả các cảnh báo màu vàng
LogBox.ignoreAllLogs(true);
const Create = () => {
    const [publicKey, setPublicKey] = useState('');
    const [videoUri, setVideoUri] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false); // Trạng thái loading

    useEffect(() => {
        const fetchPublicKey = async () => {
            try {
                const storedPublicKey = await AsyncStorage.getItem('publicKey');
                if (storedPublicKey) {
                    setPublicKey(storedPublicKey);
                } else {
                    console.log('No public key found');
                }
            } catch (error) {
                console.error('Error fetching public key:', error);
            }
        };

        fetchPublicKey();
    }, []);

    useFocusEffect(
        useCallback(() => {
            clearData(); // Clear data every time the screen is focused

            return () => {
                clearData(); // Clear data when the screen loses focus (optional)
            };
        }, [])
    );

    const clearData = () => {
        setVideoUri(null);
        setTitle('');
        setContent('');
    };

    const pickVideo = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Sorry, we need media library permissions to select a video!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setVideoUri(result.assets[0].uri);
        } else {
            console.log('User cancelled video picker');
        }
    };

    const handleUpload = async () => {
        if (!videoUri || !title || !content || !publicKey) {
            Alert.alert('Error', 'Please fill all fields and select a video.');
            return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: Platform.OS === 'ios' ? videoUri.replace('file://', '') : videoUri,
            name: 'video.mp4',
            type: 'video/mp4',
        });
        formData.append('title', title);
        formData.append('content', content);
        formData.append('publickey', publicKey);

        setLoading(true); // Bắt đầu loading

        try {
            const response = await fetch(`${BASE_URL}/api/upload-video`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            });

            if (response.ok) {
                Alert.alert('Success', 'Video uploaded successfully.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            clearData(); // Clear data after successful upload
                            setLoading(false); // Kết thúc loading
                            // Navigate to TabBar screen or any other desired screen
                            // navigation.navigate('TabBar');
                        }
                    },
                ]);
            } else {
                setLoading(false); // Kết thúc loading
                Alert.alert('Error', 'Failed to upload video.');
            }
        } catch (error) {
            setLoading(false); // Kết thúc loading
            console.error('Error uploading video:', error);
            Alert.alert('Error', 'An error occurred while uploading the video.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // Adjust if needed
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false} // Optional: Hide vertical scroll indicator
            >
                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : (
                    <View style={styles.innerContainer}>
                        {videoUri && (
                            <View style={styles.videoContainer}>
                                <Video
                                    source={{ uri: videoUri }}
                                    useNativeControls
                                    resizeMode="contain"
                                    style={styles.video}
                                />
                            </View>
                        )}
                        <TouchableOpacity style={styles.uploadButton} onPress={pickVideo}>
                            <Icon name="upload" size={30} color="#fff" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Content"
                            value={content}
                            onChangeText={setContent}
                        />
                        <Button title="Upload Video" onPress={handleUpload} />
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    innerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    videoContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    video: {
        width: '100%',
        height: 400,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 20,
        borderRadius: 5,
    },
});

export default Create;
