/**
 * useProtocolStats — single hook that aggregates all live on-chain
 * protocol metrics from PartitionFactory and Marketplace.
 *
 * Returns values consumed by the global ProtocolStatsBar and each page.
 */
import { useReadContract, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACTS, FACTORY_ABI, MARKETPLACE_ABI } from './contracts';

const ARB_CHAIN_ID = 42161;

export function useProtocolStats() {
  const addresses = CONTRACTS[ARB_CHAIN_ID];

  // ── Factory ──────────────────────────────────────────────────────────────
  const { data: totalSupply } = useReadContract({
    address: addresses.FACTORY as `0x${string}`,
    abi: FACTORY_ABI,
    functionName: 'totalSupply',
    query: { refetchInterval: 15_000 },
  });

  // ── Marketplace ───────────────────────────────────────────────────────────
  const { data: activeListings } = useReadContract({
    address: addresses.MARKETPLACE as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'getActiveListingsDetails',
    query: { refetchInterval: 15_000 },
  });

  const listings = (activeListings as any[]) ?? [];

  // Total USDC value of all active listings (6 decimals)
  const totalListedUsdc = listings.reduce(
    (acc: number, l: any) => acc + Number(formatUnits(l.price, 6)),
    0
  );

  // Cheapest / most expensive listing
  const prices = listings.map((l: any) => Number(formatUnits(l.price, 6)));
  const lowestPrice  = prices.length ? Math.min(...prices) : null;
  const highestPrice = prices.length ? Math.max(...prices) : null;
  const avgPrice     = prices.length ? totalListedUsdc / prices.length : null;

  return {
    // Factory
    totalPartitionsEver: totalSupply !== undefined ? Number(totalSupply) : null,

    // Marketplace
    activeListingCount: listings.length,
    listings,
    totalListedUsdc,
    lowestPrice,
    highestPrice,
    avgPrice,
  };
}
