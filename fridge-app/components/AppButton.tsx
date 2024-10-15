import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function AppButton({ title, style, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.appButtonContainer, style]}
    >
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appButtonContainer: {
    backgroundColor: Colors.light.background,
    paddingVertical: 16, // Adjusted pading for better sizing
    paddingHorizontal: 32,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: Colors.light.primary,
    alignItems: "center", // Center the text horizontally
    marginVertical: 10, // Vertical margin for spacing between buttons
    width: 300, // Set a fixed width for all buttons
  },
  appButtonText: {
    color: Colors.light.primary,
    fontWeight: "600",
    fontSize: 24, // Adjusted font size for better readability
    textAlign: "center", // Center the text
  },
});
