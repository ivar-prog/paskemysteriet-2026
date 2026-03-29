import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import GameIconButton from "../components/GameIconButton";
import GameUnlockModal from "../components/GameUnlockModal";
import { GAMES } from "../data/games";
import { useGameProgress } from "../hooks/useGameProgress";
import { GameDefinition } from "../types/game";

export default function GamePage(): React.JSX.Element {
  const navigate = useNavigate();
  const {
    progress,
    unlockGame,
    completeGame,
    resetProgress,
    completeAllGames,
    allCompleted,
  } = useGameProgress();
  const [selectedGame, setSelectedGame] = useState<GameDefinition | null>(null);

  return (
    <AppLayout>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-lg text-white transition hover:bg-red-600"
        aria-label="Go back"
      >
        ✕
      </button>
      <button
        type="button"
        onClick={() => {
          localStorage.removeItem("started");
          resetProgress();
        }}
        className="fixed top-16 right-4 z-50 rounded-lg bg-red-700 px-4 py-2 text-sm text-white shadow-lg transition hover:bg-red-800"
      >
        Reset localStorage
      </button>
      <button
        type="button"
        onClick={completeAllGames}
        className="fixed top-28 right-4 z-50 rounded-lg bg-green-700 px-4 py-2 text-sm text-white shadow-lg transition hover:bg-green-800"
      >
        Complete all games
      </button>

      <div className="flex h-[calc(100vh-40px)] items-center justify-center overflow-hidden px-2 py-2 sm:px-4 sm:py-4">
        <div className="relative w-full max-w-[600px]">
          <div className="relative mx-auto w-full max-w-[1000px] aspect-[3/4] sm:aspect-[4/5] md:aspect-[4/5]">
            <img
              src="/letter-bg.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
            />

            <div className="absolute left-1/2 top-8 h-[90%] w-[75%] -translate-x-1/2 overflow-hidden sm:h-[90%] sm:w-[48%] md:h-[90%] md:w-[75%]">
              <div className="h-full overflow-y-auto pt-4">
                <h1 className="mb-4 text-center font-handwrittenTitle text-2xl text-black md:text-3xl">
                  Kjære Nerskogenvenner
                </h1>

                <div className="font-handwritten text-lg leading-[1.45] text-black sm:text-[1.2rem] md:text-[1.2rem]">
                  {allCompleted ? (
                    <>
                      <p>Dere klarte det.</p>
                      <p>Alle sporene ble fulgt. Alle gåtene ble løst.</p>
                      <p>Jeg må innrømme… jeg er imponert.</p>
                      <p>
                        De som tok meg trodde de hadde vunnet.
                        <br /> De lette overalt, men de forsto aldri hvordan alt
                        hang sammen.
                      </p>
                      <p>Men dere gjorde det.</p>
                      <p>Dere så det jeg håpet noen ville se.</p>
                      <p>Nå gjenstår bare én siste ting.</p>
                      <p>
                        Eggene er ikke bare gjemt… de er gjemt et sted som hører
                        til her.
                      </p>
                      <p>
                        <strong>Der vi har ski.</strong>
                      </p>
                      <p>Finn riktig sted, og dere vil finne det jeg gjemte.</p>
                      <p>Lykke til.</p> <p>— Påskeharen</p>
                    </>
                  ) : (
                    <>
                      <p>Utrolig nok gikk ikke alt etter planen min.</p>
                      <p>
                        Noen fant ut hva jeg hadde skjult, og de kom etter meg.
                      </p>
                      <p>De trodde de kunne få tak i eggene uten problemer.</p>
                      <p>
                        En ting de ikke forsto, var hvor godt jeg hadde
                        forberedt meg.
                      </p>
                      <p>Raskt måtte jeg gjemme alt før de fant meg.</p>
                      <br />
                      <p>
                        Bare én ting var sikkert – eggene måtte holdes skjult.
                      </p>
                      <p>Om de fikk tak i dem, ville alt være tapt.</p>
                      <p>Riktig nok lette de overalt i huset.</p>
                      <p>
                        De åpnet skuffer, flyttet på ting og snudde alt opp ned.
                      </p>
                      <p>En etter en ga de opp, frustrerte og sinte.</p>
                      <p>
                        Til slutt tok de meg med seg, men eggene fant de aldri.
                      </p>
                      <br />
                      <p>
                        Nå er det opp til dere. Dere må følge sporene jeg har
                        lagt igjen. Dere trenger hverandre for å løse alle
                        gåtene. Alt vil åpenbare seg for dere etterhvert.
                      </p>
                      <p>
                        <strong>Les nøye.</strong> Tenk smart. Og stol på
                        hverandre.
                      </p>
                      <p>Lykke til.</p>
                      <p>— Påskeharen</p>
                    </>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 px-4 md:flex md:justify-between">
                  {GAMES.map((game) => (
                    <GameIconButton
                      key={game.id}
                      game={game}
                      state={progress[game.id]}
                      onClick={() => setSelectedGame(game)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GameUnlockModal
        game={selectedGame}
        isUnlocked={selectedGame ? progress[selectedGame.id].unlocked : false}
        onClose={() => setSelectedGame(null)}
        onUnlock={unlockGame}
        onComplete={completeGame}
      />
    </AppLayout>
  );
}
