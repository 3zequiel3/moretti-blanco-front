// app/page.tsx
import { Navbar } from "@/components/public/Navbar/Navbar";
import { Banner } from "@/components/public/Banner/Banner";
import { Features } from "@/components/public/Features/Features";
import { Contact } from "@/components/public/Contact/Contact";
import { Footer } from "@/components/public/Footer/Footer";
import { FloatingButton } from "@/components/public/FloatingButton/FloatingButton";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[color:var(--color-bg)]">
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:26px_26px]" />

      <Navbar />

      <div className="relative z-10 flex-1">
        <Banner />
        <Features />
        <Contact />
      </div>

      <Footer />

      <FloatingButton />
    </main>
  );
}
