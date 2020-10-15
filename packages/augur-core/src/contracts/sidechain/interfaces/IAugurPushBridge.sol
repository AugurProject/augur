pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IUniverse.sol';


interface IAugurPushBridge {

    struct MarketData {
        bool finalized;
        bool invalid;
        address owner;
        uint256 feeDivisor;
        address universe;
        uint256 numTicks;
        uint256 numOutcomes;
        uint256[] winningPayout;
        uint256 affiliateFeeDivisor;
    }

    function bridgeMarket(IMarket _market) external returns (MarketData memory);
    function bridgeReportingFee(IUniverse _universe) external returns (uint256);
}