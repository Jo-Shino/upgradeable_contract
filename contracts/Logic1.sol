// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Logic1 {
    uint public x = 0;
    function changeX(uint _x) external {
        x = _x;
    }
}