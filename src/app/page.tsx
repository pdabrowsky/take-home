import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const {
    data: { user },
  } = await auth.getServerUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Admin Panel
          </h1>
          <p className="text-gray-600">
            Please sign in to access the protected dashboard
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.02]"
          >
            Sign In
          </Link>

          <p className="text-sm text-gray-500">
            Don&apos;t have an account? You can create one on the sign in page.
          </p>
        </div>
      </div>
    </div>
  );
}
