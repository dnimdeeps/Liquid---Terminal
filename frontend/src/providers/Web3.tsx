'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { phantomWallet, injectedWallet, metaMaskWallet, coinbaseWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const projectId = 'c07834ce800f0fdcea34e46cfe3ef082';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, phantomWallet, injectedWallet, coinbaseWallet, walletConnectWallet],
    },
  ],
  { appName: 'Liquid Terminal', projectId }
);

// Arbitrum One only — single-chain protocol
const config = createConfig({
  connectors,
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
  },
  ssr: false,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 30s before considering it stale
        staleTime: 30_000,
        // Keep unused data in cache for 2 minutes
        gcTime: 120_000,
        // Retry failed queries once
        retry: 1,
      },
    },
  }));
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#D4AF37',
            accentColorForeground: '#000000',
            borderRadius: 'none',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          // Lock UI to Arbitrum One only
          initialChain={arbitrum}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
