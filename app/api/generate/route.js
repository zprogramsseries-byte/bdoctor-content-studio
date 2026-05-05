export async function POST(request) {
  const { tone, network, theme } = await request.json();

  const prompt = `Eres el community manager de B-Doctor, una plataforma médica argentina que combina CRM clínico, red profesional médica, comunidad, interconsultas online e inteligencia artificial. La B significa Buen Doctor. Generá contenido en español rioplatense. 
  
Red: ${network} | Tema: ${theme} | Tono: ${tone}

Respondé SOLO con este JSON sin backticks ni explicaciones:
{"post":"texto del post","imagePrompt":"prompt en inglés para imagen","tip":"consejo de implementación"}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const clean = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(clean);
    return Response.json(parsed);
  } catch {
    return Response.json({ error: "Error al procesar la respuesta" });
  }
}
