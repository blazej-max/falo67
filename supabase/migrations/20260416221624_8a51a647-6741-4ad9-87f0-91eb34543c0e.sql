-- Roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Categories
CREATE TABLE public.menu_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON public.menu_categories
  FOR SELECT USING (true);
CREATE POLICY "Admins insert categories" ON public.menu_categories
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update categories" ON public.menu_categories
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete categories" ON public.menu_categories
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER menu_categories_updated BEFORE UPDATE ON public.menu_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Menu items
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  tag TEXT CHECK (tag IN ('spicy', 'veg')),
  allergens INT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read items" ON public.menu_items
  FOR SELECT USING (true);
CREATE POLICY "Admins insert items" ON public.menu_items
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update items" ON public.menu_items
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete items" ON public.menu_items
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER menu_items_updated BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_menu_items_category ON public.menu_items(category_id, sort_order);

-- Pizza sauces
CREATE TABLE public.pizza_sauces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT '3 zł',
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pizza_sauces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sauces" ON public.pizza_sauces
  FOR SELECT USING (true);
CREATE POLICY "Admins insert sauces" ON public.pizza_sauces
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update sauces" ON public.pizza_sauces
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete sauces" ON public.pizza_sauces
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER pizza_sauces_updated BEFORE UPDATE ON public.pizza_sauces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed categories
INSERT INTO public.menu_categories (slug, name, sort_order) VALUES
  ('przystawki', 'Przystawki', 1),
  ('dania', 'Dania główne', 2),
  ('pizza', 'Pizza', 3),
  ('napoje', 'Napoje', 4),
  ('desery', 'Desery', 5);

-- Seed sauces
INSERT INTO public.pizza_sauces (name, sort_order) VALUES
  ('Feta-czosnek', 1), ('Mango', 2), ('Pomidorowy', 3), ('Ostry', 4);

-- Seed items
WITH cats AS (SELECT id, slug FROM public.menu_categories)
INSERT INTO public.menu_items (category_id, name, description, price, tag, allergens, sort_order)
SELECT (SELECT id FROM cats WHERE slug = c), n, d, p, t, a, o FROM (VALUES
  ('przystawki', 'Krewetki pieczone w oliwie z czosnkiem', 'Krewetki, chilli, czosnek, pomidorki semi secchi, pieczywo', '31 zł', NULL, ARRAY[1,2], 1),
  ('przystawki', 'Burrata z prosciutto', 'Szynka prosciutto, burrata, pomidorki semi-secchi, koktajlowe, pesto, oliwa, parmezan, pistacje, bułka', '39 zł', NULL, ARRAY[1,7,8], 2),
  ('dania', 'Spaghetti Carbonara po naszemu', 'Makaron spaghetti, guanciale, żółtka, parmezan, pieprz', '41 zł', NULL, ARRAY[1,3,7], 1),
  ('dania', 'Rigatoni ze spianatą', 'Makaron rigatoni, guanciale, spianata, pom. koktajlowe, sos pomidorowy, białe wino, pietruszka, parmezan, oliwa', '41 zł', 'spicy', ARRAY[1,7,12], 2),
  ('dania', 'Spaghetti truflowe z burratą', 'Makaron spaghetti, pasta truflowa, mascarpone, śmietana, trufle, oliwa truflowa, burrata', '56 zł', 'veg', ARRAY[1,7], 3),
  ('dania', 'Krewetki w sosie śmietanowym', 'Krewetki, suszone pomidory, świeży szpinak, prażone migdały, tabasco, natka pietruszki, czerwona cebula, bułka', '46 zł', NULL, ARRAY[1,2,7,8], 4),
  ('dania', 'Gnocchi alla Sorrentina', 'Gnocchi, sos pomidorowy, mozzarella, pesto, parmezan, liście bazylii. Dodatkowo guanciale do gnocchi (+7 zł)', '39 zł', 'veg', ARRAY[1,7,8], 5),
  ('dania', 'Gnocchi Formaggi', 'Gnocchi, śmietana, gorgonzola, parmezan, mozzarella, rukola, feta, pesto, migdały', '39 zł', 'veg', ARRAY[1,7,8], 6),
  ('dania', 'Gnocchi z łososiem', 'Gnocchi, łosoś, pasta z suszonych pomidorów, pieczarki, śmietana, rukola, czerwona piklowana cebula, natka', '45 zł', NULL, ARRAY[1,4,7], 7),
  ('dania', 'Zielone spaghetti', 'Spaghetti, pesto, burrata, pistacje', '48 zł', 'veg', ARRAY[1,7,8], 8),
  ('pizza', 'Margherita', 'Sos z pomidorów pelati, mozzarella, świeża bazylia', '31 zł', 'veg', ARRAY[1,7], 1),
  ('pizza', 'Salami', 'Sos z pomidorów pelati, salami napoli / salami spianata, mozzarella', '39 zł', NULL, ARRAY[1,7], 2),
  ('pizza', 'Capricciosa', 'Sos z pomidorów pelati, mozzarella, szynka cotto, pieczarki, czarne oliwki, karczochy', '42 zł', NULL, ARRAY[1,7], 3),
  ('pizza', 'Ostra', 'Sos z pomidorów pelati, salami spianata, mozzarella, czosnek, jalapeño, czarne oliwki', '42 zł', 'spicy', ARRAY[1,7], 4),
  ('pizza', 'Wiejska', 'Sos z pomidorów pelati, mozzarella, pancetta, pieczarki, pomidory koktajlowe, czosnek, czerwona cebula, szczypiorek', '43 zł', NULL, ARRAY[1,7], 5),
  ('pizza', 'Prosciutto Crudo', 'Sos z pomidorów pelati, mozzarella, ricotta, sos balsamiczny, szynka prosciutto, rukola, pomidory koktajlowe, parmezan', '46 zł', NULL, ARRAY[1,7], 6),
  ('pizza', 'Wiosenna', 'Crème fraîche, mozzarella, gorgonzola, coppa, por, szczypior, kozi ser', '45 zł', NULL, ARRAY[1,7], 7),
  ('pizza', 'Nduja', 'Sos śmietanowy, nduja, salami spianata, por, mozzarella, ricotta, miód', '47 zł', 'spicy', ARRAY[1,7], 8),
  ('pizza', 'Pancettina', 'Sos z pomidorów pelati, pancetta, mozzarella, płatki Grana Padano, czerwona cebula, bazylia', '44 zł', NULL, ARRAY[1,7], 9),
  ('pizza', 'Wegetariańska', 'Sos z pomidorów pelati, mozzarella, rukola, suszone pomidory, pieczony bakłażan, grillowana papryka, prażone migdały', '42 zł', 'veg', ARRAY[1,7,8], 10),
  ('pizza', 'Funghi', 'Sos z pomidorów pelati, mozzarella, szynka cotto, pieczarki, świeża bazylia', '39 zł', NULL, ARRAY[1,7], 11),
  ('pizza', 'Burratina', 'Sos z pomidorów pelati, mozzarella, kozi ser, burrata, cukinia, suszone pomidory, rukola, czosnek', '49 zł', 'veg', ARRAY[1,7], 12),
  ('pizza', 'Melanzana', 'Sos z pomidorów pelati, mozzarella, szynka prosciutto, Grana Padano, pieczony bakłażan', '44 zł', NULL, ARRAY[1,7], 13),
  ('pizza', 'Figowa', 'Mozzarella, pancetta, gorgonzola, chutney figowy, świeża bazylia', '43 zł', NULL, ARRAY[1,7], 14),
  ('pizza', 'Quattro Formaggi', 'Sos z pomidorów pelati, mozzarella, gorgonzola, Grana Padano, ricotta, suszone pomidory', '45 zł', 'veg', ARRAY[1,7], 15),
  ('pizza', 'Grucha', 'Sos z pomidorów pelati, mozzarella, gorgonzola, kozi ser, gruszka, suszone pomidory', '45 zł', 'veg', ARRAY[1,7], 16),
  ('pizza', 'Czorizardi', 'Sos z pomidorów pelati, mozzarella, chorizo, salami spianata, ananas, grillowana papryka, jalapeño', '44 zł', 'spicy', ARRAY[1,7], 17),
  ('pizza', 'Hawaii', 'Sos z pomidorów pelati, mozzarella, szynka cotto, ananas', '39 zł', NULL, ARRAY[1,7], 18),
  ('pizza', 'Mięsna', 'Sos z pomidorów pelati, mozzarella, pancetta, czosnek, salami napoli, szynka cotto, zielone pepperoni, czerwona cebula', '44 zł', 'spicy', ARRAY[1,7], 19),
  ('pizza', 'Szpinakowa', 'Crème fraîche, mozzarella, czosnek, szpinak, pancetta, feta, migdały', '44 zł', NULL, ARRAY[1,7,8], 20),
  ('pizza', 'Szpinacotto', 'Crème fraîche, mozzarella, szynka cotto, szpinak, suszone pomidory, czosnek', '45 zł', NULL, ARRAY[1,7], 21),
  ('pizza', 'Truflowa', 'Sos z pomidorów pelati, mozzarella, pasta truflowa, salami napoli, mascarpone, szczypiorek', '47 zł', NULL, ARRAY[1,7], 22),
  ('napoje', 'Domowa lemoniada', NULL, '13 zł', NULL, ARRAY[]::INT[], 1),
  ('napoje', 'Coca-Cola / Cola Zero 0,25L', NULL, '9 zł', NULL, ARRAY[]::INT[], 2),
  ('napoje', 'Woda gazowana / niegazowana 0,33L', NULL, '7 zł', NULL, ARRAY[]::INT[], 3),
  ('napoje', 'Oranżada włoska', NULL, '12 zł', NULL, ARRAY[]::INT[], 4),
  ('napoje', 'Sok Cappy', NULL, '9 zł', NULL, ARRAY[]::INT[], 5),
  ('napoje', 'Herbata', NULL, '9 zł', NULL, ARRAY[]::INT[], 6),
  ('napoje', 'Herbata zimowa', 'Herbata czarna, goździki, cynamon, anyż, kardamon, cytryna, miód, imbir', '15 zł', NULL, ARRAY[]::INT[], 7),
  ('napoje', 'Kawa Espresso', NULL, '9 zł', NULL, ARRAY[]::INT[], 8),
  ('napoje', 'Kawa Americano', NULL, '9 zł', NULL, ARRAY[]::INT[], 9),
  ('napoje', 'Kawa Cappuccino', NULL, '12 zł', NULL, ARRAY[7], 10),
  ('napoje', 'Aperol 0%', NULL, '25 zł', NULL, ARRAY[12], 11),
  ('napoje', 'Piwo bezalk.', NULL, 'zapytaj obsługi', NULL, ARRAY[1], 12),
  ('napoje', 'Wino bezalk.', NULL, 'zapytaj obsługi', NULL, ARRAY[12], 13),
  ('desery', 'Desery dnia', 'Zapytaj obsługi co dziś przygotowaliśmy!', '—', NULL, ARRAY[1,3,7,8], 1)
) AS v(c, n, d, p, t, a, o);