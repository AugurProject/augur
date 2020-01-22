pragma solidity 0.5.15;

import 'ROOT/reporting/Universe.sol';


contract UpgradedUniverse is Universe {
    uint256 public newData;

    function setNewData(uint256 _newData) public returns (bool) {
        newData = _newData;
        return true;
    }

    function getTypeName() public view returns (bytes32) {
        return "UpgradedUniverse";
    }

    function getNewForkReputationGoal() public view returns (uint256) {
        return getForkReputationGoal() + 1;
    }
}
