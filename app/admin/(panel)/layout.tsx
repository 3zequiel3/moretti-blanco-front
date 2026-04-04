// app/admin/layout.tsx

import { AdminShell } from "@/components/admin/Layout/AdminShell";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
