export const metadata = {
  title: "B-Doctor Content Studio",
  description: "Generador de contenido para redes sociales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, background: "#0a0f1e" }}>
        {children}
      </body>
    </html>
  );
}
