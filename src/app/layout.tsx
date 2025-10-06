import "./globals.css";
import { Press_Start_2P, Modak } from "next/font/google";
import Link from "next/link";
import Navbar from "./components/Navbar";

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

export const metadata = {
  title: "Tendo Cup",
  description: "Description ici",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="fr">
      <body className="min-h-dvh bg-stone-300">
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
