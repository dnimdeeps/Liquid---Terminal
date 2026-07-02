# Liquid Terminal: Token-Bound OTC Protocol

## Executive Summary
Liquid Terminal is a decentralized Over-The-Counter (OTC) marketplace designed to bridge institutional liquidity with retail buyers. It allows users with large asset holdings to partition their capital into smaller, fixed-balance smart contract vaults. 

Instead of trading raw tokens and suffering massive slippage on Decentralized Exchanges (DEXs), **Liquid Terminal shifts the paradigm from trading tokens to trading the cryptographic Vaults that hold the tokens.**

---

## The Architecture: ERC-6551 (Token-Bound Accounts)
Liquid Terminal operates on a cutting-edge implementation of Token-Bound Accounts (similar to the ERC-6551 standard).

### The Vault and The Key (How it works)
To understand Liquid Terminal, you must understand the difference between traditional wallets and Smart Contract Wallets.

1. **The Vault (PartitionWallet):** When a user fragments 10 ETH into 5 partitions, the protocol deploys 5 distinct Smart Contract Wallets. These are essentially robotic vaults living on the blockchain. The vaults hold the actual ETH.
2. **The Key (ERC-721 NFT):** At the exact same time, the protocol mints 5 NFTs into the creator's MetaMask. These NFTs do NOT hold any crypto. They act as the cryptographic "Key" to the Vault.
3. **The Lock (`onlyOwner`):** The Vault is programmed with a single rule: *"I will only obey the Ethereum address that currently holds my corresponding NFT."* 

### Selling a Partition OTC
If you list your Partition NFT on the Liquid Terminal Marketplace and sell it to a buyer:
1. The NFT moves from your MetaMask to the Buyer's MetaMask.
2. The ETH **never moves**. It remains safely inside the Smart Contract Vault.
3. However, because the Buyer now holds the NFT (The Key), the Vault instantly recognizes the Buyer as its new master. You are locked out, and the Buyer gains full execution rights.

**You have just securely traded an entire wallet OTC without ever moving the underlying assets over the network.**

---

## Core Concepts & Mechanisms

### 1. USDC Marketplace Settlement
The Liquid Terminal Marketplace settles all OTC trades in **USDC Stablecoins**. Sellers list their ETH Vaults for a fixed USDC asking price. Buyers must approve and spend native Arbitrum USDC (`0xaf88...`) to acquire the Vaults. This provides a clean mechanism to calculate arbitrage or discount opportunities.

### 2. Live Chainlink Oracles & Arbitrage
The Liquid Terminal UI connects directly to live **Chainlink Data Feeds** to calculate the real-time USD Net Asset Value (NAV) of every Vault. When browsing the orderbook, buyers can instantly see if a Vault is listed at a discount (Guaranteed Arbitrage) or at a premium to its underlying assets.

### 3. The "Empty Shell" Mechanic & Permanent Reusability
The value of a Liquid Partition NFT is 100% pegged to the live balance inside the Vault.
If you withdraw the assets from your Vault, it drops to 0 ETH.
* **Buyer Protection:** The UI reads the live on-chain balance of the vault. If a seller drains their vault, it is flagged as an `EMPTY SHELL` and buying is disabled to protect users.
* **Reusability vs Cleanup:** Even when empty, the Vault remains a fully functional Smart Contract Wallet. You can deposit new assets into it anytime. If you don't want the clutter, you can use the **Discard Empty Vault** feature in the Portfolio UI to permanently burn the NFT to the `0x00...dEaD` address.

---

## Technical Stack
- **Smart Contracts:** Foundry, Solidity ^0.8.20, OpenZeppelin (ERC721, ReentrancyGuard).
- **Frontend:** Next.js 14, TailwindCSS, Wagmi v3, Viem.
- **Network:** Arbitrum One (L2) / Chain ID: `42161`

## Contract Overview
1. **`PartitionFactory.sol`**: An `ERC721Enumerable` NFT contract. Receives bulk ETH, deploys `PartitionWallet` contracts, and mints the NFT Keys to the user.
2. **`PartitionWallet.sol`**: A Smart Contract Wallet that delegates its `onlyOwner` access control directly to `PartitionFactory.ownerOf(tokenId)`. Contains `withdrawETH`, `withdrawERC20`, and a generic `executeCall` for DeFi interactions.
3. **`Marketplace.sol`**: An on-chain orderbook that allows users to list their Partition NFTs for a fixed **USDC** price. Facilitates atomic swaps between buyer USDC and seller NFTs.

---

## Roadmap & Upcoming Features

### Multi-Asset Vault Initialization
Currently, Liquid Terminal supports partitioning native Ethereum (ETH) upon creation. In the next major update, we will introduce `createPartitionsERC20`, allowing institutional whales to fragment and OTC trade massive blocks of stablecoins and Arbitrum-native tokens without crashing DEX liquidity pools.

---

## Open Source & Fee Structure
Liquid Terminal is proudly **100% Open Source and Free to use**. 
There are zero platform fees, zero withdrawal fees, and zero hidden royalties. The only costs incurred are the native Arbitrum One network gas fees (which are typically fractions of a cent per transaction).

---

## Legal & Security Disclaimer
* **No Custody:** Liquid Terminal is entirely non-custodial. The protocol administrators have no access to the underlying funds locked inside the Partition Vaults.
* **Smart Contract Risk:** This is experimental software. While the contracts utilize battle-tested standards like OpenZeppelin's `ReentrancyGuard` and `ERC721`, they have not yet undergone a formal security audit. Use at your own risk.
* **User Responsibility:** The `executeCall` function inside the Partition Vault allows the vault to interact with any arbitrary smart contract. It is the sole responsibility of the NFT owner to ensure they do not interact with malicious contracts that could drain the vault.
