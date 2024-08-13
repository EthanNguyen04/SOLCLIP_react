import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';

const CreatVideo = () => {
    const [publicKey, setPublicKey] = useState('');
    const [videoUri, setVideoUri] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // Fetch publicKey from AsyncStorage when component mounts
    useEffect(() => {
        const fetchPublicKey = async () => {
            try {
                const storedPublicKey = await AsyncStorage.getItem('publicKey');
                if (storedPublicKey) {
                    setPublicKey(storedPublicKey);
                    console.log(storedPublicKey)
                } else {
                    console.log('No public key found');
                }
            } catch (error) {
                console.error('Error fetching public key:', error);
            }
        };

        fetchPublicKey();
    }, []);

    // Pick a video from the device's media library
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

    // Upload video
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

        try {
            const response = await fetch('http://192.168.1.18:3000/api/upload-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            });
            console.log(formData)

            if (response.ok) {
                Alert.alert('Success', 'Video uploaded successfully.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate to TabBar screen or any other desired screen
                            // navigation.navigate('TabBar');
                        }
                    },
                ]);
            } else {
                Alert.alert('Error', 'Failed to upload video.');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            Alert.alert('Error', 'An error occurred while uploading the video.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Đây là trang tạo Video</Text>
            {publicKey ? (
                <Text style={styles.publicKeyText}>Public Key: {publicKey}</Text>
            ) : (
                <Text style={styles.publicKeyText}>Loading public key...</Text>
            )}
            <Button title="Chọn Video" onPress={pickVideo} />
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
    publicKeyText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
    },
    videoContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    video: {
        width: '100%',
        height: 200,
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

export default CreatVideo;
