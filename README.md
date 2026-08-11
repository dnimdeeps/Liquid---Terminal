# Liquid Terminal

## **[✨ Live Demo ✨](https://liquid-terminal-e-roan.vercel.app/)**

A proof-of-concept OTC marketplace for partitioned wallets on Arbitrum.

Liquid Terminal lets users take a wallet holding a large position and split it into smaller fixed-balance vaults. Instead of selling tokens directly on a DEX (and suffering slippage), you sell the vault itself. Each vault is represented by an NFT. Whoever holds the NFT holds the key to that vault — and therefore controls all assets inside it.

---

## How it works

1. **Partition** — a wallet is split into multiple ERC-6551 Smart Contract vaults, each holding a fixed amount
2. **Mint keys** — one NFT is minted per vault and sent to the creator's wallet
3. **List** — the creator lists the NFT keys on the marketplace at a discount to NAV
4. **Buy** — a buyer pays USDC to acquire the NFT key
5. **Control** — the vault's `onlyOwner` rule instantly recognizes the new NFT holder as its controller

The underlying assets never move during the OTC trade. Only the NFT key changes hands.

---

## Stack

Solidity · ERC-6551 · ERC-721 · Chainlink Data Feeds · Arbitrum · USDC · TypeScript · React
