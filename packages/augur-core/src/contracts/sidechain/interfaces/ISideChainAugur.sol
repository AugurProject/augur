pragma solidity 0.5.15;

import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/reporting/IUniverse.sol';


contract ISideChainAugur {
    function trustedCashTransfer(address _from, address _to, uint256 _amount) public returns (bool);
    function isTrustedSender(address _address) public returns (bool);
    function logCompleteSetsPurchased(IUniverse _universe, address _market, address _account, uint256 _numCompleteSets) public returns (bool);
    function logCompleteSetsSold(IUniverse _universe, address _market, address _account, uint256 _numCompleteSets, uint256 _fees) public returns (bool);
    function logTradingProceedsClaimed(IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees) public returns (bool);
    function logShareTokensBalanceChanged(address _account, address _market, uint256 _outcome, uint256 _balance) public returns (bool);
    function logMarketOIChanged(IUniverse _universe, address _market, uint256 _openInterest) public returns (bool);
    function lookup(bytes32 _key) public view returns (address);
    function isKnownMarket(address _market) public view returns (bool);
}
