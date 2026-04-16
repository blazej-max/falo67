import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Leaf } from "lucide-react";
import { useMenuData, MenuItem } from "@/hooks/useMenuData";

const ALLERGENS: { id: number; name: string }[] = [
  { id: 1, name: "Gluten" }, { id: 2, name: "Skorupiaki" }, { id: 3, name: "Jaja" },
  { id: 4, name: "Ryby" }, { id: 5, name: "Orzeszki ziemne" }, { id: 6, name: "Soja" },
  { id: 7, name: "Mleko" }, { id: 8, name: "Orzechy" }, { id: 9, name: "Seler" },
  { id: 10, name: "Gorczyca" }, { id: 11, name: "Sezam" }, { id: 12, name: "Siarczyny" },
  { id: 13, name: "Łubin" }, { id: 14, name: "Mięczaki" },
];

const ItemRow = ({ item }: { item: MenuItem }) => (
  <div className="flex items-baseline justify-between gap-4 py-4 border-b border-border/60 last:border-0">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <h4 className="font-serif text-lg font-semibold">
          {item.name}
          {item.allergens && item.allergens.length > 0 && (
            <span className="ml-2 text-xs text-muted-foreground font-sans font-normal align-middle">
              ({item.allergens.join(", ")})
            </span>
          )}
        </h4>
        {item.tag === "spicy" && <Flame className="w-4 h-4 text-primary" aria-label="ostra" />}
        {item.tag === "veg" && <Leaf className="w-4 h-4 text-primary-glow" aria-label="wegetariańska" />}
      </div>
      {item.description && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</p>}
    </div>
    <span className="text-primary font-semibold whitespace-nowrap">{item.price}</span>
  </div>
);

const MenuFull = () => {
  const { data, isLoading } = useMenuData();

  if (isLoading || !data) {
    return (
      <section id="menu-pelne" className="py-24 bg-background">
        <div className="container max-w-5xl text-center text-muted-foreground">Ładowanie menu...</div>
      </section>
    );
  }

  const { categories, items, sauces } = data;
  const defaultTab = categories.find((c) => c.slug === "pizza")?.slug ?? categories[0]?.slug;

  return (
    <section id="menu-pelne" className="py-24 bg-background">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-primary uppercase tracking-[0.3em] text-sm mb-3">Pełne menu</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Cała karta</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pizza, dania główne, przystawki, desery i napoje. Ceny mogą ulec zmianie — aktualną kartę
            zawsze potwierdza obsługa.
          </p>
        </div>

        {defaultTab && (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto justify-center bg-secondary mb-10">
              {categories.map((c) => (
                <TabsTrigger key={c.id} value={c.slug}>{c.name}</TabsTrigger>
              ))}
            </TabsList>
            {categories.map((c) => {
              const catItems = items.filter((i) => i.category_id === c.id);
              const useColumns = catItems.length > 3;
              return (
                <TabsContent key={c.id} value={c.slug}>
                  <div className={useColumns ? "grid md:grid-cols-2 gap-x-12" : ""}>
                    {catItems.map((it) => <ItemRow key={it.id} item={it} />)}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}

        {sauces.length > 0 && (
          <div className="mt-12 bg-secondary rounded-2xl p-8 text-center">
            <h3 className="font-serif text-2xl font-bold mb-2">Sosy do pizzy</h3>
            <p className="text-muted-foreground mb-4">Do wyboru — {sauces[0].price}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {sauces.map((s) => (
                <span key={s.id} className="px-4 py-1.5 bg-card rounded-full text-sm font-medium border border-border">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 bg-card border border-border rounded-2xl p-8">
          <div className="text-center mb-6">
            <p className="text-primary uppercase tracking-[0.3em] text-xs mb-2">Informacja</p>
            <h3 className="font-serif text-2xl md:text-3xl font-bold">Alergeny</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              Liczby w nawiasie obok nazwy dania oznaczają możliwą obecność poniższych alergenów.
              W razie wątpliwości prosimy o kontakt z obsługą.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
            {ALLERGENS.map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/30">
                  {a.id}
                </span>
                <span className="text-sm text-foreground">{a.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-primary" /> ostra</span>
          <span className="flex items-center gap-2"><Leaf className="w-4 h-4 text-primary-glow" /> wegetariańska</span>
        </div>
      </div>
    </section>
  );
};

export default MenuFull;
