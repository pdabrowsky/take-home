import { AuthGuard } from "@/components/AuthGuard";
import { ClientNavbar } from "@/components/ClientNavbar";
import { auth } from "@/lib/auth";
import { AccountsList, AccountWithDocuments } from "@/components/AccountsList";
import { getAccountsAction } from "@/app/api/actions/accounts.actions";

async function getAccountsServerSide(): Promise<AccountWithDocuments[]> {
  try {
    const result = await getAccountsAction();

    if (result.success && result.data) {
      return result.data;
    } else {
      console.error("Failed to fetch accounts:", result.error);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch accounts on server:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const {
    data: { user },
  } = await auth.getServerUser();

  const accounts = await getAccountsServerSide();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <ClientNavbar userName={user?.email} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your accounts and documents
              </p>
            </div>

            <AccountsList initialAccounts={accounts} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
