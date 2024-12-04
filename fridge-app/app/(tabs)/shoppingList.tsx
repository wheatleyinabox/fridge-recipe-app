import { Colors } from "@/constants/Colors";
import React from "react";
import { Text, Dimensions, StyleSheet, View } from "react-native";

export default function shoppingList() {
  return (
    <View style={styles.container}>
      <Text>shopping page</Text>
      <Text>displaying all ingredients for a recipe</Text>
      <Text>backend stuff</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    height: Dimensions.get("screen").height,
    display: "flex",
    justifyContent: "center", // Center the buttons vertically
    alignItems: "center", // Center the buttons horizontally
  },
});
