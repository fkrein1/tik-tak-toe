import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="create-game" options={{ title: "Create Game" }} />
      <Stack.Screen name="join-game" options={{ title: "Join Game" }} />
      <Stack.Screen name="game" options={{ title: 'Tik Tak Toe' }} />
    </Stack>
  );
}