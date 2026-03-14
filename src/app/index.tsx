import { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  Alert, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { api } from "@/server/api";
import { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ApiErrorResponse {
  message: string;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function verificarSessao() {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("@interclasse_user");
        if (usuarioSalvo) {
          router.replace("/modalidades");
        }
      } catch (e) {
        console.error("Erro ao ler sessão", e);
      }
    }
    verificarSessao();
  }, []);

  function handleEmailChange(texto: string) {
    setEmail(texto);
    if (texto.trim() === "") {
      setEmailError("O campo não pode ficar vazio.");
    } else if (!texto.includes("@") && !texto.toLowerCase().startsWith("rm")) {
      setEmailError("Insira um RM ou E-mail válido.");
    } else {
      setEmailError(null);
    }
  }

  function handlePasswordChange(texto: string) {
    setPassword(texto);
    if (texto.length < 3) {
      setPasswordError("A senha deve ter no mínimo 3 caracteres.");
    } else {
      setPasswordError(null);
    }
  }

  async function handleEntrar() {
    if (!email || emailError || !password || passwordError) {
      Alert.alert("Atenção", "Corrija os erros destacados antes de entrar.");
      return;
    }

    setCarregando(true);

    try {
      // await api.post("/login", { email, password }); // Simulação de chamada
      
      const perfilUsuario = {
        rm: email.trim(),
        nome: "Estudante Fiap",
        modalidade: "Nenhuma"
      };

      await AsyncStorage.setItem("@interclasse_perfil", JSON.stringify(perfilUsuario));
      await AsyncStorage.setItem("@interclasse_user", email);
      
      router.replace("/modalidades");
      
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        Alert.alert("Acesso Negado", error.response?.data?.message || "Servidor indisponível.");
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo Icon / Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#0a27e2', '#061a9c']}
            style={styles.logoBadge}
          >
            <MaterialIcons name="sports-kabaddi" size={48} color="#FFF" />
          </LinearGradient>
          <Text style={styles.overtitle}>TEMPORADA 2026</Text>
          <Text style={styles.titulo}>INTERCLASSE <Text style={styles.tituloDestaque}>FIAP</Text></Text>
        </View>

        <View style={styles.form}>
          {/* Input de Usuário */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>IDENTIFICAÇÃO</Text>
            <View style={[styles.inputContainer, emailError ? styles.inputError : null]}>
              <MaterialIcons name="person-outline" size={20} color={emailError ? "#ff4444" : "#666"} />
              <TextInput
                style={styles.input}
                placeholder="E-mail ou RM"
                placeholderTextColor="#444"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleEmailChange}
                value={email}
              />
            </View>
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          {/* Input de Senha */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>SENHA ACESSO</Text>
            <View style={[styles.inputContainer, passwordError ? styles.inputError : null]}>
              <MaterialIcons name="lock-outline" size={20} color={passwordError ? "#ff4444" : "#666"} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#444"
                secureTextEntry
                onChangeText={handlePasswordChange}
                value={password}
              />
            </View>
            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
          </View>

          {/* Botão de Entrada */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              (carregando || !!emailError || !!passwordError || !email || !password) && styles.buttonDisabled,
              pressed && { transform: [{ scale: 0.98 }] }
            ]}
            disabled={carregando || !!emailError || !!passwordError || !email || !password}
            onPress={handleEntrar}
          >
            {carregando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>ACESSAR PORTAL</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
              </>
            )}
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          Desenvolvido para fins educacionais • 2026
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { flex: 1, justifyContent: "center", padding: 32 },
  header: { alignItems: "center", marginBottom: 40 },
  logoBadge: { 
    width: 100, 
    height: 100, 
    borderRadius: 30, 
    justifyContent: "center", 
    alignItems: "center",
    marginBottom: 20,
    elevation: 10,
    shadowColor: "#0a27e2",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  overtitle: { color: "#0a27e2", fontWeight: "800", fontSize: 12, letterSpacing: 3 },
  titulo: { fontSize: 28, fontWeight: "900", color: "#FFF", marginTop: 5 },
  tituloDestaque: { color: "#0a27e2" },

  form: { width: "100%", gap: 20 },
  inputWrapper: { width: "100%" },
  inputLabel: { color: "#444", fontSize: 10, fontWeight: "900", marginBottom: 8, letterSpacing: 1 },
  inputContainer: { 
    flexDirection: "row",
    alignItems: "center",
    height: 60, 
    backgroundColor: "#1a1a1a", 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    borderWidth: 1, 
    borderColor: "#333",
    gap: 12
  },
  input: { flex: 1, color: "#FFF", fontSize: 16, fontWeight: "500" },
  inputError: { borderColor: "#ff4444" },
  errorText: { color: "#ff4444", fontSize: 11, marginTop: 6, fontWeight: "600" },

  button: { 
    height: 60, 
    backgroundColor: "#0a27e2", 
    borderRadius: 12, 
    flexDirection: "row",
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 10,
    gap: 10
  },
  buttonDisabled: { opacity: 0.3, backgroundColor: "#333" },
  buttonText: { fontSize: 14, fontWeight: "900", color: "#fff", letterSpacing: 1 },
  
  footerText: { 
    textAlign: "center", 
    color: "#333", 
    fontSize: 12, 
    marginTop: 40, 
    fontWeight: "600" 
  }
});