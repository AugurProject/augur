pragma solidity 0.4.24;

import 'IAugur.sol';
import 'reporting/IUniverse.sol';
import 'reporting/IReputationToken.sol';


contract IAuctionFactory {
    function createAuction(IAugur _augur, IUniverse _universe, IReputationToken _reputationToken) public returns (IAuction);
}
