// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PartitionWallet.sol";
import "../src/PartitionFactory.sol";
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("Mock", "MCK") {
        _mint(msg.sender, 1000 * 10**18);
    }
}

contract MockTarget {
    uint256 public value;
    function setValue(uint256 _v) external payable {
        value = _v;
    }
}

contract PartitionWalletTest is Test {
    PartitionFactory public factory;
    PartitionWallet public wallet;
    address public owner = makeAddr("owner");
    address public nonOwner = makeAddr("nonOwner");
    uint256 public tokenId;

    function setUp() public {
        factory = new PartitionFactory();
        
        vm.deal(owner, 10 ether);
        vm.prank(owner);
        (uint256[] memory tokens, address[] memory wallets) = factory.createPartitions{value: 10 ether}(1);
        
        tokenId = tokens[0];
        wallet = PartitionWallet(payable(wallets[0]));
    }

    function testReceiveETH() public {
        vm.deal(address(this), 1 ether);
        (bool s,) = address(wallet).call{value: 1 ether}("");
        assertTrue(s);
        assertEq(address(wallet).balance, 11 ether);
    }

    function testWithdrawETH() public {
        vm.prank(owner);
        wallet.withdrawETH(payable(owner), 5 ether);
        assertEq(address(wallet).balance, 5 ether);
        assertEq(owner.balance, 5 ether);
    }

    function testWithdrawETHInsufficient() public {
        vm.prank(owner);
        vm.expectRevert("Insufficient balance");
        wallet.withdrawETH(payable(owner), 15 ether);
    }

    function testWithdrawETHNotOwner() public {
        vm.prank(nonOwner);
        vm.expectRevert("Not NFT owner");
        wallet.withdrawETH(payable(nonOwner), 5 ether);
    }

    function testWithdrawERC20() public {
        MockToken token = new MockToken();
        token.transfer(address(wallet), 100 ether);
        
        assertEq(token.balanceOf(address(wallet)), 100 ether);

        vm.prank(owner);
        wallet.withdrawERC20(address(token), owner, 50 ether);

        assertEq(token.balanceOf(address(wallet)), 50 ether);
        assertEq(token.balanceOf(owner), 50 ether);
    }

    function testExecuteCall() public {
        MockTarget target = new MockTarget();
        bytes memory data = abi.encodeWithSignature("setValue(uint256)", 42);
        
        vm.prank(owner);
        wallet.executeCall(address(target), 0, data);
        
        assertEq(target.value(), 42);
    }
    
    function testExecuteCallFailed() public {
        MockTarget target = new MockTarget();
        bytes memory data = abi.encodeWithSignature("doesNotExist()");
        
        vm.prank(owner);
        vm.expectRevert("Call failed");
        wallet.executeCall(address(target), 0, data);
    }
}
