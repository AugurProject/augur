pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/sidechain/IMarketGetter.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/sidechain/interfaces/IAugurPushBridge.sol';

contract ArbitrumMarketGetter is IMarketGetter {

    mapping(address => IAugurPushBridge.MarketData ) private markets;
    uint256 private reportingFeeDivisor;
    address arbitrumBridgeAddress;

    event EnterPosition(address sender, uint256 cash, uint256 outputShares, bool buyLong, uint256 priorShares);

    constructor(address _arbitrumBridgeAddress) public {
        arbitrumBridgeAddress = _arbitrumBridgeAddress;
    }

    function receiveMarketData(bytes calldata _rawMarketData, address _marketAddress) external isArbitrumBridge returns (bool) {
        (IAugurPushBridge.MarketData memory _marketData) = abi.decode(_rawMarketData, (IAugurPushBridge.MarketData));
        markets[_marketAddress] = _marketData;
        return true;
    }

    function receiveFeeData(uint256 _fee) external isArbitrumBridge returns (bool) {
        reportingFeeDivisor = _fee;
        return true;
    }

    function getMarket(address _marketAddress) internal view returns (IAugurPushBridge.MarketData memory) {
        IAugurPushBridge.MarketData memory _market = markets[_marketAddress];
        require(_market.universe != address(0), "No market registered at address");
        return _market;
    }

    function isValid(address _marketAddress) public view returns (bool) {
        IAugurPushBridge.MarketData memory _market = getMarket(_marketAddress);
        return !_market.invalid;
    }

    function isFinalized(address _marketAddress) public view returns (bool) {
        IAugurPushBridge.MarketData memory _market = getMarket(_marketAddress);
        return _market.finalized;
    }

    function isFinalizedAsInvalid(address _marketAddress) external view returns (bool) {
        return !isValid(_marketAddress) && isFinalized(_marketAddress);
    }

    function getOwner(address _marketAddress) external view returns (address) {
        IAugurPushBridge.MarketData memory _market = getMarket(_marketAddress);
        return _market.owner;
    }

    function getCreatorFee(address _marketAddress) external view returns (uint256) {
        IAugurPushBridge.MarketData memory _market = getMarket(_marketAddress);
        return _market.feeDivisor;
    }

    function getUniverse(address _marketAddress) external view returns (IUniverse) {
        IAugurPushBridge.MarketData memory _market = getMarket(_marketAddress);
        return IUniverse(_market.universe);
    }

    function getNumTicks(address _marketAddress) external view returns (uint256) {
        IAugurPushBridge.MarketData memory _market = getMarket(_marketAddress);
        return _market.numTicks;
    }

    function getNumberOfOutcomes(address _marketAddress) external view returns (uint256) {
        IAugurPushBridge.MarketData memory _market = getMarket(_marketAddress);
        return _market.numOutcomes;
    }

    function getWinningPayoutNumerator(address _marketAddress, uint256 _outcome) external view returns (uint256) {
        IAugurPushBridge.MarketData memory _market = getMarket(_marketAddress);
        require(_outcome < _market.winningPayout.length, "No outcome corresponds to given index");
        return _market.winningPayout[_outcome];
    }

    function getAffiliateFeeDivisor(address _marketAddress) external view returns (uint256) {
        IAugurPushBridge.MarketData memory _market = getMarket(_marketAddress);
        return _market.affiliateFeeDivisor;
    }

    function getOrCacheReportingFeeDivisor() external view returns (uint256) {
        return reportingFeeDivisor;
    }

    modifier isArbitrumBridge() {
        require(tx.origin == arbitrumBridgeAddress);
        _;
    }
}
