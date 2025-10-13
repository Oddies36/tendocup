"use client";

import Link from "next/link";
import { Press_Start_2P, Modak } from "next/font/google";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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

  async function handleNewTournament(){
    try{
      const res = await fetch("/api/tournament/new-tournament", { method: "POST" });
  
      if(!res.ok){
        throw new Error("Erreur lors de la création du tournoi.")
      }
      const data = await res.json();

      router.push(`/tournament/${data.id}/setup`);
    }
    catch(error){
      console.log(error);
      alert("Problème lors de la création du tournoi. Contactez le boss.")
    }
  }

  return (
    <nav className="bg-black/80 text-white fixed w-full z-50 backdrop-blur-sm">
      <div className="p-5 relative">
        <ul className="flex justify-between items-center">
          {/* Bouton burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative z-50"
            aria-label="Toggle menu"
          >
            {open ? (
              <X size={28} className="text-white" />
            ) : (
              <Menu size={28} className="text-white" />
            )}
          </button>

          {/* ===== MENU MOBILE déroulant (amélioré, plein écran, fluide) ===== */}
          <div
            className={`
              ${press.className}
              absolute top-full left-0 w-full bg-black/90 text-white
              flex flex-col items-center gap-5 py-6 text-sm
              transition-all duration-300 ease-in-out md:hidden
              ${open ? "opacity-100 max-h-96 translate-y-0" : "opacity-0 max-h-0 -translate-y-4"}
            `}
          >
            <Link
              onClick={() => setOpen(false)}
              href="/"
              className="transition-transform duration-300 hover:-translate-y-1 hover:scale-110 hover:text-red-500"
            >
              Accueil
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/previous-tournaments"
              className="transition-transform duration-300 hover:-translate-y-1 hover:scale-110 hover:text-red-500"
            >
              Tournois Précédents
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/new-tournament"
              className="transition-transform duration-300 hover:-translate-y-1 hover:scale-110 hover:text-red-500"
            >
              Nouveau Tournoi
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/current-champion"
              className="transition-transform duration-300 hover:-translate-y-1 hover:scale-110 hover:text-red-500"
            >
              Champion Actuel
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/connection"
              className="transition-transform duration-300 hover:-translate-y-1 hover:scale-110 hover:text-red-500"
            >
              Connexion
            </Link>
          </div>

          {/* Logo central */}
          <div className={`${modak.className} text-rose-600`}>
            <li className="text-3xl list-none">TENDO CUP</li>
          </div>

          {/* Liens desktop */}
          <div
            className={`${press.className} hidden md:flex gap-8 text-[clamp(0.6rem, 1vw + 0.5rem, 1rem)]`}
          >
            <Link href="/">
              <li className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-red-500 list-none ">
                Accueil
              </li>
            </Link>
            <Link href="/previous-tournaments">
              <li className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-red-500 list-none">
                Tournois Précédents
              </li>
            </Link>
              <li onClick={handleNewTournament} className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-red-500 list-none">
                Nouveau Tournoi
              </li>
            <Link href="/current-champion">
              <li className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-red-500 list-none">
                Champion Actuel
              </li>
            </Link>
          </div>

          {/* Lien Connexion séparé (inchangé) */}
          <div
            className={`${press.className} hidden md:flex flex-row gap-15 text-white`}
          >
            <Link href="/connection">
              <li className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-red-500 list-none">
                Connexion
              </li>
            </Link>
          </div>
        </ul>
      </div>
    </nav>
  );
}
