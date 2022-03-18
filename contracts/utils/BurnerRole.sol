// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Context.sol";
import "../libraries/Roles.sol";

contract BurnerRole is Context {
    using Roles for Roles.Role;

    event BurnerAdded(address indexed account);
    event BurnerRemoved(address indexed account);

    Roles.Role private _burners;

    constructor() {
        _addBurner(_msgSender());
    }

    modifier onlyBurner() {
        require(
            isBurner(_msgSender()),
            "BurnerRole: caller does not have the Burner role"
        );
        _;
    }

    function isBurner(address account) public view returns (bool) {
        return _burners.has(account);
    }

    function addBurner(address account) public onlyBurner {
        _addBurner(account);
    }

    function renounceBurner() public {
        _removeBurner(_msgSender());
    }

    function _addBurner(address account) internal {
        _burners.add(account);
        emit BurnerAdded(account);
    }

    function _removeBurner(address account) internal {
        _burners.remove(account);
        emit BurnerRemoved(account);
    }
}
