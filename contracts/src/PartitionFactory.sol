// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PartitionWallet} from "./PartitionWallet.sol";
import {ERC721} from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract PartitionFactory is ERC721Enumerable {
    uint256 public nextTokenId;
    
    // Mapping from tokenId to the actual deployed wallet address
    mapping(uint256 => address) public tokenToWallet;

    event PartitionCreated(address indexed creator, address indexed wallet, uint256 tokenId);

    constructor() ERC721("Liquid Partition", "LQD") {}

    function createPartitions(uint256 count) external payable returns (uint256[] memory, address[] memory) {
        require(count > 0, "Count must be > 0");
        require(count <= 100, "Max 100 partitions per tx");
        require(msg.value > 0, "Must send ETH to fund partitions");
        require(msg.value % count == 0, "ETH amount must be evenly divisible");

        uint256 amountPerPartition = msg.value / count;
        uint256[] memory tokens = new uint256[](count);
        address[] memory wallets = new address[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 tokenId = nextTokenId++;
            
            // Deploy new wallet linked to this factory and tokenId
            PartitionWallet wallet = new PartitionWallet(address(this), tokenId);
            
            // Fund the wallet
            (bool success, ) = address(wallet).call{value: amountPerPartition}("");
            require(success, "Funding failed");

            // Mint the NFT to the creator
            _mint(msg.sender, tokenId);

            tokenToWallet[tokenId] = address(wallet);
            tokens[i] = tokenId;
            wallets[i] = address(wallet);

            emit PartitionCreated(msg.sender, address(wallet), tokenId);
        }

        return (tokens, wallets);
    }
    
    function getWalletAddress(uint256 tokenId) external view returns (address) {
        return tokenToWallet[tokenId];
    }
}
