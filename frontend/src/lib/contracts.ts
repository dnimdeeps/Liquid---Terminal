// Contract addresses — update these when deploying to a new network
export const CONTRACTS = {
  31337: { // Anvil local
    FACTORY:     '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MARKETPLACE: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
} as const;

export const FACTORY_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'count', type: 'uint256' }],
    name: 'createPartitions',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserPartitions',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: true, internalType: 'address', name: 'wallet', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'partitionId', type: 'uint256' },
    ],
    name: 'PartitionCreated',
    type: 'event',
  },
] as const;

export const MARKETPLACE_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'wallet', type: 'address' },
      { internalType: 'uint256', name: 'price', type: 'uint256' },
    ],
    name: 'listWallet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'wallet', type: 'address' }],
    name: 'buyWallet',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'listings',
    outputs: [
      { internalType: 'address', name: 'seller', type: 'address' },
      { internalType: 'uint256', name: 'price', type: 'uint256' },
      { internalType: 'bool', name: 'isActive', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
