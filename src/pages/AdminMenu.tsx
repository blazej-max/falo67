import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function AdminMenu() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/auth";
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/auth";
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Ładowanie...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>
      <p>Jesteś zalogowany</p>

      <button onClick={logout}>
        Wyloguj
      </button>
    </div>
  );
}