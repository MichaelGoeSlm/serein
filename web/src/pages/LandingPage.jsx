import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  ClipboardPaste, 
  BrainCircuit, 
  ShieldCheck, 
  Rocket, 
  Heart, 
  MessageCircle 
} from 'lucide-react';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="serein-landing selection:bg-cyan-500/30 selection:text-white">
      {/* Aurora Background */}
      <div className="aurora-bg"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 py-4 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center glass-container rounded-full p-3 pl-5">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-cyan-400 fill-cyan-400/10" />
            <span className="text-2xl font-bold text-gradient-cyan tracking-wide">Serein.ai</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/10">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/30 rounded-full text-xs font-medium text-white border border-blue-500/30">
              <span className="uppercase">fr</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors">
              <span className="uppercase">en</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors">
              <span className="uppercase">es</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">Protégez-vous des</span>
            <span className="text-gradient-cyan">arnaques en ligne</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Une intelligence artificielle bienveillante qui analyse vos liens, emails et images pour détecter les contenus trompeurs.
          </p>
          <Link 
            to="/login"
            className="btn-glow px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-lg font-bold text-white inline-flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* Why Serein Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto glass-container rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Pourquoi Serein ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              'Pas de publicité',
              'Pas de tracking',
              'Vos données restent privées',
              'Conçu pour être simple'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="p-3 bg-green-500/20 rounded-full border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-lg font-medium text-gray-200">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/10 via-purple-500/20 to-cyan-500/10 -translate-y-1/2 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 glass-container rounded-2xl flex items-center justify-center mb-6 border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                <ClipboardPaste className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">1. Soumettez</h3>
              <p className="text-gray-400">Collez un lien ou une image suspecte.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 glass-container rounded-2xl flex items-center justify-center mb-6 border-purple-500/30 shadow-[0_0_25px_rgba(139,92,246,0.15)]">
                <BrainCircuit className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">2. Analysez</h3>
              <p className="text-gray-400">Notre IA analyse le contenu en temps réel.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 glass-container rounded-2xl flex items-center justify-center mb-6 border-green-500/30 shadow-[0_0_25px_rgba(34,197,94,0.15)]">
                <ShieldCheck className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">3. Verdict</h3>
              <p className="text-gray-400">Recevez un verdict clair et des conseils.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Un prix simple et transparent</h2>
          
          <div className="glass-container rounded-3xl p-10 border-t-2 border-t-purple-500/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent opacity-30 pointer-events-none"></div>
            
            <h3 className="text-2xl font-bold text-green-400 mb-4">3 analyses gratuites</h3>
            <p className="text-gray-300 mb-8">pour essayer sans engagement</p>
            
            <div className="my-10">
              <span className="text-6xl font-extrabold text-white">29 €</span>
              <span className="text-xl text-gray-400"> / an</span>
            </div>
            
            <p className="text-lg text-gray-300 mb-10">pour un accès illimité</p>
            
            <Link 
              to="/login"
              className="btn-glow w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-lg font-bold text-white flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Commencer gratuitement
            </Link>
            <p className="text-sm text-gray-500 mt-6">Pas d'engagement. Pas de surprise.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm">
        <p className="flex items-center justify-center gap-2">
          Serein - Fait avec <Heart className="w-4 h-4 text-red-500 fill-red-500" /> pour votre tranquillité.
        </p>
      </footer>

      {/* Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="chat-bubble p-4 rounded-full bg-[#1A1F36] hover:bg-[#242a45] transition-colors">
          <MessageCircle className="w-6 h-6 text-blue-400" />
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
