import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  const {
    data: { user },
  } = await auth.getServerUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
