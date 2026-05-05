export async function POST(request) {
  const { tone, network, theme } = await request.json();

  const networkGuidelines = {
    "LinkedIn": "Tono profesional y reflexivo. Usá datos o insights del sector. Estructura: gancho fuerte → problema → solución → CTA. Sin emojis en exceso, máximo 2. Entre 150-250 palabras.",
    "Instagram": "Gancho visual en la primera línea. Frases cortas y directas. Máximo 3 emojis estratégicos. Terminá con pregunta para generar comentarios. Entre 80-120 palabras.",
    "Facebook": "Tono cercano pero profesional. Enfocado en comunidad médica. Podés contar una situación real del consultorio. Entre 100-180 palabras.",
    "Twitter/X": "Máximo 280 caracteres. Directo, contundente. Un solo mensaje clave. 1 emoji máximo."
  };

  const toneGuidelines = {
    "Educativo": "Enseñá algo concreto y aplicable. Usá datos reales si es posible. Posicioná a B-Doctor como referente.",
    "Inspirador": "Conectá con el propósito del médico. Hablá del impacto en los pacientes. Emocioná sin caer en lo cursi.",
    "Directo / vendedor": "Mostrá un beneficio concreto de B-Doctor. Creá urgencia real. CTA claro y específico.",
    "Humorístico / cercano": "Humor inteligente, no payasada. Situaciones reales del consultorio que todo médico reconoce. Siempre con mensaje de fondo."
  };

  const prompt = `Sos el head of content de B-Doctor, la red médica profesional más innovadora de Argentina. B-Doctor combina CRM clínico inteligente, red profesional médica, comunidad con foro y eventos, interconsultas online, cursos, recursos e IA para resumen de historia clínica. La B significa Buen Doctor. El target son médicos independientes con consultorio propio en Argentina.

IDENTIDAD DE MARCA:
- Profesional pero humano, nunca corporativo frío
- Español rioplatense natural, no forzado
- Autoridad médica + innovación tecnológica
- Nunca sonar como bot ni usar frases hechas

RED SOCIAL: ${network}
GUÍA PARA ESTA RED: ${networkGuidelines[network] || networkGuidelines["LinkedIn"]}

TEMA: ${theme}
TONO: ${tone}
GUÍA DE TONO: ${toneGuidelines[tone] || toneGuidelines["Educativo"]}

REGLAS ESTRICTAS:
- Nunca usar: "che colegas", "papa frita", frases de relleno genéricas
- Hashtags: máximo 4, específicos y relevantes, siempre incluir #BDoctor
- El gancho (primera línea) tiene que parar el scroll
- El CTA tiene que ser específico, no "déjanos tu comentario" genérico
- Si mencionás una función de B-Doctor, que sea natural, no publicidad directa

Respondé SOLO con este JSON exacto sin backticks ni texto extra:
{"post":"texto completo del post listo para publicar","imagePrompt":"detailed English prompt for a professional medical technology image, modern clinic aesthetic, no text overlay, photorealistic, showing ${theme.toLowerCase()} concept with subtle B-Doctor platform UI elements visible on screen","tip":"consejo específico: mejor día y horario para publicar este post en ${network}, y una táctica de engagement"}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return Response.json({ error: `Google API error: ${data.error.message}` });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return Response.json({ error: `Respuesta vacía. Data: ${JSON.stringify(data)}` });
    }

    const clean = text.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(clean);
      return Response.json(parsed);
    } catch {
      return Response.json({ error: `JSON inválido: ${clean}` });
    }

  } catch (e) {
    return Response.json({ error: `Excepción: ${e.message}` });
  }
}
