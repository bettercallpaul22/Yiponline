import { useAppDispatch, useAppSelector } from '@/src/store/store';
import { removeProduct } from '@/src/store/productSlice';
import { showToast } from '@/src/store/toastSlice';
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Apple iPhone 14',
    price: 899000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQP-D5nCpJZ1owyEJDI5MGMwtlhdu6fguBrQ&s',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S23',
    price: 780000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTShasI44tc1NhTZWXxzu8sc6tkzIWps6t05w&s',
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Headphones',
    price: 210000,
    image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
  },
];

const Products = () => {
  const dispatch = useAppDispatch()
const {products} = useAppSelector(state=>state.product)
  const removeItem = (id: string) => {
    Alert.alert('Remove Product', 'Are you sure you want to remove this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          dispatch(removeProduct(id))
          dispatch(showToast({
            message: 'Product removed successfully',
            type: 'info',
            duration:3000,
          }))
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₦{item.price.toLocaleString()}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.id)}
        >
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Product List</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
            No products available.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    backgroundColor: '#f9f9f9',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4f',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  removeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
