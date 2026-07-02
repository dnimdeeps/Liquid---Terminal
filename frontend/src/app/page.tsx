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
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">Liquid Terminal</span>
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

        {/* Right Column: Protocol Architecture Visualization */}
        <div className="flex-1 relative w-full h-[600px] hidden lg:flex flex-col gap-4 items-end justify-center">

          {/* Factory Contract */}
          <div className="w-80 glass-panel-heavy z-20 p-5 flex flex-col gap-3 border-l-2 border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-shadow">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.3em] uppercase">PartitionFactory.sol</span>
              <span className="text-[9px] font-mono text-green-400">ERC-721</span>
            </div>
            <div className="text-xs text-[#888888] font-light">Mints NFT Keys and deploys Smart Contract Vaults. The entry point of the protocol.</div>
            <div className="h-px bg-[#2A2A2A]"></div>
            <div className="text-[9px] font-mono text-[#555555]">createPartitions(count) payable</div>
          </div>

          {/* Arrow */}
          <div className="w-px h-8 bg-gradient-to-b from-[#D4AF37]/60 to-[#D4AF37]/20 mr-40"></div>

          {/* Vault Contract */}
          <div className="w-72 glass-panel z-10 p-5 flex flex-col gap-3 border-l-2 border-[#888888] scale-95 opacity-80 hover:opacity-100 hover:scale-100 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-[#888888] tracking-[0.3em] uppercase">PartitionWallet.sol</span>
              <span className="text-[9px] font-mono text-[#555555]">TBA</span>
            </div>
            <div className="text-xs text-[#555555] font-light">A programmable Smart Contract Vault. Obeys only the current NFT holder.</div>
            <div className="h-px bg-[#2A2A2A]"></div>
            <div className="text-[9px] font-mono text-[#444444]">withdrawETH / executeCall</div>
          </div>

          {/* Arrow */}
          <div className="w-px h-8 bg-gradient-to-b from-[#D4AF37]/20 to-transparent mr-32"></div>

          {/* Marketplace Contract */}
          <div className="w-64 glass-panel z-10 p-5 flex flex-col gap-3 border-l-2 border-[#555555] scale-90 opacity-60 hover:opacity-90 hover:scale-95 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-[#555555] tracking-[0.3em] uppercase">Marketplace.sol</span>
              <span className="text-[9px] font-mono text-blue-400/60">USDC</span>
            </div>
            <div className="text-xs text-[#444444] font-light">On-chain OTC orderbook. Atomic NFT ↔ USDC settlement.</div>
            <div className="h-px bg-[#2A2A2A]"></div>
            <div className="text-[9px] font-mono text-[#333333]">listWallet / buyWallet</div>
          </div>

          <div className="absolute bottom-0 right-0 w-64 h-64 border border-[#D4AF37]/20 rounded-full animate-[spin_30s_linear_infinite] border-dashed pointer-events-none"></div>
        </div>

      </div>

      {/* Architecture Explanation Section */}
      <div className="relative z-10 w-full bg-[#050505] border-t border-[#D4AF37]/10 py-24 px-8 mt-20">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] mb-4">Architecture</h2>
            <h3 className="text-4xl lg:text-5xl font-serif text-white">The Vault and The Key</h3>
            <p className="text-[#888888] mt-6 max-w-2xl mx-auto font-light leading-relaxed">
              Liquid Terminal does not trade tokens. It trades the cryptographic keys to Smart Contract Wallets. 
              Powered by Token-Bound Accounts (ERC-6551 architecture).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="glass-panel p-8 border-t border-[#D4AF37]/40 hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center mb-6 text-[#D4AF37] font-serif text-xl">1</div>
              <h4 className="text-xl font-serif text-white mb-4">The Steel Vault</h4>
              <p className="text-sm text-[#888888] leading-relaxed">
                When you partition capital, the protocol deploys independent Smart Contract Wallets. 
                These are robotic vaults living on the blockchain that securely hold your ETH or tokens.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-panel p-8 border-t border-[#D4AF37]/40 hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center mb-6 text-[#D4AF37] font-serif text-xl">2</div>
              <h4 className="text-xl font-serif text-white mb-4">The NFT Key</h4>
              <p className="text-sm text-[#888888] leading-relaxed">
                Instead of a seed phrase, ownership is tied to an ERC-721 NFT minted to your wallet. 
                The Vault's code has one rule: <em>"I will only obey the Ethereum address holding my NFT."</em>
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-panel p-8 border-t border-[#D4AF37]/40 hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center mb-6 text-[#D4AF37] font-serif text-xl">3</div>
              <h4 className="text-xl font-serif text-white mb-4">The OTC Transfer</h4>
              <p className="text-sm text-[#888888] leading-relaxed">
                Selling the NFT on our marketplace instantly transfers absolute control of the Vault to the buyer. 
                You just traded an entire wallet over-the-counter without moving a single underlying token.
              </p>
            </div>

          </div>

          <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-serif text-white mb-6">100% Dynamic Value Peg</h3>
              <p className="text-[#888888] font-light leading-relaxed mb-6">
                The value of a Partition NFT is mathematically pegged to the live balance inside its Vault. 
                If the Vault holds 10 ETH, the NFT is intrinsically worth 10 ETH. 
              </p>
              <p className="text-[#888888] font-light leading-relaxed">
                <strong>Buyer Protection:</strong> Because an owner can withdraw funds at any time, 
                our Marketplace and Dashboard dynamically query the live blockchain state. If a seller drains their vault, 
                the UI immediately updates to show an empty balance, preventing the sale of an empty shell.
              </p>
            </div>
            
            <div className="glass-panel-heavy p-8 border-l border-[#D4AF37] flex flex-col justify-center relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#D4AF37]/10 blur-3xl rounded-full"></div>
               <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-4">Infrastructure Specs</h4>
               <ul className="space-y-4 font-mono text-xs text-[#E0E0E0]">
                 <li className="flex justify-between border-b border-[#2A2A2A] pb-2">
                   <span className="text-[#888888]">Network</span>
                   <span>Arbitrum One (L2)</span>
                 </li>
                 <li className="flex justify-between border-b border-[#2A2A2A] pb-2">
                   <span className="text-[#888888]">Est. Partition Gas Cost</span>
                   <span className="text-green-400">~$0.01 USD</span>
                 </li>
                 <li className="flex justify-between border-b border-[#2A2A2A] pb-2">
                   <span className="text-[#888888]">Standard</span>
                   <span>ERC-721 / TBA</span>
                 </li>
               </ul>
            </div>
          </div>

        </div>
      </div>

      <div className="w-full h-12 border-t border-[#D4AF37]/10 flex items-center px-8 justify-between text-[9px] font-mono uppercase tracking-[0.4em] text-[#D4AF37]/40 z-20 relative bg-[#020202]">
        <span>V 1.0.0 // Mainnet Beta</span>
        <span>Secure Enclave Active</span>
      </div>
    </main>
  );
}
