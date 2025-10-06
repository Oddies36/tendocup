"use client";

import Link from "next/link";
import { Press_Start_2P, Modak } from "next/font/google";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="bg-black/80 p-5">
        <ul className="flex justify-between">
          <button onClick={() => setOpen(!open)} className="md:hidden">
            <Menu size={28} className="text-white"></Menu>
          </button>

          {open && (
            <ul className="text-white flex flex-col mt-4 gap-4 md:hidden">
              <li>
                <Link onClick={() => setOpen(!open)} href="/">Accueil</Link>
              </li>
              <li>
                <Link onClick={() => setOpen(!open)} href="/previous-tournaments">Tournois Précédents</Link>
              </li>
              <li>
                <Link onClick={() => setOpen(!open)} href="/new-tournament">Nouveau Tournoi</Link>
              </li>
              <li>
                <Link onClick={() => setOpen(!open)} href="/current-champion">Champion Actuel</Link>
              </li>
              <li>
                <Link onClick={() => setOpen(!open)} href="/connection">Connexion</Link>
              </li>
            </ul>
          )}

          <div className={`${modak.className} text-rose-600`}>
            <li className="text-3xl">TENDO CUP</li>
          </div>
          <div
            className={`${press.className} hidden md:flex flex-row gap-15 text-white`}
          >
            <Link href="/">
              <li className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-red-500">
                Accueil
              </li>
            </Link>
            <Link href="/previous-tournaments">
              <li className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-red-500">
                Tournois Précédents
              </li>
            </Link>
            <Link href="/new-tournament">
              <li className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-red-500">
                Nouveau Tournoi
              </li>
            </Link>
            <Link href="/current-champion">
              <li className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-red-500">
                Champion Actuel
              </li>
            </Link>
          </div>
          <div
            className={`${press.className} hidden md:flex flex-row gap-15 text-white`}
          >
            <Link href="/connection">
              <li className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:text-red-500">
                Connexion
              </li>
            </Link>
          </div>
        </ul>
      </div>
    </nav>
  );
}
