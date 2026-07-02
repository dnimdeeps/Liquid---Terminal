// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PartitionFactory.sol";
import "../src/Marketplace.sol";

contract DeployScript is Script {
    function run() external {
        // Use the private key provided via the CLI flag
        vm.startBroadcast();

        PartitionFactory factory = new PartitionFactory();

        // Arbitrum One Native USDC address
        address usdcAddress = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
        Marketplace marketplace = new Marketplace(address(factory), usdcAddress);

        console.log("PartitionFactory deployed at:", address(factory));
        console.log("Marketplace deployed at:", address(marketplace));

        vm.stopBroadcast();
    }
}
