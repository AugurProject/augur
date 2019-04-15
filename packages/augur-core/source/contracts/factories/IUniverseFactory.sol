pragma solidity 0.5.4;

import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/IAugur.sol';


contract IUniverseFactory {
    function createUniverse(IAugur _augur, IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] memory _payoutNumerators) public returns (IUniverse);
}
