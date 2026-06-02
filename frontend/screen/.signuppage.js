import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🚌 LatitudeLord</Text>
        <Text style={styles.subtitle}>
          Smart Bus Tracking System
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            CREATE ACCOUNT
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.loginText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F4C81',
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  subtitle: {
    color: '#ddd',
    marginTop: 5,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 25,
    elevation: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0F4C81',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 14,
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#FF7A00',
    padding: 16,
    borderRadius: 15,
    marginTop: 10,
  },

  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  loginText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#0F4C81',
  },
});