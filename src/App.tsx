import React from "react";
import BackgroundRemover from "./components/BackgroundRemover";

function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-100 to-purple-200 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 transition-colors duration-500 overflow-hidden">
      <div className="w-full max-w-3xl p-2 sm:p-6 bg-white/60 dark:bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-white/20 flex flex-col items-center justify-center min-h-[540px] max-h-[90vh] transition-all">
        <BackgroundRemover />
        <footer className="text-center mt-6 text-gray-500 dark:text-gray-400 text-xs hidden sm:block opacity-70">
          Powered by{" "}
          <a
            href="https://img.ly"
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            IMG.LY
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
