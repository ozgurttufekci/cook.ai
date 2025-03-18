import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { fetchName } from '../../services/api';

export default function HomeScreen() {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadName = async () => {
      try {
        const fetchedName = await fetchName();
        setName(fetchedName);
      } catch (err) {
        setError('Failed to load name');
        console.error(err);
      }
    };

    loadName();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Cook.ai</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Text style={styles.name}>Hello, {name || 'Loading...'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    color: '#666',
  },
  error: {
    fontSize: 18,
    color: '#FF6B6B',
  },
});
