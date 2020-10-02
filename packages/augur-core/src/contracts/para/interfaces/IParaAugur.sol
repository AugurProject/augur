pragma solidity 0.5.15;

import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/para/interfaces/IParaUniverse.sol';

import 'ROOT/ICash.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/para/interfaces/IOINexus.sol';


contract IParaAugur {
    mapping(address => address) public getParaUniverse;

    ICash public cash;
    IParaShareToken public shareToken;
    IOINexus public OINexus;

    function generateParaUniverse(IUniverse _universe) external returns (IParaUniverse);
    function registerContract(bytes32 _key, address _address) external returns (bool);
    function lookup(bytes32 _key) external view returns (address);
    function isKnownUniverse(IUniverse _universe) external view returns (bool);
    function trustedCashTransfer(address _from, address _to, uint256 _amount) public returns (bool);
    function isKnownMarket(IMarket _market) public view returns (bool);
    function logCompleteSetsPurchased(IUniverse _universe, IMarket _market, address _account, uint256 _numCompleteSets) external returns (bool);
    function logCompleteSetsSold(IUniverse _universe, IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees) external returns (bool);
    function logMarketOIChanged(IUniverse _universe, IMarket _market) external returns (bool);
    function logTradingProceedsClaimed(IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees) external returns (bool);
    function logShareTokensBalanceChanged(address _account, IMarket _market, uint256 _outcome, uint256 _balance) external returns (bool);
    function logReportingFeeChanged(uint256 _reportingFee) external returns (bool);
    function getTimestamp() public view returns (uint256);
}
