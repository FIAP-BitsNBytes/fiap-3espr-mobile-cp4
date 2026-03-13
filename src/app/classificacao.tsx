import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { api } from "@/server/api";
import { isAxiosError } from "axios";

// Tipagem básica para garantir consistência dos dados
type Turma = {
  id: string;
  nome: string;
  pontos: number;
};

export default function Classificacao() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [carregando, setCarregando] = useState(true);

  async function buscarClassificacao() {
    try {
      // Faz o GET para o endpoint que criarás na tua API
      const response = await api.get("/classificacao");
      setTurmas(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert("Erro", "Não foi possível carregar a tabela.");
      }
    } finally {
      setCarregando(false);
    }
  }

  // O array vazio [] garante que isto só executa UMA VEZ ao abrir o ecrã
  useEffect(() => {
    buscarClassificacao();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabela de Classificação</Text>

      {carregando ? (
        <Text style={styles.aviso}>A carregar pontuações...</Text>
      ) : (
        <FlatList
          data={turmas}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.posicao}>{index + 1}º</Text>
              <Text style={styles.nomeTurma}>{item.nome}</Text>
              <Text style={styles.pontos}>{item.pontos} pts</Text>
            </View>
          )}
          // Mensagem caso a API devolva um array vazio
          ListEmptyComponent={<Text style={styles.aviso}>Nenhuma pontuação registada.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F5F5F5",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2, // Sombra subtil no Android
  },
  posicao: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a27e2",
    width: 40,
  },
  nomeTurma: {
    fontSize: 16,
    flex: 1,
  },
  pontos: {
    fontSize: 16,
    fontWeight: "bold",
  },
  aviso: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});