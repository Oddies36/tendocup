"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Connection() {
  const router = useRouter();
  
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submitForm(e: React.FormEvent){
    e.preventDefault();

    const response = await signIn("credentials", {
      redirect: false,
      userName,
      password
    });

    if (response?.error){
      setError("Nom d'utilisateur ou mot de passe incorrect");
      return;
    }

    router.push("/");
    
  }

  return(
    <main>
      <div className="min-h-[100dvh] flex justify-center items-center p-2 md:p-0">
        <form onSubmit={submitForm}>
          <div className="bg-stone-200 border rounded-xl min-w-80 flex flex-col justify-center items-center shadow-xl">
            <div>
              <h1 className="p-6 font-bold text-xl">Connexion</h1>
            </div>
            <div className="w-full p-4">
              <input onChange={(e) => setUserName(e.target.value)} type="text" placeholder="Nom d'utilisateur" className="border bg-white rounded-md mb-5 p-1 w-full" />
              <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mot de passe" className="border bg-white rounded-md p-1 w-full" />
            </div>
            <div className="p-4">
              <button type="submit" className="bg-blue-300 hover:bg-blue-400 rounded-md cursor-pointer shadow-xl">
                <p className="p-2">Connexion</p>
                {
                  error && (
                    <div>
                      <p className="text-red-500">{error}</p>
                    </div>
                  )
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}