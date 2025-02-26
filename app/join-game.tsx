import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function JoinGameScreen() {
  const [loading, setLoading] = useState(false);
  const [gameCode, setGameCode] = useState("");

  const handleJoinGame = async () => {
    if (gameCode.length !== 4) {
      Alert.alert("Error", "Please enter a valid 4-character code");
      return;
    }

    setLoading(true);
    
    // Check if game exists
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameCode)
      .single();

    if (gameError || !gameData) {
      Alert.alert("Error", "Game not found");
      setLoading(false);
      return;
    }

    // Check if O player is available
    if (gameData.player_o) {
      Alert.alert("Error", "Game is already full");
      setLoading(false);
      return;
    }

    // Update game to add player O
    const { error } = await supabase
    .from("games")
    .update({ 
      player_o: "O",
      current_player: "X" // Reset current player when second player joins
    })
    .eq("id", gameCode);

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    router.push({ pathname: "/game", params: { gameId: gameCode, player: "O" } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Existing Game</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter game code"
        value={gameCode}
        onChangeText={setGameCode}
        maxLength={4}
        autoCapitalize="characters"
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={handleJoinGame}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Joining..." : "Join Game"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ...StyleSheet.create({ // Reuse styles from CreateGameScreen
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
      backgroundColor: "#e67e22",
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
  }),
});