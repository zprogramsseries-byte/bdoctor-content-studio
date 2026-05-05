"use client";
import { useState } from "react";

const THEMES = ["Productividad médica","Historia clínica digital","IA en medicina","Comunidad médica","Interconsultas","Gestión de consultorio","Cursos y formación","Testimonios / casos de uso","Tip rápido B-Doctor","Motivación profesional"];
const NETWORKS = ["LinkedIn","Instagram","Facebook","Twitter/X"];
const TONES = ["Educativo","Inspirador","Directo / vendedor","Humorístico / cercano"];
const SYSTEM_PROMPT = `Eres el community manager de B-Doctor, una plataforma médica argentina que combina CRM clínico, red profesional médica, comunidad, interconsultas online e inteligencia artificial. La B significa Buen Doctor. Generá contenido en español rioplatense. Respondé SOLO con este JSON sin backticks: {"post":"texto del post","imagePrompt":"prompt en inglés para imagen","tip":"consejo de implementación"}`;

export default function Home() {
  const [theme, setTheme] = useState(THEMES[0]);
  const [network, setNetwork] = useState("LinkedIn");
  const [tone, setTone] = useState("Educativo");
  const [customTheme, setCustomTheme] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  const generate = async () => {
    setLoading(true);
    setResult(null);
    const finalTheme = customTheme.trim() || theme;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Red: ${network} | Tema: ${finalTheme} | Tono: ${tone}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
    } catch (e) {
      setResult({ error: "Error generando contenido. Intentá de nuevo." });
    }
    setLoading(false);
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#0a0f1e", minHeight: "100vh", color: "#e8edf5" }}>
      <div style={{ background: "linear-gradient(135deg,#0a0f1e,#0d2137)", borderBottom: "1px solid #1a3a5c", padding: "28px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#0ea5e9,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "white" }}>B</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#e8edf5" }}>B-Doctor <span style={{ color: "#0ea5e9" }}>Content Studio</span></div>
          <div style={{ fontSize: 12, color: "#64748b", fontFamily: "sans-serif" }}>Generador de contenido para redes sociales</div>
        </div>
      </div>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ background: "#0d1a2e", border: "1px solid #1a3a5c", borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: 600, color: "#0ea5e9", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>Configurar post</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#94a3b8", marginBottom: 8 }}>Red social</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {NETWORKS.map(n => <button key={n} onClick={() => setNetwork(n)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid", borderColor: network===n?"#0ea5e9":"#1a3a5c", background: network===n?"rgba(14,165,233,0.15)":"transparent", color: network===n?"#0ea5e9":"#64748b", fontSize: 12, fontFamily: "sans-serif", cursor: "pointer" }}>{n}</button>)}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#94a3b8", marginBottom: 8 }}>Tono</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TONES.map(t => <button key={t} onClick={() => setTone(t)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid", borderColor: tone===t?"#10b981":"#1a3a5c", background: tone===t?"rgba(16,185,129,0.15)":"transparent", color: tone===t?"#10b981":"#64748b", fontSize: 12, fontFamily: "sans-serif", cursor: "pointer" }}>{t}</button>)}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#94a3b8", marginBottom: 8 }}>Tema</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {THEMES.map(th => <button key={th} onClick={() => { setTheme(th); setCustomTheme(""); }} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid", borderColor: theme===th&&!customTheme?"#7c3aed":"#1a3a5c", background: theme===th&&!customTheme?"rgba(124,58,237,0.15)":"transparent", color: theme===th&&!customTheme?"#a78bfa":"#64748b", fontSize: 12, fontFamily: "sans-serif", cursor: "pointer" }}>{th}</button>)}
            </div>
            <input placeholder="O escribí tu propio tema..." value={customTheme} onChange={e => setCustomTheme(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #1a3a5c", background: "#071020", color: "#e8edf5", fontSize: 13, fontFamily: "sans-serif", outline: "none", boxSizing: "border-box" }} />
          </div>
          <button onClick={generate} disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 12, background: loading?"#1a3a5c":"linear-gradient(135deg,#0ea5e9,#2563eb)", border: "none", color: "white", fontSize: 15, fontFamily: "sans-serif", fontWeight: 600, cursor: loading?"not-allowed":"pointer" }}>
            {loading ? "✦ Generando..." : "✦ Generar post"}
          </button>
        </div>
        {result && !result.error && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#0d1a2e", border: "1px solid #1a3a5c", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #1a3a5c", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: 700, color: "#0ea5e9", letterSpacing: 2, textTransform: "uppercase" }}>📝 Post para {network}</span>
                <button onClick={() => copy(result.post, "post")} style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid #1a3a5c", background: copied==="post"?"rgba(16,185,129,0.2)":"transparent", color: copied==="post"?"#10b981":"#64748b", fontSize: 12, fontFamily: "sans-serif", cursor: "pointer" }}>{copied==="post"?"✓ Copiado":"Copiar"}</button>
              </div>
              <div style={{ padding: 20, fontSize: 15, lineHeight: 1.75, whiteSpace: "pre-wrap", color: "#cbd5e1" }}>{result.post}</div>
            </div>
            <div style={{ background: "#0d1a2e", border: "1px solid #1a3a5c", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #1a3a5c", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: 700, color: "#a78bfa", letterSpacing: 2, textTransform: "uppercase" }}>🎨 Prompt para imagen</span>
                <button onClick={() => copy(result.imagePrompt, "img")} style={{ padding: "5px 14px", borderRadius: 7, border: "1px solid #1a3a5c", background: copied==="img"?"rgba(16,185,129,0.2)":"transparent", color: copied==="img"?"#10b981":"#64748b", fontSize: 12, fontFamily: "sans-serif", cursor: "pointer" }}>{copied==="img"?"✓ Copiado":"Copiar"}</button>
              </div>
              <div style={{ padding: 20, fontSize: 13, color: "#94a3b8", fontFamily: "sans-serif", lineHeight: 1.7 }}>{result.imagePrompt}</div>
            </div>
            <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 12 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <div>
                <div style={{ fontSize: 11, fontFamily: "sans-serif", fontWeight: 700, color: "#10b981", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Consejo</div>
                <div style={{ fontSize: 13, fontFamily: "sans-serif", color: "#94a3b8", lineHeight: 1.6 }}>{result.tip}</div>
              </div>
            </div>
          </div>
        )}
        {result?.error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 20, color: "#f87171", fontFamily: "sans-serif" }}>{result.error}</div>}
      </div>
    </div>
  );
}
