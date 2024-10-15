import AppButton from "@/components/AppButton";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Alert, Dimensions, StyleSheet, View } from "react-native";

export default function main_page() {
  return (
    <View style={styles.container}>
      <AppButton
        title="Scanner"
        onPress={() => Alert.alert("Scanner Button Pressed")}
      />
      <AppButton
        title="Planner"
        onPress={() => Alert.alert("Planner Button Pressed")}
      />
      <AppButton
        title="Scheduler"
        onPress={() => Alert.alert("Scheduler Button Pressed")}
      />
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
