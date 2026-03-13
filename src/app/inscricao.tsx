import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import { api } from "@/server/api";
import { isAxiosError } from "axios";
import { useLocalSearchParams } from "expo-router"; // <-- ADICIONAR ISSO

export default function Inscricao() {
  // Puxa a modalidade que veio da tela anterior
  const { modalidadeSelecionada } = useLocalSearchParams(); 

  const [matricula, setMatricula] = useState("");
  // Preenche automaticamente o estado com o que veio do clique, mas permite edição se for string
  const [modalidade, setModalidade] = useState(
    typeof modalidadeSelecionada === 'string' ? modalidadeSelecionada : ""
  );
  const [carregando, setCarregando] = useState(false);

  // ... (mantenha o resto da função handleEnviarInscricao e do return exatamente igual ao seu código atual)
  async function handleEnviarInscricao() {
    // Validação Frontend (Nível Estudante)
    if (matricula.trim() === "" || modalidade.trim() === "") {
      Alert.alert("Erro de Validação", "Por favor, preenche todos os campos.");
      return; // Interrompe a função aqui, poupando recursos de rede
    }

    setCarregando(true);

    try {
      // Dispara o POST enviando os parâmetros exigidos pelo CP
      const response = await api.post("/inscricao", {
        matricula,
        modalidade
      });

      Alert.alert("Sucesso!", response.data.message);
      
      // Limpa o formulário após sucesso
      setMatricula("");
      setModalidade("");

    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert(
          "Falha na Inscrição", 
          error.response?.data?.message || "Erro de conexão com a API."
        );
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Inscrição em Modalidade</Text>
      <Text style={styles.subtitulo}>Insere os teus dados para participar no Interclasse</Text>

      <Text style={styles.label}>Tua Matrícula (RM):</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 98765"
        keyboardType="numeric"
        value={matricula}
        onChangeText={setMatricula}
      />

      <Text style={styles.label}>Modalidade Desejada:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Futsal, Vôlei..."
        value={modalidade}
        onChangeText={setModalidade}
      />

      <Pressable 
        style={({ pressed }) => [
          styles.botao,
          pressed && { opacity: 0.8 },
          carregando && { opacity: 0.5 }
        ]}
        onPress={handleEnviarInscricao}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.textoBotao}>Confirmar Inscrição</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: "#0a27e2",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});