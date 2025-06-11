import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export const auth = {
  signIn: async (email: string, password: string) => {
    const supabase = createBrowserClient();
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signUp: async (email: string, password: string) => {
    const supabase = createBrowserClient();
    return await supabase.auth.signUp({ email, password });
  },

  signOut: async () => {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = "/login";
    }
    return { error };
  },

  getUser: async () => {
    const supabase = createBrowserClient();
    return await supabase.auth.getUser();
  },

  getSession: async () => {
    const supabase = createBrowserClient();
    return await supabase.auth.getSession();
  },

  getServerUser: async () => {
    const supabase = await createServerClient();
    return await supabase.auth.getUser();
  },

  getServerSession: async () => {
    const supabase = await createServerClient();
    return await supabase.auth.getSession();
  },

  onAuthStateChange: (
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) => {
    const supabase = createBrowserClient();
    return supabase.auth.onAuthStateChange(callback);
  },
};
