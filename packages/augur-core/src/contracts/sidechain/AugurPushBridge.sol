pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/sidechain/interfaces/IAugurPushBridge.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IReportingParticipant.sol';


contract AugurPushBridge is IAugurPushBridge {

    function bridgeMarket(IMarket _market) external returns (MarketData memory) {
        MarketData memory _marketData;
        _marketData.owner = _market.getOwner();
        _marketData.numOutcomes = _market.getNumberOfOutcomes();
        _marketData.affiliateFeeDivisor = _market.affiliateFeeDivisor();
        _marketData.feeDivisor = _market.getMarketCreatorSettlementFeeDivisor();
        _marketData.numTicks = _market.getNumTicks();
        _marketData.universe = address(_market.getUniverse());
        _marketData.finalized = _market.isFinalized();
        if (_marketData.finalized) {
            IReportingParticipant _winningReportingParticipant = _market.getWinningReportingParticipant();
            _marketData.winningPayout = _winningReportingParticipant.getPayoutNumerators();
        }
        return _marketData;
    }

    function bridgeReportingFee(IUniverse _universe) external returns (uint256) {
        return _universe.getOrCacheReportingFeeDivisor();
    }
}