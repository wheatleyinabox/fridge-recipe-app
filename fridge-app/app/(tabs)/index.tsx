// App.tsx
import React from "react";
import { View, Text } from "react-native";
import RecipeList from "../../components/RecipeList"; // Update path as needed
import { Colors } from "@/constants/Colors";
const App: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text
          style={{
            fontSize: 48,
            fontWeight: "bold",
            textAlign: "center",
            color: Colors.light.secondary,
            padding: 20,
            backgroundColor: "#f8f8f8",
          }}
        >
          FRIDGE CHEF
        </Text>
      </View>
      <RecipeList />
    </View>
  );
};

export default App;
