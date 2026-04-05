import type { Metadata } from "next";
import { Barlow, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const barlowDisplay = Barlow({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MB - Cierres Perimetrales y Metalúrgica",
  description:
    "Nos dedicamos a la fabricación e instalación de cierres perimetrales, rejas, portones, estructuras metálicas y trabajos de herrería en general. Con más de 5 años de experiencia, ofrecemos soluciones personalizadas para cada proyecto, garantizando calidad, seguridad y durabilidad. Contáctanos para transformar tus espacios con nuestros servicios de metalúrgica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${barlowDisplay.variable} ${ibmPlexSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
