import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  Text,
  Card,
  IconButton,
  Snackbar,
} from 'react-native-paper';
import { User } from './types/User';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import { loadUsersFromStorage, saveUsersToStorage } from './storage/storage';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? MD3DarkTheme : MD3LightTheme;

  const [users, setUsers] = useState<User[]>([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await loadUsersFromStorage();
    if (data) setUsers(data);
  };

  const addUser = async (user: User) => {
    const newUsers = [...users, user];
    setUsers(newUsers);
    await saveUsersToStorage(newUsers);
    showMessage('Usuário cadastrado com sucesso!');
  };

  const deleteUser = async (id: string) => {
    const filtered = users.filter((u) => u.id !== id);
    setUsers(filtered);
    await saveUsersToStorage(filtered);
    showMessage('Usuário removido!');
  };

  const showMessage = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
            <View style={styles.headerRow}>
              <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                CadastraAí 📋
              </Text>
              <IconButton
                icon={darkMode ? 'weather-sunny' : 'weather-night'}
                size={28}
                onPress={() => setDarkMode(!darkMode)}
                accessibilityLabel="Alternar modo claro/escuro"
              />
            </View>

            <Card style={styles.card}>
              <UserForm onSubmit={addUser} />
            </Card>

            <Card style={[styles.card, styles.listCard]}>
              <UserList users={users} onDelete={deleteUser} />
            </Card>

            <Snackbar
              visible={snackbarVisible}
              onDismiss={() => setSnackbarVisible(false)}
              duration={3000}
            >
              {snackbarMessage}
            </Snackbar>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  card: {
    marginBottom: 24,
    padding: 16,
    elevation: 3,
    borderRadius: 8,
  },
  listCard: {
    paddingVertical: 0,
  },
});
