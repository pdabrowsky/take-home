import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Icon } from "@/components/Icon";

export default async function Home() {
  const {
    data: { user },
  } = await auth.getServerUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center space-y-8">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Icon name="shield-check" size={32} className="text-indigo-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>

            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Secure access to your dashboard. Please sign in to continue to the
              protected area.
            </p>
          </div>

          <div className="space-y-6">
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md hover:scale-[1.02] transform"
            >
              <Icon name="login" size={20} className="mr-2 text-white" />
              Sign In to Dashboard
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">
                  New to our platform?
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              New users can create an account during sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
