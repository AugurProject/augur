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
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/IAugur.sol';


contract DisputeWindow is Initializable, VariableSupplyToken, IDisputeWindow {
    using SafeMathUint256 for uint256;

    IAugur public augur;
    IUniverse private universe;
    ICash public cash;
    uint256 private startTime;
    uint256 private numMarkets;
    uint256 private invalidMarketsCount;
    uint256 private incorrectDesignatedReportMarketCount;
    uint256 private designatedReportNoShows;
    uint256 public windowId;
    uint256 public duration;

    function initialize(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId, uint256 _duration, uint256 _startTime, address _erc820RegistryAddress) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        universe = _universe;
        duration = _duration;
        windowId = _disputeWindowId;
        cash = ICash(augur.lookup("Cash"));
        startTime = _startTime;
        erc820Registry = IERC820Registry(_erc820RegistryAddress);
        initialize820InterfaceImplementations();
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

    function buy(uint256 _attotokens) public afterInitialized returns (bool) {
        require(_attotokens > 0);
        require(isActive());
        require(!universe.isForking());
        getReputationToken().trustedDisputeWindowTransfer(msg.sender, address(this), _attotokens);
        mint(msg.sender, _attotokens);
        return true;
    }

    function redeem() public afterInitialized returns (bool) {
        require(isOver() || universe.isForking());

        uint256 _attoParticipationTokens = balances[msg.sender];

        if (_attoParticipationTokens == 0) {
            return true;
        }

        uint256 _cashBalance = cash.balanceOf(address(this));

        if (_cashBalance == 0) {
            return true;
        }

        uint256 _supply = totalSupply();

        // Burn tokens and send back REP
        burn(msg.sender, _attoParticipationTokens);
        require(getReputationToken().transfer(msg.sender, _attoParticipationTokens));

        // Pay out fees
        uint256 _feePayoutShare = _cashBalance.mul(_attoParticipationTokens).div(_supply);
        cash.transfer(msg.sender, _feePayoutShare);

        augur.logParticipationTokensRedeemed(universe, msg.sender, _attoParticipationTokens, _feePayoutShare);
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

    function onTokenTransfer(address _from, address _to, uint256 _value) internal returns (bool) {
        augur.logParticipationTokensTransferred(universe, _from, _to, _value, balances[_from], balances[_to]);
        return true;
    }

    function onMint(address _target, uint256 _amount) internal returns (bool) {
        augur.logParticipationTokensMinted(universe, _target, _amount, totalSupply(), balances[_target]);
        return true;
    }

    function onBurn(address _target, uint256 _amount) internal returns (bool) {
        augur.logParticipationTokensBurned(universe, _target, _amount, totalSupply(), balances[_target]);
        return true;
    }
}
