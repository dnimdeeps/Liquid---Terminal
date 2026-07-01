// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PartitionFactory.sol";
import "../src/Marketplace.sol";

contract DeployScript is Script {
    function run() external {
        // Use Anvil's default account 0 private key
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(deployerPrivateKey);

        PartitionFactory factory = new PartitionFactory();
        Marketplace marketplace = new Marketplace();

        console.log("PartitionFactory deployed at:", address(factory));
        console.log("Marketplace deployed at:", address(marketplace));

        vm.stopBroadcast();
    }
}
