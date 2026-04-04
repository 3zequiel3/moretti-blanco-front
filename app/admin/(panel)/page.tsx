// app/admin/page.tsx

export default function AdminDashboard() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      
      <div className="max-w-2xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-[var(--color-text)]">
          Moretti Blanco <span className="text-[#C41E3A]">Administración</span>
        </h1>
        
        <p className="mt-6 text-lg text-[var(--color-text-light)]">
          Selecciona una opción del menú lateral para gestionar el contenido de tu sitio web.
        </p>
      </div>

    </div>
  );
}