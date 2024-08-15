import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, Dimensions, TouchableOpacity,TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { Video } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Entypo from '@expo/vector-icons/Entypo';


const { width } = Dimensions.get('window');
const numColumns = 3; // Số cột
const videoWidth = (width - 30) / numColumns; // Chiều rộng của mỗi video (trừ khoảng cách giữa các video)
const videoHeight = videoWidth * (16 / 9); // Tính chiều cao của video với tỷ lệ 9:16

const Profile = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null); // ID của video đang phát

  const [publicKey, setPublicKey] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const storedPublicKey = await AsyncStorage.getItem('publicKey');
      if (storedPublicKey) {
        setPublicKey(storedPublicKey);
        console.log('Public Key:', storedPublicKey);
        
        const userResponse = await fetch(`${BASE_URL}/api/user/${storedPublicKey}`);
        const userData = await userResponse.json();
        console.log(userData);

        if (userResponse.ok) {
          setUser(userData);
        } else {
          setError(userData.message || 'Something went wrong');
        }

        const videoResponse = await fetch(`${BASE_URL}/api/videos/user/${storedPublicKey}`);
        const videoData = await videoResponse.json();
        console.log(videoData);

        if (videoResponse.ok) {
          setVideos(videoData);
        } else {
          setError(videoData.message || 'Something went wrong');
        }
      } else {
        setError('Public key not found');
      }
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handlePressIn = (id) => {
    setPlayingVideo(id); // Đặt video hiện tại đang phát
  };

  const handlePressOut = () => {
    setPlayingVideo(null); // Dừng phát video khi nhả ra
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.errorMessage}>{`Error: ${error}`}</Text>;

  if (!user) return <Text style={styles.errorMessage}>No user data available</Text>;

  return (
    <View style={styles.container}>
        <View style={styles.iconContainer}>
        <LinearGradient
          colors={['#00FFA3', '#DC1FFF', '#00F5FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <TouchableOpacity style={styles.buttonContent} activeOpacity={0.8}>
            <Entypo name="wallet" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
      {/* Card View */}
      <View style={styles.card}>
        <Image source={{ uri: `${BASE_URL}${user.img}` }} style={styles.image} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <FlatList
        data={videos}
        keyExtractor={(item) => item._id}
        numColumns={numColumns} // Số cột trong mỗi hàng
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPressIn={() => handlePressIn(item._id)}
            onPressOut={handlePressOut}
          >
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: `${BASE_URL}${item.url}` }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={playingVideo === item._id} // Phát video nếu video đang phát
                isLooping={false}
                style={styles.video}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#000',
      },
      iconContainer: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1, // Đảm bảo rằng biểu tượng nằm trên các phần tử khác
      },
      gradient: {
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      card: {
        backgroundColor: '#1e2639',
        borderRadius: 10,
        marginTop: 20,
        padding: 15,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 15, // Thêm độ sâu cho card trên Android
        color:'#fff',
      },
      image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color:'#fff',
      },
      email: {
        fontSize: 18,
        color: '#666',
        color:'#aeaeae',
      },
      videoContainer: {
        flex: 1,
        margin: 5, // Khoảng cách giữa các video
      },
      video: {
        width: videoWidth,
        height: videoHeight,
      },
      columnWrapper: {
        justifyContent: 'space-between',
      },
      errorMessage: {
        fontSize: 18,
        color: 'red',
      },
    });

export default Profile;
