import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [savedImageUri, setSavedImageUri] = useState("");

  const saveImage = async (uri: string) => {
    try {
      const fileName = uri.split("/").pop();
      const newPath = `${FileSystem.documentDirectory}images/${fileName}`;

      console.log("PENEWpath LOCATION HERE LOCATION HERE!@#!@#", newPath);
      setSavedImageUri(newPath);

      const jsonFilePath = `${FileSystem.documentDirectory}savedImages.json`;
      let imageData = [];

      const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
      if (fileInfo.exists) {
        const existingData = await FileSystem.readAsStringAsync(jsonFilePath);
        imageData = JSON.parse(existingData);
      }

      imageData.push({
        uri: newPath,
        date: new Date().toISOString(),
      });

      await FileSystem.writeAsStringAsync(
        jsonFilePath,
        JSON.stringify(imageData)
      );
      console.log("Image URI saved to JSON:", jsonFilePath);

      // PRINT JSON FOR VERIFICATION
      verifyJsonFile();

      // DISPLAY IMAGE FOR VERIFICATION
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "images",
        { intermediates: true }
      );
      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });

      console.log("Image saved into app!");
      setModalTitle("Success");
    } catch (error) {
      console.error("Error saving image:", error);
      setModalTitle("Failure");
    }
  };

  const verifyJsonFile = async () => {
    const jsonFilePath = `${FileSystem.documentDirectory}savedImages.json`;
    const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);

    if (fileInfo.exists) {
      const data = await FileSystem.readAsStringAsync(jsonFilePath);
      console.log("Saved JSON data:", JSON.parse(data));
    } else {
      console.log("No JSON file found.");
    }
  };

  const selectImage = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!image.canceled) {
      const uri = image.assets[0].uri;
      saveImage(uri);
      openModal();
    } else {
      setModalTitle("Failure");
      openModal();
    }
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
        <Pressable style={styles.button} onPress={selectImage}>
          <Text style={styles.title}>Upload Image</Text>
        </Pressable>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalText}>
              {modalTitle === "Success"
                ? "Image uploaded successfully!"
                : "Failed to upload image."}
            </Text>

            {savedImageUri ? ( // Conditionally render the image
              <Image source={{ uri: savedImageUri }} style={styles.image} />
            ) : null}

            <TouchableOpacity onPress={closeModal} style={styles.button}>
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
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#5B795D",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    paddingBottom: 20,
  },
});
