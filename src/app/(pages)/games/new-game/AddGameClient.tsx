"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddGameClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/games/new-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l’ajout du jeu.");
        return;
      }

      setSuccess("Jeu ajouté avec succès !");
      setName("");
      setTimeout(() => router.push("/games"), 1000);
    } catch (err) {
      setError("Erreur serveur.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-6 rounded-md bg-stone-200 w-80 shadow-md transition-all duration-300 hover:border-red-400"
    >
      <label className="block mb-2 font-semibold text-gray-700">
        Nom du jeu :
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 rounded border border-gray-400 focus:outline-none focus:border-red-400"
        placeholder="Ex: Smash Bros"
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-md py-2 transition-all disabled:opacity-50"
      >
        Ajouter
      </button>
    </form>
  );
}
