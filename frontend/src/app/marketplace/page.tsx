'use client';
import { WalletConnect } from '@/components/WalletConnect';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACTS, MARKETPLACE_ABI } from '@/lib/contracts';

// Static mock listings for UI demonstration alongside real contract data
const MOCK_LISTINGS = Array.from({ length: 12 }).map((_, i) => ({
  id: `0xf${(i * 7 + 1).toString(16).padStart(3, '0')}...${(i * 13 + 5).toString(16).padStart(4, '0')}`,
  value: (Math.random() * 100 + 10).toFixed(2),
  price: (Math.random() * 90 + 9).toFixed(2),
  discount: (Math.random() * 10 + 2).toFixed(1),
  age: `${Math.floor(Math.random() * 24)}H ${Math.floor(Math.random() * 60)}M`,
  isMock: true,
}));

export default function Marketplace() {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddresses = CONTRACTS[chainId as keyof typeof CONTRACTS];
  const marketplaceAddress = contractAddresses?.MARKETPLACE as `0x${string}` | undefined;

  const { data: txHash, isPending, writeContract, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const handleBuy = (walletAddr: string, price: string) => {
    if (!marketplaceAddress) return setTxError('Unsupported network');
    setSelectedWallet(walletAddr);
    setTxError(null);
    writeContract({
      address: marketplaceAddress,
      abi: MARKETPLACE_ABI,
      functionName: 'buyWallet',
      args: [walletAddr as `0x${string}`],
      value: parseEther(price),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020202] relative text-[#E0E0E0] overflow-x-hidden">
      <div className="noise-bg"></div>

      {/* Bloomberg-style Header */}
      <nav className="w-full p-4 px-8 flex justify-between items-center border-b border-[#2A2A2A] bg-[#020202] z-50 font-mono text-xs uppercase tracking-widest">
        <div className="flex gap-8 items-center">
          <Link href="/" className="text-[#D4AF37] hover:text-[#F3E5AB] flex items-center gap-3">
            <span className="w-2 h-2 bg-[#D4AF37]"></span>
            Liquid_Terminal
          </Link>
          <span className="text-[#333333]">/</span>
          <span className="text-[#FDF5E6]">OTC_Orderbook</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 border border-[#2A2A2A] px-4 py-2">
            <span className="text-green-500 animate-pulse text-[8px]">●</span>
            <span className="text-[#888888] text-[9px]">Network: Anvil // Chain 31337</span>
          </div>
          <WalletConnect />
        </div>
      </nav>

      <main className="flex-1 w-full px-8 py-8 flex flex-col gap-6 z-10 relative">

        {/* Metrics Bar */}
        <div className="grid grid-cols-4 gap-4 mb-2">
          {[
            { label: 'Total Liquidity (24H)', value: '1,402.50', unit: 'ETH' },
            { label: 'Active Wallets', value: '342', unit: 'TOTAL' },
            { label: 'Avg Market Discount', value: '6.4%', unit: 'PREMIUM' },
            { label: 'Network Gas', value: '12', unit: 'GWEI' },
          ].map((metric, idx) => (
            <div key={idx} className="border border-[#2A2A2A] bg-[#050505] p-5 flex flex-col justify-between h-28 hover:border-[#D4AF37]/40 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#D4AF37]/50 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <span className="text-[9px] text-[#555555] font-mono uppercase tracking-[0.2em]">{metric.label}</span>
              <span className="text-3xl font-serif text-[#FDF5E6]">
                {metric.value}
                <span className="text-[10px] font-mono text-[#D4AF37] ml-2">{metric.unit}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Error / success messages */}
        {txError && (
          <div className="border border-red-500/30 bg-red-500/5 p-4 text-xs font-mono text-red-400">⚠ {txError}</div>
        )}
        {isConfirmed && (
          <div className="border border-green-500/30 bg-green-500/5 p-4 text-xs font-mono text-green-400">
            ✓ Trade executed! TX: {txHash?.slice(0, 24)}...
          </div>
        )}

        {/* Orderbook Table */}
        <div className="flex-1 border border-[#2A2A2A] bg-[#050505] overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>

          {/* Table Header */}
          <div className="grid grid-cols-7 border-b border-[#2A2A2A] bg-[#0A0A0A] p-4 text-[9px] text-[#555555] font-mono uppercase tracking-[0.3em]">
            <div className="pl-4">Wallet Contract</div>
            <div>Age</div>
            <div>Underlying Asset</div>
            <div>Asking Price</div>
            <div>Discount</div>
            <div>Status</div>
            <div className="text-right pr-4">Execution</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2A2A2A #050505' }}>
            {MOCK_LISTINGS.map((listing, i) => {
              const isThisPending = isPending && selectedWallet === listing.id;
              const isThisConfirming = isConfirming && selectedWallet === listing.id;
              return (
                <div key={i} className="grid grid-cols-7 items-center p-4 border-b border-[#111111] hover:bg-[#D4AF37]/[0.02] transition-colors group">

                  <div className="font-mono text-xs text-[#555555] group-hover:text-[#D4AF37] transition-colors pl-4">
                    {listing.id}
                  </div>

                  <div className="font-mono text-[10px] text-[#555555]">{listing.age}</div>

                  <div className="font-serif text-xl text-white">
                    {listing.value} <span className="text-[9px] text-[#888888] font-mono tracking-widest">ETH</span>
                  </div>

                  <div className="font-serif text-xl text-[#D4AF37]">
                    {listing.price} <span className="text-[9px] text-[#D4AF37]/50 font-mono tracking-widest">ETH</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-green-400 border border-green-400/20 bg-green-400/5 px-2 py-1 tracking-widest">
                      -{listing.discount}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono text-[#555555] border border-[#2A2A2A] px-2 py-1">
                      LISTED
                    </span>
                  </div>

                  <div className="text-right pr-4">
                    <button
                      disabled={!isConnected || isThisPending || isThisConfirming}
                      onClick={() => handleBuy(listing.id, listing.price)}
                      className="border border-[#2A2A2A] text-[#888888] text-[9px] font-mono uppercase tracking-[0.2em] px-6 py-2 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isThisPending || isThisConfirming ? 'Pending...' : 'Execute Trade'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
