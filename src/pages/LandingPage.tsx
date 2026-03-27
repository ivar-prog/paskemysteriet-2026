import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

export default function LandingPage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="relative min-h-screen flex flex-col items-center justify-center text-white">
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-[#253729] mb-10 text-center">
            Påskemysteriet på Nerskogen
          </h1>

          <div className="relative w-[80%] max-w-[500px] aspect-[4/3]">
            {/* Envelope as background */}
            <div
              className="w-full h-full bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: "url('/sealed-letter.png')" }}
            />

            {/* Invisible clickable wax seal area */}
            <button
              type="button"
              onClick={() => navigate("/game")}
              className="absolute left-1/2 -translate-x-1/2 
               bottom-[36%] 
               w-16 h-16 
               rounded-full 
               bg-transparent"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
