pragma solidity 0.5.4;

import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IRepPriceOracle.sol';
import 'ROOT/reporting/IAuctionToken.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';


contract IAuction is IRepPriceOracle {
    IAuctionToken public repAuctionToken; // The token keeping track of ETH provided to purchase the REP being auctioned off
    IAuctionToken public ethAuctionToken; // The token keeping track of REP provided to purchase the ETH being auctioned off
    function initialize(IAugur _augur, IUniverse _universe, IV2ReputationToken _reputationToken) public returns (bool);
    function recordFees(uint256 _feeAmount) public returns (bool);
    function getUniverse() public view returns (IUniverse);
    function getAuctionIndexForCurrentTime() public view returns (uint256);
}
