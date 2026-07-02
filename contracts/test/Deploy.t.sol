// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../script/Deploy.s.sol";

contract DeployScriptTest is Test {
    DeployScript public deployer;

    function setUp() public {
        deployer = new DeployScript();
    }

    function testRun() public {
        // Execute the deployment script to guarantee no runtime reverts and 100% coverage
        deployer.run();
    }
}
