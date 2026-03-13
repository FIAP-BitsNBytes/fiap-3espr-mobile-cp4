import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0a27e2", // Cor do ícone selecionado
        tabBarInactiveTintColor: "#888",  // Cor não selecionado
        headerStyle: {
          backgroundColor: "#0a27e2",
        },
        headerTintColor: "#FFF",
        headerTitleAlign: "center",
      }}
    >
      {/* 1. LOGIN - Totalmente Oculto */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />

      {/* 2. MENU: MODALIDADES */}
      <Tabs.Screen
        name="modalidades"
        options={{
          title: "Modalidades",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="sports-soccer" size={24} color={color} />
          ),
        }}
      />

      {/* 3. MENU: CALENDÁRIO */}
      <Tabs.Screen
        name="calendario"
        options={{
          title: "Calendário",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event" size={24} color={color} />
          ),
        }}
      />

      {/* 4. MENU: CLASSIFICAÇÃO (RANKING) */}
      <Tabs.Screen
        name="classificacao"
        options={{
          title: "Ranking",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="emoji-events" size={24} color={color} />
          ),
        }}
      />

      {/* 5. MENU: EDUCAÇÃO FÍSICA (AGORA VISÍVEL) */}
      <Tabs.Screen
        name="educacao-fisica"
        options={{
          title: "Atividades",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="fitness-center" size={24} color={color} />
          ),
        }}
      />

      {/* 6. TELA INTERNA: INSCRIÇÃO (Oculta do menu, acessada pelo clique) */}
      <Tabs.Screen
        name="inscricao"
        options={{
          href: null, // A MÁGICA: Não cria botão no rodapé
          title: "Nova Inscrição",
        }}
      />
    </Tabs>
  );
}