'use client';
import { WalletConnect } from '@/components/WalletConnect';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useReadContract, useBalance } from 'wagmi';
import { parseEther, formatEther, formatUnits } from 'viem';
import { CONTRACTS, MARKETPLACE_ABI, ERC20_ABI } from '@/lib/contracts';
import { useProtocolStats } from '@/lib/useProtocolStats';
import { ProtocolStatsBar } from '@/components/ProtocolStatsBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ShieldAlert, Key, Zap, Lock, Unlock } from 'lucide-react';

function Tooltip({ children, text }: { children: React.ReactNode, text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 5 }} 
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#0A0A0A] border border-[#D4AF37]/40 p-3 text-[10px] font-mono text-[#E0E0E0] shadow-2xl z-50 text-center leading-relaxed"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#D4AF37]/40"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Marketplace() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const contractAddresses = CONTRACTS[chainId as keyof typeof CONTRACTS];
  const marketplaceAddress = contractAddresses?.MARKETPLACE as `0x${string}` | undefined;
  const usdcAddress = contractAddresses?.USDC as `0x${string}` | undefined;

  const isArbitrum = chainId === 42161;

  const { data: activeListings } = useReadContract({
    address: marketplaceAddress,
    abi: MARKETPLACE_ABI,
    functionName: 'getActiveListingsDetails',
    query: {
      enabled: !!marketplaceAddress && isArbitrum,
      refetchInterval: 10_000,
    }
  });

  const listingCount = (activeListings as any[])?.length ?? 0;

  const { totalPartitionsEver, totalListedUsdc, lowestPrice, highestPrice, avgPrice } = useProtocolStats();

  const fmtUsdc = (n: number | null) =>
    n === null ? '—' : `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#020202] relative text-[#E0E0E0] overflow-x-hidden selection:bg-[#D4AF37]/30">
      <div className="noise-bg"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#D4AF37]/5 blur-[120px] pointer-events-none"></div>

      {/* Nav */}
      <nav className="w-full p-4 px-8 flex justify-between items-center border-b border-[#2A2A2A] bg-[#020202]/80 backdrop-blur-md z-50 font-mono text-xs uppercase tracking-widest sticky top-0">
        <div className="flex gap-8 items-center">
          <Link href="/" className="text-[#D4AF37] hover:text-[#F3E5AB] flex items-center gap-3 transition-colors">
            <span className="w-2 h-2 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></span>
            Liquid_Terminal
          </Link>
          <span className="text-[#333333]">/</span>
          <span className="text-[#FDF5E6] flex items-center gap-2"><Lock size={12}/> OTC_Orderbook</span>
          <span className="text-[#333333]">/</span>
          <Link href="/dashboard" className="text-[#888888] hover:text-white transition-colors flex items-center gap-2"><Key size={12}/> Portfolio</Link>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 border border-[#2A2A2A] px-4 py-2 bg-[#050505]">
            {isArbitrum ? (
              <><span className="text-green-500 animate-pulse text-[8px] shadow-[0_0_8px_#22c55e]">●</span>
              <span className="text-[#888888] text-[9px]">Arbitrum One</span></>
            ) : (
              <><span className="text-red-500 animate-pulse text-[8px]">●</span>
              <span className="text-red-400 text-[9px]">Wrong Network</span></>
            )}
          </div>
          <WalletConnect />
        </div>
      </nav>

      {/* Wrong Network Banner */}
      {isConnected && !isArbitrum && (
        <div className="w-full bg-red-900/30 border-b border-red-500/40 px-8 py-3 text-xs font-mono text-red-400 flex items-center gap-3 z-40">
          <ShieldAlert size={14} />
          This protocol is deployed on <strong className="text-red-300">Arbitrum One</strong> only. Please switch networks in your wallet to continue.
        </div>
      )}

      <ProtocolStatsBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-8 flex flex-col gap-6 z-10 relative">

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end mb-4">
           <div>
             <h1 className="text-4xl font-serif text-white mb-2">Secondary OTC Market (USDC)</h1>
             <p className="text-sm text-[#888888] font-light max-w-2xl">
               Acquire absolute control over live Smart Contract Vaults using USDC stablecoins. Purchasing the NFT transfers full ownership of the vault and its underlying balance directly to your wallet.
             </p>
           </div>
        </motion.div>

        {/* Metrics Bar — 100% live on-chain */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-5 gap-3 mb-2">
          {[
            { label: 'Active Vaults', value: listingCount.toString(), sub: 'LISTINGS' },
            { label: 'Total USDC on Market', value: fmtUsdc(totalListedUsdc), sub: 'USDC' },
            { label: 'Lowest Ask', value: fmtUsdc(lowestPrice), sub: 'USDC' },
            { label: 'Highest Ask', value: fmtUsdc(highestPrice), sub: 'USDC' },
            { label: 'Avg Listing Price', value: fmtUsdc(avgPrice), sub: 'USDC' },
          ].map((m, idx) => (
            <div key={idx} className="border border-[#2A2A2A] bg-[#050505] p-4 flex flex-col justify-between h-24 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.02] transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#D4AF37]/50 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              <span className="text-[8px] text-[#555555] font-mono uppercase tracking-[0.2em]">{m.label}</span>
              <span className="text-xl font-serif text-[#FDF5E6]">
                {m.value}
                <span className="text-[9px] font-mono text-[#D4AF37] ml-1">{m.sub}</span>
              </span>
            </div>
          ))}
        </motion.div>

        {/* Orderbook Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1 border border-[#2A2A2A] bg-[#050505] overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-sm mt-4">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>

          {/* Table Header */}
          <div className="grid grid-cols-8 border-b border-[#2A2A2A] bg-[#0A0A0A] p-4 text-[9px] text-[#555555] font-mono uppercase tracking-[0.3em]">
            <div className="pl-4">NFT Key</div>
            <div>Vault Contract</div>
            <div>Seller Address</div>
            <Tooltip text="The exact amount of ETH currently locked inside this Smart Contract Vault.">
              <div className="flex items-center gap-1 cursor-help hover:text-[#D4AF37] transition-colors w-fit">Vault NAV <Info size={10}/></div>
            </Tooltip>
            <Tooltip text="The price the seller is asking for the NFT that controls this Vault. Priced in USDC.">
              <div className="flex items-center gap-1 cursor-help hover:text-[#D4AF37] transition-colors w-fit">Asking Price (USDC) <Info size={10}/></div>
            </Tooltip>
            <Tooltip text="Mathematical difference between Vault NAV and Asking Price. Green is guaranteed instant profit.">
              <div className="flex items-center gap-1 cursor-help hover:text-[#D4AF37] transition-colors w-fit">Arb/Discount <Info size={10}/></div>
            </Tooltip>
            <div>Status</div>
            <div className="text-right pr-4">Execution</div>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2A2A2A #050505' }}>
            {!activeListings || (activeListings as any[]).length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-[#555555] font-mono text-xs tracking-widest uppercase gap-4">
                <Lock size={32} className="opacity-20" />
                No active vaults listed on the market.
              </div>
            ) : (
              <AnimatePresence>
                {(activeListings as any[]).map((listing, i) => (
                  <ListingRow 
                    key={listing.tokenId.toString()} 
                    index={i}
                    listing={listing} 
                    address={address as `0x${string}`} 
                    isConnected={isConnected} 
                    marketplaceAddress={marketplaceAddress}
                    usdcAddress={usdcAddress}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ListingRow({ index, listing, address, isConnected, marketplaceAddress, usdcAddress }: any) {
  const { data: balanceData } = useBalance({ address: listing.wallet });
  
  // Get allowance
  const { data: allowance } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && marketplaceAddress ? [address, marketplaceAddress] : undefined,
    query: { refetchInterval: 3000 }
  });

  const { data: txHash, isPending, writeContract, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const tokenId = listing.tokenId;
  const walletAddr = listing.wallet;
  const sellerAddr = listing.seller;
  
  // USDC has 6 decimals
  const priceUsdc = formatUnits(listing.price, 6);
  const priceNumber = Number(priceUsdc);
  
  const balanceEth = balanceData ? formatEther(balanceData.value) : '0';
  const balanceNumber = Number(balanceEth);

  // Approximate ETH price for discount calculation (e.g., $3000)
  // In a real app we'd fetch live ETH price, but we assume 3000 here for MVP display
  const ethPriceUsd = 3000;
  const vaultNavUsd = balanceNumber * ethPriceUsd;

  let discount = 0;
  if (vaultNavUsd > 0) {
    discount = ((vaultNavUsd - priceNumber) / vaultNavUsd) * 100;
  }
  
  const hasAllowance = allowance !== undefined && (allowance as bigint) >= listing.price;

  const handleAction = () => {
    if (!hasAllowance) {
      writeContract({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [marketplaceAddress, listing.price],
      });
    } else {
      writeContract({
        address: marketplaceAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'buyWallet',
        args: [tokenId],
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: index * 0.05 }}
      className="grid grid-cols-8 items-center p-4 border-b border-[#111111] hover:bg-[#D4AF37]/[0.03] transition-all group"
    >
      <div className="font-mono text-xs text-[#D4AF37] pl-4 flex items-center gap-2">
        <Key size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
        #{tokenId.toString()}
      </div>

      <div className="font-mono text-xs text-[#555555] group-hover:text-[#FDF5E6] transition-colors flex flex-col">
        {walletAddr.slice(0, 8)}...{walletAddr.slice(-6)}
      </div>

      <div className="font-mono text-[10px] text-[#555555]">{sellerAddr.slice(0,6)}...{sellerAddr.slice(-4)}</div>

      <div className="font-serif text-xl text-white flex flex-col group-hover:text-[#D4AF37] transition-colors">
        <div>
          {Number(balanceEth).toFixed(4)} <span className="text-[9px] text-[#888888] font-mono tracking-widest">ETH</span>
        </div>
      </div>

      <div className="font-serif text-xl text-[#D4AF37]">
        ${Number(priceUsdc).toLocaleString()} <span className="text-[9px] text-[#D4AF37]/50 font-mono tracking-widest">USDC</span>
      </div>

      <div>
        {discount > 0 ? (
          <div className="flex items-center gap-1 text-[10px] font-mono text-green-400 bg-green-400/5 px-2 py-1 w-fit border border-green-400/20">
            <Zap size={10} /> -{discount.toFixed(1)}% OFF
          </div>
        ) : discount < 0 ? (
          <span className="text-[10px] font-mono text-red-400 bg-red-400/5 px-2 py-1 border border-red-400/20">
            +{Math.abs(discount).toFixed(1)}% PREMIUM
          </span>
        ) : (
           <span className="text-[10px] font-mono text-[#555555]">
            AT PAR
          </span>
        )}
      </div>

      <div>
        {balanceNumber === 0 ? (
           <Tooltip text="The seller drained this vault. It contains 0 assets. Do not buy.">
             <span className="text-[9px] font-mono text-red-500 border border-red-500/30 px-2 py-1 bg-red-500/10 cursor-help flex items-center gap-1 w-fit">
               <ShieldAlert size={10}/> EMPTY SHELL
             </span>
           </Tooltip>
        ) : (
           <span className="text-[9px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-1 bg-[#D4AF37]/10 flex items-center gap-1 w-fit">
             <Lock size={10}/> LIVE VAULT
           </span>
        )}
      </div>

      <div className="text-right pr-4 flex flex-col items-end gap-1">
        <button
          disabled={!isConnected || isPending || isConfirming || (isConnected && sellerAddr === address) || balanceNumber === 0} 
          onClick={handleAction}
          className="relative overflow-hidden border border-[#2A2A2A] text-[#888888] text-[9px] font-mono uppercase tracking-[0.2em] px-6 py-2 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed group/btn w-full max-w-[120px]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isPending || isConfirming ? (
               <><span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>...</>
            ) : !hasAllowance ? '1. Approve' : '2. Acquire'}
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
        </button>
        {isConfirmed && hasAllowance && (
          <span className="text-[8px] text-green-400 font-mono">Vault Acquired!</span>
        )}
        {writeError && (
          <span className="text-[8px] text-red-400 font-mono truncate max-w-[120px]">{(writeError as any).shortMessage}</span>
        )}
      </div>
    </motion.div>
  );
}
