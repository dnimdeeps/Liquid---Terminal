# Liquid Terminal (MVP)

## Executive Summary
Liquid Terminal is a decentralized Over-The-Counter (OTC) marketplace designed to bridge institutional liquidity with retail buyers. It allows users with large asset holdings to partition their capital into smaller, fixed-balance smart wallets. These wallets can then be listed on a secondary marketplace and purchased at a discount, offering seamless liquidity distribution without moving public market prices.

## Core Problem & Solution
**The Problem:** Large asset holders (whales) struggle to liquidate positions without causing high slippage or price impact on public Decentralized Exchanges (DEXs). Meanwhile, retail users constantly seek opportunities to acquire crypto assets at a premium or discount.

**The Solution:** An OTC platform where large positions are split into manageable "Partitioned Wallets". Retail users can purchase ownership of these wallets directly. This shifts the paradigm from trading tokens to trading the wallets that hold the tokens.

## Simplified Architecture (MVP)
To make the project practical and achievable, we have temporarily removed the complex cross-chain (LayerZero) and zero-knowledge privacy (Railgun/Aztec) layers. The MVP focuses strictly on a robust and functional OTC mechanism deployed on a single low-cost L2 network (e.g., Arbitrum or Base).

### 1. Smart Contracts (Solidity)
- **PartitionFactory:** A contract that receives a bulk deposit (e.g., 100 ETH) and deploys `N` Smart Wallets (e.g., 10 wallets of 10 ETH each).
- **PartitionWallet (ERC-4337 based):** Individual smart contracts holding the partitioned funds. The core functionality is that *ownership of the contract can be transferred*.
- **Marketplace:** An on-chain order book where Partitioned Wallets can be listed by the owner and purchased by buyers for a specific asking price.

### 2. Frontend Terminal (Next.js)
A unified, responsive web interface serving both sides of the market:
- **Seller Terminal:** A dashboard for liquidity providers to deposit bulk assets, configure the number of partitions, set a target discount, and publish them to the marketplace.
- **Buyer Storefront:** A clean interface where retail users can browse available partitioned wallets, compare discount rates against live oracle prices, and purchase them directly.

## Development Roadmap

### Phase 1: Smart Contract Foundation
- Develop the `PartitionFactory` for bulk deposits and efficient wallet generation.
- Implement the lightweight `PartitionWallet` contract supporting secure ownership transfer.
- Build the `Marketplace` contract for listing, buying, and executing trades atomically.
- Write tests using Foundry and deploy to an L2 Testnet.

### Phase 2: Frontend Terminal
- Set up a Next.js 14 project with TailwindCSS and `wagmi` / `viem` for Web3 integration.
- Build the **Seller Dashboard** UI to interact with the `PartitionFactory`.
- Build the **Marketplace UI** to fetch active listings and facilitate purchases.

### Phase 3: Integration & Polish
- End-to-end (E2E) testing on testnet.
- Refine the user experience to ensure smooth wallet creation and purchasing flows.
- Prepare for a simplified mainnet launch.
