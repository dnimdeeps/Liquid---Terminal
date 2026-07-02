'use client';
import { WalletConnect } from '@/components/WalletConnect';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACTS, FACTORY_ABI } from '@/lib/contracts';
import { useProtocolStats } from '@/lib/useProtocolStats';
import { ProtocolStatsBar } from '@/components/ProtocolStatsBar';

export default function Terminal() {
  const [totalEth, setTotalEth] = useState('10');
  const [partitions, setPartitions] = useState('5');
  const [txError, setTxError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const numPartitions = Math.min(Math.max(Number(partitions) || 1, 1), 60);
  const ethPerPartition = Number(totalEth) / numPartitions || 0;
  const totalWei = ethPerPartition * 1e18;

  const contractAddresses = CONTRACTS[chainId as keyof typeof CONTRACTS];
  const factoryAddress = contractAddresses?.FACTORY as `0x${string}` | undefined;
  const isArbitrum = chainId === 42161;

  const { totalPartitionsEver, activeListingCount } = useProtocolStats();

  // Write: deploy partition wallets
  const { data: txHash, isPending, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  const handleDeploy = () => {
    if (!isArbitrum) return setTxError('Please switch to Arbitrum One to use this protocol.');
    if (!factoryAddress) return setTxError('Contract not yet deployed — awaiting mainnet deployment.');
    if (!totalEth || !partitions) return;
    setTxError(null);
    writeContract({
      address: factoryAddress,
      abi: FACTORY_ABI,
      functionName: 'createPartitions',
      args: [BigInt(numPartitions)],
      value: parseEther(totalEth),
    });
  };

  const isLoading = isPending || isConfirming;

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] relative overflow-hidden text-[#E0E0E0] tech-grid">
      <div className="noise-bg"></div>

      <nav className="w-full p-6 flex justify-between items-center border-b border-[#D4AF37]/20 bg-[#050505]/90 z-50">
        <Link href="/" className="text-xl font-serif tracking-[0.3em] uppercase text-[#D4AF37] hover:text-[#F3E5AB] transition-colors flex items-center gap-4">
          <div className="w-4 h-4 border border-[#D4AF37] rotate-45"></div>
          Liquid Terminal
        </Link>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2 text-[9px] font-mono">
            {isArbitrum ? (
              <><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span><span className="text-green-400 uppercase tracking-widest">Arbitrum One</span></>
            ) : (
              <><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span><span className="text-red-400 uppercase tracking-widest">Wrong Network</span></>
            )}
          </div>
          <Link href="/dashboard" className="text-xs font-mono uppercase tracking-[0.2em] text-[#888888] hover:text-white transition-colors">Portfolio</Link>
          <WalletConnect />
        </div>
      </nav>

      <ProtocolStatsBar />

      {/* Wrong network banner */}
      {isConnected && !isArbitrum && (
        <div className="w-full bg-red-900/30 border-b border-red-500/40 px-8 py-3 text-xs font-mono text-red-400 flex items-center gap-2">
          ⚠ This protocol is deployed on <strong className="text-red-300">Arbitrum One</strong> only. Please switch your wallet network.
        </div>
      )}

      <main className="flex-1 w-full max-w-[1500px] mx-auto p-8 mt-4 z-10 flex flex-col lg:flex-row gap-16">

        {/* Left Column: Control Panel */}
        <div className="flex-1 max-w-md">
          <div className="mb-10">
            <h1 className="text-5xl font-serif font-light mb-4 text-white">Partition Matrix</h1>
            <p className="text-[#888888] font-light text-xs uppercase tracking-[0.3em]">Configure Smart Wallet Fragmentation</p>
          </div>

          <div className="glass-panel-heavy p-8 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-transparent"></div>

            <div className="space-y-10">
              <div>
                <label className="flex justify-between text-[10px] text-[#888888] uppercase tracking-[0.2em] mb-3">
                  <span>Source Capital (ETH)</span>
                  {isConnected && <span className="text-[#D4AF37]">Wallet Connected</span>}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={totalEth}
                    onChange={(e) => setTotalEth(e.target.value)}
                    className="w-full bg-transparent border-b border-[#2A2A2A] text-white text-4xl p-3 pl-0 font-serif focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/50 font-serif text-2xl">Ξ</span>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-[10px] text-[#888888] uppercase tracking-[0.2em] mb-3">
                  <span>Target Partitions</span>
                  <span className="text-[#D4AF37]">Max: 60</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={partitions}
                    onChange={(e) => setPartitions(e.target.value)}
                    className="w-full bg-transparent border-b border-[#2A2A2A] text-white text-4xl p-3 pl-0 font-serif focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] font-mono text-xs uppercase tracking-widest">Wallets</span>
                </div>
              </div>

              <div className="pt-8 border-t border-[#D4AF37]/10 space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#888888]">Size per Vault</span>
                  <span className="font-serif text-4xl text-[#D4AF37]">{ethPerPartition.toFixed(4)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-2">
                    <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.15em]">Total Partitions Protocol</div>
                    <div className="text-sm font-serif text-white mt-1">{totalPartitionsEver ?? '—'}</div>
                  </div>
                  <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-2">
                    <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.15em]">Active OTC Listings</div>
                    <div className="text-sm font-serif text-white mt-1">{activeListingCount}</div>
                  </div>
                  <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-2">
                    <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.15em]">Est. Gas (Arbitrum)</div>
                    <div className="text-sm font-serif text-green-400 mt-1">~$0.01 USD</div>
                  </div>
                  <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-2">
                    <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.15em]">This Deploy Total ETH</div>
                    <div className="text-sm font-serif text-white mt-1">{Number(totalEth) || 0} ETH</div>
                  </div>
                </div>
              </div>

              {(txError || writeError) && (
                <div className="border border-red-500/30 bg-red-500/5 p-4 text-xs font-mono text-red-400 leading-relaxed">
                  ⚠ {txError || (writeError as { shortMessage?: string })?.shortMessage || writeError?.message}
                </div>
              )}

              {isConfirmed && txHash && (
                <div className="border border-green-500/30 bg-green-500/5 p-4 text-xs font-mono text-green-400 leading-relaxed">
                  ✓ Deployed! TX: {txHash.slice(0, 20)}...
                </div>
              )}

              <button
                onClick={handleDeploy}
                disabled={!isConnected || isLoading}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-[#D4AF37] to-[#8A7322] text-[#050505] py-6 text-xs uppercase tracking-[0.4em] font-bold transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] border border-[#FDF5E6] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {!isConnected ? 'Connect Wallet First' : isLoading ? 'Deploying...' : 'Deploy & Partition'}
                </span>
                {!isLoading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>}
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
             <Link href="/dashboard" className="text-xs font-mono uppercase tracking-[0.2em] border border-[#2A2A2A] text-[#888888] hover:text-[#D4AF37] hover:border-[#D4AF37] px-6 py-4 w-full text-center transition-all bg-[#050505]/50">
               Access Portfolio Dashboard →
             </Link>
          </div>
        </div>

        {/* Right Column: Graphic Representation */}
        <div className="flex-[2] relative min-h-[700px] glass-panel flex flex-col items-center justify-center overflow-hidden border-[#D4AF37]/20">

          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-[800px] h-[800px] border border-[#D4AF37] rounded-full"></div>
            <div className="absolute w-[600px] h-[600px] border border-[#D4AF37] rounded-full border-dashed animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute w-[400px] h-[400px] border border-[#D4AF37] rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center w-full h-full justify-center mt-12">

            {/* Source Wallet Node */}
            <div className="relative flex items-center justify-center mb-24">
              <div className="absolute w-40 h-40 bg-[#D4AF37]/10 rounded-full animate-ping"></div>
              <div className="w-32 h-32 rounded-full border border-[#D4AF37] bg-[#050505] z-10 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                <span className="font-serif text-3xl text-[#FDF5E6]">{totalEth || '0'}</span>
                <span className="text-[9px] font-mono text-[#D4AF37] mt-1">ETH</span>
              </div>
              <div className="absolute -bottom-10 text-[10px] font-mono text-[#888888] tracking-[0.3em] uppercase bg-[#050505] px-4 py-1 border border-[#2A2A2A]">Source Node</div>
              <div className="absolute top-32 w-px h-24 bg-gradient-to-b from-[#D4AF37] to-transparent z-0"></div>
            </div>

            {/* Partition Nodes */}
            <div className="relative w-full max-w-3xl mt-4">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
              <div className="flex flex-wrap justify-center gap-6 px-4 max-h-[350px] overflow-y-auto pb-10" style={{ scrollbarWidth: 'none' }}>
                {Array.from({ length: numPartitions }).map((_, i) => (
                  <div key={i} className="relative flex flex-col items-center group">
                    <div className="absolute -top-24 w-px h-24 bg-gradient-to-b from-[#D4AF37]/40 to-transparent opacity-20 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="w-16 h-16 rounded-full border border-[#2A2A2A] bg-[#0A0A0A] flex flex-col items-center justify-center group-hover:border-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 transform group-hover:scale-110 cursor-crosshair relative z-10">
                      <span className="text-[11px] font-serif text-[#FDF5E6]">{ethPerPartition.toFixed(2)}</span>
                      <span className="text-[7px] font-mono text-[#D4AF37]/50">ETH</span>
                    </div>
                    {isConfirmed && (
                      <span className="mt-1 text-[7px] font-mono text-green-400 opacity-70">✓ Live</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute top-6 left-8 text-[10px] font-mono text-[#888888] tracking-[0.3em] uppercase">
            Fragmentation Engine // V1.0.0
          </div>
          <div className="absolute top-6 right-8 flex gap-3 items-center border border-[#D4AF37]/30 px-3 py-1 bg-[#0A0A0A]">
            <span className={`w-1.5 h-1.5 ${isLoading ? 'bg-yellow-400' : isConfirmed ? 'bg-green-400' : 'bg-[#D4AF37]'} rounded-full animate-pulse`}></span>
            <span className="text-[9px] font-mono text-[#D4AF37] tracking-widest">
              {isLoading ? 'DEPLOYING...' : isConfirmed ? 'CONFIRMED' : 'LIVE SYNC'}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
