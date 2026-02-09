import AdminSidebar from "@/components/admin/AdminSidebar"
import Navbar from "@/components/layout/Navbar"
import AuthProvider from "@/components/auth/AuthProvider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-background-light overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
