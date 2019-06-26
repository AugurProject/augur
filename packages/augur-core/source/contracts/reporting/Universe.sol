pragma solidity 0.5.4;


import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/libraries/ITyped.sol';
import 'ROOT/factories/IReputationTokenFactory.sol';
import 'ROOT/factories/IDisputeWindowFactory.sol';
import 'ROOT/factories/IMarketFactory.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/reporting/Reporting.sol';
import 'ROOT/reporting/IRepPriceOracle.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/IAugur.sol';


contract Universe is ITyped, IUniverse {
    using SafeMathUint256 for uint256;

    IAugur public augur;
    IUniverse private parentUniverse;
    IRepPriceOracle public repPriceOracle;
    bytes32 private parentPayoutDistributionHash;
    uint256[] public payoutNumerators;
    IV2ReputationToken private reputationToken;
    IMarket private forkingMarket;
    bytes32 private tentativeWinningChildUniversePayoutDistributionHash;
    uint256 private forkEndTime;
    uint256 private forkReputationGoal;
    uint256 private disputeThresholdForFork;
    uint256 private disputeThresholdForDisputePacing;
    uint256 private initialReportMinValue;
    mapping(uint256 => IDisputeWindow) private disputeWindows;
    mapping(address => bool) private markets;
    mapping(bytes32 => IUniverse) private childUniverses;
    uint256 private openInterestInAttoCash;
    IMarketFactory public marketFactory;
    IDisputeWindowFactory public disputeWindowFactory;

    mapping (address => uint256) private validityBondInAttoCash;
    mapping (address => uint256) private designatedReportStakeInAttoRep;
    mapping (address => uint256) private designatedReportNoShowBondInAttoRep;
    uint256 public previousValidityBondInAttoCash;
    uint256 public previousDesignatedReportStakeInAttoRep;
    uint256 public previousDesignatedReportNoShowBondInAttoRep;

    mapping (address => uint256) private shareSettlementFeeDivisor;
    uint256 public previousReportingFeeDivisor;

    address public completeSets;

    uint256 constant public INITIAL_WINDOW_ID_BUFFER = 365 days * 10 ** 8;

    constructor(IAugur _augur, IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] memory _payoutNumerators) public {
        augur = _augur;
        parentUniverse = _parentUniverse;
        parentPayoutDistributionHash = _parentPayoutDistributionHash;
        payoutNumerators = _payoutNumerators;
        reputationToken = IReputationTokenFactory(augur.lookup("ReputationTokenFactory")).createReputationToken(augur, this, parentUniverse);
        marketFactory = IMarketFactory(augur.lookup("MarketFactory"));
        disputeWindowFactory = IDisputeWindowFactory(augur.lookup("DisputeWindowFactory"));
        completeSets = augur.lookup("CompleteSets");
        repPriceOracle = IRepPriceOracle(augur.lookup("RepPriceOracle"));
        updateForkValues();
        previousValidityBondInAttoCash = Reporting.getDefaultValidityBond();
        previousDesignatedReportStakeInAttoRep = initialReportMinValue;
        previousDesignatedReportNoShowBondInAttoRep = initialReportMinValue;
    }

    function fork() public returns (bool) {
        updateForkValues();
        require(!isForking());
        require(isContainerForMarket(IMarket(msg.sender)));
        forkingMarket = IMarket(msg.sender);
        forkEndTime = augur.getTimestamp().add(Reporting.getForkDurationSeconds());
        augur.logUniverseForked(forkingMarket);
        return true;
    }

    function updateForkValues() public returns (bool) {
        require(!isForking());
        uint256 _totalRepSupply = reputationToken.getTotalTheoreticalSupply();
        forkReputationGoal = _totalRepSupply.div(2); // 50% of REP migrating results in a victory in a fork
        disputeThresholdForFork = _totalRepSupply.div(40); // 2.5% of the total rep supply
        initialReportMinValue = disputeThresholdForFork.div(3).div(2**18).add(1); // This value will result in a maximum 20 round dispute sequence
        disputeThresholdForDisputePacing = disputeThresholdForFork.div(2**9); // Disputes begin normal pacing once there are 8 rounds remaining in the fastest case to fork. The "last" round is the one that causes a fork and requires no time so the exponent here is 9 to provide for that many rounds actually occuring.
        return true;
    }

    function getTypeName() public view returns (bytes32) {
        return "Universe";
    }

    function getParentUniverse() public view returns (IUniverse) {
        return parentUniverse;
    }

    function getParentPayoutDistributionHash() public view returns (bytes32) {
        return parentPayoutDistributionHash;
    }

    function getReputationToken() public view returns (IV2ReputationToken) {
        return reputationToken;
    }

    function getForkingMarket() public view returns (IMarket) {
        return forkingMarket;
    }

    function getForkEndTime() public view returns (uint256) {
        return forkEndTime;
    }

    function getForkReputationGoal() public view returns (uint256) {
        return forkReputationGoal;
    }

    function getDisputeThresholdForFork() public view returns (uint256) {
        return disputeThresholdForFork;
    }

    function getDisputeThresholdForDisputePacing() public view returns (uint256) {
        return disputeThresholdForDisputePacing;
    }

    function getInitialReportMinValue() public view returns (uint256) {
        return initialReportMinValue;
    }

    function getPayoutNumerators() public view returns (uint256[] memory) {
        return payoutNumerators;
    }

    function getDisputeWindow(uint256 _disputeWindowId) public view returns (IDisputeWindow) {
        return disputeWindows[_disputeWindowId];
    }

    function isForking() public view returns (bool) {
        return forkingMarket != IMarket(0);
    }

    function getChildUniverse(bytes32 _parentPayoutDistributionHash) public view returns (IUniverse) {
        return childUniverses[_parentPayoutDistributionHash];
    }

    function getDisputeWindowId(uint256 _timestamp, bool _initial) public view returns (uint256) {
        uint256 _windowId = _timestamp.div(getDisputeRoundDurationInSeconds(_initial));
        if (_initial) {
            _windowId += INITIAL_WINDOW_ID_BUFFER;
        }
        return _windowId;
    }

    function getDisputeRoundDurationInSeconds(bool _initial) public view returns (uint256) {
        return _initial ? Reporting.getInitialDisputeRoundDurationSeconds() : Reporting.getDisputeRoundDurationSeconds();
    }

    function getOrCreateDisputeWindowByTimestamp(uint256 _timestamp, bool _initial) public returns (IDisputeWindow) {
        uint256 _windowId = getDisputeWindowId(_timestamp, _initial);
        if (disputeWindows[_windowId] == IDisputeWindow(0)) {
            uint256 _duration = getDisputeRoundDurationInSeconds(_initial);
            uint256 _startTime = _timestamp.div(_duration).mul(_duration);
            IDisputeWindow _disputeWindow = disputeWindowFactory.createDisputeWindow(augur, this, _windowId, _duration, _startTime);
            disputeWindows[_windowId] = _disputeWindow;
            augur.logDisputeWindowCreated(_disputeWindow, _windowId, _initial);
        }
        return disputeWindows[_windowId];
    }

    function getDisputeWindowByTimestamp(uint256 _timestamp, bool _initial) public view returns (IDisputeWindow) {
        uint256 _windowId = getDisputeWindowId(_timestamp, _initial);
        return disputeWindows[_windowId];
    }

    function getOrCreatePreviousPreviousDisputeWindow(bool _initial) public returns (IDisputeWindow) {
        return getOrCreateDisputeWindowByTimestamp(augur.getTimestamp().sub(getDisputeRoundDurationInSeconds(_initial).mul(2)), _initial);
    }

    function getOrCreatePreviousDisputeWindow(bool _initial) public returns (IDisputeWindow) {
        return getOrCreateDisputeWindowByTimestamp(augur.getTimestamp().sub(getDisputeRoundDurationInSeconds(_initial)), _initial);
    }

    function getPreviousDisputeWindow(bool _initial) public view returns (IDisputeWindow) {
        return getDisputeWindowByTimestamp(augur.getTimestamp().sub(getDisputeRoundDurationInSeconds(_initial)), _initial);
    }

    function getOrCreateCurrentDisputeWindow(bool _initial) public returns (IDisputeWindow) {
        return getOrCreateDisputeWindowByTimestamp(augur.getTimestamp(), _initial);
    }

    function getCurrentDisputeWindow(bool _initial) public view returns (IDisputeWindow) {
        return getDisputeWindowByTimestamp(augur.getTimestamp(), _initial);
    }

    function getOrCreateNextDisputeWindow(bool _initial) public returns (IDisputeWindow) {
        return getOrCreateDisputeWindowByTimestamp(augur.getTimestamp().add(getDisputeRoundDurationInSeconds(_initial)), _initial);
    }

    function getNextDisputeWindow(bool _initial) public view returns (IDisputeWindow) {
        return getDisputeWindowByTimestamp(augur.getTimestamp().add(getDisputeRoundDurationInSeconds(_initial)), _initial);
    }

    function createChildUniverse(uint256[] memory _parentPayoutNumerators) public returns (IUniverse) {
        bytes32 _parentPayoutDistributionHash = forkingMarket.derivePayoutDistributionHash(_parentPayoutNumerators);
        IUniverse _childUniverse = getChildUniverse(_parentPayoutDistributionHash);
        if (_childUniverse == IUniverse(0)) {
            _childUniverse = augur.createChildUniverse(_parentPayoutDistributionHash, _parentPayoutNumerators);
            childUniverses[_parentPayoutDistributionHash] = _childUniverse;
        }
        return _childUniverse;
    }

    function updateTentativeWinningChildUniverse(bytes32 _parentPayoutDistributionHash) public returns (bool) {
        IUniverse _tentativeWinningUniverse = getChildUniverse(tentativeWinningChildUniversePayoutDistributionHash);
        IUniverse _updatedUniverse = getChildUniverse(_parentPayoutDistributionHash);
        uint256 _currentTentativeWinningChildUniverseRepMigrated = 0;
        if (_tentativeWinningUniverse != IUniverse(0)) {
            _currentTentativeWinningChildUniverseRepMigrated = _tentativeWinningUniverse.getReputationToken().getTotalMigrated();
        }
        uint256 _updatedUniverseRepMigrated = _updatedUniverse.getReputationToken().getTotalMigrated();
        if (_updatedUniverseRepMigrated > _currentTentativeWinningChildUniverseRepMigrated) {
            tentativeWinningChildUniversePayoutDistributionHash = _parentPayoutDistributionHash;
        }
        if (_updatedUniverseRepMigrated >= forkReputationGoal) {
            forkingMarket.finalize();
        }
        return true;
    }

    function getWinningChildUniverse() public view returns (IUniverse) {
        require(isForking());
        require(tentativeWinningChildUniversePayoutDistributionHash != bytes32(0));
        IUniverse _tentativeWinningUniverse = getChildUniverse(tentativeWinningChildUniversePayoutDistributionHash);
        uint256 _winningAmount = _tentativeWinningUniverse.getReputationToken().getTotalMigrated();
        require(_winningAmount >= forkReputationGoal || augur.getTimestamp() > forkEndTime);
        return _tentativeWinningUniverse;
    }

    function isContainerForDisputeWindow(IDisputeWindow _shadyDisputeWindow) public view returns (bool) {
        uint256 _disputeWindowId = _shadyDisputeWindow.getWindowId();
        IDisputeWindow _legitDisputeWindow = disputeWindows[_disputeWindowId];
        return _shadyDisputeWindow == _legitDisputeWindow;
    }

    function isContainerForMarket(IMarket _shadyMarket) public view returns (bool) {
        return markets[address(_shadyMarket)];
    }

    function addMarketTo() public returns (bool) {
        require(parentUniverse.isContainerForMarket(IMarket(msg.sender)));
        markets[msg.sender] = true;
        augur.logMarketMigrated(IMarket(msg.sender), parentUniverse);
        return true;
    }

    function removeMarketFrom() public returns (bool) {
        require(isContainerForMarket(IMarket(msg.sender)));
        markets[msg.sender] = false;
        return true;
    }

    function isContainerForShareToken(IShareToken _shadyShareToken) public view returns (bool) {
        IMarket _shadyMarket = _shadyShareToken.getMarket();
        if (_shadyMarket == IMarket(0)) {
            return false;
        }
        if (!isContainerForMarket(_shadyMarket)) {
            return false;
        }
        IMarket _legitMarket = _shadyMarket;
        return _legitMarket.isContainerForShareToken(_shadyShareToken);
    }

    function isContainerForReportingParticipant(IReportingParticipant _shadyReportingParticipant) public view returns (bool) {
        IMarket _shadyMarket = _shadyReportingParticipant.getMarket();
        if (_shadyMarket == IMarket(0)) {
            return false;
        }
        if (!isContainerForMarket(_shadyMarket)) {
            return false;
        }
        IMarket _legitMarket = _shadyMarket;
        return _legitMarket.isContainerForReportingParticipant(_shadyReportingParticipant);
    }

    function isParentOf(IUniverse _shadyChild) public view returns (bool) {
        bytes32 _parentPayoutDistributionHash = _shadyChild.getParentPayoutDistributionHash();
        return getChildUniverse(_parentPayoutDistributionHash) == _shadyChild;
    }

    function decrementOpenInterest(uint256 _amount) public returns (bool) {
        require(msg.sender == completeSets);
        openInterestInAttoCash = openInterestInAttoCash.sub(_amount);
        return true;
    }

    function decrementOpenInterestFromMarket(IMarket _market) public returns (bool) {
        require(isContainerForMarket(IMarket(msg.sender)));
        uint256 _amount = _market.getShareToken(0).totalSupply().mul(_market.getNumTicks());
        openInterestInAttoCash = openInterestInAttoCash.sub(_amount);
        return true;
    }

    function incrementOpenInterest(uint256 _amount) public returns (bool) {
        require(msg.sender == completeSets);
        openInterestInAttoCash = openInterestInAttoCash.add(_amount);
        return true;
    }

    function incrementOpenInterestFromMarket(IMarket _market) public returns (bool) {
        require(isContainerForMarket(IMarket(msg.sender)));
        uint256 _amount = _market.getShareToken(0).totalSupply().mul(_market.getNumTicks());
        openInterestInAttoCash = openInterestInAttoCash.add(_amount);
        return true;
    }

    function getOpenInterestInAttoCash() public view returns (uint256) {
        return openInterestInAttoCash;
    }

    function getRepMarketCapInAttoCash() public view returns (uint256) {
        uint256 _attoCashPerRep = repPriceOracle.getRepPriceInAttoCash();
        uint256 _repMarketCapInAttoCash = getReputationToken().totalSupply().mul(_attoCashPerRep).div(10 ** 18);
        return _repMarketCapInAttoCash;
    }

    function getTargetRepMarketCapInAttoCash() public view returns (uint256) {
        return getOpenInterestInAttoCash().mul(Reporting.getTargetRepMarketCapMultiplier()).div(Reporting.getTargetRepMarketCapDivisor());
    }

    function getOrCacheValidityBond() public returns (uint256) {
        IDisputeWindow _disputeWindow = getOrCreateCurrentDisputeWindow(false);
        IDisputeWindow  _previousDisputeWindow = getOrCreatePreviousPreviousDisputeWindow(false);
        uint256 _currentValidityBondInAttoCash = validityBondInAttoCash[address(_disputeWindow)];
        if (_currentValidityBondInAttoCash != 0) {
            return _currentValidityBondInAttoCash;
        }
        uint256 _totalValidityBondsInPreviousWindow = _previousDisputeWindow.validityBondTotal();
        uint256 _invalidBondsInPreviousWindow = _previousDisputeWindow.invalidMarketsTotal();
        _currentValidityBondInAttoCash = calculateFloatingValue(_invalidBondsInPreviousWindow, _totalValidityBondsInPreviousWindow, Reporting.getTargetInvalidMarketsDivisor(), previousValidityBondInAttoCash, Reporting.getValidityBondFloor());
        validityBondInAttoCash[address(_disputeWindow)] = _currentValidityBondInAttoCash;
        previousValidityBondInAttoCash = _currentValidityBondInAttoCash;
        return _currentValidityBondInAttoCash;
    }

    function getOrCacheDesignatedReportStake() public returns (uint256) {
        updateForkValues();
        IDisputeWindow _disputeWindow = getOrCreateCurrentDisputeWindow(false);
        IDisputeWindow _previousDisputeWindow = getOrCreatePreviousPreviousDisputeWindow(false);
        uint256 _currentDesignatedReportStakeInAttoRep = designatedReportStakeInAttoRep[address(_disputeWindow)];
        if (_currentDesignatedReportStakeInAttoRep != 0) {
            return _currentDesignatedReportStakeInAttoRep;
        }
        uint256 _totalInitialReportBondsInPreviousWindow = _previousDisputeWindow.initialReportBondTotal();
        uint256 _incorrectDesignatedReportBondsInPreviousWindow = _previousDisputeWindow.incorrectDesignatedReportTotal();

        _currentDesignatedReportStakeInAttoRep = calculateFloatingValue(_incorrectDesignatedReportBondsInPreviousWindow, _totalInitialReportBondsInPreviousWindow, Reporting.getTargetIncorrectDesignatedReportMarketsDivisor(), previousDesignatedReportStakeInAttoRep, initialReportMinValue);
        designatedReportStakeInAttoRep[address(_disputeWindow)] = _currentDesignatedReportStakeInAttoRep;
        previousDesignatedReportStakeInAttoRep = _currentDesignatedReportStakeInAttoRep;
        return _currentDesignatedReportStakeInAttoRep;
    }

    function getOrCacheDesignatedReportNoShowBond() public returns (uint256) {
        IDisputeWindow _disputeWindow = getOrCreateCurrentDisputeWindow(false);
        IDisputeWindow _previousDisputeWindow = getOrCreatePreviousPreviousDisputeWindow(false);
        uint256 _currentDesignatedReportNoShowBondInAttoRep = designatedReportNoShowBondInAttoRep[address(_disputeWindow)];
        if (_currentDesignatedReportNoShowBondInAttoRep != 0) {
            return _currentDesignatedReportNoShowBondInAttoRep;
        }
        uint256 _totalNoShowBondsInPreviousWindow = _previousDisputeWindow.designatedReporterNoShowBondTotal();
        uint256 _designatedReportNoShowBondsInPreviousWindow = _previousDisputeWindow.designatedReportNoShowsTotal();

        _currentDesignatedReportNoShowBondInAttoRep = calculateFloatingValue(_designatedReportNoShowBondsInPreviousWindow, _totalNoShowBondsInPreviousWindow, Reporting.getTargetDesignatedReportNoShowsDivisor(), previousDesignatedReportNoShowBondInAttoRep, initialReportMinValue);
        designatedReportNoShowBondInAttoRep[address(_disputeWindow)] = _currentDesignatedReportNoShowBondInAttoRep;
        previousDesignatedReportNoShowBondInAttoRep = _currentDesignatedReportNoShowBondInAttoRep;
        return _currentDesignatedReportNoShowBondInAttoRep;
    }

    function getOrCacheMarketRepBond() public returns (uint256) {
        return getOrCacheDesignatedReportNoShowBond().max(getOrCacheDesignatedReportStake());
    }

    function calculateFloatingValue(uint256 _totalBad, uint256 _total, uint256 _targetDivisor, uint256 _previousValue, uint256 _floor) public pure returns (uint256 _newValue) {
        if (_total == 0) {
            return _previousValue;
        }

        // Modify the amount based on the previous amount and the number of markets fitting the failure criteria. We want the amount to be somewhere in the range of 0.9 to 2 times its previous value where ALL markets with the condition results in 2x and 0 results in 0.9x.
        // Safe math div is redundant so we avoid here as we're at the stack limit.
        if (_totalBad <= _total / _targetDivisor) {
            // FXP formula: previous_amount * actual_percent / (10 * target_percent) + 0.9;
            _newValue = _totalBad
                .mul(_previousValue)
                .mul(_targetDivisor);
            _newValue = _newValue / _total;
            _newValue = _newValue / 10;
            _newValue = _newValue.add(_previousValue * 9 / 10);
        } else {
            // FXP formula: previous_amount * (1/(1 - target_percent)) * (actual_percent - target_percent) + 1;
            _newValue = _targetDivisor
                .mul(_previousValue
                    .mul(_totalBad)
                    .div(_total)
                .sub(_previousValue / _targetDivisor));
            _newValue = _newValue / (_targetDivisor - 1);
            _newValue = _newValue.add(_previousValue);
        }
        _newValue = _newValue.max(_floor);

        return _newValue;
    }

    function getOrCacheReportingFeeDivisor() public returns (uint256) {
        IDisputeWindow _disputeWindow = getOrCreateCurrentDisputeWindow(false);
        uint256 _currentFeeDivisor = shareSettlementFeeDivisor[address(_disputeWindow)];
        if (_currentFeeDivisor != 0) {
            return _currentFeeDivisor;
        }

        _currentFeeDivisor = calculateReportingFeeDivisor();

        shareSettlementFeeDivisor[address(_disputeWindow)] = _currentFeeDivisor;
        previousReportingFeeDivisor = _currentFeeDivisor;
        return _currentFeeDivisor;
    }

    function getReportingFeeDivisor() public view returns (uint256) {
        IDisputeWindow _disputeWindow = getCurrentDisputeWindow(false);
        uint256 _currentFeeDivisor = shareSettlementFeeDivisor[address(_disputeWindow)];
        if (_currentFeeDivisor != 0) {
            return _currentFeeDivisor;
        }

        return calculateReportingFeeDivisor();
    }

    function calculateReportingFeeDivisor() public view returns (uint256) {
        uint256 _repMarketCapInAttoCash = getRepMarketCapInAttoCash();
        uint256 _targetRepMarketCapInAttoCash = getTargetRepMarketCapInAttoCash();
        uint256 _reportingFeeDivisor = 0;
        if (previousReportingFeeDivisor == 0) {
            _reportingFeeDivisor = Reporting.getDefaultReportingFeeDivisor();
        } else if (_targetRepMarketCapInAttoCash == 0) {
            _reportingFeeDivisor = Reporting.getDefaultReportingFeeDivisor();
        } else {
            _reportingFeeDivisor = previousReportingFeeDivisor.mul(_repMarketCapInAttoCash).div(_targetRepMarketCapInAttoCash);
        }

        _reportingFeeDivisor = _reportingFeeDivisor
            .max(Reporting.getMinimumReportingFeeDivisor())
            .min(Reporting.getMaximumReportingFeeDivisor());

        return _reportingFeeDivisor;
    }

    function getOrCacheMarketCreationCost() public returns (uint256) {
        return getOrCacheValidityBond();
    }

    function getInitialReportStakeSize() public returns (uint256) {
        return getOrCacheDesignatedReportNoShowBond().max(getOrCacheDesignatedReportStake());
    }

    function createYesNoMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, bytes32 _topic, string memory _extraInfo) public returns (IMarket _newMarket) {
        _newMarket = createMarketInternal(_endTime, _feePerCashInAttoCash, _affiliateFeeDivisor, _designatedReporterAddress, msg.sender, 2, 100);
        int256[] memory _prices = new int256[](2);
        _prices[0] = 0;
        _prices[1] = 1 ether;
        augur.logMarketCreated(_endTime, _topic, _extraInfo, _newMarket, msg.sender, _designatedReporterAddress, _feePerCashInAttoCash, _prices, IMarket.MarketType.YES_NO, 100);
        return _newMarket;
    }

    function createCategoricalMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, bytes32[] memory _outcomes, bytes32 _topic, string memory _extraInfo) public returns (IMarket _newMarket) {
        _newMarket = createMarketInternal(_endTime, _feePerCashInAttoCash, _affiliateFeeDivisor, _designatedReporterAddress, msg.sender, uint256(_outcomes.length), 100);
        int256[] memory _prices = new int256[](2);
        _prices[0] = 0;
        _prices[1] = 1 ether;
        augur.logMarketCreated(_endTime, _topic, _extraInfo, _newMarket, msg.sender, _designatedReporterAddress, _feePerCashInAttoCash, _prices, IMarket.MarketType.CATEGORICAL, _outcomes);
        return _newMarket;
    }

    function createScalarMarket(uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, int256[] memory _prices, uint256 _numTicks, bytes32 _topic, string memory _extraInfo) public returns (IMarket _newMarket) {
        require(_prices.length == 2);
        require(_prices[0] < _prices[1]);
        require(_numTicks.isMultipleOf(2));
        _newMarket = createMarketInternal(_endTime, _feePerCashInAttoCash, _affiliateFeeDivisor, _designatedReporterAddress, msg.sender, 2, _numTicks);
        augur.logMarketCreated(_endTime, _topic, _extraInfo, _newMarket, msg.sender, _designatedReporterAddress, _feePerCashInAttoCash, _prices, IMarket.MarketType.SCALAR, _numTicks);
        return _newMarket;
    }

    function createMarketInternal(uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks) private returns (IMarket _newMarket) {
        getReputationToken().trustedUniverseTransfer(_sender, address(marketFactory), getOrCacheMarketRepBond());
        _newMarket = marketFactory.createMarket(augur, this, _endTime, _feePerCashInAttoCash, _affiliateFeeDivisor, _designatedReporterAddress, _sender, _numOutcomes, _numTicks);
        markets[address(_newMarket)] = true;
        return _newMarket;
    }

    function redeemStake(IReportingParticipant[] memory _reportingParticipants, IDisputeWindow[] memory _disputeWindows) public returns (bool) {
        for (uint256 i=0; i < _reportingParticipants.length; i++) {
            _reportingParticipants[i].redeem(msg.sender);
        }
        for (uint256 i=0; i < _disputeWindows.length; i++) {
            _disputeWindows[i].redeem(msg.sender);
        }
        return true;
    }

    function assertMarketBalance() public view returns (bool) {
        IMarket _market = IMarket(msg.sender);
        // Escrowed funds for open orders
        uint256 _expectedBalance = IOrders(augur.lookup("Orders")).getTotalEscrowed(_market);
        // Market Open Interest. If we're finalized we need actually calculate the value
        if (_market.isFinalized()) {
            IReportingParticipant _winningReportingPartcipant = _market.getWinningReportingParticipant();
            for (uint256 i = 0; i < _market.getNumberOfOutcomes(); i++) {
                _expectedBalance = _expectedBalance.add(_market.getShareToken(i).totalSupply().mul(_winningReportingPartcipant.getPayoutNumerator(i)));
            }
        } else {
            _expectedBalance = _expectedBalance.add(_market.getShareToken(0).totalSupply().mul(_market.getNumTicks()));
        }

        assert(ICash(augur.lookup("Cash")).balanceOf(address(_market)) >= _expectedBalance);
        return true;
    }
}
