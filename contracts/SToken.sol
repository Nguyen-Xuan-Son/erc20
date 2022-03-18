// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";
import "./utils/Context.sol";

contract SToken is ERC20 {
    uint256 private _maxSupply = 1 * 10**9 * 10**_decimal;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function maxSupply() public view virtual returns (uint256) {
        return _maxSupply;
    }
}
