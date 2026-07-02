// ─────────────────────────────────────────────────────────────────────────────
// CONTRACT ADDRESSES
// Update FACTORY and MARKETPLACE after deployment to Arbitrum One.
// USDC is the canonical Arbitrum One native USDC — do NOT change this.
// ─────────────────────────────────────────────────────────────────────────────
export const CONTRACTS = {
  42161: { // Arbitrum One — only supported network
    FACTORY:     '0x2c726c3F1970532752BE55f444B5dbB984E2b478',
    MARKETPLACE: '0x207B62fE0Fd081a87ce51bC0554d5A6350F85351', 
    USDC:        '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Native USDC on Arbitrum One
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ABIs
// ─────────────────────────────────────────────────────────────────────────────

export const WALLET_ABI = [
  { inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'withdrawETH', type: 'function', stateMutability: 'nonpayable' },
  { inputs: [{ name: 'token', type: 'address' }, { name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'withdrawERC20', type: 'function', stateMutability: 'nonpayable' },
  { inputs: [{ name: 'target', type: 'address' }, { name: 'value', type: 'uint256' }, { name: 'data', type: 'bytes' }], name: 'executeCall', type: 'function', stateMutability: 'nonpayable' },
] as const;

export const FACTORY_ABI = [
  { inputs: [{ name: 'count', type: 'uint256' }], name: 'createPartitions', outputs: [{ name: 'tokens', type: 'uint256[]' }, { name: 'wallets', type: 'address[]' }], stateMutability: 'payable', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }, { name: 'index', type: 'uint256' }], name: 'tokenOfOwnerByIndex', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'tokenId', type: 'uint256' }], name: 'ownerOf', outputs: [{ name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'tokenId', type: 'uint256' }], name: 'getWalletAddress', outputs: [{ name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'to', type: 'address' }, { name: 'tokenId', type: 'uint256' }], name: 'approve', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'operator', type: 'address' }, { name: 'approved', type: 'bool' }], name: 'setApprovalForAll', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'tokenId', type: 'uint256' }], name: 'getApproved', outputs: [{ name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }, { name: 'operator', type: 'address' }], name: 'isApprovedForAll', outputs: [{ name: '', type: 'bool' }], stateMutability: 'view', type: 'function' },
] as const;

export const MARKETPLACE_ABI = [
  { inputs: [{ name: '_factory', type: 'address' }, { name: '_usdc', type: 'address' }], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], name: 'ReentrancyGuardReentrantCall', type: 'error' },
  { anonymous: false, inputs: [{ indexed: true, name: 'tokenId', type: 'uint256' }, { indexed: true, name: 'seller', type: 'address' }], name: 'Delisted', type: 'event' },
  { anonymous: false, inputs: [{ indexed: true, name: 'tokenId', type: 'uint256' }, { indexed: true, name: 'seller', type: 'address' }, { indexed: false, name: 'price', type: 'uint256' }], name: 'Listed', type: 'event' },
  { anonymous: false, inputs: [{ indexed: true, name: 'tokenId', type: 'uint256' }, { indexed: true, name: 'buyer', type: 'address' }, { indexed: false, name: 'price', type: 'uint256' }], name: 'Purchased', type: 'event' },
  { inputs: [{ name: '', type: 'uint256' }], name: 'activeListings', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'tokenId', type: 'uint256' }], name: 'buyWallet', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'tokenId', type: 'uint256' }], name: 'delistWallet', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'factory', outputs: [{ name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'usdc', outputs: [{ name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'getActiveListingsDetails', outputs: [{ components: [{ name: 'tokenId', type: 'uint256' }, { name: 'wallet', type: 'address' }, { name: 'seller', type: 'address' }, { name: 'price', type: 'uint256' }], name: '', type: 'tuple[]' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'tokenId', type: 'uint256' }, { name: 'price', type: 'uint256' }], name: 'listWallet', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: '', type: 'uint256' }], name: 'listings', outputs: [{ name: 'seller', type: 'address' }, { name: 'price', type: 'uint256' }, { name: 'isActive', type: 'bool' }, { name: 'arrayIndex', type: 'uint256' }], stateMutability: 'view', type: 'function' },
] as const;

export const ERC20_ABI = [
  { inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], name: 'allowance', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' },
] as const;
