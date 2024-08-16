import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Image, Text, StyleSheet, ActivityIndicator, Dimensions, Animated, TouchableWithoutFeedback, Modal, Button, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BASE_URL } from '../config';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure this library is installed
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [videosWatched, setVideosWatched] = useState(0);
    const [showLuckyDraw, setShowLuckyDraw] = useState(false);
    const [showPublicKeyModal, setShowPublicKeyModal] = useState(false); // State to control the public key modal
    const [luckyDrawNumber, setLuckyDrawNumber] = useState(null);
    const videoRef = useRef(null);
    const translateY = useRef(new Animated.Value(0)).current;
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [privateKeyA, setPrivateKey] = useState('');
    const [amount, setAmount] = useState(''); // State để lưu số tiền

    useEffect(() => {
        const loadSeedPhrase = async () => {
            try {
                const storedFrom = await AsyncStorage.getItem('from');
                const storedTo = await AsyncStorage.getItem('to');
                const storedPublickey = await AsyncStorage.getItem('publicKey');
                const storedPrivatekey = await AsyncStorage.getItem('privateKey');
                
                    setFrom(storedFrom);
                    setTo(storedTo);
                    setPublicKey(storedPublickey);console.log(privateKeyA);
                    setPrivateKey(storedPrivatekey);
                    
                
            } catch (error) {
                console.error('Lỗi khi tải mã:', error);
            }
        };

        loadSeedPhrase();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/videos`);
            if (!response.ok) {
                throw new Error("Lỗi khi lấy video");
            }
            const data = await response.json();
            setVideos(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
        const interval = setInterval(fetchVideos, 30000);
        return () => clearInterval(interval);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (isPlaying) {
                videoRef.current?.playAsync();
            } else {
                videoRef.current?.pauseAsync();
            }
            return () => {
                videoRef.current?.pauseAsync();
            };
        }, [currentIndex, isPlaying])
    );

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
        // Reset translation
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % videos.length;
            handleVideoWatched(newIndex);
            return newIndex;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + videos.length) % videos.length;
            handleVideoWatched(newIndex);
            return newIndex;
        });
    };
    const handleClaim = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipientPublicKeyString: publicKey,
                    amount: luckyDrawNumber,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Đã xảy ra lỗi khi chuyển token');
            }
    
            const result = await response.json();
            alert(result.message); // Hiển thị thông báo từ API
            handleCloseLuckyDraw(); // Đóng modal sau khi yêu cầu thành công
        } catch (error) {
            console.error(error);
            alert('Đã xảy ra lỗi khi thực hiện yêu cầu');
        }
    };
    
    const handleVideoWatched = (index) => {
        setVideosWatched((prevCount) => {
            const newCount = prevCount + 1;
            if (newCount % 5 === 0) {
                if (from && to) {
                    // Random số từ từ "from" đến "to"
                    const randomNumber = Math.floor(Math.random() * (parseInt(to) - parseInt(from) + 1)) + parseInt(from);
                    setLuckyDrawNumber(randomNumber);
                    setShowLuckyDraw(true);
                } else {
                    setShowLuckyDraw(false);
                }
            }
            return newCount;
        });
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handlePlaybackStatusUpdate = (status) => {
        if (status.didJustFinish && !status.isLooping) {
            handleNext();
        }
    };

    const handleCloseLuckyDraw = () => {
        setShowLuckyDraw(false);
    };

    const handleOpenPublicKeyModal = () => {
        setShowPublicKeyModal(true);
    };

    const handleClosePublicKeyModal = () => {
        setShowPublicKeyModal(false);
    };

    const handleDonate = async () => {
        console.log(privateKeyA + " "+ amount + " " + video.publickey)
    
        if (!privateKeyA) {
            alert('Lỗi Vui lòng nhập private key hợp lệ.');
            return;
        }
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert('Lỗi Vui lòng nhập số tiền hợp lệ.');
            return;
        }
        if (!video || !video.publickey) {
            alert('Lỗi Video không hợp lệ hoặc public key không tồn tại.');
            return;
        }
    
        setLoading(true); // Bắt đầu hiển thị loading
    
        try {
            const response = await fetch(`${BASE_URL}/api/transfer-donate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    privateKey: privateKeyA,
                    recipientPublicKeyString: video.publickey,
                    amount: Number(amount),
                }),
            });
    
            if (!response.ok) {
                throw new Error('Đã xảy ra lỗi khi gửi yêu cầu');
            }
    
            const data = await response.json();
            alert('Thành công', `Giao dịch thành công! TxSignature: ${data.txSignature}`);
        } catch (error) {
            console.error(error);
            alert('Lỗi', 'Đã xảy ra lỗi trong quá trình gửi token.');
        } finally {
            setLoading(false); // Dừng hiển thị loading
            handleClosePublicKeyModal(); // Đóng modal sau khi hoàn tất
        }
    };
    

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>Lỗi: {error}</Text>;
    }

    const video = videos[currentIndex];
    const videoUrl = video.url.replace('\\', '/');

    return (
        <>
            <PanGestureHandler
                onGestureEvent={handleGestureEvent}
                onEnded={handleGestureEnd}
            >
                <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
                    {video && (
                        <TouchableWithoutFeedback onPress={togglePlayPause}>
                            <View style={styles.videoContainer}>
                                <Video
                                    ref={videoRef}
                                    source={{ uri: `${BASE_URL}${videoUrl}` }}
                                    style={styles.video}
                                    useNativeControls={false}
                                    resizeMode="cover"
                                    shouldPlay={isPlaying}
                                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
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

                                {/* Button to show Public Key */}
                                <TouchableOpacity
                                    style={styles.coinButton}
                                    onPress={handleOpenPublicKeyModal}
                                >
                                    <Icon name="dollar" size={30} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </Animated.View>
            </PanGestureHandler>

            {/* Modal for Public Key */}
            <Modal
                visible={showPublicKeyModal}
                transparent={true}
                animationType="slide"
                onRequestClose={handleClosePublicKeyModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Donate to</Text>
                        <Text style={styles.modalText}>{video.publickey}</Text>
                        <Text>Số tiền</Text>
                        <TextInput
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <Button title={loading ? 'Đang gửi...' : 'Gửi'} onPress={handleDonate} disabled={loading} />
                        <Button title="Đóng" onPress={handleClosePublicKeyModal} />
                    </View>
                </View>
            </Modal>

            {/* Modal for Lucky Draw */}
            <Modal
                visible={showLuckyDraw}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseLuckyDraw}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>🎉 Vòng Quay May Mắn! 🎉</Text>
                        <Text style={styles.modalText}>
                            Bạn đã xem 5 video. Chúc mừng!
                        </Text>
                        {luckyDrawNumber !== null && (
                             <View style={styles.infoContainer}>
                                <Text style={styles.modalText}>
                                    bạn đã kiếm được: {luckyDrawNumber}
                                </Text>
                                <Image
                                    source={require('../image/Logohoanthien.png')} // Đảm bảo đường dẫn đúng
                                    style={styles.infoImage}
                                />
                            </View>
                        )}
                        <Button title="Claim" onPress={handleClaim} />
                    </View>
                </View>
            </Modal>

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
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
    errorText: {
        color: 'red',
        textAlign: 'center',
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
        marginBottom: 50,
    },modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },

    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    infoImage: {
        width: 30,
        height: 30,
        marginBottom: 20
    },
});

export default Home;
