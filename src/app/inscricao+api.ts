export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validação de segurança no backend
    if (!body.matricula || !body.modalidade) {
      return Response.json(
        { message: "Matrícula e Modalidade são obrigatórios." },
        { status: 400 }
      );
    }

    // Aqui o backend salvaria na base de dados.
    // Como é nível estudante, apenas devolvemos sucesso.
    return Response.json(
      { message: `Inscrição de ${body.matricula} na modalidade ${body.modalidade} realizada com sucesso!` },
      { status: 201 }
    );
    
  } catch (error) {
    return Response.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}