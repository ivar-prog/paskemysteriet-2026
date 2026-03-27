import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

export default function GamePage(): React.JSX.Element {
  const navigate = useNavigate();

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

      <div className="flex min-h-[calc(100vh-40px)] items-center justify-center px-2 py-2 sm:px-4 sm:py-4">
        <div className="relative w-full max-w-[1200px]">
          {/* Letter */}
          <div className="relative mx-auto w-full max-w-[1000px] aspect-[3/4] sm:aspect-[4/5] md:aspect-[4/5]">
            <img
              src="/letter-bg.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
            />

            {/* Writing area */}
            <div className="absolute left-1/2 h-[90%] w-[75%] -translate-x-1/2 overflow-hidden sm:h-[90%] sm:w-[48%] md:top-16 md:h-[90%] md:w-[75%]">
              <div className="h-full overflow-y-auto pt-8">
                <h1 className="text-black mb-4 text-center font-handwrittenTitle text-2xl md:text-5xl">
                  The Easter Mystery
                </h1>

                <div className="text-black font-handwritten text-lg leading-[1.45] sm:text-[1.7rem] md:text-[2rem]">
                  Kristendommens begynnelse Kristendommen startet som en jødisk
                  sekt sentrert rundt personen og læren til Jesus fra Nasaret.
                  Jesus ble anklaget for blasfemi og henrettet via korsfestelse,
                  men sto opp fra de døde ifølge sine nærmeste tilhengere,
                  apostlene. Oppstandelsen ble ansett som bevis for at Jesus var
                  den lovede Messias nevnt i jødenes bibel. Fra jødisk sekt til
                  universalreligion Ifølge de fire evangeliene viser Jesus seg
                  for apostlene etter Oppstandelsen. Da beordrer Jesus apostlene
                  til å spre budskapet hans til alle folkeslag – dette kalles
                  for misjonsbefalingen. Apostlene begynte deretter å misjonere
                  til alle, ikke bare til jøder. De startet også med å
                  organisere oldkirken, det vil si de tidligste menighetene.
                  Kristendommen ble dermed misjonerende og universal, åpen for
                  alle, i motsetning til jødedommen, som er en etnisk,
                  ikke-misjonerende religion. Det vil si at det ligger i
                  kristendommens natur å spre læren til alle mennesker på jorda.
                  Dette er en av grunnene til at kristendommen har blitt verdens
                  største religion.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
