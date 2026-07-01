// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PartitionWallet} from "./PartitionWallet.sol";

contract PartitionFactory {
    event PartitionCreated(address indexed creator, address indexed wallet, uint256 partitionId);

    // Keep track of partitions per user
    mapping(address => address[]) public userPartitions;
    
    // Create multiple partitions at once and fund them equally with ETH
    function createPartitions(uint256 count) external payable returns (address[] memory) {
        require(count > 0, "Count must be > 0");
        require(msg.value > 0, "Must send ETH to fund partitions");
        require(msg.value % count == 0, "ETH amount must be evenly divisible");

        uint256 amountPerPartition = msg.value / count;
        address[] memory partitions = new address[](count);

        for (uint256 i = 0; i < count; i++) {
            // Deploy new wallet with the sender as the initial owner
            PartitionWallet wallet = new PartitionWallet(msg.sender);
            
            // Fund the wallet
            (bool success, ) = address(wallet).call{value: amountPerPartition}("");
            require(success, "Funding failed");

            partitions[i] = address(wallet);
            userPartitions[msg.sender].push(address(wallet));

            emit PartitionCreated(msg.sender, address(wallet), i);
        }

        return partitions;
    }

    function getUserPartitions(address user) external view returns (address[] memory) {
        return userPartitions[user];
    }
}
