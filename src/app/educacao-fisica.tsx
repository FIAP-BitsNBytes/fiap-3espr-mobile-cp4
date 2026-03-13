import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// 1. DADOS FIXOS: 5 Atividades exatas
const ATIVIDADES = [
  { id: "1", nome: "Corrida de Saco" },
  { id: "2", nome: "Dança das Cadeiras" },
  { id: "3", nome: "Pula Corda" },
  { id: "4", nome: "Cabo de Guerra" },
  { id: "5", nome: "Mímica" },
];

// 2. DADOS FIXOS: Lista simulada de pessoas (poderia vir da API)
const PARTICIPANTES = [
  { id: "p1", nome: "Ana Silva" },
  { id: "p2", nome: "Carlos Oliveira" },
  { id: "p3", nome: "Mariana Santos" },
  { id: "p4", nome: "João Pedro" },
  { id: "p5", nome: "Beatriz Costa" },
  { id: "p6", nome: "Lucas Almeida" },
  { id: "p7", nome: "Fernanda Lima" },
  { id: "p8", nome: "Rafael Souza" },
  { id: "p9", nome: "Camila Alves" },
  { id: "p10", nome: "Mateus Silva" },
  { id: "p11", nome: "Juliana (NÃO DEVE APARECER)" }, // Item 11 para provar a trava
];

export default function EducacaoFisica() {
  // Estado que guarda as atividades selecionadas (Múltipla Escolha)
  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  // Lógica Sênior de Múltipla Escolha
  function alternarAtividade(idAtividade: string) {
    setSelecionadas((estadoAnterior) => {
      // Se já tem, tira (filtra). Se não tem, adiciona.
      if (estadoAnterior.includes(idAtividade)) {
        return estadoAnterior.filter((id) => id !== idAtividade);
      } else {
        return [...estadoAnterior, idAtividade];
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Educação Física</Text>

      {/* SESSÃO 1: Atividades (Limitado a 5, usando .map) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atividades (Múltipla Escolha)</Text>
        <View style={styles.tagsContainer}>
          {ATIVIDADES.map((ativ) => {
            const isAtivo = selecionadas.includes(ativ.id);
            return (
              <Pressable
                key={ativ.id}
                style={[styles.tag, isAtivo && styles.tagAtiva]}
                onPress={() => alternarAtividade(ativ.id)}
              >
                <Text style={[styles.tagTexto, isAtivo && styles.tagTextoAtiva]}>
                  {ativ.nome}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* SESSÃO 2: Participantes (Limitado a 10 pela trava .slice) */}
      <View style={styles.sectionLista}>
        <Text style={styles.sectionTitle}>Participantes (Máx 10)</Text>
        
        <FlatList
          // A MÁGICA: .slice(0, 10) corta a lista no décimo item antes de renderizar
          data={PARTICIPANTES.slice(0, 10)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardParticipante}>
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={24} color="#666" />
              </View>
              <Text style={styles.nomeParticipante}>{item.nome}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionLista: {
    flex: 1, // Permite que a lista ocupe o resto da tela sem vazar
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Faz os botões pularem para a linha de baixo se faltar espaço
    gap: 10,
  },
  tag: {
    backgroundColor: "#E3E3E3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  tagAtiva: {
    backgroundColor: "#0a27e2",
    borderColor: "#0a27e2",
  },
  tagTexto: {
    color: "#555",
    fontWeight: "600",
  },
  tagTextoAtiva: {
    color: "#FFF",
  },
  cardParticipante: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  nomeParticipante: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});