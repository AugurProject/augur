pragma solidity 0.5.4;

import 'ROOT/reporting/IAuction.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';
import 'ROOT/reporting/IReputationToken.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/reporting/Reporting.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/reporting/IAuctionToken.sol';
import 'ROOT/factories/AuctionTokenFactory.sol';


contract Auction is Initializable, IAuction {
    using SafeMathUint256 for uint256;

    enum RoundType {
        DORMANT_1,
        DORMANT_2,
        UNRECORDED,
        DORMANT_3,
        DORMANT_4,
        DORMANT_5,
        RECORDED
    }

    IAugur public augur;
    IUniverse private universe;
    IV2ReputationToken private reputationToken;
    ICash public cash;
    AuctionTokenFactory public auctionTokenFactory;

    bool public bootstrapMode; // Indicates the auction is currently bootstrapping by selling off minted REP to get CASH for the CASH auction
    bool public bootstrapped; // Records that a bootstrap initialization occurred. We can turn bootstrapping off if this has happened before.
    uint256 public initializationTime; // The time this contract was uploaded and initialized. The auction cadence is relative to this time

    uint256 public feeBalance; // The CASH this contract has received in fees.
    uint256 public currentAuctionIndex; // The current auction index. Indicies starts at 0 relative to epoch where each week has 2
    RoundType public currentRoundType; // The current auction type.
    uint256 public initialAttoRepBalance; // The initial REP balance in attoREP considered for the current auction
    uint256 public initialAttoCashBalance; // The initial CASH balance in attoCASH considered for the current auction
    uint256 public initialRepSalePrice; // The initial price of REP in attoCASH for the current auction
    uint256 public initialCashSalePrice; // The initial price of CASH in attoREP for the current auction
    uint256 public lastRepPrice; // The last auction's Rep price in attoCASH, regardless of whether the result is used in determining reporting fees
    uint256 public repPrice; // The Rep price in attoCASH that should be used to determine reporting fees during and immediately after an ignored auction.

    function initialize(IAugur _augur, IUniverse _universe, IV2ReputationToken _reputationToken) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        universe = _universe;
        reputationToken = IV2ReputationToken(_reputationToken);
        cash = ICash(augur.lookup("Cash"));
        auctionTokenFactory = AuctionTokenFactory(augur.lookup("AuctionTokenFactory"));
        initializationTime = augur.getTimestamp();
        uint256 _initialRepPriceInAttoCash = Reporting.getAuctionInitialRepPrice();
        lastRepPrice = _initialRepPriceInAttoCash;
        repPrice = _initialRepPriceInAttoCash;
        bootstrapMode = true;
        return true;
    }

    function initializeNewAuction() public returns (bool) {
        uint256 _derivedRepPrice = getDerivedRepPriceInAttoCash();
        if (currentRoundType == RoundType.RECORDED) {
            repPrice = _derivedRepPrice;
        }
        lastRepPrice = _derivedRepPrice;
        currentRoundType = getRoundType();
        uint256 _currentAuctionIndex = getAuctionIndexForCurrentTime();
        require(currentRoundType == RoundType.UNRECORDED || currentRoundType == RoundType.RECORDED);
        require(currentAuctionIndex != _currentAuctionIndex);
        if (bootstrapped) {
            bootstrapMode = false;
        }
        require(!bootstrapMode || currentRoundType == RoundType.UNRECORDED);
        bootstrapped = true;

        // Get any funds from the previously participated in auction that are set to be distributed
        if (repAuctionToken != IAuctionToken(0)) {
            repAuctionToken.retrieveFunds();
        }
        if (cashAuctionToken != IAuctionToken(0)) {
            cashAuctionToken.retrieveFunds();
        }

        uint256 _auctionRepBalanceTarget = reputationToken.totalSupply() / Reporting.getAuctionTargetSupplyDivisor();
        uint256 _repBalance = reputationToken.balanceOf(address(this));

        if (_repBalance < _auctionRepBalanceTarget) {
            reputationToken.mintForAuction(_auctionRepBalanceTarget.sub(_repBalance));
        }

        initialAttoRepBalance = reputationToken.balanceOf(address(this));
        initialAttoCashBalance = cash.balanceOf(address(this));

        currentAuctionIndex = _currentAuctionIndex;

        initialRepSalePrice = lastRepPrice.mul(Reporting.getAuctionInitialPriceMultiplier());
        initialCashSalePrice = Reporting.getAuctionInitialPriceMultiplier().mul(10**36).div(lastRepPrice);

        // Create and fund Tokens
        repAuctionToken = auctionTokenFactory.createAuctionToken(augur, this, reputationToken, currentAuctionIndex);
        if (!bootstrapMode) {
            cashAuctionToken = auctionTokenFactory.createAuctionToken(augur, this, cash, currentAuctionIndex);
            cash.transfer(address(cashAuctionToken), initialAttoCashBalance);
        }
        augur.recordAuctionTokens(universe);

        reputationToken.transfer(address(repAuctionToken), initialAttoRepBalance);
        return true;
    }

    function initializeNewAuctionIfNeeded() private returns (bool) {
        if (currentAuctionIndex != getAuctionIndexForCurrentTime()) {
            initializeNewAuction();
        }
        return true;
    }

    function tradeRepForCash(uint256 _attoCashAmount) public returns (bool) {
        initializeNewAuctionIfNeeded();
        require(!bootstrapMode);
        uint256 _currentAttoCashBalance = getCurrentAttoCashBalance();
        require(_currentAttoCashBalance > 0);
        require(_attoCashAmount > 0);
        _attoCashAmount = _attoCashAmount.min(_currentAttoCashBalance);
        uint256 _cashPriceInAttoRep = getCashSalePriceInAttoRep();
        uint256 _attoRepCost = _attoCashAmount.mul(_cashPriceInAttoRep) / 10**18;
        reputationToken.trustedAuctionTransfer(msg.sender, address(this), _attoRepCost);
        cashAuctionToken.mintForPurchaser(msg.sender, _attoRepCost);
        return true;
    }

    function tradeCashForRep(uint256 _attoRepAmount) public payable returns (bool) {
        initializeNewAuctionIfNeeded();
        uint256 _currentAttoRepBalance = getCurrentAttoRepBalance();
        require(_currentAttoRepBalance > 0);
        require(_attoRepAmount > 0);
        _attoRepAmount = _attoRepAmount.min(_currentAttoRepBalance);
        uint256 _repPriceInAttoCash = getRepSalePriceInAttoCash();
        uint256 _attoCashCost = _attoRepAmount.mul(_repPriceInAttoCash) / 10**18;
        // This will raise an exception if insufficient CASH was sent
        augur.trustedTransfer(cash, msg.sender, address(this), _attoCashCost);
        repAuctionToken.mintForPurchaser(msg.sender, _attoCashCost);
        return true;
    }

    function getRepSalePriceInAttoCash() public returns (uint256) {
        initializeNewAuctionIfNeeded();
        uint256 _timePassed = augur.getTimestamp().sub(initializationTime).sub(currentAuctionIndex * 1 days);
        uint256 _priceDecrease = initialRepSalePrice.mul(_timePassed) / Reporting.getAuctionDuration();
        return initialRepSalePrice.sub(_priceDecrease);
    }

    function getCashSalePriceInAttoRep() public returns (uint256) {
        initializeNewAuctionIfNeeded();
        require(!bootstrapMode);
        uint256 _timePassed = augur.getTimestamp().sub(initializationTime).sub(currentAuctionIndex * 1 days);
        uint256 _priceDecrease = initialCashSalePrice.mul(_timePassed) / Reporting.getAuctionDuration();
        return initialCashSalePrice.sub(_priceDecrease);
    }

    function getCurrentAttoRepBalance() public returns (uint256) {
        uint256 _repSalePriceInAttoCash = getRepSalePriceInAttoCash();
        uint256 _cashSupply = repAuctionToken.maxSupply();
        uint256 _attoRepSold = _cashSupply.mul(10**18).div(_repSalePriceInAttoCash);
        if (_attoRepSold >= initialAttoRepBalance) {
            return 0;
        }
        return initialAttoRepBalance.sub(_attoRepSold);
    }

    function getCurrentAttoCashBalance() public returns (uint256) {
        uint256 _cashSalePriceInAttoRep = getCashSalePriceInAttoRep();
        uint256 _repSupply = cashAuctionToken.maxSupply();
        uint256 _attoCashSold = _repSupply.mul(10**18).div(_cashSalePriceInAttoRep);
        if (_attoCashSold >= initialAttoCashBalance) {
            return 0;
        }
        return initialAttoCashBalance.sub(_attoCashSold);
    }

    function auctionOver(IAuctionToken _auctionToken) public returns (bool) {
        if (_auctionToken == repAuctionToken) {
            return getCurrentAttoRepBalance() == 0;
        } else if (_auctionToken == cashAuctionToken) {
            return getCurrentAttoCashBalance() == 0;
        }
        return true;
    }

    function getDerivedRepPriceInAttoCash() public view returns (uint256) {
        if (repAuctionToken == IAuctionToken(0) || cashAuctionToken == IAuctionToken(0)) {
            return repPrice;
        }
        uint256 _repAuctionTokenMaxSupply = repAuctionToken.maxSupply();
        uint256 _cashAuctionTokenMaxSupply = cashAuctionToken.maxSupply();
        if (_repAuctionTokenMaxSupply == 0 || _cashAuctionTokenMaxSupply == 0) {
            return repPrice;
        }
        uint256 _upperBoundRepPrice = repAuctionToken.maxSupply().mul(10**18).div(initialAttoRepBalance);
        uint256 _lowerBoundRepPrice = initialAttoCashBalance.mul(10**18).div(_cashAuctionTokenMaxSupply);
        return _upperBoundRepPrice.add(_lowerBoundRepPrice) / 2;
    }

    function getRepPriceInAttoCash() public view returns (uint256) {
        // If this auction is over and it is a recorded auction use the price it found
        if (getAuctionIndexForCurrentTime() != currentAuctionIndex && currentRoundType == RoundType.RECORDED) {
            return getDerivedRepPriceInAttoCash();
        }

        return repPrice;
    }

    function getAuctionIndexForCurrentTime() public view returns (uint256) {
        return augur.getTimestamp().sub(initializationTime) / Reporting.getAuctionDuration();
    }

    function isActive() public view returns (bool) {
        RoundType _roundType = getRoundType();
        return _roundType == RoundType.UNRECORDED || _roundType == RoundType.RECORDED;
    }

    function getRoundType() public view returns (RoundType) {
        uint256 _auctionDay = getAuctionIndexForCurrentTime() % 7;
        return RoundType(_auctionDay);
    }

    function getAuctionStartTime() public view returns (uint256) {
        uint256 _auctionIndex = getAuctionIndexForCurrentTime();
        uint256 _auctionDay = _auctionIndex % 7;
        uint256 _weekStart = initializationTime.add(_auctionIndex).sub(_auctionDay);
        uint256 _addedTime = _auctionDay > uint256(RoundType.UNRECORDED) ? uint256(RoundType.RECORDED) : uint256(RoundType.UNRECORDED);
        return _weekStart.add(_addedTime.mul(Reporting.getAuctionDuration()));
    }

    function getAuctionEndTime() public view returns (uint256) {
        uint256 _auctionIndex = getAuctionIndexForCurrentTime();
        uint256 _auctionDay = _auctionIndex % 7;
        uint256 _weekStart = initializationTime.add(_auctionIndex).sub(_auctionDay);
        uint256 _addedTime = _auctionDay > uint256(RoundType.UNRECORDED) ? uint256(RoundType.RECORDED) : uint256(RoundType.UNRECORDED);
        _addedTime += 1;
        return _weekStart.add(_addedTime.mul(Reporting.getAuctionDuration()));
    }

    function getUniverse() public view returns (IUniverse) {
        return universe;
    }

    function getReputationToken() public view returns (IReputationToken) {
        return IReputationToken(reputationToken);
    }
}
