import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { router, Stack } from "expo-router"; // Adicionei o Stack aqui
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type NomeIcone = keyof typeof MaterialIcons.glyphMap;

interface Modalidade {
  id: string;
  nome: string;
  tipo: string;
  icone: NomeIcone;
  minIntegrantes?: number;
  cor: string;
}

const MODALIDADES_OFICIAIS: Modalidade[] = [
  { id: "1", nome: "Futsal", tipo: "Equipe", icone: "sports-soccer", minIntegrantes: 10, cor: "#27ae60" },
  { id: "2", nome: "Vôlei", tipo: "Equipe", icone: "sports-volleyball", minIntegrantes: 12, cor: "#f1c40f" },
  { id: "3", nome: "Basquete", tipo: "Equipe", icone: "sports-basketball", minIntegrantes: 10, cor: "#e67e22" },
  { id: "4", nome: "E-sports", tipo: "Equipe", icone: "sports-esports", cor: "#8e44ad" },
];

export default function Modalidades() {
  
  function handleLogout() {
    router.replace("/"); 
  }

  function irParaInscricao(nomeModalidade: string) {
    router.push({
      pathname: "/inscricao",
      params: { modalidadeSelecionada: nomeModalidade }
    });
  }

  return (
    <View style={styles.container}>
      {/* Configuração do Header Nativo */}
      <Stack.Screen 
        options={{
          title: "Modalidades",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#0a27e2" },
          headerTintColor: "#FFF",
          headerRight: () => (
            <Pressable 
              onPress={handleLogout}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginRight: 10
              })}
            >
              <MaterialIcons name="logout" size={24} color="#FFF" />
            </Pressable>
          ),
        }} 
      />

      <View style={styles.headerCorpo}>
        <Text style={styles.overtitle}>TEMPORADA 2026</Text>
        <Text style={styles.titulo}>INTERCLASSE <Text style={styles.tituloDestaque}>FIAP</Text></Text>
        <View style={styles.divisor} />
      </View>

      <FlatList
        data={MODALIDADES_OFICIAIS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Pressable 
            style={({ pressed }) => [
              styles.card, 
              pressed && { transform: [{ scale: 0.97 }] }
            ]}
            onPress={() => irParaInscricao(item.nome)}
          >
            <LinearGradient
              colors={[item.cor, '#1a1a1a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <View style={styles.cardContent}>
                <View style={styles.textos}>  
                  <Text style={styles.nomeModalidade}>{item.nome.toUpperCase()}</Text>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="groups" size={16} color="#FFF" />
                    <Text style={styles.infoTexto}>
                      {item.minIntegrantes ? `Mínimo ${item.minIntegrantes} atletas` : "Inscrição Livre"}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.iconeContainer}>
                   <MaterialIcons name={item.icone} size={40} color="rgba(255,255,255,0.3)" />
                   <MaterialIcons name="arrow-forward-ios" size={18} color="#FFF" />
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        )}
      />

      <Pressable 
        onPress={() => router.back()} 
        style={styles.botaoVoltar}
      >
        <Text style={styles.textoBotaoVoltar}>Cancelar e voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  headerCorpo: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20 },
  overtitle: { color: "#0a27e2", fontWeight: "800", fontSize: 12, letterSpacing: 2 },
  titulo: { fontSize: 32, fontWeight: "900", color: "#FFF", marginTop: 5 },
  tituloDestaque: { color: "#0a27e2" },
  divisor: { width: 50, height: 4, backgroundColor: "#0a27e2", marginTop: 10, borderRadius: 2 },
  lista: { padding: 20 },
  card: { marginBottom: 18, borderRadius: 12, overflow: "hidden" },
  gradient: { padding: 20 },
  cardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  textos: { flex: 1 },
  nomeModalidade: { fontSize: 24, fontWeight: "900", color: "#FFF", fontStyle: "italic" },
  infoRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 8, 
    backgroundColor: "rgba(0,0,0,0.3)", 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4,
    alignSelf: "flex-start",
    gap: 6
  },
  infoTexto: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  iconeContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  botaoVoltar: { padding: 20, alignItems: "center" },
  textoBotaoVoltar: { color: "#666", fontSize: 14, fontWeight: "600" }
});