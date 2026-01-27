import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, ArrowLeft, Brain, Lock, Activity } from 'lucide-react';

const LandingPage = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Simulation d'un scan pour l'effet "Wow"
  const startDemoScan = () => {
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      setScanResult('safe');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-gray-100 font-sans relative overflow-hidden selection:bg-cyan-500/30">
      {/* --- AMBIANCE 2026 (Backgrounds animés) --- */}
      {/* Orbite cyan pour la sécurité */}
      <div className="fixed top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[150px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '5000ms' }} />
      {/* Orbite verte pour la validation */}
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] mix-blend-screen pointer-events-none" />

      {/* --- NAVIGATION --- */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto">
        <a href="https://devhub.wiki" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Retour au Hub</span>
        </a>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest animate-pulse">
            System Online
          </span>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* COLONNE GAUCHE : Présentation */}
        <div>
          {/* Logo Flottant */}
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-cyan-900/50 to-emerald-900/50 border border-cyan-500/30 mb-8 shadow-[0_0_40px_rgba(6,182,212,0.2)] backdrop-blur-md">
            <Shield size={48} className="text-cyan-300" />
          </div>

          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-emerald-200 mb-6 leading-tight">
            Serein
            <span className="text-cyan-500 text-6xl">.</span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
            La première IA de défense personnelle pour seniors.
            <span className="text-gray-200"> Détecte les arnaques, analyse les SMS et sécurise la navigation</span> en temps réel grâce à Claude AI.
          </p>

          {/* Tech Stack 2026 */}
          <div className="flex flex-wrap gap-3 mb-12">
            {['Node.js', 'React', 'Firebase', 'Claude AI'].map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-cyan-200 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all cursor-default"
              >
                {tech}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              Lancer la Démo
            </Link>
            <a
              href="https://github.com/MichaelGoeSlm/serein"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* COLONNE DROITE : Démo Interactive (Le "Hologramme") */}
        <div className="relative">
          {/* Cadre de l'appareil */}
          <div className="relative z-10 bg-[#0A101F]/80 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl p-8 shadow-2xl overflow-hidden ring-1 ring-white/5">
            {/* Header App */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Activity className="text-emerald-400 animate-pulse" size={20} />
                <span className="text-sm font-mono text-emerald-400/80">PROTECTION ACTIVE</span>
              </div>
              <Lock size={18} className="text-gray-500" />
            </div>

            {/* Zone de simulation */}
            <div className="space-y-6">
              <div className="bg-[#050912] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Message reçu</p>
                <p className="text-gray-300 font-mono text-sm leading-relaxed">
                  "Bonjour maman, j'ai perdu mon téléphone. C'est mon nouveau numéro +33612..."
                </p>
              </div>

              {/* Bouton Scan */}
              {!scanning && !scanResult && (
                <button
                  onClick={startDemoScan}
                  className="w-full py-4 rounded-xl border border-dashed border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/5 hover:border-cyan-500/60 transition-all flex items-center justify-center gap-2 group"
                >
                  <Brain size={20} className="group-hover:rotate-12 transition-transform" />
                  Analyser avec Serein AI
                </button>
              )}

              {/* État : Analyse en cours */}
              {scanning && (
                <div className="py-4 flex flex-col items-center justify-center text-cyan-400 gap-3">
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 animate-pulse"
                      style={{ width: '60%', animation: 'pulse 1s ease-in-out infinite' }}
                    />
                  </div>
                  <span className="text-xs font-mono animate-pulse">ANALYSE HEURISTIQUE EN COURS...</span>
                </div>
              )}

              {/* Résultat : Arnaque détectée */}
              {scanResult === 'safe' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <AlertTriangle className="text-red-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-red-200 font-bold mb-1">Arnaque détectée</h3>
                      <p className="text-red-200/60 text-sm">
                        Probabilité d'arnaque : <span className="text-red-400 font-bold">94%</span>. Technique connue : "L'enfant en détresse". Ne répondez pas.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1.2k</div>
                <div className="text-xs text-gray-500">Menaces bloquées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">0.02s</div>
                <div className="text-xs text-gray-500">Latence moyenne</div>
              </div>
            </div>
          </div>

          {/* Effet décoratif derrière le téléphone */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-600 to-purple-600 opacity-20 blur-2xl -z-10 rounded-[2rem]" />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
