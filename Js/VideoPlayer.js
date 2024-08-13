import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const VideoPlayer = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://192.168.1.18:3000/api/videos");
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

  useFocusEffect(
    React.useCallback(() => {
      videoRef.current?.playAsync();

      return () => {
        videoRef.current?.pauseAsync();
      };
    }, [])
  );

  const handleGestureEvent = (event) => {
    if (event.nativeEvent.translationY < -50) {
      handleNext();
    } else if (event.nativeEvent.translationY > 50) {
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
  const videoUrl = video.url.replace('\\', '/');

  return (
    <PanGestureHandler onGestureEvent={handleGestureEvent}>
      <View style={styles.container}>
        {video && (
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={{ uri: `http://192.168.1.18:3000${videoUrl}` }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              shouldPlay
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{video.title}</Text>
              <Text style={styles.content}>{video.content}</Text>
            </View>
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
  },
  videoContainer: {
    width: width,
    height: height,
    justifyContent: 'flex-end',
  },
  video: {
    backgroundColor:'black',
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: '7%'
  },
  textContainer: {
    position: 'absolute',
    bottom: 150,
    left: 10, // Cách bên trái 10
    width: '95%', // Điều chỉnh width để không tràn ra khỏi màn hình
    alignItems: 'flex-start', // Căn chỉnh text bắt đầu từ bên trái
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Nền mờ để dễ đọc chữ
    borderRadius:5,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    fontSize: 14,
    color: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default VideoPlayer;
