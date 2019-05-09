pragma solidity 0.5.4;

import 'ROOT/reporting/IReputationToken.sol';


contract IV2ReputationToken is IReputationToken {
    function trustedAuctionTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool);
    function mintForAuction(uint256 _amountToMint) public returns (bool);
    function burnForAuction(uint256 _amountToMint) public returns (bool);
    function burnForMarket(uint256 _amountToBurn) public returns (bool);
    function mintForUniverse(uint256 _amountToMint, address _target) public returns (bool);
}
