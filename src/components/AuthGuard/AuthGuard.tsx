import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { AuthGuardProps } from "./AuthGuard.types";

export const AuthGuard = async ({
  children,
  redirectTo = "/login",
}: AuthGuardProps) => {
  const {
    data: { user },
  } = await auth.getServerUser();

  if (!user) {
    redirect(redirectTo);
  }

  return <>{children}</>;
};
