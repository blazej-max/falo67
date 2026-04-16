import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMenuData, MenuItem, MenuCategory, PizzaSauce } from "@/hooks/useMenuData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";

const ALLERGEN_NAMES: Record<number, string> = {
  1: "Gluten", 2: "Skorupiaki", 3: "Jaja", 4: "Ryby", 5: "Orzeszki ziemne",
  6: "Soja", 7: "Mleko", 8: "Orzechy", 9: "Seler", 10: "Gorczyca",
  11: "Sezam", 12: "Siarczyny", 13: "Łubin", 14: "Mięczaki",
};

type ItemForm = Partial<MenuItem> & { allergens: number[] };

const AdminMenu = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAdmin, loading: roleLoading, userId } = useIsAdmin();
  const { data, isLoading } = useMenuData(true);

  const [editItem, setEditItem] = useState<ItemForm | null>(null);
  const [editCat, setEditCat] = useState<Partial<MenuCategory> | null>(null);
  const [editSauce, setEditSauce] = useState<Partial<PizzaSauce> | null>(null);

  useEffect(() => {
    if (!roleLoading && !userId) navigate("/auth");
  }, [roleLoading, userId, navigate]);

  if (roleLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Ładowanie...</div>;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <h1 className="font-serif text-2xl font-bold mb-2">Brak uprawnień</h1>
          <p className="text-muted-foreground mb-4">
            Twoje konto nie ma uprawnień administratora. Skontaktuj się z właścicielem strony.
          </p>
          <p className="text-xs text-muted-foreground mb-4 break-all">Twój ID: {userId}</p>
          <Button onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}>
            Wyloguj
          </Button>
        </Card>
      </main>
    );
  }

  const refresh = () => qc.invalidateQueries({ queryKey: ["menu"] });

  const saveItem = async () => {
    if (!editItem || !editItem.name || !editItem.price || !editItem.category_id) {
      toast.error("Uzupełnij nazwę, cenę i kategorię");
      return;
    }
    const payload = {
      category_id: editItem.category_id,
      name: editItem.name,
      description: editItem.description || null,
      price: editItem.price,
      tag: editItem.tag || null,
      allergens: editItem.allergens,
      sort_order: editItem.sort_order ?? 999,
      is_visible: editItem.is_visible ?? true,
    };
    const { error } = editItem.id
      ? await supabase.from("menu_items").update(payload).eq("id", editItem.id)
      : await supabase.from("menu_items").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Zapisano");
    setEditItem(null);
    refresh();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Usunąć tę pozycję?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Usunięto"); refresh(); }
  };

  const saveCat = async () => {
    if (!editCat?.name || !editCat?.slug) { toast.error("Nazwa i slug wymagane"); return; }
    const payload = {
      name: editCat.name, slug: editCat.slug,
      sort_order: editCat.sort_order ?? 999,
      is_visible: editCat.is_visible ?? true,
    };
    const { error } = editCat.id
      ? await supabase.from("menu_categories").update(payload).eq("id", editCat.id)
      : await supabase.from("menu_categories").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Zapisano"); setEditCat(null); refresh(); }
  };

  const deleteCat = async (id: string) => {
    if (!confirm("Usunąć kategorię i wszystkie pozycje w niej?")) return;
    const { error } = await supabase.from("menu_categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Usunięto"); refresh(); }
  };

  const saveSauce = async () => {
    if (!editSauce?.name) { toast.error("Nazwa wymagana"); return; }
    const payload = {
      name: editSauce.name,
      price: editSauce.price || "3 zł",
      sort_order: editSauce.sort_order ?? 999,
      is_visible: editSauce.is_visible ?? true,
    };
    const { error } = editSauce.id
      ? await supabase.from("pizza_sauces").update(payload).eq("id", editSauce.id)
      : await supabase.from("pizza_sauces").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Zapisano"); setEditSauce(null); refresh(); }
  };

  const deleteSauce = async (id: string) => {
    if (!confirm("Usunąć sos?")) return;
    const { error } = await supabase.from("pizza_sauces").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Usunięto"); refresh(); }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container max-w-6xl flex items-center justify-between py-4">
          <div>
            <h1 className="font-serif text-2xl font-bold">Panel menu</h1>
            <p className="text-sm text-muted-foreground">Edytuj kartę restauracji</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/">Zobacz stronę</Link></Button>
            <Button variant="ghost" onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}>
              <LogOut className="w-4 h-4 mr-2" /> Wyloguj
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl py-8">
        <Tabs defaultValue="items">
          <TabsList>
            <TabsTrigger value="items">Pozycje menu</TabsTrigger>
            <TabsTrigger value="cats">Kategorie</TabsTrigger>
            <TabsTrigger value="sauces">Sosy</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4">
            <Button onClick={() => setEditItem({ allergens: [], is_visible: true, sort_order: 999 })}>
              <Plus className="w-4 h-4 mr-2" /> Dodaj pozycję
            </Button>
            {data?.categories.map((cat) => (
              <Card key={cat.id} className="p-4">
                <h3 className="font-serif text-xl font-bold mb-3">{cat.name}</h3>
                <div className="space-y-2">
                  {data.items.filter((i) => i.category_id === cat.id).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-secondary rounded">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.name}</span>
                          {!item.is_visible && <span className="text-xs px-2 py-0.5 bg-muted rounded">ukryta</span>}
                          {item.tag && <span className="text-xs text-primary">{item.tag}</span>}
                        </div>
                        {item.description && <p className="text-sm text-muted-foreground truncate">{item.description}</p>}
                      </div>
                      <span className="text-primary font-semibold">{item.price}</span>
                      <Button size="icon" variant="ghost" onClick={() => setEditItem({ ...item })}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="cats" className="space-y-4">
            <Button onClick={() => setEditCat({ is_visible: true, sort_order: 999 })}>
              <Plus className="w-4 h-4 mr-2" /> Dodaj kategorię
            </Button>
            <Card className="p-4 space-y-2">
              {data?.categories.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-secondary rounded">
                  <div className="flex-1">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({c.slug})</span>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setEditCat({ ...c })}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteCat(c.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </Card>
          </TabsContent>

          <TabsContent value="sauces" className="space-y-4">
            <Button onClick={() => setEditSauce({ is_visible: true, sort_order: 999, price: "3 zł" })}>
              <Plus className="w-4 h-4 mr-2" /> Dodaj sos
            </Button>
            <Card className="p-4 space-y-2">
              {data?.sauces.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-secondary rounded">
                  <span className="flex-1 font-semibold">{s.name}</span>
                  <span className="text-primary">{s.price}</span>
                  <Button size="icon" variant="ghost" onClick={() => setEditSauce({ ...s })}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteSauce(s.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Item dialog */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem?.id ? "Edytuj pozycję" : "Nowa pozycja"}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div>
                <Label>Kategoria</Label>
                <Select value={editItem.category_id ?? ""} onValueChange={(v) => setEditItem({ ...editItem, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Wybierz kategorię" /></SelectTrigger>
                  <SelectContent>
                    {data?.categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nazwa</Label>
                <Input value={editItem.name ?? ""} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
              </div>
              <div>
                <Label>Opis</Label>
                <Textarea value={editItem.description ?? ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cena</Label>
                  <Input value={editItem.price ?? ""} onChange={(e) => setEditItem({ ...editItem, price: e.target.value })} placeholder="np. 39 zł" />
                </div>
                <div>
                  <Label>Kolejność</Label>
                  <Input type="number" value={editItem.sort_order ?? 0} onChange={(e) => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <Label>Tag</Label>
                <Select value={editItem.tag ?? "none"} onValueChange={(v) => setEditItem({ ...editItem, tag: v === "none" ? null : (v as "spicy" | "veg") })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">brak</SelectItem>
                    <SelectItem value="spicy">ostra 🔥</SelectItem>
                    <SelectItem value="veg">wegetariańska 🌿</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Alergeny</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {Object.entries(ALLERGEN_NAMES).map(([id, name]) => {
                    const num = parseInt(id);
                    const checked = editItem.allergens.includes(num);
                    return (
                      <label key={id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => setEditItem({
                            ...editItem,
                            allergens: e.target.checked
                              ? [...editItem.allergens, num].sort((a, b) => a - b)
                              : editItem.allergens.filter((a) => a !== num),
                          })}
                        />
                        {num}. {name}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editItem.is_visible ?? true} onCheckedChange={(v) => setEditItem({ ...editItem, is_visible: v })} />
                <Label>Widoczne na stronie</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Anuluj</Button>
            <Button onClick={saveItem}>Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category dialog */}
      <Dialog open={!!editCat} onOpenChange={(o) => !o && setEditCat(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editCat?.id ? "Edytuj kategorię" : "Nowa kategoria"}</DialogTitle></DialogHeader>
          {editCat && (
            <div className="space-y-4">
              <div><Label>Nazwa</Label><Input value={editCat.name ?? ""} onChange={(e) => setEditCat({ ...editCat, name: e.target.value })} /></div>
              <div><Label>Slug (krótki identyfikator, bez spacji)</Label><Input value={editCat.slug ?? ""} onChange={(e) => setEditCat({ ...editCat, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} /></div>
              <div><Label>Kolejność</Label><Input type="number" value={editCat.sort_order ?? 0} onChange={(e) => setEditCat({ ...editCat, sort_order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={editCat.is_visible ?? true} onCheckedChange={(v) => setEditCat({ ...editCat, is_visible: v })} />
                <Label>Widoczna</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCat(null)}>Anuluj</Button>
            <Button onClick={saveCat}>Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sauce dialog */}
      <Dialog open={!!editSauce} onOpenChange={(o) => !o && setEditSauce(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editSauce?.id ? "Edytuj sos" : "Nowy sos"}</DialogTitle></DialogHeader>
          {editSauce && (
            <div className="space-y-4">
              <div><Label>Nazwa</Label><Input value={editSauce.name ?? ""} onChange={(e) => setEditSauce({ ...editSauce, name: e.target.value })} /></div>
              <div><Label>Cena</Label><Input value={editSauce.price ?? ""} onChange={(e) => setEditSauce({ ...editSauce, price: e.target.value })} /></div>
              <div><Label>Kolejność</Label><Input type="number" value={editSauce.sort_order ?? 0} onChange={(e) => setEditSauce({ ...editSauce, sort_order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={editSauce.is_visible ?? true} onCheckedChange={(v) => setEditSauce({ ...editSauce, is_visible: v })} />
                <Label>Widoczny</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSauce(null)}>Anuluj</Button>
            <Button onClick={saveSauce}>Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminMenu;
