// Copyright (C) 2015 Forecast Foundation OU, full GPL notice in LICENSE

pragma solidity 0.5.10;


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


/**
 * @title Dispute Window
 * @notice A contract used to encapsulate a window of time in which markets can be disputed as well as the pot where reporting fees are collected and distributed.
 */
contract DisputeWindow is Initializable, VariableSupplyToken, IDisputeWindow {
    using SafeMathUint256 for uint256;

    IAugur public augur;
    IUniverse private universe;
    ICash public cash;
    uint256 private startTime;

    uint256 public windowId;
    uint256 public duration;

    function initialize(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId, uint256 _duration, uint256 _startTime, address _erc1820RegistryAddress) public beforeInitialized {
        endInitialization();
        augur = _augur;
        universe = _universe;
        duration = _duration;
        windowId = _disputeWindowId;
        cash = ICash(augur.lookup("Cash"));
        startTime = _startTime;
        erc1820Registry = IERC1820Registry(_erc1820RegistryAddress);
        initialize1820InterfaceImplementations();
    }

    function onMarketFinalized() public {
        IMarket _market = IMarket(msg.sender);
        require(universe.isContainerForMarket(_market));

        uint256 _currentValidityBond = universe.getOrCacheValidityBond();
        uint256 _currentInitialReportBond = universe.getOrCacheDesignatedReportStake();
        uint256 _currentNoShowBond = universe.getOrCacheDesignatedReportNoShowBond();

        uint256 _validityBond = _market.getValidityBondAttoCash();
        uint256 _repBond = _market.getInitialReporter().getSize();

        if (_validityBond >= _currentValidityBond / 2) {
            validityBondTotal = validityBondTotal.add(_validityBond);
            if (_market.isInvalid()) {
                invalidMarketsTotal = invalidMarketsTotal.add(_validityBond);
            }
        }

        if (_repBond >= _currentInitialReportBond / 2) {
            initialReportBondTotal = initialReportBondTotal.add(_repBond);
            if (!_market.designatedReporterWasCorrect()) {
                incorrectDesignatedReportTotal = incorrectDesignatedReportTotal.add(_repBond);
            }
        }

        if (_repBond >= _currentNoShowBond / 2) {
            designatedReporterNoShowBondTotal = designatedReporterNoShowBondTotal.add(_repBond);
            if (!_market.designatedReporterShowed()) {
                designatedReportNoShowsTotal = designatedReportNoShowsTotal.add(_repBond);
            }
        }
    }

    /**
     * @notice Buy tokens which can be redeemed for reporting fees
     * @param _attotokens The number of tokens to purchase
     * @return bool True
     */
    function buy(uint256 _attotokens) public returns (bool) {
        require(_attotokens > 0, "DisputeWindow.buy: amount cannot be 0");
        require(isActive(), "DisputeWindow.buy: window is not active");
        require(!universe.isForking(), "DisputeWindow.buy: universe is forking");
        getReputationToken().trustedDisputeWindowTransfer(msg.sender, address(this), _attotokens);
        mint(msg.sender, _attotokens);
        return true;
    }

    /**
     * @notice Redeem tokens for reporting fees
     * @param _account The account to redeem tokens for
     * @return bool True
     */
    function redeem(address _account) public returns (bool) {
        require(isOver() || universe.isForking(), "DisputeWindow.redeem: window is not over");

        uint256 _attoParticipationTokens = balances[_account];

        if (_attoParticipationTokens == 0) {
            return true;
        }

        uint256 _cashBalance = cash.balanceOf(address(this));

        if (_cashBalance == 0) {
            return true;
        }

        uint256 _supply = totalSupply();

        // Burn tokens and send back REP
        burn(_account, _attoParticipationTokens);
        require(getReputationToken().transfer(_account, _attoParticipationTokens));

        // Pay out fees
        uint256 _feePayoutShare = _cashBalance.mul(_attoParticipationTokens).div(_supply);
        cash.transfer(_account, _feePayoutShare);

        augur.logParticipationTokensRedeemed(universe, _account, _attoParticipationTokens, _feePayoutShare);
        return true;
    }

    function getTypeName() public view returns (bytes32) {
        return "DisputeWindow";
    }

    /**
     * @return The universe associated with this window
     */
    function getUniverse() public view returns (IUniverse) {
        return universe;
    }

    /**
     * @return The reputation token associated with this window
     */
    function getReputationToken() public view returns (IReputationToken) {
        return universe.getReputationToken();
    }

    /**
     * @return When the window begins as a uint256 timestamp
     */
    function getStartTime() public view returns (uint256) {
        return startTime;
    }

    /**
     * @return When the window ends as a uint256 timestamp
     */
    function getEndTime() public view returns (uint256) {
        return getStartTime().add(duration);
    }

    function getWindowId() public view returns (uint256) {
        return windowId;
    }

    /**
     * @return Bool indicating if the window has begun and has not yet ended
     */
    function isActive() public view returns (bool) {
        if (augur.getTimestamp() <= getStartTime()) {
            return false;
        }
        if (augur.getTimestamp() >= getEndTime()) {
            return false;
        }
        return true;
    }

    /**
     * @return Bool indicating if the window has ended
     */
    function isOver() public view returns (bool) {
        return augur.getTimestamp() >= getEndTime();
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {
        augur.logParticipationTokensTransferred(universe, _from, _to, _value, balances[_from], balances[_to]);
    }

    function onMint(address _target, uint256 _amount) internal {
        augur.logParticipationTokensMinted(universe, _target, _amount, totalSupply(), balances[_target]);
    }

    function onBurn(address _target, uint256 _amount) internal {
        augur.logParticipationTokensBurned(universe, _target, _amount, totalSupply(), balances[_target]);
    }
}
