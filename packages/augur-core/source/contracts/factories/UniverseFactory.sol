pragma solidity 0.4.24;

import 'IAugur.sol';
import 'reporting/Universe.sol';


contract UniverseFactory {
    function createUniverse(IAugur _augur, IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash) public returns (IUniverse) {
        return IUniverse(new Universe(_augur, _parentUniverse, _parentPayoutDistributionHash));
    }
}
