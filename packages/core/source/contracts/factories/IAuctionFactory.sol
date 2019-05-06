pragma solidity 0.5.4;

import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IReputationToken.sol';


contract IAuctionFactory {
    function createAuction(IAugur _augur, IUniverse _universe, IReputationToken _reputationToken) public returns (IAuction);
}
