import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "@/src/store/productSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/store";
import { hideToast, showToast } from "@/src/store/toastSlice";
import ToastContainer from "@/components/ToastContainer";
import { Link } from "expo-router";
import * as Notifications from "expo-notifications";

const triggerLocalNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🎉 Product Added!",
      body: "Your product was successfully added.",
      sound: true,
    },
    trigger: null,
  });
};

const ProductFormScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { products } = useAppSelector((state) => state.product);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useAppDispatch();
  const clearForm = () => {
    setName("");
    setPrice("");
    setImageUri(null);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera roll permission is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddProduct = () => {
    if (!name || !price || !imageUri) {
      dispatch(
        showToast({
          message: "Please fill out all fields",
          type: "error",
          duration: 3000,
          position: "top",
        })
      );

      //   Alert.alert("Error", "Please fill out all fields");
      return;
    }
    if (products.length >= 5) {
      dispatch(
        showToast({
          message: "You have reached the maximum number of products",
          type: "error",
          duration: 3000,
          position: "top",
        })
      );
      clearForm();

      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      image: imageUri,
    };

    dispatch(addProduct(newProduct));
    triggerLocalNotification();
    dispatch(
      showToast({
        message: "Product added successfully",
        type: "success",
        duration: 3000,
        position: "top",
      })
    );
    clearForm();
    setModalVisible(true); 

  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Form</Text>
        <Link href="./Products" style={styles.cartContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/891/891462.png",
            }}
            style={styles.cartIcon}
          />
          {products.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{products.length}</Text>
            </View>
          )}
        </Link>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          placeholder="Enter name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Price (₦)</Text>
        <TextInput
          placeholder="Enter price"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Product Image</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.placeholder}>No image selected</Text>
        )}

        <TouchableOpacity style={styles.pickButton} onPress={handlePickImage}>
          <Text style={styles.pickText}>Pick Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Product Added!</Text>
            <Text style={styles.modalMessage}>
              Your product has been successfully added.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.dismissButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Dismiss</Text>
              </TouchableOpacity>
              <Link
                href="./Products"
                style={[styles.modalButton, styles.viewButton]}
                onPress={() => setModalVisible(false)}
                
              >
                <Text style={[styles.modalButtonText, { textAlign: "center" }]}>
                  View Product
                </Text>
              </Link>
            
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  placeholder: {
    color: "#999",
    marginBottom: 10,
    fontStyle: "italic",
  },
  pickButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  pickText: {
    color: "#fff",
    fontWeight: "600",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  cartContainer: {
    position: "relative",
  },
  cartIcon: {
    width: 32,
    height: 32,
    tintColor: "#007bff",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  // New modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  dismissButton: {
    backgroundColor: "#6c757d",
  },
  viewButton: {
    backgroundColor: "#007bff",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
