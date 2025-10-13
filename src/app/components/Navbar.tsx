"use client";

import Link from "next/link";
import { Press_Start_2P, Modak } from "next/font/google";
import { useState } from "react";
import { Menu, X, Trophy, History, Plus, Crown, LogIn, PersonStanding, Gamepad } from "lucide-react";
import { useRouter } from "next/navigation";

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

  async function handleNewTournament() {
    try {
      const res = await fetch("/api/tournament/new-tournament", { method: "POST" });
      
      if (!res.ok) {
        throw new Error("Erreur lors de la création du tournoi.");
      }
      const data = await res.json();
      router.push(`/tournament/${data.id}/setup`);
    } catch (error) {
      console.log(error);
      alert("Problème lors de la création du tournoi. Contactez le boss.");
    }
  }

  return (
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
          <div className={`${press.className} hidden lg:flex items-center space-x-1 xl:space-x-2`}>
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
            
            <button
              onClick={handleNewTournament}
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

          {/* Connection Button (Desktop) */}
          <Link href="/connection" className="hidden lg:block">
            <div className={`${press.className} px-4 py-2 rounded-md text-xs whitespace-nowrap bg-rose-600 hover:bg-rose-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-rose-600/30`}>
              <LogIn size={14} />
              <span>Connexion</span>
            </div>
          </Link>

          {/* Spacer for mobile */}
          <div className="lg:hidden w-10"></div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`${press.className} px-4 pt-2 pb-4 space-y-2 bg-black/95 border-t border-rose-600/30`}>
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
              handleNewTournament();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300 text-left"
          >
            <Plus size={16} />
            <span>Nouveau Tournoi</span>
          </button>
          
          <Link href="/current-champion" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-md text-sm hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-300">
              <Crown size={16} />
              <span>Champion Actuel</span>
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
  );
}