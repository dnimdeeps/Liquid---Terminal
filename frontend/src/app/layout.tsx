import type { Metadata } from 'next';
import './globals.css';
import { Web3Provider } from '@/providers/Web3';

export const metadata: Metadata = {
  title: 'Liquid Terminal | Institutional OTC',
  description: 'Decentralized OTC marketplace for partitioned smart wallets.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
