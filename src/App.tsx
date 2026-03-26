import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <LandingPage />
            </PageWrapper>
          }
        />
        <Route
          path="/game"
          element={
            <PageWrapper>
              <GamePage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
