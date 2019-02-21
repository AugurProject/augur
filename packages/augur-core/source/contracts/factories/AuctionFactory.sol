pragma solidity 0.5.4;

import 'ROOT/libraries/CloneFactory.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/Auction.sol';
import 'ROOT/reporting/IReputationToken.sol';


contract AuctionFactory is CloneFactory {
    function createAuction(IAugur _augur, IUniverse _universe, IReputationToken _reputationToken) public returns (IAuction) {
        IAuction _auction = IAuction(createClone(_augur.lookup("Auction")));
        _auction.initialize(_augur, _universe, _reputationToken);
        return _auction;
    }
}
