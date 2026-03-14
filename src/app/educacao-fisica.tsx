import { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  Platform 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const ATIVIDADES = [
  { id: "1", nome: "Corrida de Saco" },
  { id: "2", nome: "Dança das Cadeiras" },
  { id: "3", nome: "Pula Corda" },
  { id: "4", nome: "Cabo de Guerra" },
  { id: "5", nome: "Mímica" },
];

const PARTICIPANTES = [
  { id: "p1", nome: "Ana Silva" }, { id: "p2", nome: "Carlos Oliveira" },
  { id: "p3", nome: "Mariana Santos" }, { id: "p4", nome: "João Pedro" },
  { id: "p5", nome: "Beatriz Costa" }, { id: "p6", nome: "Lucas Almeida" },
  { id: "p7", nome: "Fernanda Lima" }, { id: "p8", nome: "Rafael Souza" },
  { id: "p9", nome: "Camila Alves" }, { id: "p10", nome: "Mateus Silva" },
];

function useSelecaoMultipla() {
  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  const alternarSelecao = (id: string) => {
    setSelecionadas((estadoAtual) => 
      estadoAtual.includes(id)
        ? estadoAtual.filter((itemId) => itemId !== id)
        : [...estadoAtual, id]
    );
  };

  const verificarSeEstaAtivo = (id: string) => selecionadas.includes(id);

  return { selecionadas, alternarSelecao, verificarSeEstaAtivo };
}

export default function EducacaoFisica() {
  const { alternarSelecao, verificarSeEstaAtivo } = useSelecaoMultipla();
  const [listaParticipantes, setListaParticipantes] = useState(PARTICIPANTES);

  useEffect(() => {
    async function carregarMeuPerfil() {
      try {
        const perfilLocal = await AsyncStorage.getItem("@interclasse_perfil");
        if (perfilLocal) {
          const perfil = JSON.parse(perfilLocal);
          setListaParticipantes([
            { id: "eu", nome: `${perfil.nome} (Você)` },
            ...PARTICIPANTES.slice(0, 9)
          ]);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil", error);
      }
    }
    carregarMeuPerfil();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "Dinâmicas", 
          headerStyle: { backgroundColor: "#0a27e2" }, 
          headerTintColor: "#FFF",
          headerTitleAlign: "center"
        }} 
      />

      <View style={styles.headerCorpo}>
        <Text style={styles.overtitle}>RECREAÇÃO ATIVA</Text>
        <Text style={styles.titulo}>EDUCAÇÃO <Text style={styles.tituloDestaque}>FÍSICA</Text></Text>
        <View style={styles.divisor} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SELECIONE AS DINÂMICAS</Text>
        <View style={styles.tagsContainer}>
          {ATIVIDADES.map((ativ) => {
            const isAtivo = verificarSeEstaAtivo(ativ.id);
            return (
              <Pressable
                key={ativ.id}
                onPress={() => alternarSelecao(ativ.id)}
                style={({ pressed }) => [
                  styles.tag,
                  isAtivo && styles.tagAtiva,
                  pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
                ]}
              >
                {isAtivo && (
                  <MaterialIcons name="check-circle" size={16} color="#FFF" style={{ marginRight: 6 }} />
                )}
                <Text style={[styles.tagTexto, isAtivo && styles.tagTextoAtiva]}>
                  {ativ.nome}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.sectionLista}>
        <Text style={styles.sectionLabel}>INSCRITOS NA RODADA</Text>
        <FlatList
          data={listaParticipantes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => {
            const isMe = item.id === "eu";
            return (
              <View style={[styles.cardParticipante, isMe && styles.cardDestaque]}>
                <View style={[styles.avatar, isMe && styles.avatarDestaque]}>
                  <MaterialIcons 
                    name={isMe ? "stars" : "person"} 
                    size={22} 
                    color={isMe ? "#FFF" : "#0a27e2"} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.nomeParticipante, isMe && styles.nomeDestaque]}>
                    {item.nome}
                  </Text>
                  <Text style={styles.statusTexto}>
                    {isMe ? "Status: Online" : "Status: Confirmado"}
                  </Text>
                </View>
                {isMe && (
                  <LinearGradient
                    colors={['#0a27e2', '#061a9c']}
                    style={styles.badgeVoce}
                  >
                    <Text style={styles.textoBadge}>MEU PERFIL</Text>
                  </LinearGradient>
                )}
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  headerCorpo: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 20 },
  overtitle: { color: "#0a27e2", fontWeight: "800", fontSize: 12, letterSpacing: 2 },
  titulo: { fontSize: 32, fontWeight: "900", color: "#FFF", marginTop: 5 },
  tituloDestaque: { color: "#0a27e2" },
  divisor: { width: 50, height: 4, backgroundColor: "#0a27e2", marginTop: 10, borderRadius: 2 },
  
  section: { paddingHorizontal: 24, marginBottom: 30 },
  sectionLabel: { color: "#444", fontSize: 11, fontWeight: "900", marginBottom: 15, letterSpacing: 1 },
  
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1a1a1a", 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: "#333" 
  },
  tagAtiva: { 
    backgroundColor: "#0a27e2", 
    borderColor: "#0a27e2",
    ...Platform.select({
      ios: { shadowColor: "#0a27e2", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
      android: { elevation: 6 }
    })
  },
  tagTexto: { color: "#888", fontWeight: "700", fontSize: 13 },
  tagTextoAtiva: { color: "#FFF" },

  sectionLista: { flex: 1, paddingHorizontal: 24 },
  cardParticipante: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#1a1a1a", 
    padding: 14, 
    marginBottom: 12, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: "rgba(255,255,255,0.05)" 
  },
  cardDestaque: { borderColor: "#0a27e2", backgroundColor: "#1d1f3d" },
  
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: "#222", 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 15 
  },
  avatarDestaque: { backgroundColor: "#0a27e2" },
  
  nomeParticipante: { fontSize: 15, fontWeight: "600", color: "#EEE" },
  nomeDestaque: { color: "#FFF", fontWeight: "800" },
  statusTexto: { fontSize: 11, color: "#555", marginTop: 2 },
  
  badgeVoce: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  textoBadge: { color: "#FFF", fontSize: 9, fontWeight: "900" }
});