import { AuthGuard } from "@/components/AuthGuard";
import { ClientNavbar } from "@/components/ClientNavbar";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const {
    data: { user },
  } = await auth.getServerUser();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <ClientNavbar userName={user?.email} />
        <div
          className="flex items-center justify-center"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-600 mb-4">SUCCESS!</h1>
            <p className="text-gray-600">
              You have successfully logged in to the dashboard.
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
