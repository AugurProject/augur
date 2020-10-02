pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/IAugur.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/ContractExists.sol';
import 'ROOT/reporting/IShareToken.sol';
import 'ROOT/ICash.sol';
import 'ROOT/sidechain/IMarketGetter.sol';


// Centralized approval authority and event emissions

/**
 * @title SideChainAugur
 * @notice The core global contract of the Augur platform. Provides a contract registry and and authority on which contracts should be trusted.
 */
contract SideChainAugur {
    using SafeMathUint256 for uint256;
    using ContractExists for address;

    event CompleteSetsPurchased(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 timestamp);
    event CompleteSetsSold(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 fees, uint256 timestamp);
    event TradingProceedsClaimed(address indexed universe, address indexed sender, address market, uint256 outcome, uint256 numShares, uint256 numPayoutTokens, uint256 fees, uint256 timestamp);
    event ShareTokenBalanceChanged(address indexed universe, address indexed account, address indexed market, uint256 outcome, uint256 balance);
    event MarketOIChanged(address indexed universe, address indexed market, uint256 marketOI);
    event RegisterContract(address contractAddress, bytes32 key);
    event FinishDeployment();

    mapping(address => bool) private trustedSender;

    address public uploader;
    mapping(bytes32 => address) private registry;

    ICash public cash;
    IMarketGetter public marketGetter;

    modifier onlyUploader() {
        require(msg.sender == uploader);
        _;
    }

    constructor() public {
        uploader = msg.sender;
    }

    //
    // Registry
    //

    function registerContract(bytes32 _key, address _address) public onlyUploader returns (bool) {
        require(registry[_key] == address(0), "Augur.registerContract: key has already been used in registry");
        require(_address.exists());
        registry[_key] = _address;
        if (_key == "ShareToken") {
            trustedSender[_address] = true;
        } else if (_key == "MarketGetter") {
            marketGetter = IMarketGetter(_address);
        } else if (_key == "Cash") {
            cash = ICash(_address);
        }
        emit RegisterContract(_address, _key);
        return true;
    }

    /**
     * @notice Find the contract address for a particular key
     * @param _key The key to 
     * @return the address of the registered contract if one exists for the given key
     */
    function lookup(bytes32 _key) public view returns (address) {
        return registry[_key];
    }

    function finishDeployment() public onlyUploader returns (bool) {
        uploader = address(1);
        emit FinishDeployment();
        return true;
    }

    //
    // Transfer
    //

    function trustedCashTransfer(address _from, address _to, uint256 _amount) public returns (bool) {
        require(trustedSender[msg.sender]);
        require(cash.transferFrom(_from, _to, _amount));
        return true;
    }

    function isTrustedSender(address _address) public view returns (bool) {
        return trustedSender[_address];
    }

    //
    // Markets
    //

    function isKnownMarket(address _market) public view returns (bool) {
        return marketGetter.isValid(_market);
    }

    //
    // Logging
    //

    function logCompleteSetsPurchased(IUniverse _universe, address _market, address _account, uint256 _numCompleteSets) public returns (bool) {
        require(msg.sender == registry["ShareToken"]);
        emit CompleteSetsPurchased(address(_universe), address(_market), _account, _numCompleteSets, block.timestamp);
        return true;
    }

    function logCompleteSetsSold(IUniverse _universe, address _market, address _account, uint256 _numCompleteSets, uint256 _fees) public returns (bool) {
        require(msg.sender == registry["ShareToken"]);
        emit CompleteSetsSold(address(_universe), address(_market), _account, _numCompleteSets, _fees, block.timestamp);
        return true;
    }

    function logTradingProceedsClaimed(IUniverse _universe, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees) public returns (bool) {
        require(msg.sender == registry["ShareToken"]);
        emit TradingProceedsClaimed(address(_universe), _sender, _market, _outcome, _numShares, _numPayoutTokens, _fees, block.timestamp);
        return true;
    }

    function logShareTokensBalanceChanged(address _account, address _market, uint256 _outcome, uint256 _balance) public returns (bool) {
        require(msg.sender == registry["ShareToken"]);
        emit ShareTokenBalanceChanged(address(marketGetter.getUniverse(_market)), _account, address(_market), _outcome, _balance);
        return true;
    }

    function logMarketOIChanged(IUniverse _universe, address _market, uint256 _openInterest) public returns (bool) {
        require(msg.sender == registry["ShareToken"]);
        emit MarketOIChanged(address(_universe), _market, _openInterest);
        return true;
    }
}
