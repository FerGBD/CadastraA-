import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserFormProps {
  onSubmit: (user: User) => void;
}

export default function UserForm({ onSubmit }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Regex para validar apenas letras e espaços
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
  // Regex básico para email
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
      onSubmit({ id: Date.now().toString(), name: name.trim(), email: email.trim() });
      setName('');
      setEmail('');
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
        Cadastrar
      </Button>
    </View>
  );
}
