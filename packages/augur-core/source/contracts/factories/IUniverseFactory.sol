pragma solidity 0.4.24;

import 'reporting/IUniverse.sol';
import 'IAugur.sol';


contract IUniverseFactory {
    function createUniverse(IAugur _augur, IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash) public returns (IUniverse);
}
