pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/symbiote/IArbiter.sol';


contract TestArbiter is IArbiter {

    uint256[] resolutionData;

    function onSymbioteCreated(uint256 _id, string[] memory _outcomeSymbols, bytes32[] memory _outcomeNames, uint256 _numTicks, bytes memory _arbiterConfiguration) public {
    }

    function getSymbioteResolution(uint256 _id) external returns (uint256[] memory) {
        return resolutionData;
    }

    function setSymbioteResolution(uint256[] calldata _resolution) external {
        resolutionData = _resolution;
    }

    function initateAugurResolution(uint256 _id) external {
    }
}