// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./StorageSlot.sol";


contract Proxy {
    address implementation;
    uint x = 0;

    function changeImplementation(address _implementation) external {
        StorageSlot.getAddressSlot(keccak256('eip1967.proxy.implementation')).value = _implementation;
    }

    fallback() external {
        (bool success, ) = StorageSlot.getAddressSlot(keccak256('eip1967.proxy.implementation')).value.delegatecall(msg.data);
        require(success);
    }
}