import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MenuCategory = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  is_visible: boolean;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: string;
  tag: "spicy" | "veg" | null;
  allergens: number[];
  sort_order: number;
  is_visible: boolean;
};

export type PizzaSauce = {
  id: string;
  name: string;
  price: string;
  sort_order: number;
  is_visible: boolean;
};

export const useMenuData = (includeHidden = false) => {
  return useQuery({
    queryKey: ["menu", includeHidden],
    queryFn: async () => {
      const [catRes, itemRes, sauceRes] = await Promise.all([
        supabase.from("menu_categories").select("*").order("sort_order"),
        supabase.from("menu_items").select("*").order("sort_order"),
        supabase.from("pizza_sauces").select("*").order("sort_order"),
      ]);
      if (catRes.error) throw catRes.error;
      if (itemRes.error) throw itemRes.error;
      if (sauceRes.error) throw sauceRes.error;
      const filt = <T extends { is_visible: boolean }>(rows: T[]) =>
        includeHidden ? rows : rows.filter((r) => r.is_visible);
      return {
        categories: filt(catRes.data as MenuCategory[]),
        items: filt(itemRes.data as MenuItem[]),
        sauces: filt(sauceRes.data as PizzaSauce[]),
      };
    },
  });
};
