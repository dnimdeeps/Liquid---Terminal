'use client';

import { WalletConnect } from '@/components/WalletConnect';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-darker text-text-main tech-grid">
      <div className="noise-bg"></div>
      <div className="ambient-glow absolute top-0 left-0 w-full h-[800px] pointer-events-none"></div>
      
      {/* Top Nav */}
      <nav className="w-full px-8 py-6 flex justify-between items-center relative z-50 mix-blend-difference">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center relative">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
            <div className="absolute w-full h-full border border-[#D4AF37] rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="text-sm font-serif tracking-[0.3em] uppercase text-[#FDF5E6]">
            Liquid Terminal
          </div>
        </div>
        <WalletConnect />
      </nav>

      {/* Hero Section - Asymmetrical */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-24 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Column: Typography */}
        <div className="flex-1 text-left relative">
          <div className="absolute -left-8 -top-8 w-16 h-16 border-l border-t border-[#D4AF37] opacity-30"></div>
          
          <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 border border-[#D4AF37]/20 bg-[#070707]/50 backdrop-blur-md">
            <span className="w-2 h-px bg-[#D4AF37]"></span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">Institutional Grade</span>
            <span className="w-2 h-px bg-[#D4AF37]"></span>
          </div>
          
          <h1 className="text-7xl lg:text-[7rem] font-serif font-light tracking-tighter leading-[0.9] mb-8 relative z-20">
            <span className="block text-white/90">Abstract.</span>
            <span className="block gold-gradient-text italic pr-4">Partition.</span>
            <span className="block text-white/50">Execute.</span>
          </h1>
          
          <p className="text-lg text-[#888888] mb-12 max-w-xl font-light leading-relaxed border-l border-[#D4AF37]/20 pl-6">
            A decentralized dark pool infrastructure for whale-tier asset management. 
            Fragment massive capital blocks into secure ERC-4337 smart wallets and 
            distribute them via an encrypted OTC secondary market.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/terminal" className="group relative overflow-hidden bg-[#D4AF37] text-black py-5 px-10 text-xs uppercase tracking-[0.3em] font-bold transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] text-center">
              <span className="relative z-10">Access Terminal</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </Link>
            <Link href="/marketplace" className="group relative overflow-hidden glass-panel-heavy text-[#FDF5E6] py-5 px-10 text-xs uppercase tracking-[0.3em] font-medium transition-all hover:border-[#D4AF37] text-center">
              <span className="relative z-10">Retail Orderbook</span>
              <div className="absolute inset-0 bg-[#D4AF37]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </Link>
          </div>
        </div>

        {/* Right Column: Abstract Data Visualization */}
        <div className="flex-1 relative w-full h-[600px] hidden lg:block">
           <div className="absolute top-1/4 right-0 w-80 h-96 glass-panel-heavy z-20 transform rotate-3 hover:rotate-0 transition-transform duration-700 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[#D4AF37]">TX: 0x9f...4a2b</span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div className="space-y-2">
                <div className="h-px w-full bg-[#D4AF37]/20"></div>
                <div className="text-4xl font-serif text-white">500.00 ETH</div>
                <div className="text-xs tracking-widest text-[#888888] uppercase">Partitioned Asset</div>
              </div>
              <div className="text-[10px] font-mono text-[#D4AF37]/50 break-all leading-relaxed">
                00110001 01101001 01110000 01101111 01101100 01111001
                10101100 11100110 01010101 11001100 01111000 10101011
              </div>
           </div>
           
           <div className="absolute top-1/2 left-10 w-72 h-80 glass-panel z-10 transform -rotate-6 scale-90 opacity-60"></div>
           <div className="absolute bottom-10 right-20 w-64 h-64 border border-[#D4AF37]/30 rounded-full animate-[spin_20s_linear_infinite] border-dashed"></div>
           <div className="absolute top-20 right-40 w-48 h-48 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        </div>

      </div>

      <div className="absolute bottom-0 w-full h-12 border-t border-[#D4AF37]/10 flex items-center px-8 justify-between text-[9px] font-mono uppercase tracking-[0.4em] text-[#D4AF37]/40 z-20">
        <span>V 1.0.0 // Mainnet Beta</span>
        <span>Secure Enclave Active</span>
      </div>
    </main>
  );
}
