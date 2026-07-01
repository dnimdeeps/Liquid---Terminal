'use client';

import dynamic from 'next/dynamic';

export const WalletConnect = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => mod.ConnectButton),
  { ssr: false }
);
