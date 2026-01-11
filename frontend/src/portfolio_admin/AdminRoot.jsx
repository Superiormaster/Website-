import { UserProvider } from "@/portfolio_admin/UserContext"
import AdminApp from "@/portfolio_admin/AdminApp"

export default function AdminRoot() {
  return (
    <UserProvider>
      <AdminApp />
    </UserProvider>
  )
}