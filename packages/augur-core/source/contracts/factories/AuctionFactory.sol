pragma solidity 0.4.24;

import 'libraries/CloneFactory.sol';
import 'IAugur.sol';
import 'reporting/IUniverse.sol';
import 'reporting/Auction.sol';
import 'reporting/IReputationToken.sol';


contract AuctionFactory is CloneFactory {
    function createAuction(IAugur _augur, IUniverse _universe, IReputationToken _reputationToken) public returns (IAuction) {
        IAuction _auction = IAuction(createClone(_augur.lookup("Auction")));
        _auction.initialize(_augur, _universe, _reputationToken);
        return _auction;
    }
}
