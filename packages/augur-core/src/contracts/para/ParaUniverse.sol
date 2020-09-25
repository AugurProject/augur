pragma solidity 0.5.15;

import 'ROOT/para/interfaces/IParaAugur.sol';
import 'ROOT/para/interfaces/IFeePotFactory.sol';
import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/para/interfaces/IParaOICashFactory.sol';
import 'ROOT/para/interfaces/IOINexus.sol';
import 'ROOT/para/FeePot.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/para/interfaces/IParaOICash.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IRepOracle.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/reporting/IAffiliates.sol';
import 'ROOT/reporting/Reporting.sol';


contract ParaUniverse is Initializable, IParaUniverse {
    using SafeMathUint256 for uint256;

    uint256 private constant MIN_TIME_BETWEEN_REPORTING_FEE_RECALC = 3 days;
    address private constant NULL_ADDRESS = address(0);
    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    IParaAugur public augur;
    IRepOracle public repOracle;
    IUniverse public originUniverse;
    IParaShareToken public shareToken;
    ICash public cash;
    IAffiliates affiliates;
    IV2ReputationToken private reputationToken;
    IOINexus public OINexus;

    IParaOICash public openInterestCash;
    IFeePot public feePot;

    uint256 public totalBalance;
    uint256 private openInterestInAttoCash;

    mapping(address => uint256) public marketCreatorFeesAttoCash;

    uint256 public lastReportingFeeUpdateTimestamp;
    uint256 public currentReportingFeeDivisor;

    mapping(address => uint256) public marketBalance;
    mapping (address => bool) public marketFinalized;

    function initialize(IParaAugur _augur, IUniverse _originUniverse) external beforeInitialized {
        endInitialization();
        augur = _augur;
        originUniverse = _originUniverse;
        reputationToken = _originUniverse.getReputationToken();
        feePot = IFeePotFactory(_augur.lookup("FeePotFactory")).createFeePot(_augur);
        openInterestCash = IParaOICashFactory(_augur.lookup("ParaOICashFactory")).createParaOICash(_augur);
        shareToken = IParaShareToken(_augur.lookup("ShareToken"));
        repOracle = IRepOracle(_augur.lookup("ParaRepOracle"));
        cash = ICash(_augur.lookup("Cash"));
        affiliates = IAffiliates(_augur.lookup("Affiliates"));
        OINexus = IOINexus(_augur.lookup("OINexus"));

        cash.approve(address(feePot), MAX_APPROVAL_AMOUNT);
    }

    /**
     * @return The OI Cash contract
     */
    function isOpenInterestCash(address _address) external view returns (bool) {
        return _address == address(openInterestCash);
    }

    function getReputationToken() external view returns (IV2ReputationToken) {
        return originUniverse.getReputationToken();
    }

    function getFeePot() external view returns (IFeePot) {
        return feePot;
    }

    function setOrigin(IUniverse _originUniverse) external {
        IParaAugur _augur = augur;
        require(msg.sender == address(_augur));
        originUniverse = _originUniverse;
        reputationToken = _originUniverse.getReputationToken();
        feePot = IFeePotFactory(_augur.lookup("FeePotFactory")).createFeePot(_augur);
        cash.approve(address(feePot), MAX_APPROVAL_AMOUNT);
        openInterestCash.approveFeePot();
    }

    function deposit(address _sender, uint256 _amount, address _market) external returns (bool) {
        require(msg.sender == address(shareToken) || msg.sender == _sender || msg.sender == address(openInterestCash));
        augur.trustedCashTransfer(_sender, address(this), _amount);
        totalBalance = totalBalance.add(_amount);
        marketBalance[_market] = marketBalance[_market].add(_amount);
        return true;
    }

    function withdraw(address _recipient, uint256 _amount, address _market) public returns (bool) {
        if (_amount == 0) {
            return true;
        }
        require(msg.sender == address(shareToken) || augur.isKnownMarket(IMarket(msg.sender)) || msg.sender == address(openInterestCash));
        totalBalance = totalBalance.sub(_amount);
        marketBalance[_market] = marketBalance[_market].sub(_amount);
        require(cash.transfer(_recipient, _amount));
        return true;
    }

    function decrementOpenInterest(uint256 _amount) external returns (bool) {
        require(msg.sender == address(shareToken));
        openInterestInAttoCash = openInterestInAttoCash.sub(_amount);
        return true;
    }

    function incrementOpenInterest(uint256 _amount) external returns (bool) {
        require(msg.sender == address(shareToken));
        openInterestInAttoCash = openInterestInAttoCash.add(_amount);
        return true;
    }

    /**
     * @return The total amount of Cash in the system which is at risk (Held in escrow for Shares)
     */
    function getOpenInterestInAttoCash() public view returns (uint256) {
        return openInterestInAttoCash;
    }

    function setMarketFinalized(IMarket _market, uint256 _totalSupply) external returns (bool) {
        require(msg.sender == address(shareToken));
        if (marketFinalized[address(_market)]) {
            return true;
        }
        marketFinalized[address(_market)] = true;
        uint256 _amount = _totalSupply.mul(_market.getNumTicks());
        openInterestInAttoCash = openInterestInAttoCash.sub(_amount);
        return true;
    }

    /**
     * @return The Market Cap of this Universe's REP
     */
    function pokeRepMarketCapInAttoCash() public returns (uint256) {
        uint256 _attoCashPerRep = repOracle.poke(address(reputationToken));
        return getRepMarketCapInAttoCashInternal(_attoCashPerRep);
    }

    function getRepMarketCapInAttoCashInternal(uint256 _attoCashPerRep) private view returns (uint256) {
        return reputationToken.getTotalTheoreticalSupply().mul(_attoCashPerRep).div(10 ** 18);
    }

    /**
     * @return The Target Market Cap of this Universe's REP for use in calculating the Reporting Fee
     */
    function getTargetRepMarketCapInAttoCash() public view returns (uint256) {
        // Target MCAP = OI * TARGET_MULTIPLIER
        uint256 _totalOI = openInterestCash.totalSupply().add(getOpenInterestInAttoCash());
        return _totalOI.mul(Reporting.getTargetRepMarketCapMultiplier());
    }

    /**
     * @dev this should be used in contracts so that the fee is actually set
     * @return The reporting fee for this window
     */
    function getOrCacheReportingFeeDivisor() external returns (uint256) {
        uint256 _currentFeeDivisor = getReportingFeeDivisor();
        uint256 _currentTime = augur.getTimestamp();
        if ((_currentTime - lastReportingFeeUpdateTimestamp) < MIN_TIME_BETWEEN_REPORTING_FEE_RECALC) {
            return _currentFeeDivisor;
        }

        _currentFeeDivisor = calculateReportingFeeDivisorInternal();

        currentReportingFeeDivisor = _currentFeeDivisor;
        augur.logReportingFeeChanged(_currentFeeDivisor);
        return _currentFeeDivisor;
    }

    /**
     * @dev this should be used for estimation purposes as it is a view and does not actually freeze or recalculate the rate
     * @return The reporting fee for this dispute window
     */
    function getReportingFeeDivisor() public view returns (uint256) {
        if (currentReportingFeeDivisor != 0) {
            return currentReportingFeeDivisor;
        }

        return Reporting.getDefaultReportingFeeDivisor();
    }

    function calculateReportingFeeDivisorInternal() private returns (uint256) {
        uint256 _repMarketCapInAttoCash = pokeRepMarketCapInAttoCash();
        uint256 _targetRepMarketCapInAttoCash = getTargetRepMarketCapInAttoCash();
        uint256 _reportingFeeDivisor = OINexus.recordParaUniverseValuesAndUpdateReportingFee(originUniverse, _targetRepMarketCapInAttoCash, _repMarketCapInAttoCash);

        return _reportingFeeDivisor;
    }

    function getMarketOpenInterest(IMarket _market) external view returns (uint256) {
        if (_market.isFinalized()) {
            return 0;
        }
        uint256 _marketBalance = marketBalance[address(_market)];
        uint256 _marketCreatorFees = marketCreatorFeesAttoCash[address(_market)];
        if (_marketCreatorFees > _marketBalance) {
            return 0;
        }
        return _marketBalance.sub(_marketCreatorFees);
    }

    function recordMarketCreatorFees(IMarket _market, uint256 _marketCreatorFees, address _sourceAccount) public returns (bool) {
        require(msg.sender == address(shareToken));

        uint256 _affiliateFeeDivisor = _market.affiliateFeeDivisor();

        address _affiliateAddress = affiliates.getAndValidateReferrer(_sourceAccount, IAffiliateValidator(NULL_ADDRESS));

        if (_affiliateAddress != NULL_ADDRESS && _affiliateFeeDivisor != 0) {
            uint256 _totalAffiliateFees = _marketCreatorFees / _affiliateFeeDivisor;
            uint256 _sourceCut = _totalAffiliateFees / Reporting.getAffiliateSourceCutDivisor();
            uint256 _affiliateFees = _totalAffiliateFees.sub(_sourceCut);
            withdraw(_sourceAccount, _sourceCut, address(_market));
            distributeAffiliateFees(_market, _affiliateAddress, _affiliateFees);
            _marketCreatorFees = _marketCreatorFees.sub(_totalAffiliateFees);
        }

        marketCreatorFeesAttoCash[address(_market)] = marketCreatorFeesAttoCash[address(_market)].add(_marketCreatorFees);

        if (_market.isFinalized()) {
            distributeMarketCreatorFees(_market);
        }
    }

    function distributeMarketCreatorFees(IMarket _market) private {
        uint256 _marketCreatorFeesAttoCash = marketCreatorFeesAttoCash[address(_market)];
        marketCreatorFeesAttoCash[address(_market)] = 0;
        if (!_market.isFinalizedAsInvalid()) {
            withdraw(_market.getOwner(), _marketCreatorFeesAttoCash, address(_market));
        } else {
            withdraw(address(this), _marketCreatorFeesAttoCash, address(_market));
            feePot.depositFees(_marketCreatorFeesAttoCash);
        }
    }

    function distributeAffiliateFees(IMarket _market, address _affiliate, uint256 _affiliateBalance) private returns (bool) {
        if (_affiliateBalance == 0) {
            return true;
        }
        if (_market.isFinalized() && _market.isFinalizedAsInvalid()) {
            withdraw(address(this), _affiliateBalance, address(_market));
            feePot.depositFees(_affiliateBalance);
        } else {
            withdraw(_affiliate, _affiliateBalance, address(_market));
        }
        return true;
    }

    function getForkingMarket() public view returns (IMarket) {
        return originUniverse.getForkingMarket();
    }

    function getDisputeThresholdForDisputePacing() public view returns (uint256) {
        return originUniverse.getDisputeThresholdForDisputePacing();
    }

    function getOrCacheDesignatedReportStake() public returns (uint256) {
        return originUniverse.getOrCacheDesignatedReportStake();
    }

    function runPeriodicals() external returns (bool) {
        return originUniverse.runPeriodicals();
    }

    function createYesNoMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, string memory _extraInfo) public returns (IMarket _newMarket) {
        return originUniverse.createYesNoMarket(_endTime, _feePerCashInAttoCash, _affiliateValidator, _affiliateFeeDivisor, _designatedReporterAddress, _extraInfo);
    }

    function createCategoricalMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, bytes32[] memory _outcomes, string memory _extraInfo) public returns (IMarket _newMarket) {
        return originUniverse.createCategoricalMarket(_endTime, _feePerCashInAttoCash, _affiliateValidator, _affiliateFeeDivisor, _designatedReporterAddress, _outcomes, _extraInfo);
    }

    function createScalarMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, IAffiliateValidator _affiliateValidator, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, int256[] memory _prices, uint256 _numTicks, string memory _extraInfo) public returns (IMarket _newMarket) {
        return originUniverse.createScalarMarket(_endTime, _feePerCashInAttoCash, _affiliateValidator, _affiliateFeeDivisor, _designatedReporterAddress, _prices, _numTicks, _extraInfo);
    }

    function getOrCacheValidityBond() public returns (uint256) {
        return originUniverse.getOrCacheValidityBond();
    }

    function getOrCacheMarketRepBond() public returns (uint256) {
        return originUniverse.getOrCacheMarketRepBond();
    }
}
