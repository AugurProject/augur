// Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE

pragma solidity 0.5.4;


import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IReputationToken.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/factories/MarketFactory.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/IAugur.sol';


contract DisputeWindow is Initializable, IDisputeWindow {
    using SafeMathUint256 for uint256;

    IAugur public augur;
    IUniverse private universe;
    uint256 private startTime;
    uint256 private numMarkets;
    uint256 private invalidMarketsCount;
    uint256 private incorrectDesignatedReportMarketCount;
    uint256 private designatedReportNoShows;
    uint256 public windowId;
    uint256 public duration;

    function initialize(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId, uint256 _duration) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        universe = _universe;
        duration = _duration;
        windowId = _disputeWindowId;
        startTime = _disputeWindowId.mul(duration);
        return true;
    }

    function onMarketFinalized() public afterInitialized returns (bool) {
        IMarket _market = IMarket(msg.sender);
        require(universe.isContainerForMarket(_market));
        numMarkets += 1;
        if (_market.isInvalid()) {
            invalidMarketsCount += 1;
        }
        if (!_market.designatedReporterWasCorrect()) {
            incorrectDesignatedReportMarketCount += 1;
        }
        if (!_market.designatedReporterShowed()) {
            designatedReportNoShows += 1;
        }
        return true;
    }

    function getTypeName() public afterInitialized view returns (bytes32) {
        return "DisputeWindow";
    }

    function getUniverse() public afterInitialized view returns (IUniverse) {
        return universe;
    }

    function getNumMarkets() public afterInitialized view returns (uint256) {
        return numMarkets;
    }

    function getReputationToken() public afterInitialized view returns (IReputationToken) {
        return universe.getReputationToken();
    }

    function getStartTime() public afterInitialized view returns (uint256) {
        return startTime;
    }

    function getEndTime() public afterInitialized view returns (uint256) {
        return getStartTime().add(duration);
    }

    function getNumInvalidMarkets() public afterInitialized view returns (uint256) {
        return invalidMarketsCount;
    }

    function getNumIncorrectDesignatedReportMarkets() public view returns (uint256) {
        return incorrectDesignatedReportMarketCount;
    }

    function getNumDesignatedReportNoShows() public view returns (uint256) {
        return designatedReportNoShows;
    }

    function getWindowId() public view returns (uint256) {
        return windowId;
    }

    function isActive() public afterInitialized view returns (bool) {
        if (augur.getTimestamp() <= getStartTime()) {
            return false;
        }
        if (augur.getTimestamp() >= getEndTime()) {
            return false;
        }
        return true;
    }

    function isOver() public afterInitialized view returns (bool) {
        return augur.getTimestamp() >= getEndTime();
    }
}
