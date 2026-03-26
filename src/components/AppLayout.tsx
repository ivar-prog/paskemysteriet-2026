import React from "react";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps): React.JSX.Element {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/forest.jpg')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-white/50" />

      {/* Content layer */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
