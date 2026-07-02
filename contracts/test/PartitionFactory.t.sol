// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PartitionFactory.sol";
import "../src/PartitionWallet.sol";

contract PartitionFactoryTest is Test {
    PartitionFactory public factory;

    function setUp() public {
        factory = new PartitionFactory();
    }

    function testCreatePartitions() public {
        vm.deal(address(this), 10 ether);
        
        (uint256[] memory tokens, address[] memory wallets) = factory.createPartitions{value: 10 ether}(5);
        
        assertEq(tokens.length, 5);
        assertEq(wallets.length, 5);
        assertEq(factory.balanceOf(address(this)), 5);
        
        for(uint i=0; i<5; i++) {
            assertEq(wallets[i].balance, 2 ether);
            assertEq(factory.ownerOf(tokens[i]), address(this));
        }
    }

    function testCreatePartitionsZeroCount() public {
        vm.deal(address(this), 10 ether);
        vm.expectRevert("Count must be > 0");
        factory.createPartitions{value: 10 ether}(0);
    }

    function testCreatePartitionsZeroValue() public {
        vm.expectRevert("Must send ETH to fund partitions");
        factory.createPartitions{value: 0}(5);
    }

    function testCreatePartitionsIndivisible() public {
        vm.deal(address(this), 10 ether);
        vm.expectRevert("ETH amount must be evenly divisible");
        factory.createPartitions{value: 10 ether}(3);
    }

    function testCreatePartitionsTooMany() public {
        vm.deal(address(this), 101 ether);
        vm.expectRevert("Max 100 partitions per tx");
        factory.createPartitions{value: 101 ether}(101);
    }
}
