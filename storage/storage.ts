import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';

const STORAGE_KEY = '@cadastraai_users';

export async function saveUsersToStorage(users: User[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
  }
}

export async function loadUsersFromStorage(): Promise<User[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    return [];
  }
}
