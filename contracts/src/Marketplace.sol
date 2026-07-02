// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {IERC721} from "openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {PartitionFactory} from "./PartitionFactory.sol";

contract Marketplace is ReentrancyGuard {
    PartitionFactory public immutable factory;
    IERC20 public immutable usdc;

    struct Listing {
        address seller;
        uint256 price;
        bool isActive;
        uint256 arrayIndex;
    }

    mapping(uint256 => Listing) public listings;
    uint256[] public activeListings;

    struct ListingDetails {
        uint256 tokenId;
        address wallet;
        address seller;
        uint256 price;
    }

    event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event Purchased(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event Delisted(uint256 indexed tokenId, address indexed seller);

    constructor(address _factory, address _usdc) {
        factory = PartitionFactory(_factory);
        usdc = IERC20(_usdc);
    }

    function getActiveListingsDetails() external view returns (ListingDetails[] memory) {
        ListingDetails[] memory details = new ListingDetails[](activeListings.length);
        for (uint i = 0; i < activeListings.length; i++) {
            uint256 tid = activeListings[i];
            Listing storage l = listings[tid];
            details[i] = ListingDetails({
                tokenId: tid,
                wallet: factory.getWalletAddress(tid),
                seller: l.seller,
                price: l.price
            });
        }
        return details;
    }

    function listWallet(uint256 tokenId, uint256 price) external {
        require(factory.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(!listings[tokenId].isActive, "Already listed");
        
        // Ensure marketplace is approved
        require(
            factory.getApproved(tokenId) == address(this) || 
            factory.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            isActive: true,
            arrayIndex: activeListings.length
        });
        
        activeListings.push(tokenId);

        emit Listed(tokenId, msg.sender, price);
    }

    function buyWallet(uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Not for sale");

        address seller = listing.seller;
        uint256 price = listing.price;

        listing.isActive = false;
        _removeListing(tokenId);

        // Transfer USDC from buyer to seller
        require(usdc.transferFrom(msg.sender, seller, price), "USDC transfer failed");

        // Transfer NFT to buyer via standard ERC721
        factory.transferFrom(seller, msg.sender, tokenId);

        emit Purchased(tokenId, msg.sender, price);
    }

    function delistWallet(uint256 tokenId) external {
        Listing storage listing = listings[tokenId];
        require(listing.isActive, "Not for sale");
        require(listing.seller == msg.sender, "Only seller can delist");

        listing.isActive = false;
        _removeListing(tokenId);

        emit Delisted(tokenId, msg.sender);
    }
    
    function _removeListing(uint256 tokenId) internal {
        uint256 index = listings[tokenId].arrayIndex;
        uint256 lastIndex = activeListings.length - 1;
        
        if (index != lastIndex) {
            uint256 lastTokenId = activeListings[lastIndex];
            activeListings[index] = lastTokenId;
            listings[lastTokenId].arrayIndex = index;
        }
        
        activeListings.pop();
    }
}
