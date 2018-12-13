pragma solidity 0.4.24;

import 'Controller.sol';
import 'reporting/IUniverse.sol';


contract MockUniverseFactory {
    IUniverse private createUniverseParentUniverseValue;
    bytes32 private createUniverseParentPayoutDistributionHashValue;
    IUniverse private createUniverseUniverseValue;

    function setCreateUniverseUniverseValue(IUniverse _universe) public {
        createUniverseUniverseValue = _universe;
    }

    function getCreateUniverseParentUniverseValue() public returns(IUniverse) {
        return createUniverseParentUniverseValue;
    }

    function getCreateUniverseParentPayoutDistributionHashValue() public returns(bytes32) {
        return createUniverseParentPayoutDistributionHashValue;
    }

    function createUniverse(IAugur _augur, IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash) public returns (IUniverse) {
        createUniverseParentUniverseValue = _parentUniverse;
        createUniverseParentPayoutDistributionHashValue = _parentPayoutDistributionHash;
        return createUniverseUniverseValue;
    }
}
