//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// Non standard token, better follow bellow ref:
// https://eips.ethereum.org/EIPS/eip-20

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PHAUToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
				// mint meaning, create the token
        _mint(msg.sender, 100000 * (10 ** 18));
    }
}
