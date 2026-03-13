export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validação de segurança básica hardcoded conforme solicitado
    if (email === "rm123456" && password === "123") {
      return Response.json(
        { message: "Acesso autorizado!", email },
        { status: 200 }
      );
    }

    return Response.json(
      { message: "Usuário e/ou senha incorreta!" },
      { status: 401 } // 401 = Unauthorized
    );
  } catch (error) {
    return Response.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}