import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const check = async (uid: string | null) => {
      if (!uid) {
        if (mounted) { setIsAdmin(false); setUserId(null); setLoading(false); }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (mounted) { setIsAdmin(!!data); setUserId(uid); setLoading(false); }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      check(session?.user?.id ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => check(session?.user?.id ?? null));

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  return { isAdmin, loading, userId };
};
