// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Marketplace.sol";
import "../src/PartitionFactory.sol";
import "../src/PartitionWallet.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("USDC", "USDC") {}
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract MarketplaceTest is Test {
    PartitionFactory public factory;
    Marketplace public marketplace;
    PartitionWallet public wallet;
    MockUSDC public usdc;
    uint256 public tokenId;
    
    address public seller = makeAddr("seller");
    address public buyer = makeAddr("buyer");

    function setUp() public {
        factory = new PartitionFactory();
        usdc = new MockUSDC();
        marketplace = new Marketplace(address(factory), address(usdc));
        
        vm.deal(seller, 10 ether);
        vm.prank(seller);
        (uint256[] memory tokens, address[] memory wallets) = factory.createPartitions{value: 10 ether}(1);
        
        tokenId = tokens[0];
        wallet = PartitionWallet(payable(wallets[0]));
        
        // Give buyer USDC
        usdc.mint(buyer, 10000 * 10**6);
    }

    function testListWallet() public {
        vm.startPrank(seller);
        factory.approve(address(marketplace), tokenId);
        marketplace.listWallet(tokenId, 5000 * 10**6);
        vm.stopPrank();

        (address listedSeller, uint256 price, bool isActive, ) = marketplace.listings(tokenId);
        assertEq(listedSeller, seller);
        assertEq(price, 5000 * 10**6);
        assertTrue(isActive);
    }

    function testListWalletNotMarketplaceApproved() public {
        vm.startPrank(seller);
        vm.expectRevert("Marketplace not approved");
        marketplace.listWallet(tokenId, 5000 * 10**6);
        vm.stopPrank();
    }

    function testListWalletAlreadyListed() public {
        vm.startPrank(seller);
        factory.approve(address(marketplace), tokenId);
        marketplace.listWallet(tokenId, 5000 * 10**6);
        
        vm.expectRevert("Already listed");
        marketplace.listWallet(tokenId, 6000 * 10**6);
        vm.stopPrank();
    }

    function testBuyWallet() public {
        vm.startPrank(seller);
        factory.approve(address(marketplace), tokenId);
        marketplace.listWallet(tokenId, 5000 * 10**6);
        vm.stopPrank();

        uint256 sellerInitialUsdc = usdc.balanceOf(seller);

        vm.startPrank(buyer);
        usdc.approve(address(marketplace), 5000 * 10**6);
        marketplace.buyWallet(tokenId);
        vm.stopPrank();

        assertEq(usdc.balanceOf(seller), sellerInitialUsdc + 5000 * 10**6);
        assertEq(factory.ownerOf(tokenId), buyer); // Buyer holds NFT

        (,, bool isActive, ) = marketplace.listings(tokenId);
        assertFalse(isActive);
    }

    function testBuyWalletNotForSale() public {
        vm.startPrank(buyer);
        usdc.approve(address(marketplace), 5000 * 10**6);
        vm.expectRevert("Not for sale");
        marketplace.buyWallet(tokenId);
        vm.stopPrank();
    }

    function testBuyWalletInsufficientUSDCAllowance() public {
        vm.startPrank(seller);
        factory.approve(address(marketplace), tokenId);
        marketplace.listWallet(tokenId, 5000 * 10**6);
        vm.stopPrank();

        vm.startPrank(buyer);
        // Do not approve USDC
        vm.expectRevert();
        marketplace.buyWallet(tokenId);
        vm.stopPrank();
    }

    function testDelistWallet() public {
        vm.startPrank(seller);
        factory.approve(address(marketplace), tokenId);
        marketplace.listWallet(tokenId, 5000 * 10**6);
        
        marketplace.delistWallet(tokenId);
        vm.stopPrank();

        assertEq(factory.ownerOf(tokenId), seller);
        (,, bool isActive, ) = marketplace.listings(tokenId);
        assertFalse(isActive);
    }

    function testDelistWalletNotSeller() public {
        vm.startPrank(seller);
        factory.approve(address(marketplace), tokenId);
        marketplace.listWallet(tokenId, 5000 * 10**6);
        vm.stopPrank();

        vm.prank(buyer);
        vm.expectRevert("Only seller can delist");
        marketplace.delistWallet(tokenId);
    }
}
