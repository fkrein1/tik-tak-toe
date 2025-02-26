import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <View style={styles.buttonContainer}>
        <Link href="/create-game" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create Game</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/join-game" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Join Game</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#2c3e50",
  },
  buttonContainer: {
    width: "80%",
    gap: 20,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});