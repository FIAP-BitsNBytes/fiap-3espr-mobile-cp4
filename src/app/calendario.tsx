import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/server/api";

type Jogo = {
  id: string;
  modalidade: string;
  equipas: string;
  data: string;
  local: string;
};

const STORAGE_KEY = "@interclasse_jogos";

export default function Calendario() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarCalendario() {
    setCarregando(true);
    try {
      // 1. Tenta ler do armazenamento local primeiro (Offline-first)
      const dadosLocais = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (dadosLocais !== null) {
        // Se existe, converte a string de volta para Array e mostra
        setJogos(JSON.parse(dadosLocais));
        console.log("Dados carregados do AsyncStorage");
      } else {
        // 2. Se não tem no telemóvel, vai à API
        const response = await api.get("/calendario");
        setJogos(response.data);
        
        // 3. Converte o Array da API para String e guarda no telemóvel
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
        console.log("Dados da API guardados no AsyncStorage");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o calendário.");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  // Função extra para forçar a atualização (útil para o teu CP)
  async function atualizarDaAPI() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    carregarCalendario();
  }

  useEffect(() => {
    carregarCalendario();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Calendário de Jogos</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#0a27e2" style={styles.loader} />
      ) : (
        <FlatList
          data={jogos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.headerCard}>
                <Text style={styles.modalidade}>{item.modalidade}</Text>
                <Text style={styles.data}>{item.data}</Text>
              </View>
              <Text style={styles.equipas}>{item.equipas}</Text>
              <Text style={styles.local}>📍 {item.local}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.aviso}>Nenhum jogo agendado.</Text>}
        />
      )}

      {/* Botão para limpar a cache e forçar nova busca */}
      <Pressable 
        style={({ pressed }) => [styles.botaoRefresh, pressed && { opacity: 0.8 }]}
        onPress={atualizarDaAPI}
      >
        <Text style={styles.textoBotao}>Atualizar Calendário</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  loader: {
    marginTop: 50,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#0a27e2",
    elevation: 3,
  },
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalidade: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0a27e2",
  },
  data: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e20a27",
  },
  equipas: {
    fontSize: 18,
    marginBottom: 8,
    color: "#333",
  },
  local: {
    fontSize: 14,
    color: "#666",
  },
  aviso: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  botaoRefresh: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
  },
});