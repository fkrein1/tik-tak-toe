import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";


export default function CreateGameScreen() {
  const [loading, setLoading] = useState(false);
  const [gameCode, setGameCode] = useState("");

  const handleCreateGame = async () => {
    if (gameCode.length !== 4) {
      Alert.alert("Error", "Game code must be 4 characters");
      return;
    }

    setLoading(true);
    
    const { data, error } = await supabase
    .from("games")
    .insert([{  
      id: gameCode,
      player_x: "X",
      board: {
        cells: {
          "0,0": "", "0,1": "", "0,2": "",
          "1,0": "", "1,1": "", "1,2": "",
          "2,0": "", "2,1": "", "2,2": ""
        }
      }
    }])
    .select();

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    router.push({ pathname: "/game", params: { gameId: gameCode, player: "X" } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Game</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 4-character code"
        value={gameCode}
        onChangeText={setGameCode}
        maxLength={4}
        autoCapitalize="characters"
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={handleCreateGame}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Game"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  disabled: {
    backgroundColor: "#95a5a6",
  },
});