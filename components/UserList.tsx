import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { List, IconButton, useTheme, Text } from 'react-native-paper';
import { User } from '../types/User';

type Props = {
  users: User[];
  onDelete: (id: string) => void;
  onEdit: (user: User) => void;
};

export default function UserList({ users, onDelete, onEdit }: Props) {
  const theme = useTheme();

  if (users.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          Nenhum usuário cadastrado ainda.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <List.Item
          title={item.name}
          description={item.email}
          left={(props) => <List.Icon {...props} icon="account-circle" />}
          right={(props) => (
            <View style={styles.listItemActions}>
              <IconButton
                {...props}
                icon="pencil"
                iconColor={theme.colors.primary}
                onPress={() => onEdit(item)}
                accessibilityLabel={`Editar usuário ${item.name}`}
              />
              <IconButton
                {...props}
                icon="delete"
                iconColor={theme.colors.error}
                onPress={() => onDelete(item.id)}
                accessibilityLabel={`Remover usuário ${item.name}`}
              />
            </View>
          )}
          style={styles.listItem}
          titleStyle={{ fontWeight: 'bold' }}
          descriptionStyle={{ fontSize: 14 }}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={{ paddingVertical: 8 }}
      accessibilityRole="list"
    />
  );
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: 'transparent',
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  listItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
