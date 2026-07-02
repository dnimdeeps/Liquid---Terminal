// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC721} from "openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";

contract PartitionWallet {
    using SafeERC20 for IERC20;

    address public immutable factory;
    uint256 public immutable tokenId;

    constructor(address _factory, uint256 _tokenId) {
        factory = _factory;
        tokenId = _tokenId;
    }

    // Access control is delegated directly to the ERC721 NFT owner
    modifier onlyOwner() {
        require(IERC721(factory).ownerOf(tokenId) == msg.sender, "Not NFT owner");
        _;
    }

    receive() external payable {}

    function withdrawETH(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function withdrawERC20(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }

    function executeCall(address target, uint256 value, bytes calldata data) external onlyOwner returns (bytes memory) {
        (bool success, bytes memory result) = target.call{value: value}(data);
        require(success, "Call failed");
        return result;
    }
}
