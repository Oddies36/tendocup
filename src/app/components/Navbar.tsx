"use client";

import Link from "next/link";
import { Press_Start_2P, Modak } from "next/font/google";
import { useState } from "react";
import {
  Menu,
  X,
  Trophy,
  History,
  Plus,
  Crown,
  LogIn,
  PersonStanding,
  Gamepad,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const press = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press",
  display: "swap",
});

const modak = Modak({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-modak",
  display: "swap",
});

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  // Authentication state
  const { data: session, status } = useSession();

  // Create tournament via modal
  async function createTournamentFromModal() {
    try {
      const res = await fetch("/api/tournament/new-tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, location }),
      });
      if (!res.ok) throw new Error("Erreur lors de la création du tournoi.");

      const data = await res.json();
      setShowModal(false);
      setTitle("");
      setLocation("");
      router.push(`/tournament/${data.id}/setup`);
    } catch (error) {
      console.error(error);
      alert("Problème lors de la création du tournoi. Contactez le boss.");
    }
  }

  // Check auth before showing modal
  function handleNewTournamentClick() {
    if (status === "unauthenticated") {
      router.push("/connection");
    } else {
      setShowModal(true);
    }
  }

  return (
    <>
      <nav className="bg-gradient-to-r from-black via-zinc-900 to-black border-b-2 border-rose-600 text-white fixed w-full z-50 backdrop-blur-md shadow-lg shadow-rose-600/20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden relative z-50 p-2 rounded-md hover:bg-rose-600/20 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? (
                <X size={24} className="text-rose-500" />
              ) : (
                <Menu size={24} className="text-rose-500" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className={`${modak.className} flex-shrink-0`}>
              <div className="text-2xl sm:text-3xl bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent hover:from-rose-400 hover:to-red-500 transition-all duration-300">
                TENDO CUP
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div
              className={`${press.className} hidden lg:flex items-center space-x-1 xl:space-x-2`}
            >
              <Link href="/">
                <div className="px-3 py-2 rounded-md text-xs whitespace-nowrap hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300 flex items-center gap-2">
                  <Trophy size={14} />
                  <span>Accueil</span>
                </div>
              </Link>

              <Link href="/previous-tournaments">
                <div className="px-3 py-2 rounded-md text-xs whitespace-nowrap hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300 flex items-center gap-2">
                  <History size={14} />
                  <span>Tournois Précédents</span>
                </div>
              </Link>

              {/* Auth check before opening modal */}
              <button
                onClick={handleNewTournamentClick}
                className="px-3 py-2 rounded-md text-xs whitespace-nowrap hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={14} />
                <span>Nouveau Tournoi</span>
              </button>

              <Link href="/current-champion">
                <div className="px-3 py-2 rounded-md text-xs whitespace-nowrap hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300 flex items-center gap-2">
                  <Crown size={14} />
                  <span>Champion</span>
                </div>
              </Link>

              <Link href="/players">
                <div className="px-3 py-2 rounded-md text-xs whitespace-nowrap hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300 flex items-center gap-2">
                  <PersonStanding size={14} />
                  <span>Joueurs</span>
                </div>
              </Link>

              <Link href="/games">
                <div className="px-3 py-2 rounded-md text-xs whitespace-nowrap hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300 flex items-center gap-2">
                  <Gamepad size={14} />
                  <span>Jeux</span>
                </div>
              </Link>
            </div>

            {/* Connection / session info (Desktop) */}
            {status === "authenticated" ? (
              <div className="hidden lg:block text-xs text-gray-300">
                Connecté en tant que{" "}
                <span className="text-rose-400">{session.user.name}</span>
              </div>
            ) : (
              <Link href="/connection" className="hidden lg:block">
                <div
                  className={`${press.className} px-4 py-2 rounded-md text-xs whitespace-nowrap bg-rose-600 hover:bg-rose-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-rose-600/30`}
                >
                  <LogIn size={14} />
                  <span>Connexion</span>
                </div>
              </Link>
            )}

            <div className="lg:hidden w-10"></div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className={`${press.className} px-4 pt-2 pb-4 space-y-2 bg-black/95 border-t border-rose-600/30`}
          >
            <Link href="/" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-md text-sm hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300">
                <Trophy size={16} />
                <span>Accueil</span>
              </div>
            </Link>

            <Link href="/previous-tournaments" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-md text-sm hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300">
                <History size={16} />
                <span>Tournois Précédents</span>
              </div>
            </Link>

            <button
              onClick={() => {
                setOpen(false);
                if (status === "unauthenticated") {
                  router.push("/connection");
                } else {
                  setShowModal(true);
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300 text-left"
            >
              <Plus size={16} />
              <span>Nouveau Tournoi</span>
            </button>

            <Link href="/current-champion" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-md text-sm hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300">
                <Crown size={16} />
                <span>Champion</span>
              </div>
            </Link>

            <Link href="/players" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-md text-sm hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300">
                <PersonStanding size={16} />
                <span>Joueurs</span>
              </div>
            </Link>

            <Link href="/games" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-md text-sm hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300">
                <Gamepad size={16} />
                <span>Jeux</span>
              </div>
            </Link>

            <Link href="/connection" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-md text-sm bg-rose-600 hover:bg-rose-700 transition-all duration-300 mt-4">
                <LogIn size={16} />
                <span>Connexion</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 text-white rounded-lg shadow-xl border border-rose-600 w-[90%] max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-rose-400">
              Nouveau Tournoi
            </h2>

            <label className="block mb-2 text-sm">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-zinc-800 border border-zinc-700 focus:border-rose-500 focus:outline-none"
              placeholder="Ex: Tendo Cup Ah Zebi"
            />

            <label className="block mb-2 text-sm">Lieu</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-zinc-800 border border-zinc-700 focus:border-rose-500 focus:outline-none"
              placeholder="Ex: Hal"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
              >
                Annuler
              </button>
              <button
                onClick={createTournamentFromModal}
                disabled={!title.trim()}
                className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700 transition disabled:opacity-50"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
