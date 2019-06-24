pragma solidity 0.5.4;

import 'ROOT/libraries/CloneFactory.sol';
import 'ROOT/reporting/IAuction.sol';
import 'ROOT/reporting/IAuctionToken.sol';
import 'ROOT/libraries/token/IERC20.sol';


contract AuctionTokenFactory is CloneFactory {
    function createAuctionToken(IAugur _augur, IAuction _auction, IERC20 _redemptionToken, uint256 _auctionIndex) public returns (IAuctionToken) {
        IAuctionToken _auctionToken = IAuctionToken(createClone(_augur.lookup("AuctionToken")));
        _auctionToken.initialize(_augur, _auction, _redemptionToken, _auctionIndex, _augur.lookup("ERC1820Registry"));
        return _auctionToken;
    }
}
