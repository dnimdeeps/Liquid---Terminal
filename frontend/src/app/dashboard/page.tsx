'use client';
import { WalletConnect } from '@/components/WalletConnect';
import { ProtocolStatsBar } from '@/components/ProtocolStatsBar';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useReadContract, useReadContracts, useBalance } from 'wagmi';
import { parseEther, formatEther, parseUnits } from 'viem';
import { CONTRACTS, MARKETPLACE_ABI, FACTORY_ABI, WALLET_ABI } from '@/lib/contracts';
import { useProtocolStats } from '@/lib/useProtocolStats';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Lock, ArrowUpRight, ShieldAlert, Zap, Wallet, Tag, BarChart3, TrendingUp, ExternalLink } from 'lucide-react';

const CHAINLINK_ETH_USD_ABI = [
  { inputs: [], name: 'latestRoundData', outputs: [{ internalType: 'uint80', name: 'roundId', type: 'uint80' }, { internalType: 'int256', name: 'answer', type: 'int256' }, { internalType: 'uint256', name: 'startedAt', type: 'uint256' }, { internalType: 'uint256', name: 'updatedAt', type: 'uint256' }, { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }], stateMutability: 'view', type: 'function' }
] as const;

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddresses = CONTRACTS[chainId as keyof typeof CONTRACTS];
  const factoryAddress = contractAddresses?.FACTORY as `0x${string}` | undefined;
  const marketplaceAddress = contractAddresses?.MARKETPLACE as `0x${string}` | undefined;
  const isArbitrum = chainId === 42161;

  const [txError, setTxError] = useState<string | null>(null);

  // Protocol-wide stats
  const { totalPartitionsEver, activeListingCount } = useProtocolStats();

  // 1. Get user's NFT balance
  const { data: nftBalance } = useReadContract({
    address: factoryAddress,
    abi: FACTORY_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!factoryAddress && isArbitrum }
  });

  // 2. Build calls to fetch Token IDs
  const tokenCalls = [];
  if (nftBalance) {
    for (let i = 0; i < Number(nftBalance); i++) {
      tokenCalls.push({
        address: factoryAddress,
        abi: FACTORY_ABI,
        functionName: 'tokenOfOwnerByIndex',
        args: [address, BigInt(i)]
      });
    }
  }

  const { data: userTokens } = useReadContracts({
    contracts: tokenCalls as any,
    query: { enabled: tokenCalls.length > 0 }
  });

  // 3. For each token ID, get the Vault address
  const walletCalls = userTokens?.filter(t => t.result !== undefined).map(t => ({
    address: factoryAddress,
    abi: FACTORY_ABI,
    functionName: 'getWalletAddress',
    args: [t.result]
  })) || [];

  const { data: userWallets } = useReadContracts({
    contracts: walletCalls as any,
    query: { enabled: walletCalls.length > 0 }
  });

  const myPartitions = userTokens?.map((t, i) => ({
    tokenId: t.result as bigint,
    walletAddr: userWallets?.[i]?.result as `0x${string}` | undefined
  })).filter(p => p.walletAddr !== undefined) || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#020202] relative text-[#E0E0E0] overflow-x-hidden selection:bg-[#D4AF37]/30">
      <div className="noise-bg"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] pointer-events-none"></div>

      <nav className="w-full p-4 px-8 flex justify-between items-center border-b border-[#2A2A2A] bg-[#020202]/80 backdrop-blur-md z-50 font-mono text-xs uppercase tracking-widest sticky top-0">
        <div className="flex gap-8 items-center">
          <Link href="/" className="text-[#D4AF37] hover:text-[#F3E5AB] flex items-center gap-3 transition-colors">
            <span className="w-2 h-2 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></span> Liquid_Terminal
          </Link>
          <span className="text-[#333333]">/</span>
          <Link href="/marketplace" className="text-[#888888] hover:text-white transition-colors flex items-center gap-2"><Lock size={12}/> OTC_Orderbook</Link>
          <span className="text-[#333333]">/</span>
          <span className="text-[#FDF5E6] flex items-center gap-2"><Key size={12}/> Portfolio_Dashboard</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 border border-[#2A2A2A] px-4 py-2 bg-[#050505]">
            {isArbitrum ? (
              <><span className="text-green-500 animate-pulse text-[8px]">●</span><span className="text-[#888888] text-[9px]">Arbitrum One</span></>
            ) : (
              <><span className="text-red-500 animate-pulse text-[8px]">●</span><span className="text-red-400 text-[9px]">Wrong Network</span></>
            )}
          </div>
          <WalletConnect />
        </div>
      </nav>

      <ProtocolStatsBar />

      <main className="flex-1 p-8 z-10 relative max-w-6xl mx-auto w-full">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b border-[#2A2A2A] pb-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-serif text-white mb-2">My Portfolio</h1>
              <p className="text-sm text-[#888888] font-light">Manage your Token-Bound Vaults. Withdraw assets or list them on the OTC market.</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em] mb-1">Vaults Owned</div>
              <div className="text-3xl font-serif text-[#FDF5E6]">{myPartitions.length}</div>
            </div>
          </div>

          {/* Account-level stats */}
          {isConnected && (
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="border border-[#2A2A2A] bg-[#050505] p-4">
                <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.2em] mb-1">Your Connected Address</div>
                <div className="text-xs font-mono text-[#D4AF37] break-all">{address}</div>
              </div>
              <div className="border border-[#2A2A2A] bg-[#050505] p-4">
                <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.2em] mb-1">Your NFT Keys Held</div>
                <div className="text-xl font-serif text-[#FDF5E6]">{myPartitions.length} <span className="text-[10px] font-mono text-[#D4AF37]">of {totalPartitionsEver ?? '—'} total</span></div>
              </div>
              <div className="border border-[#2A2A2A] bg-[#050505] p-4">
                <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.2em] mb-1">Protocol OTC Listings (Global)</div>
                <div className="text-xl font-serif text-[#FDF5E6]">{activeListingCount} <span className="text-[10px] font-mono text-[#D4AF37]">ACTIVE</span></div>
              </div>
            </div>
          )}
        </motion.div>

        {txError && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="border border-red-500/30 bg-red-500/5 p-4 text-xs font-mono text-red-400 mb-6 flex items-center gap-3">
            <ShieldAlert size={16} /> {txError}
          </motion.div>
        )}

        {!isConnected ? (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16 border border-[#2A2A2A] bg-[#050505] text-center font-mono text-xs text-[#555555] flex flex-col items-center gap-4">
             <Wallet size={32} className="opacity-20" />
             Connect your wallet to view your owned Partition NFTs.
           </motion.div>
        ) : !isArbitrum ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16 border border-red-500/20 bg-red-500/5 text-center font-mono text-xs text-red-400 flex flex-col items-center gap-4">
            <ShieldAlert size={32} className="opacity-40" />
            Please switch to Arbitrum One to view your portfolio.
          </motion.div>
        ) : myPartitions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16 border border-[#2A2A2A] bg-[#050505] text-center font-mono text-xs text-[#555555] flex flex-col items-center gap-4">
             <Key size={32} className="opacity-20" />
             No Partition NFTs found. Use the Terminal to create your first vault.
             <Link href="/terminal" className="border border-[#D4AF37]/40 text-[#D4AF37] px-6 py-2 text-[10px] hover:bg-[#D4AF37]/10 transition-colors">
               Open Terminal →
             </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {myPartitions.map((p, i) => (
                <PartitionCard 
                  key={p.tokenId.toString()} 
                  index={i}
                  partition={p} 
                  factoryAddress={factoryAddress!} 
                  marketplaceAddress={marketplaceAddress!}
                  address={address!}
                  setGlobalError={setTxError}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}


function PartitionCard({ index, partition, factoryAddress, marketplaceAddress, address, setGlobalError }: any) {
  const [listPrice, setListPrice] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  const { data: txHash, isPending, writeContract, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  // Live vault ETH balance
  const { data: balanceData, dataUpdatedAt } = useBalance({
    address: partition.walletAddr,
    query: { refetchInterval: 10_000 }
  });
  
  const balanceEth = balanceData ? formatEther(balanceData.value) : '0';
  const balanceNum = Number(balanceEth);
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—';

  // Fetch ETH/USD price from Chainlink
  const { data: priceData } = useReadContract({
    address: '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612',
    abi: CHAINLINK_ETH_USD_ABI,
    functionName: 'latestRoundData',
    query: { refetchInterval: 30000 },
  });
  const ethPriceUsd = priceData ? Number(priceData[1]) / 1e8 : 0;
  const vaultUsdcValue = balanceNum * ethPriceUsd;

  const handleWithdrawAmountChange = (val: string) => {
    if (Number(val) < 0) return;
    setWithdrawAmount(val);
  };

  const handleListPriceChange = (val: string) => {
    if (Number(val) < 0) return;
    setListPrice(val);
  };

  const setWithdrawPercent = (percent: number) => {
    if (balanceNum > 0) {
      setWithdrawAmount((balanceNum * percent).toFixed(6).replace(/\.?0+$/, ''));
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    setGlobalError(null);
    writeContract({
        address: partition.walletAddr as `0x${string}`,
        abi: WALLET_ABI,
        functionName: 'withdrawETH',
        args: [address as `0x${string}`, parseEther(withdrawAmount)],
    });
  };

  const handleApprove = () => {
    setGlobalError(null);
    writeContract({
      address: factoryAddress,
      abi: FACTORY_ABI,
      functionName: 'approve',
      args: [marketplaceAddress, partition.tokenId],
    });
  };

  const handleList = () => {
    if (!listPrice) return;
    setGlobalError(null);
    writeContract({
        address: marketplaceAddress,
        abi: MARKETPLACE_ABI,
        functionName: 'listWallet',
        args: [partition.tokenId, parseUnits(listPrice, 6)],
    });
  };

  const handleDiscard = () => {
    setGlobalError(null);
    writeContract({
        address: factoryAddress,
        abi: [{
            name: 'transferFrom',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'tokenId', type: 'uint256' }]
        }],
        functionName: 'transferFrom',
        args: [address, '0x000000000000000000000000000000000000dEaD', partition.tokenId],
    });
  };

  const arbscanVault = `https://arbiscan.io/address/${partition.walletAddr}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.08 }}
      className="border border-[#2A2A2A] bg-[#050505] flex flex-col group hover:border-[#D4AF37]/40 transition-all relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#111111] bg-[#080808]">
        <div className="flex items-center gap-3">
          <Key size={12} className="text-[#D4AF37]" />
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">NFT Key #{partition.tokenId?.toString()}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[8px] font-mono text-[#555555]">Updated {lastUpdated}</span>
          <a
            href={arbscanVault}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[8px] font-mono text-[#555555] hover:text-[#D4AF37] transition-colors"
          >
            <ExternalLink size={10} /> View on Arbiscan
          </a>
          <span className={`text-[9px] font-mono border px-2 py-0.5 flex items-center gap-1 ${balanceNum > 0 ? 'text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/5' : 'text-red-500 border-red-500/30 bg-red-500/5'}`}>
            <Lock size={8}/> {balanceNum > 0 ? 'FUNDED' : 'EMPTY'}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col lg:flex-row gap-8">

        {/* Left: Vault Info + Metrics */}
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.2em] mb-1">Smart Contract Vault Address</div>
            <div className="text-sm font-mono text-white tracking-wider break-all">{partition.walletAddr}</div>
          </div>

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-3">
              <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.15em] mb-1">Live Vault NAV</div>
              <div className="text-xl font-serif text-white">{balanceNum.toFixed(4)} <span className="text-[9px] font-mono text-[#D4AF37]">ETH</span></div>
              {ethPriceUsd > 0 && <div className="text-[9px] font-mono text-green-400 mt-1">≈ ${vaultUsdcValue.toFixed(2)} USDC</div>}
            </div>
            <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-3">
              <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.15em] mb-1">Raw Balance (Wei)</div>
              <div className="text-xs font-mono text-[#888888] break-all mt-1">{balanceData?.value?.toString() ?? '0'}</div>
            </div>
            <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-3">
              <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.15em] mb-1">Token ID (On-Chain)</div>
              <div className="text-xl font-serif text-[#D4AF37]">#{partition.tokenId?.toString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-3">
              <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.15em] mb-1">Owner of Record</div>
              <div className="text-[10px] font-mono text-[#888888] break-all">{address}</div>
            </div>
            <div className="border border-[#1A1A1A] bg-[#0A0A0A] p-3">
              <div className="text-[8px] font-mono text-[#555555] uppercase tracking-[0.15em] mb-1">Standard</div>
              <div className="text-sm font-mono text-white">ERC-721 <span className="text-[#555555]">/ TBA</span></div>
              <div className="text-[8px] font-mono text-[#555555] mt-1">Arbitrum One · Chain 42161</div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col gap-4 min-w-[300px] w-full lg:w-[450px] border-t lg:border-t-0 lg:border-l border-[#1A1A1A] pt-6 lg:pt-0 lg:pl-8">

          {/* Withdraw */}
          <div className="mb-6">
            <label className="block text-[9px] font-mono text-[#888888] uppercase tracking-[0.2em] mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1"><ArrowUpRight size={10}/> Extract Liquidity</span>
              <span className="text-[#D4AF37]">Max: {balanceNum.toFixed(4)} ETH</span>
            </label>
            <p className="text-[8px] text-[#555555] font-mono mb-2">Withdraw underlying ETH from this Smart Wallet directly to your personal address.</p>
            
            <div className="flex gap-2 mb-2">
              {[0.25, 0.50, 0.75, 1].map((pct) => (
                <button 
                  key={pct}
                  onClick={() => setWithdrawPercent(pct)}
                  className="flex-1 border border-[#2A2A2A] bg-[#0A0A0A] text-[8px] font-mono text-[#888888] py-1 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  {pct === 1 ? 'MAX' : `${pct * 100}%`}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  min="0"
                  placeholder="0.00" 
                  value={withdrawAmount}
                  onChange={(e) => handleWithdrawAmountChange(e.target.value)}
                  className="w-full bg-transparent border border-[#2A2A2A] px-3 py-2 text-sm font-mono focus:border-[#D4AF37] outline-none text-white transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#555555]">ETH</span>
              </div>
              <button 
                onClick={handleWithdraw}
                disabled={isPending || isConfirming || balanceNum === 0}
                className="border border-[#2A2A2A] px-4 py-2 text-[10px] font-mono uppercase hover:bg-white hover:text-black transition-colors disabled:opacity-30"
              >
                Withdraw
              </button>
            </div>
            {balanceNum > 0 && withdrawAmount && Number(withdrawAmount) > balanceNum && (
              <p className="text-[9px] text-red-400 font-mono mt-1">⚠ Amount exceeds vault balance ({balanceNum.toFixed(4)} ETH)</p>
            )}
          </div>

          <div className="w-full h-px bg-[#1A1A1A]"></div>

          {/* List */}
          <div>
            <label className="block text-[9px] font-mono text-[#888888] uppercase tracking-[0.2em] mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1"><Tag size={10}/> OTC Market Listing</span>
              {ethPriceUsd > 0 && <span className="text-[#D4AF37]">Vault Value: ≈${vaultUsdcValue.toFixed(2)}</span>}
            </label>
            <p className="text-[8px] text-[#555555] font-mono mb-2 leading-relaxed">List this entire NFT Vault for sale on the decentralized OTC marketplace. Buyers will pay you the exact USDC asking price below to take full ownership of the vault and its ETH contents.</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  min="0"
                  placeholder="Asking Price" 
                  value={listPrice}
                  onChange={(e) => handleListPriceChange(e.target.value)}
                  className="w-full h-[54px] bg-transparent border border-[#2A2A2A] px-3 py-2 text-sm font-mono focus:border-[#D4AF37] outline-none text-white transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#555555]">USDC</span>
                {ethPriceUsd > 0 && listPrice && (
                  <div className="absolute left-3 -bottom-5 text-[8px] font-mono text-green-400/70">
                    ≈ {(Number(listPrice) / ethPriceUsd).toFixed(4)} ETH equivalent
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={handleApprove}
                  disabled={isPending || isConfirming}
                  className="border border-[#2A2A2A] px-3 py-1.5 text-[9px] font-mono uppercase hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 text-[#888888] hover:text-[#D4AF37] transition-colors"
                >
                  1. Approve
                </button>
                <button 
                  onClick={handleList}
                  disabled={isPending || isConfirming}
                  className="bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] px-3 py-1.5 text-[9px] font-mono uppercase hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                  2. List Vault
                </button>
              </div>
            </div>
          </div>

          {/* TX feedback */}
          {(isPending || isConfirming) && (
            <div className="text-[9px] text-yellow-400 font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
              {isPending ? 'Awaiting wallet signature...' : 'Confirming on Arbitrum...'}
            </div>
          )}
          {(writeError as any)?.shortMessage && (
            <div className="text-[9px] text-red-400 font-mono flex items-center gap-1"><ShieldAlert size={10}/> {(writeError as any).shortMessage}</div>
          )}
          {isConfirmed && (
            <div className="text-[9px] text-green-400 font-mono flex items-center gap-1">
              <Zap size={10}/> Confirmed · TX: {txHash?.slice(0, 18)}...
              <a href={`https://arbiscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-300 ml-1"><ExternalLink size={9}/></a>
            </div>
          )}

          {balanceNum === 0 && (
            <div className="mt-2 pt-4 border-t border-red-500/10">
              <label className="block text-[9px] font-mono text-red-500/70 uppercase tracking-[0.2em] mb-1">Cleanup / Burn</label>
              <p className="text-[8px] text-[#555555] font-mono mb-2">This is a permanent, reusable Smart Wallet! You can deposit ETH into it anytime. However, if you want to remove this empty shell from your portfolio permanently, you can discard it.</p>
              <button 
                onClick={handleDiscard}
                disabled={isPending || isConfirming}
                className="w-full border border-red-500/30 text-red-500/70 px-3 py-2 text-[9px] font-mono uppercase hover:bg-red-500/10 hover:border-red-500 hover:text-red-400 transition-colors"
              >
                Permanently Discard Empty Vault
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
