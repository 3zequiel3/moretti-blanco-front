// app/page.tsx
import { Navbar } from "@/components/public/Navbar/Navbar";
import { Banner } from "@/components/public/Banner/Banner";
import { Features } from "@/components/public/Features/Features";
import { Contact } from "@/components/public/Contact/Contact";
import { Footer } from "@/components/public/Footer/Footer";
import { FloatingButton } from "@/components/public/FloatingButton/FloatingButton";

export default function Home() {
  return (
    // Agregamos flex y flex-col para que el Footer se comporte correctamente
    // relative es necesario para que el botón flotante se posicione bien si usas absolute en lugar de fixed
    <main className="flex min-h-screen flex-col bg-[color:var(--color-bg)] relative">
      
      <Navbar />
      
      {/* Contenido principal (crecerá ocupando el espacio disponible) */}
      <div className="flex-1">
        <Banner />
        <Features />
        <Contact />
      </div>

      <Footer />
      
      <FloatingButton />

    </main>
  );
}