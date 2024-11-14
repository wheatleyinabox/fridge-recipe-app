// App.tsx
import { React, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import RecipeList from "../../components/RecipeList"; // Update path as needed
import { Colors } from "@/constants/Colors";
import { SearchBar } from "react-native-elements";
const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const updateSearch = (query: string) => {
    setSearchQuery(query);
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.textTitle}>FRIDGE CHEF</Text>
      </View>
      <View style={styles.searchBarOuter}>
        <SearchBar
          placeholder="Search..."
          onChangeText={updateSearch}
          value={searchQuery}
          platform="default" // Optional: Use "android", "ios", or "default"
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={{ backgroundColor: "#f8f8f8" }}
          round={true}
        />
      </View>
      <RecipeList searchQuery={searchQuery} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  textTitle: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.light.secondary,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  searchBarOuter: {
    backgroundColor: "#f8f8f8",
  },
  searchBarContainer: {
    width: 300,
    backgroundColor: "",
    padding: -10,
    borderBlockColor: "#D0D0D0",
    alignSelf: "center",
  },
});

export default App;
