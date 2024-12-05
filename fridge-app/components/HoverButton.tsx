import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

const HoverableButton: React.FC<{ title: string; onPress: () => void }> = ({
  title,
  onPress,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isHovered ? "#93BA8F" : "#A9DFA3" },
      ]}
      onPressIn={() => setIsHovered(true)} // Trigger hover effect
      onPressOut={() => setIsHovered(false)} // Reset to default
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4, // Adds a shadow effect on Android
  },
  buttonText: {
    color: Colors.light.secondary, // White text for contrast
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HoverableButton;
