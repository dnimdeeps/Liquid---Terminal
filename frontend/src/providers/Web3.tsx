'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, arbitrum, base, localhost, foundry } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const config = getDefaultConfig({
  appName: 'Liquid Terminal',
  projectId: 'a52f4007baf95edec15eb89ed7fa5fc7', // Public placeholder ID
  chains: [mainnet, arbitrum, base, localhost, foundry],
  ssr: false,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#D4AF37', // Luxury Gold
            accentColorForeground: '#000000',
            borderRadius: 'none',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
