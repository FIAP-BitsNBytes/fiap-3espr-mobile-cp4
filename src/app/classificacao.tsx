import { useState, useCallback } from "react";
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
import { useFocusEffect, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export interface Inscrito { id: string; nome: string; pontos: number; }

export default function Classificacao() {
  const [lista, setLista] = useState<Inscrito[]>([]);
  const [meuRM, setMeuRM] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  async function carregarDadosDoAsyncStorage(isPullToRefresh = false) {
    if (isPullToRefresh) setAtualizando(true);

    try {
      const perfilLocal = await AsyncStorage.getItem("@interclasse_perfil");
      if (perfilLocal) {
        // Buscamos o RM para destacar a linha do usuário
        setMeuRM(JSON.parse(perfilLocal).rm);
      }

      const listaSalva = await AsyncStorage.getItem("@interclasse_lista_inscricoes");
      
      if (listaSalva) {
        const arrayCompleto = JSON.parse(listaSalva);
        // Exibimos os 10 primeiros por ordem de inscrição/chegada
        const top10 = arrayCompleto.slice(0, 10);
        setLista(top10);
      } else {
        setLista([]);
      }

    } catch (error) {
      Alert.alert("Erro", "Falha ao ler os dados locais.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarDadosDoAsyncStorage();
    }, [])
  );

  // Função para definir a cor do ícone de troféu com base na posição
  const getCorTrofeu = (index: number) => {
    if (index === 0) return "#FFD700"; // Ouro
    if (index === 1) return "#C0C0C0"; // Prata
    if (index === 2) return "#CD7F32"; // Bronze
    return "#444";
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "Classificação", 
          headerStyle: { backgroundColor: "#0a27e2" }, 
          headerTintColor: "#FFF",
          headerTitleAlign: "center"
        }} 
      />

      <View style={styles.headerCorpo}>
        <Text style={styles.overtitle}>TOP 10 INSCRITOS</Text>
        <Text style={styles.titulo}>RANKING <Text style={styles.tituloDestaque}>LÍDERES</Text></Text>
        <View style={styles.divisor} />
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#0a27e2" style={styles.loader} />
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={ 
            <RefreshControl 
                refreshing={atualizando} 
                onRefresh={() => carregarDadosDoAsyncStorage(true)} 
                tintColor="#0a27e2"
                colors={["#0a27e2"]} 
            /> 
          }
          renderItem={({ item, index }) => {
            // O ID no seu mock contém o RM do primeiro integrante
            const isMinhaEquipa = meuRM && item.id.includes(meuRM);

            return (
              <View style={[styles.card, isMinhaEquipa && styles.cardDestaque]}>
                <View style={styles.posicaoWrapper}>
                  <Text style={[styles.posicaoTexto, index < 3 && styles.posicaoTop]}>
                    {index + 1}
                  </Text>
                  <MaterialIcons 
                    name="emoji-events" 
                    size={20} 
                    color={getCorTrofeu(index)} 
                  />
                </View>

                <View style={styles.infoEquipa}>
                  <Text 
                    style={[styles.nomeTurma, isMinhaEquipa && styles.textoDestaque]}
                    numberOfLines={1}
                  >
                    {item.nome}
                  </Text>
                  <Text style={styles.idSubtexto}>REF: {item.id.split('-')[1] || 'ID'}</Text>
                </View>

                {isMinhaEquipa && (
                  <LinearGradient
                    colors={['#0a27e2', '#061a9c']}
                    style={styles.badgeVoce}
                  >
                    <Text style={styles.textoBadgeVoce}>VOCÊ</Text>
                  </LinearGradient>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.vazioContainer}>
              <MaterialIcons name="storage" size={50} color="#333" />
              <Text style={styles.avisoVazio}>Ainda não há inscritos locais.</Text>
            </View>
          }
        />
      )}
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
  
  loader: { flex: 1, justifyContent: "center" },
  lista: { padding: 20, paddingBottom: 40 },
  
  card: { 
    flexDirection: "row", 
    backgroundColor: "#1a1a1a", 
    padding: 16, 
    marginBottom: 12, 
    borderRadius: 16, 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)"
  },
  cardDestaque: { 
    borderColor: "#0a27e2", 
    borderWidth: 1.5,
    backgroundColor: "#1a1e3a" // Um azul bem escuro para diferenciar
  },
  
  posicaoWrapper: { 
    alignItems: "center", 
    justifyContent: "center", 
    width: 45,
    borderRightWidth: 1,
    borderRightColor: "#333",
    marginRight: 15
  },
  posicaoTexto: { 
    color: "#666", 
    fontSize: 18, 
    fontWeight: "900" 
  },
  posicaoTop: {
    color: "#FFF",
  },

  infoEquipa: { flex: 1 },
  nomeTurma: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: "#FFF",
    marginBottom: 2
  },
  idSubtexto: {
    fontSize: 11,
    color: "#555",
    fontWeight: "600"
  },
  textoDestaque: { color: "#0a27e2" },

  badgeVoce: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 10
  },
  textoBadgeVoce: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900"
  },

  vazioContainer: { alignItems: "center", marginTop: 60, opacity: 0.3 },
  avisoVazio: { textAlign: "center", marginTop: 15, fontSize: 14, color: "#666", fontWeight: "600" }
});