pragma solidity ^0.5.4;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/Reporting.sol';
import 'ROOT/trading/Order.sol';


contract Constants {
    function DESIGNATED_REPORTING_DURATION_SECONDS() public returns (uint256) { return Reporting.getDesignatedReportingDurationSeconds(); }
    function DISPUTE_ROUND_DURATION_SECONDS() public returns (uint256) { return Reporting.getDisputeRoundDurationSeconds(); }
    function INITIAL_DISPUTE_ROUND_DURATION_SECONDS() public returns (uint256) { return Reporting.getInitialDisputeRoundDurationSeconds(); }
    function FORK_DURATION_SECONDS() public returns (uint256) { return Reporting.getForkDurationSeconds(); }

    function BASE_MARKET_DURATION_MAXIMUM() public returns (uint256) { return Reporting.getBaseMarketDurationMaximum(); }
    function UPGRADE_CADENCE() public returns (uint256) { return Reporting.getUpgradeCadence(); }

    function DEFAULT_VALIDITY_BOND() public returns (uint256) { return Reporting.getDefaultValidityBond(); }
    function VALIDITY_BOND_FLOOR() public returns (uint256) { return Reporting.getValidityBondFloor(); }
    function DEFAULT_REPORTING_FEE_DIVISOR() public returns (uint256) { return Reporting.getDefaultReportingFeeDivisor(); }
    function MAXIMUM_REPORTING_FEE_DIVISOR() public returns (uint256) { return Reporting.getMaximumReportingFeeDivisor(); }
    function MINIMUM_REPORTING_FEE_DIVISOR() public returns (uint256) { return Reporting.getMinimumReportingFeeDivisor(); }

    function TARGET_INVALID_MARKETS_DIVISOR() public returns (uint256) { return Reporting.getTargetInvalidMarketsDivisor(); }
    function TARGET_INCORRECT_DESIGNATED_REPORT_MARKETS_DIVISOR() public returns (uint256) { return Reporting.getTargetIncorrectDesignatedReportMarketsDivisor(); }
    function TARGET_DESIGNATED_REPORT_NO_SHOWS_DIVISOR() public returns (uint256) { return Reporting.getTargetDesignatedReportNoShowsDivisor(); }
    function TARGET_REP_MARKET_CAP_MULTIPLIER() public returns (uint256) { return Reporting.getTargetRepMarketCapMultiplier(); }
    function TARGET_REP_MARKET_CAP_DIVISOR() public returns (uint256) { return Reporting.getTargetRepMarketCapDivisor(); }

    function INITIAL_REP_SUPPLY() public returns (uint256) { return Reporting.getInitialREPSupply(); }

    function BID() public returns (uint256) { return uint256(Order.Types.Bid); }
    function ASK() public returns (uint256) { return uint256(Order.Types.Ask); }
    function LONG() public returns (uint256) { return uint256(Order.TradeDirections.Long); }
    function SHORT() public returns (uint256) { return uint256(Order.TradeDirections.Short); }
}
