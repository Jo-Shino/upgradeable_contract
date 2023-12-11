// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Proxy {
    address implementaion;

    function changeImplementation(address _implementation) external {
        implementaion = _implementation;
    }

    fallback() external {
        (bool success,) = implementaion.call(msg.data);
        require(success);
    }
}