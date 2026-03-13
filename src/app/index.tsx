import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Image } from "react-native";
import { api } from "@/server/api";
import { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Home() {
  // Dados pré-escritos conforme você pediu para testes rápidos
  const [email, setEmail] = useState("gg@gmail.com");
  const [password, setPassword] = useState("123");

  useEffect(() => {
    async function verificarSessao() {
      const usuarioSalvo = await AsyncStorage.getItem("@interclasse_user");
      if (usuarioSalvo) {
        router.replace("/modalidades");
      }
    }
    verificarSessao();
  }, []);

  async function handleEntrar() {
    try {
      const response = await api.post("/login", { email, password });

      // Salva a sessão e avança
      await AsyncStorage.setItem("@interclasse_user", email);
      router.replace("/modalidades");
      
    } catch (error) {
      if (isAxiosError(error)) {
        return Alert.alert(
          "Acesso Negado",
          error.response?.data?.message || "Erro ao conectar.",
          [{ text: "Ok" }]
        );
      }
      Alert.alert("Aviso", "Não foi possível conectar. Verifique o servidor.");
    }
  }

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: "https://via.placeholder.com/150" }} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titulo}>Interclasse Digital</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          (!email || !password) && { opacity: 0.5 },
          pressed && { opacity: 0.8 }
        ]}
        disabled={!email || !password}
        onPress={handleEntrar}
      >
        <Text style={styles.text}>Entrar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 16, backgroundColor: "#F5F5F5" },
  logo: { width: 120, height: 120, marginBottom: 10, borderRadius: 60 },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
  input: { height: 54, width: "100%", backgroundColor: "#E3E3E3", borderRadius: 8, padding: 16, fontSize: 16 },
  button: { height: 54, width: "100%", backgroundColor: "#0a27e2", borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 10 },
  text: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});