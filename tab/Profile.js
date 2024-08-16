import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { Video } from 'expo-av';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Nhập useNavigation
import { LinearGradient } from 'expo-linear-gradient';
import Entypo from '@expo/vector-icons/Entypo';
import { LogBox } from 'react-native';

// Tắt tất cả các cảnh báo màu vàng
LogBox.ignoreAllLogs(true);
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
  const navigation = useNavigation();
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


  const navigateToWallet = () => {
    navigation.navigate('Wallet'); // Điều hướng sang màn hình Wallet
  };
  const updateKol = async () => {
    if (!publicKey) {
      Alert.alert('Lỗi', 'Public key chưa được thiết lập.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/update-video-kol`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publickey: publicKey, newKolValue: "kol" }), // Thay đổi giá trị 123 thành giá trị kol mong muốn
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thành Công', data.message);
      } else {
        Alert.alert('Lỗi', data.error || 'Không thể cập nhật kol.');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật kol.');
    }
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
          <TouchableOpacity
            style={styles.buttonContent}
            activeOpacity={0.8}
            onPress={navigateToWallet} // Điều hướng khi nhấn nút
          >
            <Entypo name="wallet" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity style={styles.buttonKol} activeOpacity={0.8} onPress={updateKol}>
          <Text>Làm kol</Text>
        </TouchableOpacity>
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
  buttonKol: {
    marginTop: 50,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  }
});

export default Profile;
