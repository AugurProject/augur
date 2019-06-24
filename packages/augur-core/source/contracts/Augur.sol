pragma solidity 0.5.4;

import 'ROOT/IAugur.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/factories/IUniverseFactory.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/reporting/IReputationToken.sol';
import 'ROOT/reporting/IReportingParticipant.sol';
import 'ROOT/reporting/IDisputeCrowdsourcer.sol';
import 'ROOT/reporting/IInitialReporter.sol';
import 'ROOT/trading/IShareToken.sol';
import 'ROOT/trading/IOrders.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/reporting/Reporting.sol';
import 'ROOT/ITime.sol';


// Centralized approval authority and event emissions

/// @title Augur
contract Augur is IAugur {
    using SafeMathUint256 for uint256;

    enum TokenType {
        ReputationToken,
        ShareToken,
        DisputeCrowdsourcer,
        FeeWindow, // No longer a valid type but here for backward compat with Augur Node processing
        FeeToken, // No longer a valid type but here for backward compat with Augur Node processing
        ParticipationToken
    }

    enum OrderEventType {
        Create,
        Cancel,
        ChangePrice,
        Fill
    }

    event MarketCreated(IUniverse indexed universe, uint256 endTime, bytes32 indexed topic, string extraInfo, IMarket market, address indexed marketCreator, address designatedReporter, uint256 feeDivisor, int256[] prices, IMarket.MarketType marketType, uint256 numTicks, bytes32[] outcomes, uint256 timestamp);
    event InitialReportSubmitted(address indexed universe, address indexed reporter, address indexed market, uint256 amountStaked, bool isDesignatedReporter, uint256[] payoutNumerators, string description, uint256 timestamp);
    event DisputeCrowdsourcerCreated(address indexed universe, address indexed market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 size);
    event DisputeCrowdsourcerContribution(address indexed universe, address indexed reporter, address indexed market, address disputeCrowdsourcer, uint256 amountStaked, string description, uint256 timestamp);
    event DisputeCrowdsourcerCompleted(address indexed universe, address indexed market, address disputeCrowdsourcer, uint256 nextWindowStartTime, bool pacingOn);
    event InitialReporterRedeemed(address indexed universe, address indexed reporter, address indexed market, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp);
    event DisputeCrowdsourcerRedeemed(address indexed universe, address indexed reporter, address indexed market, address disputeCrowdsourcer, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp);
    event ReportingParticipantDisavowed(address indexed universe, address indexed market, address reportingParticipant);
    event MarketParticipantsDisavowed(address indexed universe, address indexed market);
    event MarketFinalized(address indexed universe, address indexed market, uint256 timestamp, uint256[] winningPayoutNumerators);
    event MarketMigrated(address indexed market, address indexed originalUniverse, address indexed newUniverse);
    event UniverseForked(address indexed universe, IMarket forkingMarket);
    event UniverseCreated(address indexed parentUniverse, address indexed childUniverse, uint256[] payoutNumerators);

    //  addressData
    //  0:  kycToken
    //  1:  orderCreator
    //  2:  orderFiller (Fill)
    //
    //  uint256Data
    //  0:  price
    //  1:  amount
    //  2:  outcome
    //  3:  tokenRefund (Cancel)
    //  4:  sharesRefund (Cancel)
    //  5:  fees (Fill)
    //  6:  amountFilled (Fill)
    //  7:  timestamp
    //  8:  sharesEscrowed
    //  9:	tokensEscrowed
    event OrderEvent(address indexed universe, address indexed market, OrderEventType indexed eventType, Order.Types orderType, bytes32 orderId, bytes32 tradeGroupId, address[] addressData, uint256[] uint256Data);

    event CompleteSetsPurchased(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 marketOI, uint256 timestamp);
    event CompleteSetsSold(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 marketOI, uint256 fees, uint256 timestamp);
    event TradingProceedsClaimed(address indexed universe, address indexed shareToken, address indexed sender, address market, uint256 outcome, uint256 numShares, uint256 numPayoutTokens, uint256 finalTokenBalance, uint256 fees, uint256 timestamp);
    event TokensTransferred(address indexed universe, address token, address indexed from, address indexed to, uint256 value, TokenType tokenType, address market);
    event TokensMinted(address indexed universe, address indexed token, address indexed target, uint256 amount, TokenType tokenType, address market, uint256 totalSupply);
    event TokensBurned(address indexed universe, address indexed token, address indexed target, uint256 amount, TokenType tokenType, address market, uint256 totalSupply);
    event TokenBalanceChanged(address indexed universe, address indexed owner, address token, TokenType tokenType, address market, uint256 balance, uint256 outcome);
    event DisputeWindowCreated(address indexed universe, address disputeWindow, uint256 startTime, uint256 endTime, uint256 id, bool initial);
    event InitialReporterTransferred(address indexed universe, address indexed market, address from, address to);
    event MarketTransferred(address indexed universe, address indexed market, address from, address to);
    event MarketVolumeChanged(address indexed universe, address indexed market, uint256 volume, uint256[] outcomeVolumes);
    event ProfitLossChanged(address indexed universe, address indexed market, address indexed account, uint256 outcome, int256 netPosition, uint256 avgPrice, int256 realizedProfit, int256 frozenFunds, int256 realizedCost, uint256 timestamp);
    event ParticipationTokensRedeemed(address indexed universe, address indexed disputeWindow, address indexed account, uint256 attoParticipationTokens, uint256 feePayoutShare, uint256 timestamp);
    event TimestampSet(uint256 newTimestamp);

    mapping(address => bool) private markets;
    mapping(address => bool) private universes;
    mapping(address => bool) private crowdsourcers;
    mapping(address => bool) private shareTokens;
    mapping(address => bool) private trustedSender;

    address public uploader;
    mapping(bytes32 => address) public registry;

    ITime public time;

    uint256 public upgradeTimestamp;

    constructor() public {
        uploader = msg.sender;
        upgradeTimestamp = Reporting.getInitialUpgradeTimestamp();
    }

    //
    // Registry
    //

    function registerContract(bytes32 _key, address _address) public returns (bool) {
        require(msg.sender == uploader);
        require(registry[_key] == address(0));
        registry[_key] = _address;
        if (_key == "CompleteSets" || _key == "Orders" || _key == "CreateOrder" || _key == "CancelOrder" || _key == "FillOrder" || _key == "Trade" || _key == "ClaimTradingProceeds" || _key == "MarketFactory") {
            trustedSender[_address] = true;
        }
        if (_key == "Time") {
            time = ITime(_address);
        }
        return true;
    }

    function lookup(bytes32 _key) public view returns (address) {
        return registry[_key];
    }

    function finishDeployment() public returns (bool) {
        require(msg.sender == uploader);
        uploader = address(1);
        return true;
    }

    //
    // Universe
    //

    function createGenesisUniverse() public returns (IUniverse) {
        require(msg.sender == uploader);
        return createUniverse(IUniverse(0), bytes32(0), new uint256[](0));
    }

    function createChildUniverse(bytes32 _parentPayoutDistributionHash, uint256[] memory _parentPayoutNumerators) public returns (IUniverse) {
        IUniverse _parentUniverse = IUniverse(msg.sender);
        require(isKnownUniverse(_parentUniverse));
        return createUniverse(_parentUniverse, _parentPayoutDistributionHash, _parentPayoutNumerators);
    }

    function createUniverse(IUniverse _parentUniverse, bytes32 _parentPayoutDistributionHash, uint256[] memory _parentPayoutNumerators) private returns (IUniverse) {
        IUniverseFactory _universeFactory = IUniverseFactory(registry["UniverseFactory"]);
        IUniverse _newUniverse = _universeFactory.createUniverse(this, _parentUniverse, _parentPayoutDistributionHash, _parentPayoutNumerators);
        universes[address(_newUniverse)] = true;
        emit UniverseCreated(address(_parentUniverse), address(_newUniverse), _parentPayoutNumerators);
        return _newUniverse;
    }

    function isKnownUniverse(IUniverse _universe) public view returns (bool) {
        return universes[address(_universe)];
    }

    //
    // Crowdsourcers
    //

    function isKnownCrowdsourcer(IDisputeCrowdsourcer _crowdsourcer) public view returns (bool) {
        return crowdsourcers[address(_crowdsourcer)];
    }

    function disputeCrowdsourcerCreated(IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] memory _payoutNumerators, uint256 _size) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForMarket(IMarket(msg.sender)));
        crowdsourcers[_disputeCrowdsourcer] = true;
        emit DisputeCrowdsourcerCreated(address(_universe), _market, _disputeCrowdsourcer, _payoutNumerators, _size);
        return true;
    }

    //
    // Share Tokens
    //
    function recordMarketShareTokens(IMarket _market) private returns (bool) {
        uint256 _numOutcomes = _market.getNumberOfOutcomes();
        for (uint256 _outcome = 0; _outcome < _numOutcomes; _outcome++) {
            shareTokens[address(_market.getShareToken(_outcome))] = true;
        }
    }

    function isKnownShareToken(IShareToken _token) public view returns (bool) {
        return shareTokens[address(_token)];
    }

    function isKnownFeeSender(address _feeSender) public view returns (bool) {
        return _feeSender == registry["CompleteSets"] || _feeSender == registry["ClaimTradingProceeds"] || markets[_feeSender];
    }

    //
    // Transfer
    //

    function trustedTransfer(IERC20 _token, address _from, address _to, uint256 _amount) public returns (bool) {
        require(trustedSender[msg.sender]);
        require(_token.transferFrom(_from, _to, _amount));
        return true;
    }

    //
    // Time
    //

    /// @dev Returns Augur’s internal Unix timestamp.
    /// @return (uint256) Augur’s internal Unix timestamp
    function getTimestamp() public view returns (uint256) {
        return time.getTimestamp();
    }

    //
    // Markets
    //

    function isValidMarket(IMarket _market) public view returns (bool) {
        return markets[address(_market)];
    }

    function getMaximumMarketEndDate() public returns (uint256) {
        uint256 _now = getTimestamp();
        while (_now > upgradeTimestamp) {
            upgradeTimestamp = upgradeTimestamp.add(Reporting.getUpgradeCadence());
        }
        uint256 _upgradeCadenceDurationEndTime = upgradeTimestamp;
        uint256 _baseDurationEndTime = _now + Reporting.getBaseMarketDurationMaximum();
        return _baseDurationEndTime.max(_upgradeCadenceDurationEndTime);
    }

    function derivePayoutDistributionHash(uint256[] memory _payoutNumerators, uint256 _numTicks, uint256 _numOutcomes) public view returns (bytes32) {
        uint256 _sum = 0;
        // This is to force an Invalid report to be entirely payed out to Invalid
        require(_payoutNumerators[0] == 0 || _payoutNumerators[0] == _numTicks);
        require(_payoutNumerators.length == _numOutcomes);
        for (uint256 i = 0; i < _payoutNumerators.length; i++) {
            uint256 _value = _payoutNumerators[i];
            _sum = _sum.add(_value);
        }
        require(_sum == _numTicks);
        return keccak256(abi.encodePacked(_payoutNumerators));
    }

    //
    // Logging
    //

    // This signature is intended for the categorical market creation. We use two signatures for the same event because of stack depth issues which can be circumvented by maintaining order of paramaters
    function logMarketCreated(uint256 _endTime, bytes32 _topic, string memory _extraInfo, IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] memory _prices, IMarket.MarketType _marketType, bytes32[] memory _outcomes) public returns (bool) {
        IUniverse _universe = IUniverse(msg.sender);
        require(isKnownUniverse(_universe));
        recordMarketShareTokens(_market);
        markets[address(_market)] = true;
        emit MarketCreated(_universe, _endTime, _topic, _extraInfo, _market,_marketCreator, _designatedReporter, _feeDivisor, _prices, _marketType, 100, _outcomes, getTimestamp());
        return true;
    }

    // This signature is intended for yesNo and scalar market creation. See function comment above for explanation.
    function logMarketCreated(uint256 _endTime, bytes32 _topic, string memory _extraInfo, IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] memory _prices, IMarket.MarketType _marketType, uint256 _numTicks) public returns (bool) {
        IUniverse _universe = IUniverse(msg.sender);
        require(isKnownUniverse(_universe));
        recordMarketShareTokens(_market);
        markets[address(_market)] = true;
        emit MarketCreated(_universe, _endTime, _topic, _extraInfo, _market, _marketCreator, _designatedReporter, _feeDivisor, _prices, _marketType, _numTicks, new bytes32[](0), getTimestamp());
        return true;
    }

    function logInitialReportSubmitted(IUniverse _universe, address _reporter, address _market, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] memory _payoutNumerators, string memory _description) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForMarket(IMarket(msg.sender)));
        emit InitialReportSubmitted(address(_universe), _reporter, _market, _amountStaked, _isDesignatedReporter, _payoutNumerators, _description, getTimestamp());
        return true;
    }

    function logDisputeCrowdsourcerContribution(IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string memory _description) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForMarket(IMarket(msg.sender)));
        emit DisputeCrowdsourcerContribution(address(_universe), _reporter, _market, _disputeCrowdsourcer, _amountStaked, _description, getTimestamp());
        return true;
    }

    function logDisputeCrowdsourcerCompleted(IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256 _nextWindowStartTime, bool _pacingOn) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForMarket(IMarket(msg.sender)));
        emit DisputeCrowdsourcerCompleted(address(_universe), _market, _disputeCrowdsourcer, _nextWindowStartTime, _pacingOn);
        return true;
    }

    function logInitialReporterRedeemed(IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] memory _payoutNumerators) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForReportingParticipant(IReportingParticipant(msg.sender)));
        emit InitialReporterRedeemed(address(_universe), _reporter, _market, _amountRedeemed, _repReceived, _payoutNumerators, getTimestamp());
        return true;
    }

    function logDisputeCrowdsourcerRedeemed(IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] memory _payoutNumerators) public returns (bool) {
        IDisputeCrowdsourcer _disputeCrowdsourcer = IDisputeCrowdsourcer(msg.sender);
        require(isKnownCrowdsourcer(_disputeCrowdsourcer));
        emit DisputeCrowdsourcerRedeemed(address(_universe), _reporter, _market, address(_disputeCrowdsourcer), _amountRedeemed, _repReceived, _payoutNumerators, getTimestamp());
        return true;
    }

    function logReportingParticipantDisavowed(IUniverse _universe, IMarket _market) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForReportingParticipant(IReportingParticipant(msg.sender)));
        emit ReportingParticipantDisavowed(address(_universe), address(_market), msg.sender);
        return true;
    }

    function logMarketParticipantsDisavowed(IUniverse _universe) public returns (bool) {
        require(isKnownUniverse(_universe));
        IMarket _market = IMarket(msg.sender);
        require(_universe.isContainerForMarket(_market));
        emit MarketParticipantsDisavowed(address(_universe), address(_market));
        return true;
    }

    function logMarketFinalized(IUniverse _universe, uint256[] memory _winningPayoutNumerators) public returns (bool) {
        require(isKnownUniverse(_universe));
        IMarket _market = IMarket(msg.sender);
        require(_universe.isContainerForMarket(_market));
        emit MarketFinalized(address(_universe), address(_market), getTimestamp(), _winningPayoutNumerators);
        return true;
    }

    function logMarketMigrated(IMarket _market, IUniverse _originalUniverse) public returns (bool) {
        IUniverse _newUniverse = IUniverse(msg.sender);
        require(isKnownUniverse(_newUniverse));
        emit MarketMigrated(address(_market), address(_originalUniverse), address(_newUniverse));
        return true;
    }

    function logOrderCanceled(IUniverse _universe, IMarket _market, address _creator, uint256 _tokenRefund, uint256 _sharesRefund, bytes32 _orderId) public returns (bool) {
        require(msg.sender == registry["CancelOrder"]);
        IOrders _orders = IOrders(registry["Orders"]);
        (Order.Types _orderType, address[] memory _addressData, uint256[] memory _uint256Data) = _orders.getOrderDataForLogs(_orderId);
        _addressData[1] = _creator;
        _uint256Data[3] = _tokenRefund;
        _uint256Data[4] = _sharesRefund;
        _uint256Data[7] = getTimestamp();
        emit OrderEvent(address(_universe), address(_market), OrderEventType.Cancel, _orderType, _orderId, 0, _addressData, _uint256Data);
        return true;
    }

    function logOrderCreated(IUniverse _universe, bytes32 _orderId, bytes32 _tradeGroupId) public returns (bool) {
        require(msg.sender == registry["Orders"]);
        IOrders _orders = IOrders(registry["Orders"]);
        (Order.Types _orderType, address[] memory _addressData, uint256[] memory _uint256Data) = _orders.getOrderDataForLogs(_orderId);
        _uint256Data[7] = getTimestamp();
        emit OrderEvent(address(_universe), address(_orders.getMarket(_orderId)), OrderEventType.Create, _orderType, _orderId, _tradeGroupId, _addressData, _uint256Data);
        return true;
    }

    function logOrderFilled(IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId) public returns (bool) {
        require(msg.sender == registry["FillOrder"]);
        IOrders _orders = IOrders(registry["Orders"]);
        (Order.Types _orderType, address[] memory _addressData, uint256[] memory _uint256Data) = _orders.getOrderDataForLogs(_orderId);
        _addressData[1] = _creator;
        _addressData[2] = _filler;
        _uint256Data[0] = _price;
        _uint256Data[5] = _fees;
        _uint256Data[6] = _amountFilled;
        _uint256Data[7] = getTimestamp();
        emit OrderEvent(address(_universe), address(_orders.getMarket(_orderId)), OrderEventType.Fill, _orderType, _orderId, _tradeGroupId, _addressData, _uint256Data);
        return true;
    }

    function logCompleteSetsPurchased(IUniverse _universe, IMarket _market, address _account, uint256 _numCompleteSets) public returns (bool) {
        require(msg.sender == registry["CompleteSets"]);
        emit CompleteSetsPurchased(address(_universe), address(_market), _account, _numCompleteSets, getMarketOpenInterest(_market), getTimestamp());
        return true;
    }

    function logCompleteSetsSold(IUniverse _universe, IMarket _market, address _account, uint256 _numCompleteSets, uint256 _fees) public returns (bool) {
        require(msg.sender == registry["CompleteSets"]);
        emit CompleteSetsSold(address(_universe), address(_market), _account, _numCompleteSets, getMarketOpenInterest(_market), _fees, getTimestamp());
        return true;
    }

    function getMarketOpenInterest(IMarket _market) public view returns (uint256) {
        if (_market.isFinalized()) {
            return 0;
        }
        return _market.getShareToken(0).totalSupply().mul(_market.getNumTicks());
    }

    function logTradingProceedsClaimed(IUniverse _universe, address _shareToken, address _sender, address _market, uint256 _outcome, uint256 _numShares, uint256 _numPayoutTokens, uint256 _finalTokenBalance, uint256 _fees) public returns (bool) {
        require(msg.sender == registry["ClaimTradingProceeds"]);
        emit TradingProceedsClaimed(address(_universe), _shareToken, _sender, _market, _outcome, _numShares, _numPayoutTokens, _finalTokenBalance, _fees, getTimestamp());
        return true;
    }

    function logUniverseForked(IMarket _forkingMarket) public returns (bool) {
        require(universes[msg.sender]);
        emit UniverseForked(msg.sender, _forkingMarket);
        return true;
    }

    function logReputationTokensTransferred(IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.getReputationToken() == IReputationToken(msg.sender));
        logTokensTransferred(address(_universe), msg.sender, _from, _to, _value, TokenType.ReputationToken, address(0), _fromBalance, _toBalance, 0);
        return true;
    }

    function logDisputeCrowdsourcerTokensTransferred(IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) public returns (bool) {
        IDisputeCrowdsourcer _disputeCrowdsourcer = IDisputeCrowdsourcer(msg.sender);
        require(isKnownCrowdsourcer(_disputeCrowdsourcer));
        logTokensTransferred(address(_universe), msg.sender, _from, _to, _value, TokenType.DisputeCrowdsourcer, address(_disputeCrowdsourcer.getMarket()), _fromBalance, _toBalance, 0);
        return true;
    }

    function logShareTokensTransferred(IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance, uint256 _outcome) public returns (bool) {
        IShareToken _shareToken = IShareToken(msg.sender);
        require(isKnownShareToken(_shareToken));
        logTokensTransferred(address(_universe), msg.sender, _from, _to, _value, TokenType.ShareToken, address(_shareToken.getMarket()), _fromBalance, _toBalance, _outcome);
        return true;
    }

    function logReputationTokensBurned(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.getReputationToken() == IReputationToken(msg.sender));
        logTokensBurned(address(_universe), msg.sender, _target, _amount, TokenType.ReputationToken, address(0), _totalSupply, _balance, 0);
        return true;
    }

    function logReputationTokensMinted(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.getReputationToken() == IReputationToken(msg.sender));
        logTokensMinted(address(_universe), msg.sender, _target, _amount, TokenType.ReputationToken, address(0), _totalSupply, _balance, 0);
        return true;
    }

    function logShareTokensBurned(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome) public returns (bool) {
        IShareToken _shareToken = IShareToken(msg.sender);
        require(isKnownShareToken(_shareToken));
        logTokensBurned(address(_universe), msg.sender, _target, _amount, TokenType.ShareToken, address(_shareToken.getMarket()), _totalSupply, _balance, _outcome);
        return true;
    }

    function logShareTokensMinted(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance, uint256 _outcome) public returns (bool) {
        IShareToken _shareToken = IShareToken(msg.sender);
        require(isKnownShareToken(_shareToken));
        logTokensMinted(address(_universe), msg.sender, _target, _amount, TokenType.ShareToken, address(_shareToken.getMarket()), _totalSupply, _balance, _outcome);
        return true;
    }

    function logDisputeCrowdsourcerTokensBurned(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) public returns (bool) {
        IDisputeCrowdsourcer _disputeCrowdsourcer = IDisputeCrowdsourcer(msg.sender);
        require(isKnownCrowdsourcer(_disputeCrowdsourcer));
        logTokensBurned(address(_universe), msg.sender, _target, _amount, TokenType.DisputeCrowdsourcer, address(_disputeCrowdsourcer.getMarket()), _totalSupply, _balance, 0);
        return true;
    }

    function logDisputeCrowdsourcerTokensMinted(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) public returns (bool) {
        IDisputeCrowdsourcer _disputeCrowdsourcer = IDisputeCrowdsourcer(msg.sender);
        require(isKnownCrowdsourcer(_disputeCrowdsourcer));
        logTokensMinted(address(_universe), msg.sender, _target, _amount, TokenType.DisputeCrowdsourcer, address(_disputeCrowdsourcer.getMarket()), _totalSupply, _balance, 0);
        return true;
    }

    function logDisputeWindowCreated(IDisputeWindow _disputeWindow, uint256 _id, bool _initial) public returns (bool) {
        require(universes[msg.sender]);
        emit DisputeWindowCreated(msg.sender, address(_disputeWindow), _disputeWindow.getStartTime(), _disputeWindow.getEndTime(), _id, _initial);
        return true;
    }

    function logParticipationTokensRedeemed(IUniverse _universe, address _account, uint256 _attoParticipationTokens, uint256 _feePayoutShare) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForDisputeWindow(IDisputeWindow(msg.sender)));
        emit ParticipationTokensRedeemed(address(_universe), msg.sender, _account, _attoParticipationTokens, _feePayoutShare, getTimestamp());
        return true;
    }

    function logTimestampSet(uint256 _newTimestamp) public returns (bool) {
        require(msg.sender == registry["Time"]);
        emit TimestampSet(_newTimestamp);
        return true;
    }

    function logInitialReporterTransferred(IUniverse _universe, IMarket _market, address _from, address _to) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForMarket(_market));
        require(msg.sender == address(_market.getInitialReporter()));
        emit InitialReporterTransferred(address(_universe), address(_market), _from, _to);
        return true;
    }

    function logMarketTransferred(IUniverse _universe, address _from, address _to) public returns (bool) {
        require(isKnownUniverse(_universe));
        IMarket _market = IMarket(msg.sender);
        require(_universe.isContainerForMarket(_market));
        emit MarketTransferred(address(_universe), address(_market), _from, _to);
        return true;
    }

    function logParticipationTokensTransferred(IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForDisputeWindow(IDisputeWindow(msg.sender)));
        logTokensTransferred(address(_universe), msg.sender, _from, _to, _value, TokenType.ParticipationToken, address(0), _fromBalance, _toBalance, 0);
        return true;
    }

    function logParticipationTokensBurned(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForDisputeWindow(IDisputeWindow(msg.sender)));
        logTokensBurned(address(_universe), msg.sender, _target, _amount, TokenType.ParticipationToken, address(0), _totalSupply, _balance, 0);
        return true;
    }

    function logParticipationTokensMinted(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply, uint256 _balance) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForDisputeWindow(IDisputeWindow(msg.sender)));
        logTokensMinted(address(_universe), msg.sender, _target, _amount, TokenType.ParticipationToken, address(0), _totalSupply, _balance, 0);
        return true;
    }

    function logTokensTransferred(address _universe, address _token, address _from, address _to, uint256 _amount, TokenType _tokenType, address _market, uint256 _fromBalance, uint256 _toBalance, uint256 _outcome) private returns (bool) {
        emit TokensTransferred(_universe, _token, _from, _to, _amount, _tokenType, _market);
        emit TokenBalanceChanged(_universe, _from, _token, _tokenType, _market, _fromBalance, _outcome);
        emit TokenBalanceChanged(_universe, _to, _token, _tokenType, _market, _toBalance, _outcome);
        return true;
    }

    function logTokensBurned(address _universe, address _token, address _target, uint256 _amount, TokenType _tokenType, address _market, uint256 _totalSupply, uint256 _balance, uint256 _outcome) private returns (bool) {
        emit TokensBurned(_universe, _token, _target, _amount, _tokenType, _market, _totalSupply);
        emit TokenBalanceChanged(_universe, _target, _token, _tokenType, _market, _balance, _outcome);
        return true;
    }

    function logTokensMinted(address _universe, address _token, address _target, uint256 _amount, TokenType _tokenType, address _market, uint256 _totalSupply, uint256 _balance, uint256 _outcome) private returns (bool) {
        emit TokensMinted(_universe, _token, _target, _amount, _tokenType, _market, _totalSupply);
        emit TokenBalanceChanged(_universe, _target, _token, _tokenType, _market, _balance, _outcome);
        return true;
    }

    function logOrderPriceChanged(IUniverse _universe, bytes32 _orderId) public returns (bool) {
        require(msg.sender == registry["Orders"]);
        IOrders _orders = IOrders(registry["Orders"]);
        (Order.Types _orderType, address[] memory _addressData, uint256[] memory _uint256Data) = _orders.getOrderDataForLogs(_orderId);
        _uint256Data[7] = getTimestamp();
        emit OrderEvent(address(_universe), address(_orders.getMarket(_orderId)), OrderEventType.ChangePrice, _orderType, _orderId, 0, _addressData, _uint256Data);
        return true;
    }

    function logMarketVolumeChanged(IUniverse _universe, address _market, uint256 _volume, uint256[] memory _outcomeVolumes) public returns (bool) {
        require(msg.sender == registry["FillOrder"]);
        emit MarketVolumeChanged(address(_universe), _market, _volume, _outcomeVolumes);
        return true;
    }

    function logProfitLossChanged(IMarket _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost) public returns (bool) {
        require(msg.sender == registry["ProfitLoss"]);
        emit ProfitLossChanged(address(_market.getUniverse()), address(_market), _account, _outcome, _netPosition, _avgPrice, _realizedProfit, _frozenFunds, _realizedCost, getTimestamp());
        return true;
    }
}
