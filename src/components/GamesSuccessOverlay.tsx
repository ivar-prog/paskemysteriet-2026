import React, { useEffect, useMemo } from "react";

type GameSuccessOverlayProps = {
  open: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  onClose: () => void;
};

export default function GameSuccessOverlay({
  open,
  title = "Congratulations!",
  message = "You completed the game!",
  buttonText = "OK",
  onClose,
}: GameSuccessOverlayProps): React.JSX.Element | null {
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 140 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.9}s`,
        duration: `${3 + Math.random() * 2}s`,
        width: `${6 + Math.random() * 6}px`,
        height: `${10 + Math.random() * 10}px`,
        rotate: `${Math.random() * 360}deg`,
      })),
    []
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <style>
        {`
          @keyframes game-success-confetti-fall {
            0% {
              transform: translateY(-12vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(720deg);
              opacity: 0.95;
            }
          }

          @keyframes game-success-pop {
            0% {
              opacity: 0;
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>

      <div className="fixed inset-0 z-[9999]">
        <div className="absolute inset-0 bg-black/40" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute top-0 rounded-sm"
              style={{
                left: piece.left,
                width: piece.width,
                height: piece.height,
                transform: `rotate(${piece.rotate})`,
                animationName: "game-success-confetti-fall",
                animationDuration: piece.duration,
                animationDelay: piece.delay,
                animationTimingFunction: "linear",
                animationIterationCount: 1,
                backgroundColor: [
                  "#ef4444",
                  "#22c55e",
                  "#3b82f6",
                  "#eab308",
                  "#a855f7",
                  "#f97316",
                  "#ec4899",
                ][piece.id % 7],
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            style={{
              animation: "game-success-pop 0.22s ease-out",
            }}
          >
            <div className="mb-3 text-4xl">🎉</div>

            <h2 className="text-2xl font-bold text-stone-900">{title}</h2>

            <p className="mt-2 text-stone-700">{message}</p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-stone-900 px-5 py-2 text-white transition hover:bg-black"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
