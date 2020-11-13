pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/ICash.sol';
import 'ROOT/reporting/IOICash.sol';
import 'ROOT/sidechain/IMarketGetter.sol';
import 'ROOT/sidechain/interfaces/IAugurPushBridge.sol';


contract TestBridgeContract is IMarketGetter {

    ICash public cash;
    IOICash public OICash;
    IUniverse public universe;
    IAugurPushBridge public augurPushBridge;

    mapping(address => IAugurPushBridge.MarketData) public marketData;
    uint256 public reportingFeeDivisor;

    constructor(ICash _cash, IOICash _OICash, IUniverse _universe, IAugurPushBridge _augurPushBridge) public {
        cash = _cash;
        OICash = _OICash;
        universe = _universe;
        augurPushBridge = _augurPushBridge;
    }

    function pullMarketData(IMarket _market) public returns (bool) {
        IAugurPushBridge.MarketData memory _marketData = augurPushBridge.bridgeMarket(_market);
        marketData[address(_market)] = _marketData;
        return true;
    }

    function pullReportingFeeDivisor() public returns (bool) {
        reportingFeeDivisor = augurPushBridge.bridgeReportingFee(universe);
        return true;
    }

    function deposit(uint256 _amount) public returns (bool) {
        OICash.transferFrom(msg.sender, address(this), _amount);
        cash.faucet(_amount);
        cash.transfer(msg.sender, _amount);
        return true;
    }

    function withdraw(uint256 _amount) public returns (bool) {
        cash.transferFrom(msg.sender, address(1), _amount);
        OICash.transfer(msg.sender, _amount);
        return true;
    }

    function moveFees(address _target) public returns (bool) {
        uint256 _feeBalance = cash.balanceOf(address(this)) - OICash.balanceOf(address(this));
        cash.transfer(_target, _feeBalance);
        return true;
    }

    function isValid(address _market) external view returns (bool) {
        return marketData[address(_market)].numTicks != 0;
    }

    function isFinalized(address _market) external view returns (bool) {
        return marketData[address(_market)].finalized;
    }
    
    function isFinalizedAsInvalid(address _market) external view returns (bool) {
        return marketData[address(_market)].invalid;
    }
    
    function getOwner(address _market) external view returns (address) {
        return marketData[address(_market)].owner;
    }
    
    function getCreatorFee(address _market) external view returns (uint256) {
        return marketData[address(_market)].feeDivisor;
    }
    
    function getUniverse(address _market) external view returns (IUniverse) {
        return IUniverse(marketData[address(_market)].universe);
    }
    
    function getNumTicks(address _market) external view returns (uint256) {
        return marketData[address(_market)].numTicks;
    }
    
    function getNumberOfOutcomes(address _market) external view returns (uint256) {
        return marketData[address(_market)].numOutcomes;
    }
    
    function getWinningPayoutNumerator(address _market, uint256 _outcome) external view returns (uint256) {
        return marketData[address(_market)].winningPayout[_outcome];
    }
    
    function getAffiliateFeeDivisor(address _market) external view returns (uint256) {
        return marketData[address(_market)].affiliateFeeDivisor;
    }

    function getOrCacheReportingFeeDivisor() public view returns (uint256) {
        return reportingFeeDivisor;
    }


}