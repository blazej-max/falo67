import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

type Pizza = {
  name: string;
};

export default function AdminMenu() {
  const [loading, setLoading] = useState(true);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [newPizza, setNewPizza] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/auth";
        return;
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔥 WAŻNE: blokuje render zanim Firebase sprawdzi usera
  if (loading) return <p style={{ padding: 20 }}>Ładowanie...</p>;

  const addPizza = () => {
    if (!newPizza) return;
    setPizzas([...pizzas, { name: newPizza }]);
    setNewPizza("");
  };

  const removePizza = (index: number) => {
    setPizzas(pizzas.filter((_, i) => i !== index));
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/auth";
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel - Menu</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={newPizza}
          onChange={(e) => setNewPizza(e.target.value)}
          placeholder="Nazwa pizzy"
        />
        <button onClick={addPizza}>Dodaj</button>
      </div>

      <ul>
        {pizzas.map((p, i) => (
          <li key={i}>
            {p.name}
            <button onClick={() => removePizza(i)}>Usuń</button>
          </li>
        ))}
      </ul>

      <button onClick={logout} style={{ marginTop: 20 }}>
        Wyloguj
      </button>
    </div>
  );
}