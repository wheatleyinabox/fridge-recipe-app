import React, { useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);

  const uploadImage = () => {
    Alert.alert("Button pressed!");
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>

      <View style={styles.banner}>
        <Text style={styles.title}>Need to scan something?</Text>
      </View>

      <Text style={styles.text}>
        Upload your image here and we'll do the rest!
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Upload Image" onPress={openModal} />
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Upload your image here!</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "25%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  banner: {
    width: Dimensions.get("window").width,
    padding: 20,
    backgroundColor: "#5B795D",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    top: "70%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  text: {
    margin: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 10, // Adds shadow for Android
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#5B795D",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  }
});
