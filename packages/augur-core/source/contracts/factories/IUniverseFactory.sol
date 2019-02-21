pragma solidity 0.5.4;

import 'reporting/IUniverse.sol';
import 'IAugur.sol';


contract IUniverseFactory {
    function createUniverse(IAugur _augur, IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash) public returns (IUniverse);
}
