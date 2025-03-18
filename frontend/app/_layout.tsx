import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        presentation: 'card',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    />
  );
}
