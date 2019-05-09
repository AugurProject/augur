pragma solidity 0.5.4;

import 'ROOT/libraries/CloneFactory.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/reporting/Universe.sol';


contract UniverseFactory is CloneFactory {
    function createUniverse(IAugur _augur, IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] memory _payoutNumerators) public returns (IUniverse) {
        IUniverse _universe = IUniverse(createClone(_augur.lookup("Universe")));
        _universe.initialize(_augur, _parentUniverse, _parentPayoutDistributionHash, _payoutNumerators);
        return _universe;
    }
}
