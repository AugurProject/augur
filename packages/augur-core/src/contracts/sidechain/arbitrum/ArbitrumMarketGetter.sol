pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/sidechain/IMarketGetter.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/sidechain/interfaces/IAugurPushBridge.sol';

contract ArbitrumMarketGetter is IMarketGetter{

    mapping(address => IAugurPushBridge.MarketData ) private markets;
    uint256 private reportingFeeDivisor;
    address arbitrumBridgeAddress;

    constructor(address _arbitrumBridgeAddress) public {
        arbitrumBridgeAddress = _arbitrumBridgeAddress;
    }

    function receiveMarketData(bytes calldata _marketData, address marketAddress) external isArbitrumBridge returns(bool){
       IAugurPushBridge.MarketData memory marketData = abi.decode(_marketData, (IAugurPushBridge.MarketData, address));
       markets[marketAddress] = marketData;
       return true;
    }

    function receiveFeeData(bytes calldata _feeData) external isArbitrumBridge returns(bool){
        uint256 _fee = abi.decode(_feeData, (uint256));
        reportingFeeDivisor = _fee;
        return true;

    }

    function getMarket(address marketAddress) internal view returns(IAugurPushBridge.MarketData memory){
        IAugurPushBridge.MarketData memory market = markets[marketAddress];
        require(market.universe != address(0), "No market registered at address");
        return market;
    }

    function isValid(address marketAddress) public view returns (bool) {
        IAugurPushBridge.MarketData memory market  = getMarket(marketAddress);
        return !market.invalid;
    }

    function isFinalized(address marketAddress) public view returns (bool) {
        IAugurPushBridge.MarketData memory market  = getMarket(marketAddress);
        return market.finalized;
    }

    function isFinalizedAsInvalid(address marketAddress) external view returns (bool) {
        return !isValid(marketAddress) && isFinalized(marketAddress);
    }

    function getOwner(address marketAddress) external view returns (address) {
        IAugurPushBridge.MarketData memory market  = getMarket(marketAddress);
        return market.owner;
    }

    function getCreatorFee(address marketAddress) external view returns (uint256) {
        IAugurPushBridge.MarketData memory market  = getMarket(marketAddress);
        return market.feeDivisor;
    }

    function getUniverse(address marketAddress) external view returns (IUniverse) {
        IAugurPushBridge.MarketData memory market  = getMarket(marketAddress);
        return IUniverse(market.universe);
    }

    function getNumTicks(address marketAddress) external view returns (uint256) {
        IAugurPushBridge.MarketData memory market  = getMarket(marketAddress);
        return market.numTicks;
    }

    function getNumberOfOutcomes(address marketAddress) external view returns (uint256) {
        IAugurPushBridge.MarketData memory market  = getMarket(marketAddress);
        return market.numOutcomes;
    }

    function getWinningPayoutNumerator(address marketAddress, uint256 _outcome) external view returns (uint256) {
        IAugurPushBridge.MarketData memory market  = getMarket(marketAddress);
        require(_outcome < market.winningPayout.length, "No outcome corresponds to given index");
        return market.winningPayout[_outcome];
    }

    function getAffiliateFeeDivisor(address marketAddress) external view returns (uint256) {
        IAugurPushBridge.MarketData memory market  = getMarket(marketAddress);
        return market.affiliateFeeDivisor;
    }

    function getOrCacheReportingFeeDivisor() external view returns (uint256) {
        return reportingFeeDivisor;
    }

    modifier isArbitrumBridge() {
        require(tx.origin == arbitrumBridgeAddress);
        _;
    }
}
