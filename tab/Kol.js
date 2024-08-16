import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, Animated, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { BASE_URL } from '../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PanGestureHandler } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Đảm bảo thư viện này đã được cài đặt
import { LogBox } from 'react-native';

// Tắt tất cả các cảnh báo màu vàng
LogBox.ignoreAllLogs(true);
const { width, height } = Dimensions.get('window');

const Kol = ({ navigation }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [translateY, setTranslateY] = useState(new Animated.Value(0));
    const [kol, setKol] = useState(null); // Thêm state cho kol

    useEffect(() => {
        const fetchKol = async () => {
            try {
                const storedKol = await AsyncStorage.getItem('kol');
                setKol(storedKol); // Lưu giá trị kol vào state
            } catch (err) {
                console.error('Failed to fetch kol from AsyncStorage:', err);
            }
        };

        const fetchVideos = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/videos/not-null-kol`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setVideos(data);
            } catch (err) {
                setError('Failed to fetch videos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchKol(); // Fetch kol first
        fetchVideos(); // Then fetch videos
    }, []);

    const handleGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: false }
    );

    const handleGestureEnd = (event) => {
        if (event.nativeEvent.translationY < -50) {
            handleNext();
        } else if (event.nativeEvent.translationY > 50) {
            handlePrev();
        }
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    if (kol !== 'kol') {
        // Nếu kol là null hoặc không có giá trị
        return (
            <View style={styles.container}>
                <Text style={styles.textk}>Chưa sử dung NFT KOL</Text>
            </View>
        );
    }

    const video = videos[currentIndex];
    const videoUrl = video.url.replace('\\', '/');

    return (
        <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onEnded={handleGestureEnd}
        >
            <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
                {video && (
                    <TouchableWithoutFeedback onPress={togglePlayPause}>
                        <View style={styles.videoContainer}>
                            <Video
                                source={{ uri: `${BASE_URL}${videoUrl}` }}
                                style={styles.video}
                                useNativeControls={false}
                                resizeMode="cover"
                                shouldPlay={isPlaying}
                            />
                            {!isPlaying && (
                                <View style={styles.playButtonContainer}>
                                    <Icon name="play-circle" size={60} color="#fff" />
                                </View>
                            )}
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.7)']}
                                style={styles.gradient}
                            >
                                <View style={styles.textContainer}>
                                    <Text style={styles.title}>{video.title}</Text>
                                    <Text style={styles.content}>{video.content}</Text>
                                </View>
                            </LinearGradient>

                            <TouchableOpacity
                                style={styles.coinButton}
                                onPress={() => alert('Coin button pressed')}
                            >
                                <Icon name="dollar" size={30} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </Animated.View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },
    videoContainer: {
        width: width,
        height: height,
        justifyContent: 'flex-end',
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        width: '100%',
        height: '40%',
        bottom: 0,
    },
    textContainer: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        width: '95%',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    content: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 30,
    },
    playButtonContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -30 }, { translateY: -30 }],
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#FFD700',
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    textk:{
        color: 'red'
    }
});

export default Kol;
