pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;


interface IArbiter {
    function onSymbioteCreated(uint256 _id, string[] calldata _outcomeSymbols, bytes32[] calldata _outcomeNames, uint256 _numTicks, bytes calldata _arbiterConfiguration) external;
    function getSymbioteResolution(uint256 _id) external returns (uint256[] memory);
}