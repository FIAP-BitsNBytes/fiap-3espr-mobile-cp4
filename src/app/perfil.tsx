import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface Perfil {
  rm: string;
  nome: string;
  modalidade: string;
}

interface Inscricao {
  id: string;
  nome: string;
  pontos: number;
}

export default function Perfil() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [totalInscricoes, setTotalInscricoes] = useState(0);
  const [carregando, setCarregando] = useState(true);

  async function carregarPerfil() {
    setCarregando(true);
    try {
      const perfilSalvo = await AsyncStorage.getItem("@interclasse_perfil");
      if (perfilSalvo) {
        setPerfil(JSON.parse(perfilSalvo));
      }

      const inscricoesSalvas = await AsyncStorage.getItem(
        "@interclasse_lista_inscricoes"
      );
      if (inscricoesSalvas) {
        const lista: Inscricao[] = JSON.parse(inscricoesSalvas);
        setTotalInscricoes(lista.length);
      }
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [])
  );

  async function handleLogout() {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("@interclasse_user");
          await AsyncStorage.removeItem("@interclasse_perfil");
          await AsyncStorage.removeItem("@interclasse_jogos");
          router.replace("/");
        },
      },
    ]);
  }

  if (carregando) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0a27e2" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header com gradiente */}
      <LinearGradient
        colors={["#0a27e2", "#061a9c", "#121212"]}
        style={styles.headerGradient}
      >
        <View style={styles.avatarWrapper}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.avatarImagem}
            resizeMode="cover"
          />
          <View style={styles.badgeAtivo}>
            <MaterialIcons name="verified" size={16} color="#0a27e2" />
          </View>
        </View>

        <Text style={styles.nomeUsuario}>
          {perfil?.nome ?? "Estudante FIAP"}
        </Text>
        <View style={styles.rmBadge}>
          <MaterialIcons name="badge" size={14} color="#aaa" />
          <Text style={styles.rmTexto}>{perfil?.rm?.toUpperCase() ?? "---"}</Text>
        </View>
      </LinearGradient>

      {/* Cards de estatísticas */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <MaterialIcons name="sports-soccer" size={24} color="#0a27e2" />
          <Text style={styles.statValor}>
            {perfil?.modalidade ?? "Nenhuma"}
          </Text>
          <Text style={styles.statLabel}>MODALIDADE</Text>
        </View>

        <View style={styles.statDivisor} />

        <View style={styles.statCard}>
          <MaterialIcons name="group-add" size={24} color="#0a27e2" />
          <Text style={styles.statValor}>{totalInscricoes}</Text>
          <Text style={styles.statLabel}>INSCRICOES</Text>
        </View>

        <View style={styles.statDivisor} />

        <View style={styles.statCard}>
          <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
          <Text style={styles.statValor}>2026</Text>
          <Text style={styles.statLabel}>TEMPORADA</Text>
        </View>
      </View>

      {/* Secao de informacoes */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>INFORMACOES DA CONTA</Text>

        <View style={styles.infoItem}>
          <View style={styles.infoIcone}>
            <MaterialIcons name="person-outline" size={20} color="#0a27e2" />
          </View>
          <View style={styles.infoTextos}>
            <Text style={styles.infoLabel}>Nome completo</Text>
            <Text style={styles.infoValor}>
              {perfil?.nome ?? "Estudante FIAP"}
            </Text>
          </View>
        </View>

        <View style={styles.separador} />

        <View style={styles.infoItem}>
          <View style={styles.infoIcone}>
            <MaterialIcons name="badge" size={20} color="#0a27e2" />
          </View>
          <View style={styles.infoTextos}>
            <Text style={styles.infoLabel}>Matricula / RM</Text>
            <Text style={styles.infoValor}>
              {perfil?.rm?.toUpperCase() ?? "---"}
            </Text>
          </View>
        </View>

        <View style={styles.separador} />

        <View style={styles.infoItem}>
          <View style={styles.infoIcone}>
            <MaterialIcons name="sports" size={20} color="#0a27e2" />
          </View>
          <View style={styles.infoTextos}>
            <Text style={styles.infoLabel}>Modalidade inscrita</Text>
            <Text style={styles.infoValor}>
              {perfil?.modalidade === "Nenhuma" || !perfil?.modalidade
                ? "Nenhuma inscricao realizada"
                : perfil.modalidade}
            </Text>
          </View>
        </View>

        <View style={styles.separador} />

        <View style={styles.infoItem}>
          <View style={styles.infoIcone}>
            <MaterialIcons name="school" size={20} color="#0a27e2" />
          </View>
          <View style={styles.infoTextos}>
            <Text style={styles.infoLabel}>Instituicao</Text>
            <Text style={styles.infoValor}>FIAP</Text>
          </View>
        </View>
      </View>

      {/* Acoes rapidas */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>ACOES</Text>

        <Pressable
          style={({ pressed }) => [
            styles.acaoItem,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => router.push("/inscricao")}
        >
          <View style={styles.infoIcone}>
            <MaterialIcons name="add-circle-outline" size={20} color="#27ae60" />
          </View>
          <Text style={styles.acaoTexto}>Nova inscricao</Text>
          <MaterialIcons name="chevron-right" size={20} color="#444" />
        </Pressable>

        <View style={styles.separador} />

        <Pressable
          style={({ pressed }) => [
            styles.acaoItem,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => router.push("/classificacao")}
        >
          <View style={styles.infoIcone}>
            <MaterialIcons name="emoji-events" size={20} color="#FFD700" />
          </View>
          <Text style={styles.acaoTexto}>Ver ranking</Text>
          <MaterialIcons name="chevron-right" size={20} color="#444" />
        </Pressable>
      </View>

      {/* Botao de logout */}
      <Pressable
        style={({ pressed }) => [
          styles.botaoLogout,
          pressed && { opacity: 0.8 },
        ]}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={18} color="#ff4444" />
        <Text style={styles.botaoLogoutTexto}>Encerrar sessao</Text>
      </Pressable>

      <Text style={styles.rodape}>Interclasse Digital • FIAP 2026</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  scrollContent: { paddingBottom: 40 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },

  headerGradient: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatarImagem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  badgeAtivo: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 2,
  },
  nomeUsuario: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
    marginBottom: 8,
  },
  rmBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  rmTexto: { color: "#aaa", fontSize: 12, fontWeight: "700", letterSpacing: 1 },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  statCard: { flex: 1, alignItems: "center", gap: 6 },
  statValor: { fontSize: 14, fontWeight: "900", color: "#FFF", textAlign: "center" },
  statLabel: { fontSize: 9, color: "#555", fontWeight: "800", letterSpacing: 1 },
  statDivisor: { width: 1, backgroundColor: "#2a2a2a", marginHorizontal: 8 },

  secao: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  secaoTitulo: {
    color: "#0a27e2",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  infoIcone: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(10,39,226,0.1)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextos: { flex: 1 },
  infoLabel: { fontSize: 11, color: "#555", fontWeight: "700", marginBottom: 2 },
  infoValor: { fontSize: 15, color: "#FFF", fontWeight: "600" },

  separador: { height: 1, backgroundColor: "#222", marginLeft: 66 },

  acaoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  acaoTexto: { flex: 1, fontSize: 15, color: "#FFF", fontWeight: "600" },

  botaoLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ff4444",
    gap: 8,
  },
  botaoLogoutTexto: { color: "#ff4444", fontSize: 15, fontWeight: "700" },

  rodape: { textAlign: "center", color: "#333", fontSize: 12, marginTop: 24, fontWeight: "600" },
});
