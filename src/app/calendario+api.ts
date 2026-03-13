export async function GET() {
  // Simulando dados de uma base de dados para o teu CP
  const jogos = [
    { id: "1", modalidade: "Futsal", equipas: "3º ES vs 2º ADS", data: "20/11 - 10:00", local: "Quadra Principal" },
    { id: "2", modalidade: "Vôlei", equipas: "1º ES vs 4º SI", data: "20/11 - 11:30", local: "Ginásio 2" },
    { id: "3", modalidade: "Basquete", equipas: "2º ES vs 3º SI", data: "21/11 - 09:00", local: "Quadra Principal" }
  ];

  return Response.json(jogos, { status: 200 });
}