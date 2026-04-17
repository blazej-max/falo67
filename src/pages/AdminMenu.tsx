import { useEffect } from "react";
import { auth } from "@/firebase";

export default function AdminMenu() {
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = "/auth";
      }
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel </h1>
      <p>Jestes zalogowany</p>
    </div>
  );
}

<h1>TEST 123</h1>