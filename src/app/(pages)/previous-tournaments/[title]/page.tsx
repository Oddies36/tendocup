import { Quantico } from "next/font/google";
import { Trophy } from "lucide-react";

const quantico = Quantico({ subsets: ["latin"], weight: "700" });

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;
  const decodedTitle = decodeURIComponent(title);
  return (
    <main className="pt-20">
      <div className="bg-stone-200">
        <h1
          className={`${quantico.className} text-[40px] text-center mb-5 p-10`}
        >
          {decodedTitle}
        </h1>
      </div>

<div className="p-2 md:p-0">

      <div className="max-w-6xl mx-auto p-6 rounded-lg border bg-stone-200 shadow-md">
        <div className="border-l-4">
          <p className="ml-4 font-bold text-2xl">Participants</p>
        </div>
        <div className="p-5">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              Premier
            </li>
            <hr />
            <li className="flex items-center gap-2">
              <Trophy className="text-gray-400" />
              Deuxmième
            </li>
            <hr />
            <li className="flex items-center gap-2">
              <Trophy className="text-yellow-800" />
              Troisième
            </li>
            <hr />
            <li className="flex items-center gap-2">
              <Trophy className="text-stone-200" />
              Le reste
            </li>
            <hr />
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 rounded-lg border bg-stone-200 mt-4 shadow-md">
        <div className="border-l-4">
          <p className="ml-4 font-bold text-2xl">Jeux</p>
        </div>
        <div className="p-5">
          <ul className="space-y-2">
            <li className="flex items-center ml-2">Puck 99</li>
            <hr />
            <li className="flex items-center ml-2">Zebi</li>
            <hr />
            <li className="flex items-center ml-2">Volley</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 rounded-lg border bg-stone-200 mt-4 shadow-md mb-4">
        <div className="border-l-4">
          <p className="ml-4 font-bold text-2xl">Classement</p>
        </div>

        <div className="p-5 max-w-full overflow-x-auto">
          <table className="table-auto border-collapse border border-stone-400 text-center">
            <thead className="bg-stone-200">
              <tr>
                <th className="border border-stone-400 px-4 py-2">Joueur</th>
                <th className="border border-stone-400 px-4 py-2">Puck 99</th>
                <th className="border border-stone-400 px-4 py-2">Zebi</th>
                <th className="border border-stone-400 px-4 py-2">Volley</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-stone-400 px-4 py-2">Oddies</td>
                <td className="border border-stone-400 px-4 py-2">3</td>
                <td className="border border-stone-400 px-4 py-2">2</td>
                <td className="border border-stone-400 px-4 py-2">1</td>
              </tr>
              <tr>
                <td className="border border-stone-400 px-4 py-2">Tendo</td>
                <td className="border border-stone-400 px-4 py-2">2</td>
                <td className="border border-stone-400 px-4 py-2">2</td>
                <td className="border border-stone-400 px-4 py-2">1</td>
              </tr>
              <tr>
                <td className="border border-stone-400 px-4 py-2">Sukinay</td>
                <td className="border border-stone-400 px-4 py-2">1</td>
                <td className="border border-stone-400 px-4 py-2">1</td>
                <td className="border border-stone-400 px-4 py-2">1</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
</div>
    </main>
  );
}
