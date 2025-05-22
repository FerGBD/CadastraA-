import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserFormProps {
  onSubmit: (user: User) => void;
  editingUser: User | null;
  onCancelEdit: () => void;
}

export default function UserForm({ onSubmit, editingUser, onCancelEdit }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    console.log('UserForm useEffect: editingUser changed to:', editingUser);
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setNameError('');
      setEmailError('');
    } else {
      // Este bloco DEVE ser executado quando editingUser é NULL (modo de cadastro)
      setName('');
      setEmail('');
      setNameError('');
      setEmailError('');
    }
  }, [editingUser]);

  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let valid = true;

    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      valid = false;
    } else if (!nameRegex.test(name)) {
      setNameError('Nome só pode conter letras e espaços');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Email inválido');
      valid = false;
    } else {
      setEmailError('');
    }

    return valid;
  };

  const handleSubmit = () => {
    if (validate()) {
      const userToSubmit: User = { // Tipagem explícita aqui
        id: editingUser ? editingUser.id : '', // ID será gerado no App.tsx se for novo
        name: name.trim(),
        email: email.trim()
      };
      console.log('UserForm handleSubmit: Chamando onSubmit com user:', userToSubmit);
      onSubmit(userToSubmit);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        label="Nome"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={{ marginBottom: 0 }}
        error={!!nameError}
      />
      {nameError ? <HelperText type="error">{nameError}</HelperText> : null}

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={{ marginBottom: 0, marginTop: 12 }}
        error={!!emailError}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <HelperText type="error">{emailError}</HelperText> : null}

      <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 16 }}>
        {editingUser ? 'Salvar Alterações' : 'Cadastrar'}
      </Button>

      {editingUser && (
        <Button mode="text" onPress={onCancelEdit} style={{ marginTop: 8 }}>
          Cancelar Edição
        </Button>
      )}
    </View>
  );
}
