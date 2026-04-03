import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MB - Cierres Perimetrales y Metalúrgica",
  description: "Nos dedicamos a la fabricación e instalación de cierres perimetrales, rejas, portones, estructuras metálicas y trabajos de herrería en general. Con más de 5 años de experiencia, ofrecemos soluciones personalizadas para cada proyecto, garantizando calidad, seguridad y durabilidad. Contáctanos para transformar tus espacios con nuestros servicios de metalúrgica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased` }
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
