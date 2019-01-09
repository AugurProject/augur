pragma solidity 0.4.24;

import 'libraries/CloneFactory.sol';
import 'reporting/IAuction.sol';
import 'reporting/IAuctionToken.sol';
import 'libraries/token/ERC20Token.sol';


contract AuctionTokenFactory is CloneFactory {
    function createAuctionToken(IAugur _augur, IAuction _auction, ERC20Token _redemptionToken, uint256 _auctionIndex) public returns (IAuctionToken) {
        IAuctionToken _auctionToken = IAuctionToken(createClone(_augur.lookup("AuctionToken")));
        _auctionToken.initialize(_augur, _auction, _redemptionToken, _auctionIndex, _augur.lookup("ERC820Registry"));
        return _auctionToken;
    }
}
