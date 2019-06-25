pragma solidity 0.5.4;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/Ownable.sol';
import 'ROOT/libraries/collections/Map.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IReportingParticipant.sol';
import 'ROOT/reporting/IDisputeCrowdsourcer.sol';
import 'ROOT/reporting/IV2ReputationToken.sol';
import 'ROOT/factories/DisputeCrowdsourcerFactory.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/trading/IShareToken.sol';
import 'ROOT/factories/ShareTokenFactory.sol';
import 'ROOT/factories/InitialReporterFactory.sol';
import 'ROOT/factories/MapFactory.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/math/SafeMathInt256.sol';
import 'ROOT/reporting/Reporting.sol';
import 'ROOT/reporting/IInitialReporter.sol';


contract Market is Initializable, Ownable, IMarket {
    using SafeMathUint256 for uint256;
    using SafeMathInt256 for int256;

    // Constants
    uint256 private constant MAX_FEE_PER_CASH_IN_ATTOCASH = 15 * 10**16; // 15%
    uint256 private constant APPROVAL_AMOUNT = 2 ** 256 - 1;
    address private constant NULL_ADDRESS = address(0);
    uint256 private constant MIN_OUTCOMES = 3; // Includes INVALID
    uint256 private constant MAX_OUTCOMES = 8;

    // Contract Refs
    IUniverse private universe;
    IDisputeWindow private disputeWindow;
    ICash private cash;
    IAugur public augur;
    MapFactory public mapFactory;

    // Attributes
    uint256 private numTicks;
    uint256 private feeDivisor;
    uint256 public affiliateFeeDivisor;
    uint256 private endTime;
    uint256 private numOutcomes;
    bytes32 private winningPayoutDistributionHash;
    uint256 public validityBondAttoCash;
    uint256 private finalizationTime;
    uint256 private repBond;
    bool private disputePacingOn;
    address private repBondOwner;
    uint256 public marketCreatorFeesAttoCash;
    uint256 public totalAffiliateFeesAttoCash;
    IDisputeCrowdsourcer public preemptiveDisputeCrowdsourcer;

    // Collections
    IReportingParticipant[] public participants;
    IMap public crowdsourcers;
    IShareToken[] private shareTokens;
    mapping (address => uint256) public affiliateFeesAttoCash;

    function initialize(IAugur _augur, IUniverse _universe, uint256 _endTime, uint256 _feePerCashInAttoCash, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _creator, uint256 _numOutcomes, uint256 _numTicks) public beforeInitialized returns (bool _success) {
        endInitialization();
        augur = _augur;
        _numOutcomes += 1; // The INVALID outcome is always first
        require(MIN_OUTCOMES <= _numOutcomes && _numOutcomes <= MAX_OUTCOMES);
        require(_designatedReporterAddress != NULL_ADDRESS);
        require((_numTicks >= _numOutcomes));
        require(_feePerCashInAttoCash <= MAX_FEE_PER_CASH_IN_ATTOCASH);
        require(_creator != NULL_ADDRESS);
        uint256 _timestamp = augur.getTimestamp();
        require(_timestamp < _endTime);
        require(_endTime < augur.getMaximumMarketEndDate());
        universe = _universe;
        require(!universe.isForking());
        cash = ICash(augur.lookup("Cash"));
        owner = _creator;
        repBondOwner = owner;
        assessFees();
        endTime = _endTime;
        numOutcomes = _numOutcomes;
        numTicks = _numTicks;
        feeDivisor = _feePerCashInAttoCash == 0 ? 0 : 1 ether / _feePerCashInAttoCash;
        affiliateFeeDivisor = _affiliateFeeDivisor;
        InitialReporterFactory _initialReporterFactory = InitialReporterFactory(augur.lookup("InitialReporterFactory"));
        participants.push(_initialReporterFactory.createInitialReporter(augur, this, _designatedReporterAddress));
        mapFactory = MapFactory(augur.lookup("MapFactory"));
        clearCrowdsourcers();
        for (uint256 _outcome = 0; _outcome < numOutcomes; _outcome++) {
            shareTokens.push(createShareToken(_outcome));
        }
        approveSpenders();
        return true;
    }

    function assessFees() private returns (bool) {
        repBond = universe.getOrCacheMarketRepBond();
        require(getReputationToken().balanceOf(address(this)) >= repBond);
        validityBondAttoCash = cash.balanceOf(address(this));
        require(validityBondAttoCash >= universe.getOrCacheValidityBond());
        return true;
    }

    function increaseValidityBond(uint256 _attoCASH) public returns (bool) {
        require(!isFinalized());
        cash.transferFrom(msg.sender, address(this), _attoCASH);
        validityBondAttoCash = validityBondAttoCash.add(_attoCASH);
        return true;
    }

    function createShareToken(uint256 _outcome) private returns (IShareToken) {
        return ShareTokenFactory(augur.lookup("ShareTokenFactory")).createShareToken(augur, this, _outcome);
    }

    // This will need to be called manually for each open market if a spender contract is updated
    function approveSpenders() public returns (bool) {
        bytes32[5] memory _names = [bytes32("CancelOrder"), bytes32("CompleteSets"), bytes32("FillOrder"), bytes32("ClaimTradingProceeds"), bytes32("Orders")];
        for (uint256 i = 0; i < _names.length; i++) {
            require(cash.approve(augur.lookup(_names[i]), APPROVAL_AMOUNT));
        }
        for (uint256 j = 0; j < numOutcomes; j++) {
            require(shareTokens[j].approve(augur.lookup("FillOrder"), APPROVAL_AMOUNT));
        }
        return true;
    }

    function doInitialReport(uint256[] memory _payoutNumerators, string memory _description) public returns (bool) {
        doInitialReportInternal(msg.sender, _payoutNumerators, _description);
        return true;
    }

    function doInitialReportInternal(address _reporter, uint256[] memory _payoutNumerators, string memory _description) private returns (bool) {
        require(!universe.isForking());
        IInitialReporter _initialReporter = getInitialReporter();
        uint256 _timestamp = augur.getTimestamp();
        require(_timestamp > endTime);
        uint256 _initialReportStake = distributeInitialReportingRep(_reporter, _initialReporter);
        // The derive call will validate that an Invalid report is entirely paid out on the Invalid outcome
        bytes32 _payoutDistributionHash = derivePayoutDistributionHash(_payoutNumerators);
        disputeWindow = universe.getOrCreateNextDisputeWindow(true);
        _initialReporter.report(_reporter, _payoutDistributionHash, _payoutNumerators, _initialReportStake);
        augur.logInitialReportSubmitted(universe, _reporter, address(this), _initialReportStake, _initialReporter.designatedReporterShowed(), _payoutNumerators, _description);
        return true;
    }

    function distributeInitialReportingRep(address _reporter, IInitialReporter _initialReporter) private returns (uint256) {
        IV2ReputationToken _reputationToken = getReputationToken();
        uint256 _initialReportStake = repBond;
        // If the designated reporter showed up and is not also the rep bond owner return the rep bond to the bond owner. Otherwise it will be used as stake in the first report.
        if (_reporter == _initialReporter.getDesignatedReporter() && _reporter != repBondOwner) {
            require(_reputationToken.noHooksTransfer(repBondOwner, _initialReportStake));
            _reputationToken.trustedMarketTransfer(_reporter, address(_initialReporter), _initialReportStake);
        } else {
            require(_reputationToken.noHooksTransfer(address(_initialReporter), _initialReportStake));
        }
        repBond = 0;
        return _initialReportStake;
    }

    function contributeToTentative(uint256[] memory _payoutNumerators, uint256 _amount, string memory _description) public returns (bool) {
        require(!disputePacingOn);
        // The derive call will validate that an Invalid report is entirely paid out on the Invalid outcome
        bytes32 _payoutDistributionHash = derivePayoutDistributionHash(_payoutNumerators);
        require(_payoutDistributionHash == getWinningReportingParticipant().getPayoutDistributionHash());
        internalContribute(msg.sender, _payoutDistributionHash, _payoutNumerators, _amount, true, _description);
        return true;
    }

    function contribute(uint256[] memory _payoutNumerators, uint256 _amount, string memory _description) public returns (bool) {
        // The derive call will validate that an Invalid report is entirely paid out on the Invalid outcome
        bytes32 _payoutDistributionHash = derivePayoutDistributionHash(_payoutNumerators);
        require(_payoutDistributionHash != getWinningReportingParticipant().getPayoutDistributionHash());
        internalContribute(msg.sender, _payoutDistributionHash, _payoutNumerators, _amount, false, _description);
        return true;
    }

    function internalContribute(address _contributor, bytes32 _payoutDistributionHash, uint256[] memory _payoutNumerators, uint256 _amount, bool _overload, string memory _description) internal returns (bool) {
        if (disputePacingOn) {
            require(disputeWindow.isActive());
        } else {
            require(!disputeWindow.isOver());
        }
        // This will require that the universe is not forking
        universe.updateForkValues();
        IDisputeCrowdsourcer _crowdsourcer = getOrCreateDisputeCrowdsourcer(_payoutDistributionHash, _payoutNumerators, _overload);
        uint256 _actualAmount = _crowdsourcer.contribute(_contributor, _amount, _overload);
        if (!_overload) {
            uint256 _amountRemainingToFill = _crowdsourcer.getRemainingToFill();
            if (_amountRemainingToFill == 0) {
                finishedCrowdsourcingDisputeBond(_crowdsourcer);
            } else {
                require(_amountRemainingToFill >= getInitialReporter().getSize());
            }
        }
        augur.logDisputeCrowdsourcerContribution(universe, _contributor, address(this), address(_crowdsourcer), _actualAmount, _description);
        return true;
    }

    function finishedCrowdsourcingDisputeBond(IDisputeCrowdsourcer _crowdsourcer) private returns (bool) {
        correctLastParticipantSize();
        participants.push(_crowdsourcer);
        clearCrowdsourcers(); // disavow other crowdsourcers
        uint256 _crowdsourcerSize = IDisputeCrowdsourcer(_crowdsourcer).getSize();
        if (_crowdsourcerSize >= universe.getDisputeThresholdForFork()) {
            universe.fork();
        } else {
            if (_crowdsourcerSize >= universe.getDisputeThresholdForDisputePacing()) {
                disputePacingOn = true;
            }
            disputeWindow = universe.getOrCreateNextDisputeWindow(false);
        }
        augur.logDisputeCrowdsourcerCompleted(universe, address(this), address(_crowdsourcer), disputeWindow.getStartTime(), disputePacingOn);
        if (preemptiveDisputeCrowdsourcer != IDisputeCrowdsourcer(0)) {
            IDisputeCrowdsourcer _newCrowdsourcer = preemptiveDisputeCrowdsourcer;
            preemptiveDisputeCrowdsourcer = IDisputeCrowdsourcer(0);
            bytes32 _payoutDistributionHash = _newCrowdsourcer.getPayoutDistributionHash();
            uint256 _correctSize = getParticipantStake().mul(2).sub(getStakeInOutcome(_payoutDistributionHash).mul(3));
            _newCrowdsourcer.setSize(_correctSize);
            if (_newCrowdsourcer.getStake() >= _correctSize) {
                finishedCrowdsourcingDisputeBond(_newCrowdsourcer);
            } else {
                crowdsourcers.add(_payoutDistributionHash, address(_newCrowdsourcer));
            }
        }
        return true;
    }

    function correctLastParticipantSize() private returns (bool) {
        if (participants.length < 2) {
            return true;
        }
        IDisputeCrowdsourcer(address(getWinningReportingParticipant())).correctSize();
        return true;
    }

    function finalize() public returns (bool) {
        require(winningPayoutDistributionHash == bytes32(0));
        uint256[] memory _winningPayoutNumerators;
        if (universe.getForkingMarket() == this) {
            IUniverse _winningUniverse = universe.getWinningChildUniverse();
            winningPayoutDistributionHash = _winningUniverse.getParentPayoutDistributionHash();
            _winningPayoutNumerators = _winningUniverse.getPayoutNumerators();
        } else {
            require(disputeWindow.isOver());
            require(!universe.isForking());
            IReportingParticipant _reportingParticipant = participants[participants.length-1];
            winningPayoutDistributionHash = _reportingParticipant.getPayoutDistributionHash();
            _winningPayoutNumerators = _reportingParticipant.getPayoutNumerators();
            // Make sure the dispute window for which we record finalization is the standard cadence window and not an initial dispute window
            disputeWindow = universe.getOrCreatePreviousDisputeWindow(false);
            disputeWindow.onMarketFinalized();
            universe.decrementOpenInterestFromMarket(this);
            redistributeLosingReputation();
        }
        distributeValidityBondAndMarketCreatorFees();
        finalizationTime = augur.getTimestamp();
        augur.logMarketFinalized(universe, _winningPayoutNumerators);
        return true;
    }

    function redistributeLosingReputation() private returns (bool) {
        // If no disputes occurred early exit
        if (participants.length == 1) {
            return true;
        }

        IReportingParticipant _reportingParticipant;

        // Initial pass is to liquidate losers so we have sufficient REP to pay the winners. Participants is implicitly bounded by the floor of the initial report REP cost to be no more than 21
        for (uint256 i = 0; i < participants.length; i++) {
            _reportingParticipant = participants[i];
            if (_reportingParticipant.getPayoutDistributionHash() != winningPayoutDistributionHash) {
                _reportingParticipant.liquidateLosing();
            }
        }

        IV2ReputationToken _reputationToken = getReputationToken();
        // We burn 20% of the REP to prevent griefing attacks which rely on getting back lost REP
        _reputationToken.burnForMarket(_reputationToken.balanceOf(address(this)) / 5);

        // Now redistribute REP. Participants is implicitly bounded by the floor of the initial report REP cost to be no more than 21.
        for (uint256 j = 0; j < participants.length; j++) {
            _reportingParticipant = participants[j];
            if (_reportingParticipant.getPayoutDistributionHash() == winningPayoutDistributionHash) {
                // The last participant's owed REP will not actually be 40% ROI in the event it was created through pre-emptive contributions. We just give them all the remaining non burn REP
                uint256 amountToTransfer = j == participants.length - 1 ? _reputationToken.balanceOf(address(this)) : _reportingParticipant.getSize().mul(2) / 5;
                require(_reputationToken.noHooksTransfer(address(_reportingParticipant), amountToTransfer));
            }
        }
        return true;
    }

    function getMarketCreatorSettlementFeeDivisor() public view returns (uint256) {
        return feeDivisor;
    }

    function deriveMarketCreatorFeeAmount(uint256 _amount) public view returns (uint256) {
        return feeDivisor == 0 ? 0 : _amount / feeDivisor;
    }

    function recordMarketCreatorFees(uint256 _marketCreatorFees, address _affiliateAddress) public returns (bool) {
        require(augur.isKnownFeeSender(msg.sender));
        if (_affiliateAddress != NULL_ADDRESS && affiliateFeeDivisor != 0) {
            uint256 _affiliateFees = _marketCreatorFees / affiliateFeeDivisor;
            affiliateFeesAttoCash[_affiliateAddress] += _affiliateFees;
            _marketCreatorFees = _marketCreatorFees.sub(_affiliateFees);
            totalAffiliateFeesAttoCash = totalAffiliateFeesAttoCash.add(_affiliateFees);
        }
        marketCreatorFeesAttoCash = marketCreatorFeesAttoCash.add(_marketCreatorFees);
        if (isFinalized()) {
            distributeMarketCreatorFees(_affiliateAddress);
        }
    }

    function distributeValidityBondAndMarketCreatorFees() private returns (bool) {
        // If the market resolved to invalid the bond gets sent to the dispute window. Otherwise it gets returned to the market creator.
        marketCreatorFeesAttoCash = validityBondAttoCash.add(marketCreatorFeesAttoCash);
        return distributeMarketCreatorFees(NULL_ADDRESS);
    }

    function distributeMarketCreatorFees(address _affiliateAddress) private returns (bool) {
        if (!isInvalid()) {
            cash.transfer(owner, marketCreatorFeesAttoCash);
            if (_affiliateAddress != NULL_ADDRESS) {
                withdrawAffiliateFees(_affiliateAddress);
            }
        } else {
            cash.transfer(address(universe.getOrCreateNextDisputeWindow(false)), marketCreatorFeesAttoCash.add(totalAffiliateFeesAttoCash));
            totalAffiliateFeesAttoCash = 0;
        }
        marketCreatorFeesAttoCash = 0;
        return true;
    }

    function withdrawAffiliateFees(address _affiliate) public returns (bool) {
        require(!isInvalid());
        uint256 _affiliateBalance = affiliateFeesAttoCash[_affiliate];
        if (_affiliateBalance == 0) {
            return true;
        }
        affiliateFeesAttoCash[_affiliate] = 0;
        cash.transfer(_affiliate, _affiliateBalance);
        return true;
    }

    function getOrCreateDisputeCrowdsourcer(bytes32 _payoutDistributionHash, uint256[] memory _payoutNumerators, bool _overload) private returns (IDisputeCrowdsourcer) {
        IDisputeCrowdsourcer _crowdsourcer = _overload ? preemptiveDisputeCrowdsourcer : IDisputeCrowdsourcer(crowdsourcers.getAsAddressOrZero(_payoutDistributionHash));
        if (_crowdsourcer == IDisputeCrowdsourcer(0)) {
            DisputeCrowdsourcerFactory _disputeCrowdsourcerFactory = DisputeCrowdsourcerFactory(augur.lookup("DisputeCrowdsourcerFactory"));
            uint256 _participantStake = getParticipantStake();
            if (_overload) {
                _participantStake = _participantStake.add(_participantStake.mul(2).sub(getHighestNonTentativeParticipantStake().mul(3)));
            }
            uint256 _size = _participantStake.mul(2).sub(getStakeInOutcome(_payoutDistributionHash).mul(3));
            _crowdsourcer = _disputeCrowdsourcerFactory.createDisputeCrowdsourcer(augur, this, _size, _payoutDistributionHash, _payoutNumerators);
            if (!_overload) {
                crowdsourcers.add(_payoutDistributionHash, address(_crowdsourcer));
            } else {
                preemptiveDisputeCrowdsourcer = _crowdsourcer;
            }
            augur.disputeCrowdsourcerCreated(universe, address(this), address(_crowdsourcer), _payoutNumerators, _size);
        }
        return _crowdsourcer;
    }

    function migrateThroughOneFork(uint256[] memory _payoutNumerators, string memory _description) public returns (bool) {
        // only proceed if the forking market is finalized
        IMarket _forkingMarket = universe.getForkingMarket();
        require(_forkingMarket.isFinalized());
        require(!isFinalized());

        disavowCrowdsourcers();

        IUniverse _currentUniverse = universe;
        bytes32 _winningForkPayoutDistributionHash = _forkingMarket.getWinningPayoutDistributionHash();
        IUniverse _destinationUniverse = _currentUniverse.getChildUniverse(_winningForkPayoutDistributionHash);

        universe.decrementOpenInterestFromMarket(this);

        // follow the forking market to its universe
        if (disputeWindow != IDisputeWindow(0)) {
            // Markets go into the standard resolution period during fork migration even if they were in the initial dispute window. We want to give some time for REP to migrate.
            disputeWindow = _destinationUniverse.getOrCreateNextDisputeWindow(false);
        }
        _destinationUniverse.addMarketTo();
        _currentUniverse.removeMarketFrom();
        universe = _destinationUniverse;

        universe.incrementOpenInterestFromMarket(this);

        // Pay the REP bond.
        repBond = universe.getOrCacheMarketRepBond();
        repBondOwner = msg.sender;
        getReputationToken().trustedMarketTransfer(repBondOwner, address(this), repBond);

        // Update the Initial Reporter
        IInitialReporter _initialReporter = getInitialReporter();
        _initialReporter.migrateToNewUniverse(msg.sender);

        // If the market is past expiration use the reporting data to make an initial report
        uint256 _timestamp = augur.getTimestamp();
        if (_timestamp > endTime) {
            doInitialReportInternal(msg.sender, _payoutNumerators, _description);
        }

        return true;
    }

    function disavowCrowdsourcers() public returns (bool) {
        IMarket _forkingMarket = getForkingMarket();
        require(_forkingMarket != this);
        require(_forkingMarket != IMarket(NULL_ADDRESS));
        require(!isFinalized());
        IInitialReporter _initialParticipant = getInitialReporter();
        // Early out if already disavowed or nothing to disavow
        if (_initialParticipant.getReportTimestamp() == 0) {
            return true;
        }
        delete participants;
        participants.push(_initialParticipant);
        // Send REP from the rep bond back to the address that placed it. If a report has been made tell the InitialReporter to return that REP and reset
        if (repBond > 0) {
            IV2ReputationToken _reputationToken = getReputationToken();
            require(_reputationToken.noHooksTransfer(repBondOwner, repBond));
            repBond = 0;
        } else {
            _initialParticipant.returnRepFromDisavow();
        }
        clearCrowdsourcers();
        augur.logMarketParticipantsDisavowed(universe);
        return true;
    }

    function clearCrowdsourcers() private returns (bool) {
        crowdsourcers = mapFactory.createMap(augur, address(this));
        return true;
    }

    function getHighestNonTentativeParticipantStake() public view returns (uint256) {
        if (participants.length < 2) {
            return 0;
        }
        bytes32 _payoutDistributionHash = participants[participants.length - 2].getPayoutDistributionHash();
        return getStakeInOutcome(_payoutDistributionHash);
    }

    function getParticipantStake() public view returns (uint256) {
        uint256 _sum;
        // Participants is implicitly bounded by the floor of the initial report REP cost to be no more than 21
        for (uint256 i = 0; i < participants.length; ++i) {
            _sum += participants[i].getStake();
        }
        return _sum;
    }

    function getStakeInOutcome(bytes32 _payoutDistributionHash) public view returns (uint256) {
        uint256 _sum;
        // Participants is implicitly bounded by the floor of the initial report REP cost to be no more than 21
        for (uint256 i = 0; i < participants.length; ++i) {
            IReportingParticipant _reportingParticipant = participants[i];
            if (_reportingParticipant.getPayoutDistributionHash() != _payoutDistributionHash) {
                continue;
            }
            _sum += _reportingParticipant.getStake();
        }
        return _sum;
    }

    function getForkingMarket() public view returns (IMarket) {
        return universe.getForkingMarket();
    }

    function getWinningPayoutDistributionHash() public view returns (bytes32) {
        return winningPayoutDistributionHash;
    }

    function isFinalized() public view returns (bool) {
        return winningPayoutDistributionHash != bytes32(0);
    }

    function getDesignatedReporter() public view returns (address) {
        return getInitialReporter().getDesignatedReporter();
    }

    function designatedReporterShowed() public view returns (bool) {
        return getInitialReporter().designatedReporterShowed();
    }

    function designatedReporterWasCorrect() public view returns (bool) {
        return getInitialReporter().designatedReporterWasCorrect();
    }

    function getEndTime() public view returns (uint256) {
        return endTime;
    }

    function isInvalid() public view returns (bool) {
        require(isFinalized());
        return getWinningReportingParticipant().getPayoutNumerator(0) > 0;
    }

    function getInitialReporter() public view returns (IInitialReporter) {
        return IInitialReporter(address(participants[0]));
    }

    function getReportingParticipant(uint256 _index) public view returns (IReportingParticipant) {
        return participants[_index];
    }

    function getCrowdsourcer(bytes32 _payoutDistributionHash) public view returns (IDisputeCrowdsourcer) {
        return  IDisputeCrowdsourcer(crowdsourcers.getAsAddressOrZero(_payoutDistributionHash));
    }

    function getWinningReportingParticipant() public view returns (IReportingParticipant) {
        return participants[participants.length-1];
    }

    function getWinningPayoutNumerator(uint256 _outcome) public view returns (uint256) {
        return getWinningReportingParticipant().getPayoutNumerator(_outcome);
    }

    function getUniverse() public view returns (IUniverse) {
        return universe;
    }

    function getDisputeWindow() public view returns (IDisputeWindow) {
        return disputeWindow;
    }

    function getFinalizationTime() public view returns (uint256) {
        return finalizationTime;
    }

    function getReputationToken() public view returns (IV2ReputationToken) {
        return universe.getReputationToken();
    }

    function getNumberOfOutcomes() public view returns (uint256) {
        return numOutcomes;
    }

    function getNumTicks() public view returns (uint256) {
        return numTicks;
    }

    function getShareToken(uint256 _outcome) public view returns (IShareToken) {
        return shareTokens[_outcome];
    }

    function getDesignatedReportingEndTime() public view returns (uint256) {
        return endTime.add(Reporting.getDesignatedReportingDurationSeconds());
    }

    function getNumParticipants() public view returns (uint256) {
        return participants.length;
    }

    function getValidityBondAttoCash() public view returns (uint256) {
        return validityBondAttoCash;
    }

    function getDisputePacingOn() public view returns (bool) {
        return disputePacingOn;
    }

    function derivePayoutDistributionHash(uint256[] memory _payoutNumerators) public view returns (bytes32) {
        return augur.derivePayoutDistributionHash(_payoutNumerators, numTicks, numOutcomes);
    }

    function isContainerForShareToken(IShareToken _shadyShareToken) public view returns (bool) {
        return getShareToken(_shadyShareToken.getOutcome()) == _shadyShareToken;
    }

    function isContainerForReportingParticipant(IReportingParticipant _shadyReportingParticipant) public view returns (bool) {
        require(_shadyReportingParticipant != IReportingParticipant(0));
        if (address(preemptiveDisputeCrowdsourcer) == address(_shadyReportingParticipant)) {
            return true;
        }
        if (crowdsourcers.getAsAddressOrZero(_shadyReportingParticipant.getPayoutDistributionHash()) == address(_shadyReportingParticipant)) {
            return true;
        }
        // Participants is implicitly bounded by the floor of the initial report REP cost to be no more than 21
        for (uint256 i = 0; i < participants.length; i++) {
            if (_shadyReportingParticipant == participants[i]) {
                return true;
            }
        }
        return false;
    }

    function onTransferOwnership(address _owner, address _newOwner) internal returns (bool) {
        augur.logMarketTransferred(getUniverse(), _owner, _newOwner);
        return true;
    }

    function assertBalances() public view returns (bool) {
        universe.assertMarketBalance();
        return true;
    }
}
