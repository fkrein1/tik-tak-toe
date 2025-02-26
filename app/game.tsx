import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";

interface GameState {
  id: string;
  player_x: string;
  player_o: string | null;
  board: {
    cells: Record<string, string>;
  };
  current_player: string | null;
  winner: string | null;
}

const winningLines = [
  ["0,0", "0,1", "0,2"],
  ["1,0", "1,1", "1,2"],
  ["2,0", "2,1", "2,2"],
  ["0,0", "1,0", "2,0"],
  ["0,1", "1,1", "2,1"],
  ["0,2", "1,2", "2,2"],
  ["0,0", "1,1", "2,2"],
  ["0,2", "1,1", "2,0"],
];

export default function GameScreen() {
  const { gameId, player } = useLocalSearchParams<{ gameId: string; player: "X" | "O" }>();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gameId) return;

    const fetchGame = async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single();

      if (data) {
        setGameState(data);
        if (data.player_x && data.player_o && !data.current_player) {
          await supabase
            .from("games")
            .update({ current_player: "X" })
            .eq("id", gameId);
        }
      }
      if (error) Alert.alert("Error", error.message);
    };

    fetchGame();

    const channel = supabase
      .channel(`game:${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          const newState = payload.new as GameState;
          setGameState((prev) => ({
            ...prev,
            ...newState,
            board: {
              cells: {
                ...prev?.board.cells,
                ...newState.board.cells
              }
            }
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const checkWinner = (cells: Record<string, string>): string | null => {
    for (const line of winningLines) {
      const [a, b, c] = line;
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  };

  const handleCellPress = async (cellKey: string) => {
    if (!gameState || loading) return;
    
    if (!gameState.player_x || !gameState.player_o) {
      Alert.alert("Waiting for both players to join");
      return;
    }

    if (gameState.current_player !== player) {
      Alert.alert("Wait your turn!");
      return;
    }

    if (gameState.board.cells[cellKey] || gameState.winner) return;

    setLoading(true);
    
    const newCells = { ...gameState.board.cells, [cellKey]: player };
    const winner = checkWinner(newCells);
    const nextPlayer = winner ? player : player === "X" ? "O" : "X";

    const { error } = await supabase
      .from("games")
      .update({
        board: { cells: newCells },
        current_player: nextPlayer,
        winner: winner || null,
      })
      .eq("id", gameId);

    setLoading(false);

    if (error) {
      Alert.alert("Error", "Failed to make move");
      console.error(error);
    }
  };

  if (!gameState) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Code: {gameId}</Text>
      <Text style={styles.status}>
        {gameState.winner
          ? `Winner: ${gameState.winner}`
          : gameState.current_player
          ? `Current Player: ${gameState.current_player}`
          : "Waiting for players..."}
      </Text>

      {(!gameState.player_o || !gameState.player_x) && (
        <Text style={styles.waiting}>
          Waiting for {!gameState.player_o ? "Player O" : "Player X"} to join...
        </Text>
      )}

      <View style={styles.board}>
        {Object.entries(gameState.board.cells).map(([cellKey, value]) => (
          <TouchableOpacity
            key={cellKey}
            style={styles.cell}
            onPress={() => handleCellPress(cellKey)}
            disabled={
              !gameState.player_o ||
              !gameState.player_x ||
              gameState.current_player !== player ||
              !!value ||
              !!gameState.winner
            }
          >
            <Text style={styles.cellText}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    textAlign: "center",
    marginVertical: 10,
  },
  status: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  waiting: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 10,
  },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
  },
  cell: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#3498db",
  },
  cellText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#2c3e50",
  },
});