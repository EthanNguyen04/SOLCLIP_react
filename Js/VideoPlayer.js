import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Video } from 'expo-av'; // Đảm bảo đã cài đặt expo-av để phát video
import { PanGestureHandler } from 'react-native-gesture-handler'; // Import PanGestureHandler

const { width } = Dimensions.get('window');

const VideoPlayer = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://192.168.1.18:3000/api/videos"); // Sử dụng địa chỉ IP của máy tính
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data = await response.json();
        setVideos(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleGestureEvent = (event) => {
    if (event.nativeEvent.translationY < -50) {
      // Vuốt lên
      handleNext();
    } else if (event.nativeEvent.translationY > 50) {
      // Vuốt xuống
      handlePrev();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  const video = videos[currentIndex];
  const videoUrl = video.url.replace('\\', '/'); // Chuyển đổi dấu gạch chéo ngược thành dấu gạch chéo xuôi

  return (
    <PanGestureHandler onGestureEvent={handleGestureEvent}>
      <View style={styles.container}>
        {video && (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: `http://192.168.1.18:3000${videoUrl}` }} // Sử dụng địa chỉ IP của máy tính
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              shouldPlay
            />
            <Text style={styles.title}>{video.title}</Text>
            <Text>{video.content}</Text>
          </View>
        )}
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  videoContainer: {
    width: width * 0.9,
    height: width * 0.56,
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default VideoPlayer;
