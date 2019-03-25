pragma solidity 0.5.4;

import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IRepPriceOracle.sol';
import 'ROOT/reporting/IAuctionToken.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';


contract IAuction is IRepPriceOracle {
    IAuctionToken public repAuctionToken; // The token keeping track of CASH provided to purchase the REP being auctioned off
    IAuctionToken public cashAuctionToken; // The token keeping track of REP provided to purchase the CASH being auctioned off
    uint256 public maxSupply;
    function initialize(IAugur _augur, IUniverse _universe, IV2ReputationToken _reputationToken) public returns (bool);
    function getUniverse() public view returns (IUniverse);
    function getAuctionIndexForCurrentTime() public view returns (uint256);
    function auctionOver(IAuctionToken _auctionToken) public returns (bool);
}
