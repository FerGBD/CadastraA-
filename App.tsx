import 'react-native-gesture-handler';
import React, { useEffect, useState, useMemo } from 'react';
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
  Button,
  TextInput,
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

  const [originalUsersOrder, setOriginalUsersOrder] = useState<User[]>([]);
  const [isAlphabeticalOrder, setIsAlphabeticalOrder] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await loadUsersFromStorage();
    if (data) {
      setUsers(data);
      setOriginalUsersOrder(data);
    }
  };

  const saveUser = async (user: User) => {
    console.log('saveUser: função chamada com user:', user);
    let updatedUsers: User[]; // Tipagem para updatedUsers
    if (user.id) { // Se o usuário já tem um ID, é uma edição
      updatedUsers = users.map((u) => (u.id === user.id ? user : u));
      showMessage('Usuário atualizado com sucesso!');
    } else { // Caso contrário, é um novo usuário. Geramos um novo ID.
      const newUserWithId: User = { ...user, id: Date.now().toString() };
      updatedUsers = [...users, newUserWithId];
      showMessage('Usuário cadastrado com sucesso!');
    }
    setUsers(updatedUsers);
    setOriginalUsersOrder(updatedUsers);
    setIsAlphabeticalOrder(false);
    setEditingUser(null); // Essa linha DEVE resetar o modo de edição
    console.log('saveUser: setEditingUser(null) chamado. Próximo valor de editingUser (na renderização):', null);
    await saveUsersToStorage(updatedUsers);
  };

  const deleteUser = async (id: string) => {
    const filtered = originalUsersOrder.filter((u) => u.id !== id);
    setUsers(filtered);
    setOriginalUsersOrder(filtered);
    setIsAlphabeticalOrder(false);
    setEditingUser(null);
    await saveUsersToStorage(filtered);
    showMessage('Usuário removido com sucesso!');
  };

  const showMessage = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  const toggleSort = () => {
    if (isAlphabeticalOrder) {
      setUsers(originalUsersOrder);
      setIsAlphabeticalOrder(false);
      showMessage('Lista desordenada (ordem de cadastro)');
    } else {
      const sortedUsers = [...users].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
      );
      setUsers(sortedUsers);
      setIsAlphabeticalOrder(true);
      showMessage('Lista ordenada por nome (A-Z)');
    }
  };

  const startEditUser = (user: User) => {
    setEditingUser(user);
    showMessage(`Editando usuário: ${user.name}`);
  };

  const cancelEditUser = () => {
    setEditingUser(null);
    showMessage('Edição cancelada.');
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.email.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [users, searchTerm]);

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

            <View style={styles.searchContainer}>
              <TextInput
                label="Pesquisar usuários"
                value={searchTerm}
                onChangeText={setSearchTerm}
                mode="outlined"
                style={styles.searchInput}
                left={<TextInput.Icon icon="magnify" />}
              />
            </View>

            <Card style={styles.card}>
              <UserForm
                onSubmit={saveUser}
                editingUser={editingUser}
                onCancelEdit={cancelEditUser}
              />
            </Card>

            <Card style={[styles.card, styles.listCard]}>
              <View style={styles.sortButtonContainer}>
                <Button
                  mode="outlined"
                  onPress={toggleSort}
                  icon={isAlphabeticalOrder ? "sort-variant" : "sort-alphabetical-ascending"}
                >
                  {isAlphabeticalOrder ? "Desordenar" : "Ordenar por Nome (A-Z)"}
                </Button>
              </View>

              <UserList users={filteredUsers} onDelete={deleteUser} onEdit={startEditUser} />
            </Card>

            <Snackbar
              visible={snackbarVisible}
              onDismiss={() => setSnackbarVisible(false)}
              duration={3000}
              style={styles.snackbarStyle}
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
  sortButtonContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInput: {
  },
  snackbarStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
});
