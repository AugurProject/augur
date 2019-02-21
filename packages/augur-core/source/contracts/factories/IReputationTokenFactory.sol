pragma solidity 0.5.4;

import 'IAugur.sol';
import 'reporting/IUniverse.sol';
import 'reporting/IReputationToken.sol';


contract IReputationTokenFactory {
    function createReputationToken(IAugur _augur, IUniverse _universe, IUniverse _parentUniverse) public returns (IReputationToken);
}
