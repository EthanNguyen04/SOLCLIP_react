import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { LogBox } from 'react-native';

// Tắt tất cả các cảnh báo màu vàng
LogBox.ignoreAllLogs(true);
const Nft = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    const loadSeedPhrase = async () => {
      try {
        const storedPublicKey = await AsyncStorage.getItem('publicKey');
        if (storedPublicKey) {
          setPublicKey(storedPublicKey);
          console.log('Public Key:', storedPublicKey);
        }
      } catch (error) {
        console.error('Lỗi khi tải mã seed phrase:', error);
      }
    };

    loadSeedPhrase();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response1 = await fetch(`${BASE_URL}/api/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ownerReferenceId: publicKey }),
        });
        const data1 = await response1.json();

        const response2 = await fetch(`${BASE_URL}/api/nfts`);
        const data2 = await response2.json();

        if (response1.ok && response2.ok) {
          if (Array.isArray(data1.data) && data1.data.length > 0) {
            const filteredItems = data1.data
              .filter(item => item.item && item.item.owner && item.item.owner.referenceId === publicKey)
              .map(item1 => {
                const matchedItem = data2.find(item2 => item2.id === item1.item.id);
                return {
                  id: item1.item.id,
                  imageUrl: item1.item.imageUrl,
                  name: item1.item.name,
                  kol: matchedItem ? matchedItem.kol : 'Không xác định',
                  from: matchedItem ? matchedItem.from : 'Không xác định',
                  to: matchedItem ? matchedItem.to : 'Không xác định'
                };
              });

            if (filteredItems.length > 0) {
              setItems(filteredItems);
            } else {
              setError('Không có NFT nào được tìm thấy cho khóa công khai này.');
            }
          } else {
            setError('Không có dữ liệu.');
          }
        } else {
          setError('Đã xảy ra lỗi khi lấy dữ liệu.');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi truy xuất dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    if (publicKey) {
      fetchItems();
    }
  }, [publicKey]);

  const handleUse = async (item) => {
    if (!publicKey) {
      Alert.alert('Lỗi', 'Public key chưa được thiết lập.');
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/api/update-user-nft/${publicKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idNft: item.id }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Thành Công', `Bạn đã sử dụng NFT ${item.name} thành công!`);
  
        // Lưu trữ `from` và `to` vào AsyncStorage dưới dạng chuỗi
        const from = String(item.from); // Chuyển đổi `from` thành chuỗi
        const to = String(item.to); // Chuyển đổi `to` thành chuỗi
        const kol = String(item.kol);
        await AsyncStorage.setItem('from', from);
        await AsyncStorage.setItem('to', to);
        await AsyncStorage.setItem('kol', kol);
      console.log(`Đã lưu : ${kol}`);
        console.log(`Đã lưu : ${from} đến ${to}`);
      } else {
        Alert.alert('Lỗi', data.error || 'Không thể cập nhật thông tin người dùng.');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thông tin.');
    }
  };
  

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorMessage}>{`${error}`}</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyMessage}>Bạn chưa mua NFT nào</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{backgroundColor:'#1e2639'}}
      data={items}
      keyExtractor={item => item.id}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={styles.cardContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.id}>{item.id}</Text>
            <Text style={styles.fromTo}>kol: {item.kol}</Text>
            <Text style={styles.fromTo}>Từ: {item.from}</Text>
            <Text style={styles.fromTo}>Đến: {item.to}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleUse(item)}>
              <Text style={styles.buttonText}>Sử dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    marginTop: 20,
  },
  cardContent: {
    marginTop: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  id: {
    fontSize: 14,
    color: '#666',
  },
  fromTo: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 18,
    color: 'red',
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
  },
});

export default Nft;
