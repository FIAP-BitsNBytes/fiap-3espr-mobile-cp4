import { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Alert, 
  ActivityIndicator, 
  RefreshControl,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/server/api";
import { isAxiosError } from "axios";
import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export interface Jogo {
  id: string;
  modalidade: string;
  equipas: string;
  data: string;
  local: string;
}

const STORAGE_KEY = "@interclasse_jogos";

// DADOS FANTASIA INTEGRADOS (10 por modalidade)
const MOCK_JOGOS: Jogo[] = [
  // FUTSAL
  { id: "f1", modalidade: "Futsal", equipas: "1TDSR vs 1TDSO", data: "15/05 - 19:00", local: "Quadra Poliesportiva" },
  { id: "f2", modalidade: "Futsal", equipas: "2TDSB vs 2TDSZ", data: "15/05 - 20:30", local: "Quadra Poliesportiva" },
  { id: "f3", modalidade: "Futsal", equipas: "3TDSA vs 1TDSA", data: "16/05 - 18:00", local: "Ginásio Principal" },
  { id: "f4", modalidade: "Futsal", equipas: "1MBA vs 2MBA", data: "16/05 - 21:00", local: "Quadra Poliesportiva" },
  { id: "f5", modalidade: "Futsal", equipas: "Vencedor J1 vs Vencedor J2", data: "17/05 - 19:00", local: "Ginásio Principal" },
  { id: "f6", modalidade: "Futsal", equipas: "3TDSB vs 2TDSR", data: "18/05 - 14:00", local: "Quadra Poliesportiva" },
  { id: "f7", modalidade: "Futsal", equipas: "1TDSJ vs 1TDSK", data: "18/05 - 15:30", local: "Quadra Poliesportiva" },
  { id: "f8", modalidade: "Futsal", equipas: "2TDSH vs 3TDSH", data: "19/05 - 19:00", local: "Ginásio Principal" },
  { id: "f9", modalidade: "Futsal", equipas: "Semifinal A", data: "20/05 - 20:00", local: "Ginásio Principal" },
  { id: "f10", modalidade: "Futsal", equipas: "Grande Final", data: "22/05 - 21:00", local: "Ginásio Principal" },
  // VÔLEI
  { id: "v1", modalidade: "Vôlei", equipas: "Sistemas vs Redes", data: "15/05 - 14:00", local: "Quadra B" },
  { id: "v2", modalidade: "Vôlei", equipas: "Cyber vs Defesa", data: "15/05 - 15:00", local: "Quadra B" },
  { id: "v3", modalidade: "Vôlei", equipas: "Engenharia vs Dados", data: "16/05 - 14:00", local: "Quadra B" },
  { id: "v4", modalidade: "Vôlei", equipas: "Cloud vs DevOps", data: "16/05 - 15:00", local: "Quadra B" },
  { id: "v5", modalidade: "Vôlei", equipas: "Design vs UX", data: "17/05 - 14:00", local: "Quadra B" },
  { id: "v6", modalidade: "Vôlei", equipas: "1TDSR vs 1TDSB", data: "17/05 - 15:00", local: "Quadra B" },
  { id: "v7", modalidade: "Vôlei", equipas: "2TDSS vs 2TDSY", data: "18/05 - 16:00", local: "Quadra B" },
  { id: "v8", modalidade: "Vôlei", equipas: "Quartas de Final 1", data: "19/05 - 14:00", local: "Quadra B" },
  { id: "v9", modalidade: "Vôlei", equipas: "Semifinal", data: "20/05 - 15:00", local: "Quadra B" },
  { id: "v10", modalidade: "Vôlei", equipas: "Final Feminina", data: "22/05 - 18:00", local: "Ginásio Principal" },
  // BASQUETE
  { id: "b1", modalidade: "Basquete", equipas: "Lakers FIAP vs Bulls TDS", data: "15/05 - 10:00", local: "Arena Central" },
  { id: "b2", modalidade: "Basquete", equipas: "Python vs Java", data: "15/05 - 11:30", local: "Arena Central" },
  { id: "b3", modalidade: "Basquete", equipas: "IA vs Mobile", data: "16/05 - 10:00", local: "Arena Central" },
  { id: "b4", modalidade: "Basquete", equipas: "Frontend vs Backend", data: "16/05 - 11:30", local: "Arena Central" },
  { id: "b5", modalidade: "Basquete", equipas: "Turma A vs Turma C", data: "17/05 - 10:00", local: "Arena Central" },
  { id: "b6", modalidade: "Basquete", equipas: "Blockchain vs IOT", data: "17/05 - 11:30", local: "Arena Central" },
  { id: "b7", modalidade: "Basquete", equipas: "Security vs Privacy", data: "18/05 - 10:00", local: "Arena Central" },
  { id: "b8", modalidade: "Basquete", equipas: "Playoffs Jogo 1", data: "19/05 - 11:30", local: "Arena Central" },
  { id: "b9", modalidade: "Basquete", equipas: "Disputa Bronze", data: "21/05 - 16:00", local: "Arena Central" },
  { id: "b10", modalidade: "Basquete", equipas: "Final 3x3", data: "22/05 - 20:00", local: "Arena Central" },
  // E-SPORTS
  { id: "e1", modalidade: "E-sports", equipas: "CS2: TDS vs ADS", data: "15/05 - 22:00", local: "Lab 501 / Twitch" },
  { id: "e2", modalidade: "E-sports", equipas: "LoL: Turma X vs Turma Y", data: "15/05 - 23:30", local: "Lab 501 / Twitch" },
  { id: "e3", modalidade: "E-sports", equipas: "Valorant: Agents vs Radiants", data: "16/05 - 22:00", local: "Discord Oficial" },
  { id: "e4", modalidade: "E-sports", equipas: "FC24: RM 991 vs RM 992", data: "16/05 - 23:00", local: "Lounge FIAP" },
  { id: "e5", modalidade: "E-sports", equipas: "LoL: Semifinal 1", data: "17/05 - 20:00", local: "Twitch FIAP" },
  { id: "e6", modalidade: "E-sports", equipas: "CS2: Semifinal 2", data: "18/05 - 20:00", local: "Twitch FIAP" },
  { id: "e7", modalidade: "E-sports", equipas: "Rocket League: Open", data: "19/05 - 18:00", local: "Online" },
  { id: "e8", modalidade: "E-sports", equipas: "SF6: Top 8", data: "20/05 - 19:00", local: "Lounge FIAP" },
  { id: "e9", modalidade: "E-sports", equipas: "Valorant: Final", data: "21/05 - 21:00", local: "Arena Digital" },
  { id: "e10", modalidade: "E-sports", equipas: "LoL: Grande Final", data: "22/05 - 22:00", local: "Arena Digital" },
];

export default function Calendario() {
  const [jogos, setJogos] = useState<Jogo[]>(MOCK_JOGOS); // Inicia com os dados fantasia
  const [carregando, setCarregando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  async function carregarCalendario(isPullToRefresh = false) {
    if (isPullToRefresh) setAtualizando(true);
    else setCarregando(true);

    try {
      const dadosLocais = await AsyncStorage.getItem(STORAGE_KEY);
      if (dadosLocais) {
        setJogos(JSON.parse(dadosLocais));
      }

      // Tenta buscar da API real
      const response = await api.get<Jogo[]>("/calendario");
      if (response.data && response.data.length > 0) {
        setJogos(response.data);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
      }

    } catch (error) {
      console.log("Mantendo dados fantasia ou cache local.");
      if (isAxiosError(error) && jogos.length === 0) {
        Alert.alert("Aviso", "Exibindo calendário offline.");
      }
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => {
    carregarCalendario();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "Cronograma", 
          headerStyle: { backgroundColor: "#0a27e2" }, 
          headerTintColor: "#FFF",
          headerTitleAlign: "center"
        }} 
      />

      <View style={styles.headerCorpo}>
        <Text style={styles.overtitle}>PRÓXIMAS PARTIDAS</Text>
        <Text style={styles.titulo}>AGENDA DE <Text style={styles.tituloDestaque}>GAMES</Text></Text>
        <View style={styles.divisor} />
      </View>

      <FlatList
        data={jogos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={atualizando} 
            onRefresh={() => carregarCalendario(true)} 
            tintColor="#0a27e2"
            colors={["#0a27e2"]} 
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.ladoEsquerdo}>
              <View style={styles.timeIcon}>
                <MaterialIcons name="event-available" size={20} color="#0a27e2" />
              </View>
              <View style={styles.linhaConectora} />
            </View>

            <View style={styles.conteudoCard}>
              <View style={styles.headerCard}>
                <LinearGradient 
                  colors={['#0a27e2', '#061a9c']} 
                  start={{x:0, y:0}} end={{x:1, y:0}} 
                  style={styles.badgeModalidade}
                >
                  <Text style={styles.textoBadge}>
                    {(item.modalidade || "ESPORTE").toUpperCase()}
                  </Text>
                </LinearGradient>
                <Text style={styles.dataTexto}>{item.data || "--/--/--"}</Text>
              </View>

              <Text style={styles.equipasTexto}>
                {item.equipas || "Equipes indefinidas"}
              </Text>
              
              <View style={styles.localContainer}>
                <MaterialIcons name="place" size={14} color="#666" />
                <Text style={styles.localTexto}>{item.local || "Local a definir"}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  headerCorpo: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 10 },
  overtitle: { color: "#0a27e2", fontWeight: "800", fontSize: 12, letterSpacing: 2 },
  titulo: { fontSize: 32, fontWeight: "900", color: "#FFF", marginTop: 5 },
  tituloDestaque: { color: "#0a27e2" },
  divisor: { width: 50, height: 4, backgroundColor: "#0a27e2", marginTop: 10, borderRadius: 2 },
  lista: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  card: { flexDirection: "row", marginBottom: 5 },
  ladoEsquerdo: { alignItems: "center", width: 40 },
  timeIcon: { 
    width: 36, height: 36, backgroundColor: "#1a1a1a", borderRadius: 18, 
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#333", zIndex: 2
  },
  linhaConectora: { flex: 1, width: 2, backgroundColor: "#1a1a1a", marginVertical: -5 },
  conteudoCard: { 
    flex: 1, backgroundColor: "#1a1a1a", marginLeft: 10, marginBottom: 20, 
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)"
  },
  headerCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  badgeModalidade: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  textoBadge: { color: "#FFF", fontSize: 10, fontWeight: "900" },
  dataTexto: { color: "#0a27e2", fontSize: 12, fontWeight: "bold" },
  equipasTexto: { color: "#FFF", fontSize: 18, fontWeight: "800", marginBottom: 10 },
  localContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  localTexto: { color: "#666", fontSize: 13, fontWeight: "500" }
});