"use client";

import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  champion: { name: string } | null;
}

export default function CurrentChampionClient({ champion }: Props) {
  return (
    <main className="pt-24 flex flex-col items-center justify-center min-h-[80vh] text-white">
      <h1 className="text-[4vw] text-center font-extrabold tracking-wide mb-12 text-rose-600 drop-shadow-md">
        CHAMPION ACTUEL
      </h1>

      {champion ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 1 }}
          className="relative bg-zinc-900/95 border border-rose-600 rounded-2xl shadow-[0_0_25px_rgba(244,63,94,0.4)] px-10 py-8 text-center max-w-md w-[90%]"
        >
          <motion.div
            initial={{ rotate: -10, scale: 0.6 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <Trophy
              size={80}
              className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse"
            />
          </motion.div>

          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-rose-400"
          >
            {champion.name}
          </motion.h2>

          <p className="mt-3 text-gray-300 italic">
            Défenseur du titre suprême de la Tendo Cup
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute inset-0 rounded-2xl border border-rose-600/30 blur-[1px]"
          />
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-700 text-lg"
        >
          Aucun champion.
        </motion.p>
      )}
    </main>
  );
}
