pragma solidity 0.5.4;

import 'ROOT/IAugur.sol';
import 'ROOT/reporting/Universe.sol';


contract UniverseFactory {
    function createUniverse(IAugur _augur, IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] memory _payoutNumerators) public returns (IUniverse) {
        return IUniverse(new Universe(_augur, _parentUniverse, _parentPayoutDistributionHash, _payoutNumerators));
    }
}
