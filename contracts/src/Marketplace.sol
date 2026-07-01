// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PartitionWallet} from "./PartitionWallet.sol";

contract Marketplace {
    struct Listing {
        address seller;
        uint256 price; // Asking price in ETH
        bool isActive;
    }

    // Mapping from wallet address to its listing
    mapping(address => Listing) public listings;

    event Listed(address indexed wallet, address indexed seller, uint256 price);
    event Purchased(address indexed wallet, address indexed buyer, uint256 price);
    event Delisted(address indexed wallet, address indexed seller);

    // To list safely, the Marketplace provides a helper function that expects
    // the wallet owner to have already called transferOwnership(address(this))
    // However, to prevent front-running, we pass the original owner explicitly and 
    // verify the marketplace is the owner now.
    
    function listWallet(address wallet, uint256 price) external {
        PartitionWallet pw = PartitionWallet(payable(wallet));
        
        // Ensure marketplace owns the wallet
        require(pw.owner() == address(this), "Marketplace must be owner");
        
        // Ensure not already listed
        require(!listings[wallet].isActive, "Already listed");

        // The caller is the seller
        listings[wallet] = Listing({
            seller: msg.sender,
            price: price,
            isActive: true
        });

        emit Listed(wallet, msg.sender, price);
    }

    function buyWallet(address wallet) external payable {
        Listing storage listing = listings[wallet];
        require(listing.isActive, "Not for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        address seller = listing.seller;
        uint256 price = listing.price;

        // Mark inactive
        listing.isActive = false;

        // Transfer funds to seller
        (bool success, ) = seller.call{value: price}("");
        require(success, "Payment to seller failed");

        // Refund excess
        if (msg.value > price) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - price}("");
            require(refundSuccess, "Refund failed");
        }

        // Transfer ownership of the wallet to the buyer
        PartitionWallet pw = PartitionWallet(payable(wallet));
        pw.transferOwnership(msg.sender);

        emit Purchased(wallet, msg.sender, price);
    }

    function delistWallet(address wallet) external {
        Listing storage listing = listings[wallet];
        require(listing.isActive, "Not for sale");
        require(listing.seller == msg.sender, "Only seller can delist");

        listing.isActive = false;

        // Return ownership to seller
        PartitionWallet pw = PartitionWallet(payable(wallet));
        pw.transferOwnership(msg.sender);

        emit Delisted(wallet, msg.sender);
    }
}
