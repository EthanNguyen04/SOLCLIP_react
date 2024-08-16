import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Đảm bảo bạn đã cài AsyncStorage
import { BASE_URL } from '../config';
import { useFocusEffect } from '@react-navigation/native';

const Maket = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publicKey, setPublicKey] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Tải public key từ AsyncStorage
      const storedPublicKey = await AsyncStorage.getItem('publicKey');
      if (storedPublicKey) {
        setPublicKey(storedPublicKey);
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy public key.');
      }
  
      // Tải dữ liệu từ API
      const response1 = await fetch(`${BASE_URL}/api/fetch-items`);
      const data1 = await response1.json();
  
      const response2 = await fetch(`${BASE_URL}/api/nfts`);
      const data2 = await response2.json();
  
      if (response1.ok && response2.ok) {
        const fetchedItems = data1.data.map(item1 => {
          const matchedItem = data2.find(item2 => item2.id === item1.item.id);
          return {
            id: item1.item.id,
            name: item1.item.name,
            description: item1.item.description,
            imageUrl: item1.item.imageUrl,
            priceCents: item1.item.priceCents || 0,
            kol: matchedItem ? matchedItem.kol : null, // Include kol field
            from: matchedItem ? matchedItem.from : 0,
            to: matchedItem ? matchedItem.to : 0
          };
        }).filter(item => item.priceCents > 0);
  
        setItems(fetchedItems);
      } else {
        setError(data1.error || data2.error || 'Failed to fetch items');
      }
    } catch (err) {
      setError('An error occurred while fetching items');
    } finally {
      setLoading(false);
    }
  }, []);
  

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handlePurchase = async (item) => {
    if (!publicKey) {
      Alert.alert('Lỗi', 'Public key chưa được thiết lập.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/buy-nft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idNFT: item.id, buyerId: publicKey })
      });
console.log(item.id)
      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Mua NFT Thành Công',
          `Nhấn vào liên kết sau để hoàn tất giao dịch:\n${data.consentUrl}`,
          [
            {
              text: 'Copy Link',
              onPress: () => {
                Clipboard.setString(data.consentUrl);
                Alert.alert('Đã sao chép liên kết vào bộ nhớ tạm');
              },
            },
            { text: 'OK' },
          ]
        );
      } else {
        Alert.alert('Lỗi', data.error || 'Không thể mua NFT');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xử lý yêu cầu mua NFT.');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text>{item.description}</Text>
          <Text>Price: ${(item.priceCents / 100).toFixed(2)}</Text>
          <Text>From: {item.from}</Text>
          <Text>kol: {item.kol}</Text>
          <Text>To: {item.to}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handlePurchase(item)}>
            <Text style={styles.buttonText}>Mua</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#00F5FF', // Màu nền của nút
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Maket;
