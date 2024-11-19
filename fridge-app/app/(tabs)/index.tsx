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
      <SearchBar
        placeholder="Search..."
        onChangeText={updateSearch}
        value={searchQuery}
        platform="default" // Optional: Use "android", "ios", or "default"
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchInputContainer}
        round={true}
      />
      <RecipeList searchQuery={searchQuery} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8f8f8",
    paddingTop: 25,
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    width: "100%",
    paddingLeft: 50,
    paddingRight: 50,
    alignSelf: "center",
    borderColor: "#f8f8f8",
  },
  searchInputContainer: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  textTitle: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.light.secondary,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
});

export default App;
