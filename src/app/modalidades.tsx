import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { api } from "@/server/api";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; // Ícones nativos do Expo

type Modalidade = { id: string; nome: string; tipo: "individual" | "grupo"; };

export default function Modalidades() {
  const [modalidades, setModalidades] = useState<Modalidade[]>([]);

  useEffect(() => {
    async function carregarModalidades() {
      try {
        const response = await api.get("/modalidades");
        setModalidades(response.data);
      } catch (error) {
        setModalidades([
          { id: "1", nome: "Futsal", tipo: "grupo" },
          { id: "2", nome: "Tênis de Mesa", tipo: "individual" },
          { id: "3", nome: "E-sports (LoL)", tipo: "grupo" },
        ]);
      }
    }
    carregarModalidades();
  }, []);

  function tratarClique(nome: string) {
    // A MÁGICA: Envia o usuário para a tela de inscrição e passa o nome da modalidade na "bagagem" (URL params)
    router.push({
      pathname: "/inscricao",
      params: { modalidadeSelecionada: nome }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Modalidades</Text>
      <Text style={styles.subtitulo}>Escolha uma para se inscrever</Text>

      <FlatList
        data={modalidades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable 
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }]}
            onPress={() => tratarClique(item.nome)}
          >
            <View style={styles.infoContainer}>
              <MaterialIcons name={item.tipo === "grupo" ? "groups" : "person"} size={32} color="#FFF" />
              <View style={styles.textos}>
                <Text style={styles.nomeModalidade}>{item.nome}</Text>
                <Text style={styles.tipoBadge}>
                  {item.tipo === "grupo" ? "Equipe" : "Individual"}
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={28} color="#FFF" />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F5F5F5" },
  titulo: { fontSize: 26, fontWeight: "bold", textAlign: "center", color: "#333" },
  subtitulo: { fontSize: 16, textAlign: "center", color: "#666", marginBottom: 24 },
  card: { flexDirection: "row", backgroundColor: "#0a27e2", padding: 20, marginBottom: 16, borderRadius: 12, alignItems: "center", justifyContent: "space-between", elevation: 4 },
  infoContainer: { flexDirection: "row", alignItems: "center", gap: 16 },
  textos: { justifyContent: "center" },
  nomeModalidade: { fontSize: 20, fontWeight: "bold", color: "#FFF" },
  tipoBadge: { fontSize: 14, color: "#E3E3E3", marginTop: 4 },
});