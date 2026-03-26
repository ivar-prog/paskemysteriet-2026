import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

export default function GamePage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div
        className="min-h-[calc(100vh-64px)] w-[600px] inset-0 bg-cover text-black p-8 mx-auto my-8"
        style={{ backgroundImage: "url('/letter-bg.png')" }}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/70 text-white text-lg hover:bg-red-600 transition"
        >
          ✕
        </button>
        <div className="p-8">
          <h1 className="text-4xl font-handwrittenTitle mb-4">
            The Easter Mystery
          </h1>
          <div className="font-handwritten text-2xl">
            Kristendommens begynnelse Kristendommen startet som en jødisk sekt
            sentrert rundt personen og læren til Jesus fra Nasaret. Jesus ble
            anklaget for blasfemi og henrettet via korsfestelse, men sto opp fra
            de døde ifølge sine nærmeste tilhengere, apostlene. Oppstandelsen
            ble ansett som bevis for at Jesus var den lovede Messias nevnt i
            jødenes bibel. Fra jødisk sekt til universalreligion Ifølge de fire
            evangeliene viser Jesus seg for apostlene etter Oppstandelsen. Da
            beordrer Jesus apostlene til å spre budskapet hans til alle
            folkeslag – dette kalles for misjonsbefalingen. Apostlene begynte
            deretter å misjonere til alle, ikke bare til jøder. De startet også
            med å organisere oldkirken, det vil si de tidligste menighetene.
            Kristendommen ble dermed misjonerende og universal, åpen for alle, i
            motsetning til jødedommen, som er en etnisk, ikke-misjonerende
            religion. Det vil si at det ligger i kristendommens natur å spre
            læren til alle mennesker på jorda. Dette er en av grunnene til at
            kristendommen har blitt verdens største religion.
          </div>
        </div>
        {/* rest of your game page */}
      </div>
    </AppLayout>
  );
}
