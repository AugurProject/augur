pragma solidity 0.5.4;

import 'ROOT/IAugur.sol';
import 'ROOT/libraries/token/ERC20Token.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/factories/IUniverseFactory.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/reporting/IReputationToken.sol';
import 'ROOT/reporting/IReportingParticipant.sol';
import 'ROOT/reporting/IDisputeCrowdsourcer.sol';
import 'ROOT/reporting/IDisputeOverloadToken.sol';
import 'ROOT/reporting/IInitialReporter.sol';
import 'ROOT/trading/IShareToken.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/reporting/IAuction.sol';
import 'ROOT/reporting/IAuctionToken.sol';
import 'ROOT/ITime.sol';


// Centralized approval authority and event emissions
contract Augur is IAugur {
    using SafeMathUint256 for uint256;

    enum TokenType{
        ReputationToken,
        ShareToken,
        DisputeCrowdsourcer,
        FeeWindow, // No longer a valid type but here for backward compat with Augur Node processing
        FeeToken, // No longer a valid type but here for backward compat with Augur Node processing
        AuctionToken,
        DisputeOverloadToken
    }

    event MarketCreated(bytes32 indexed topic, string description, string extraInfo, address indexed universe, address market, address indexed marketCreator, bytes32[] outcomes, uint256 marketCreationFee, int256 minPrice, int256 maxPrice, IMarket.MarketType marketType);
    event InitialReportSubmitted(address indexed universe, address indexed reporter, address indexed market, uint256 amountStaked, bool isDesignatedReporter, uint256[] payoutNumerators, string description);
    event DisputeCrowdsourcerCreated(address indexed universe, address indexed market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 size);
    event DisputeCrowdsourcerContribution(address indexed universe, address indexed reporter, address indexed market, address disputeCrowdsourcer, uint256 amountStaked, string description);
    event DisputeCrowdsourcerCompleted(address indexed universe, address indexed market, address disputeCrowdsourcer);
    event InitialReporterRedeemed(address indexed universe, address indexed reporter, address indexed market, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators);
    event DisputeCrowdsourcerRedeemed(address indexed universe, address indexed reporter, address indexed market, address disputeCrowdsourcer, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators);
    event ReportingParticipantDisavowed(address indexed universe, address indexed market, address reportingParticipant);
    event MarketParticipantsDisavowed(address indexed universe, address indexed market);
    event MarketFinalized(address indexed universe, address indexed market);
    event MarketMigrated(address indexed market, address indexed originalUniverse, address indexed newUniverse);
    event UniverseForked(address indexed universe);
    event UniverseCreated(address indexed parentUniverse, address indexed childUniverse, uint256[] payoutNumerators);
    event OrderCanceled(address indexed universe, address indexed shareToken, address indexed sender, bytes32 orderId, Order.Types orderType, uint256 tokenRefund, uint256 sharesRefund);
    event OrderPriceChanged(address indexed universe, bytes32 orderId, uint256 price);
    // The ordering here is to match functions higher in the call chain to avoid stack depth issues
    event OrderCreated(Order.Types orderType, uint256 amount, uint256 price, address indexed creator, uint256 moneyEscrowed, uint256 sharesEscrowed, bytes32 tradeGroupId, bytes32 orderId, address indexed universe, address indexed shareToken);
    event OrderFilled(address indexed universe, address indexed shareToken, address filler, bytes32 orderId, uint256 numCreatorShares, uint256 numCreatorTokens, uint256 numFillerShares, uint256 numFillerTokens, uint256 marketCreatorFees, uint256 reporterFees, uint256 amountFilled, bytes32 tradeGroupId);
    event CompleteSetsPurchased(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 marketOI);
    event CompleteSetsSold(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 marketOI);
    event TradingProceedsClaimed(address indexed universe, address indexed shareToken, address indexed sender, address market, uint256 numShares, uint256 numPayoutTokens, uint256 finalTokenBalance);
    event TokensTransferred(address indexed universe, address indexed token, address indexed from, address to, uint256 value, TokenType tokenType, address market, uint256 fromBalance, uint256 toBalance);
    event TokensMinted(address indexed universe, address indexed token, address indexed target, uint256 amount, TokenType tokenType, address market, uint256 totalSupply);
    event TokensBurned(address indexed universe, address indexed token, address indexed target, uint256 amount, TokenType tokenType, address market, uint256 totalSupply);
    event DisputeWindowCreated(address indexed universe, address disputeWindow, uint256 startTime, uint256 endTime, uint256 id, bool initial);
    event InitialReporterTransferred(address indexed universe, address indexed market, address from, address to);
    event MarketTransferred(address indexed universe, address indexed market, address from, address to);
    event MarketVolumeChanged(address indexed universe, address indexed market, uint256 volume);
    event EscapeHatchChanged(bool isOn);
    event TimestampSet(uint256 newTimestamp);

    mapping(address => bool) private markets;
    mapping(address => bool) private universes;
    mapping(address => bool) private crowdsourcers;
    mapping(address => bool) private overloadTokens;
    mapping(address => bool) private shareTokens;
    mapping(address => bool) private auctionTokens;
    mapping(address => bool) private trustedSender;

    address public uploader;
    mapping(bytes32 => address) public registry;

    ITime public time;

    constructor() public {
        uploader = msg.sender;
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
        IUniverse _newUniverse = _universeFactory.createUniverse(this, _parentUniverse, _parentPayoutDistributionHash);
        universes[address(_newUniverse)] = true;
        trustedSender[address(_newUniverse.getAuction())] = true;
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
        overloadTokens[address(IDisputeCrowdsourcer(_disputeCrowdsourcer).getDisputeOverloadToken())] = true;
        emit DisputeCrowdsourcerCreated(address(_universe), _market, _disputeCrowdsourcer, _payoutNumerators, _size);
        return true;
    }

    function isKnownOverloadToken(IDisputeOverloadToken _disputeOverloadToken) public view returns (bool) {
        return overloadTokens[address(_disputeOverloadToken)];
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
    // Auction Tokens
    //
    function recordAuctionTokens(IUniverse _universe) public returns (bool) {
        require(isKnownUniverse(_universe));
        IAuction _auction = _universe.getAuction();
        IAuctionToken _ethAuctionToken = _auction.ethAuctionToken();
        IAuctionToken _repAuctionToken = _auction.repAuctionToken();
        if (_ethAuctionToken != IAuctionToken(0)) {
            auctionTokens[address(_ethAuctionToken)] = true;
        }
        if (_repAuctionToken != IAuctionToken(0)) {
            auctionTokens[address(_repAuctionToken)] = true;
        }
    }

    function isKnownAuctionToken(IAuctionToken _token) public view returns (bool) {
        return auctionTokens[address(_token)];
    }

    //
    // Transfer
    //

    function trustedTransfer(ERC20Token _token, address _from, address _to, uint256 _amount) public returns (bool) {
        require(trustedSender[msg.sender]);
        require(_token.transferFrom(_from, _to, _amount));
        return true;
    }

    //
    // Time
    //

    function getTimestamp() public view returns (uint256) {
        return time.getTimestamp();
    }

    //
    // Markets
    //

    function isValidMarket(IMarket _market) public view returns (bool) {
        return markets[address(_market)];
    }

    //
    // Logging
    //

    // This signature is intended for the categorical market creation. We use two signatures for the same event because of stack depth issues which can be circumvented by maintaining order of paramaters
    function logMarketCreated(bytes32 _topic, string memory _description, string memory _extraInfo, IUniverse _universe, IMarket _market, address _marketCreator, bytes32[] memory _outcomes, int256 _minPrice, int256 _maxPrice, IMarket.MarketType _marketType) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe == IUniverse(msg.sender));
        recordMarketShareTokens(_market);
        markets[address(_market)] = true;
        emit MarketCreated(_topic, _description, _extraInfo, address(_universe), address(_market), _marketCreator, _outcomes, _universe.getOrCacheMarketCreationCost(), _minPrice, _maxPrice, _marketType);
        return true;
    }

    // This signature is intended for yesNo and scalar market creation. See function comment above for explanation.
    function logMarketCreated(bytes32 _topic, string memory _description, string memory _extraInfo, IUniverse _universe, IMarket _market, address _marketCreator, int256 _minPrice, int256 _maxPrice, IMarket.MarketType _marketType) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe == IUniverse(msg.sender));
        recordMarketShareTokens(_market);
        markets[address(_market)] = true;
        emit MarketCreated(_topic, _description, _extraInfo, address(_universe), address(_market), _marketCreator, new bytes32[](0), _universe.getOrCacheMarketCreationCost(), _minPrice, _maxPrice, _marketType);
        return true;
    }

    function logInitialReportSubmitted(IUniverse _universe, address _reporter, address _market, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] memory _payoutNumerators, string memory _description) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForMarket(IMarket(msg.sender)));
        emit InitialReportSubmitted(address(_universe), _reporter, _market, _amountStaked, _isDesignatedReporter, _payoutNumerators, _description);
        return true;
    }

    function logDisputeCrowdsourcerContribution(IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string memory _description) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForMarket(IMarket(msg.sender)));
        emit DisputeCrowdsourcerContribution(address(_universe), _reporter, _market, _disputeCrowdsourcer, _amountStaked, _description);
        return true;
    }

    function logDisputeCrowdsourcerCompleted(IUniverse _universe, address _market, address _disputeCrowdsourcer) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForMarket(IMarket(msg.sender)));
        emit DisputeCrowdsourcerCompleted(address(_universe), _market, _disputeCrowdsourcer);
        return true;
    }

    function logInitialReporterRedeemed(IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] memory _payoutNumerators) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.isContainerForReportingParticipant(IReportingParticipant(msg.sender)));
        emit InitialReporterRedeemed(address(_universe), _reporter, _market, _amountRedeemed, _repReceived, _payoutNumerators);
        return true;
    }

    function logDisputeCrowdsourcerRedeemed(IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256[] memory _payoutNumerators) public returns (bool) {
        IDisputeCrowdsourcer _disputeCrowdsourcer = IDisputeCrowdsourcer(msg.sender);
        require(isKnownCrowdsourcer(_disputeCrowdsourcer));
        emit DisputeCrowdsourcerRedeemed(address(_universe), _reporter, _market, address(_disputeCrowdsourcer), _amountRedeemed, _repReceived, _payoutNumerators);
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

    function logMarketFinalized(IUniverse _universe) public returns (bool) {
        require(isKnownUniverse(_universe));
        IMarket _market = IMarket(msg.sender);
        require(_universe.isContainerForMarket(_market));
        emit MarketFinalized(address(_universe), address(_market));
        return true;
    }

    function logMarketMigrated(IMarket _market, IUniverse _originalUniverse) public returns (bool) {
        IUniverse _newUniverse = IUniverse(msg.sender);
        require(isKnownUniverse(_newUniverse));
        emit MarketMigrated(address(_market), address(_originalUniverse), address(_newUniverse));
        return true;
    }

    function logOrderCanceled(IUniverse _universe, address _shareToken, address _sender, bytes32 _orderId, Order.Types _orderType, uint256 _tokenRefund, uint256 _sharesRefund) public returns (bool) {
        require(msg.sender == registry["CancelOrder"]);
        emit OrderCanceled(address(_universe), _shareToken, _sender, _orderId, _orderType, _tokenRefund, _sharesRefund);
        return true;
    }

    function logOrderCreated(Order.Types _orderType, uint256 _amount, uint256 _price, address _creator, uint256 _moneyEscrowed, uint256 _sharesEscrowed, bytes32 _tradeGroupId, bytes32 _orderId, IUniverse _universe, address _shareToken) public returns (bool) {
        require(msg.sender == registry["Orders"]);
        emit OrderCreated(_orderType, _amount, _price, _creator, _moneyEscrowed, _sharesEscrowed, _tradeGroupId, _orderId, address(_universe), _shareToken);
        return true;
    }

    function logOrderFilled(IUniverse _universe, address _shareToken, address _filler, bytes32 _orderId, uint256 _numCreatorShares, uint256 _numCreatorTokens, uint256 _numFillerShares, uint256 _numFillerTokens, uint256 _marketCreatorFees, uint256 _reporterFees, uint256 _amountFilled, bytes32 _tradeGroupId) public returns (bool) {
        require(msg.sender == registry["FillOrder"]);
        emit OrderFilled(address(_universe), _shareToken, _filler, _orderId, _numCreatorShares, _numCreatorTokens, _numFillerShares, _numFillerTokens, _marketCreatorFees, _reporterFees, _amountFilled, _tradeGroupId);
        return true;
    }

    function logCompleteSetsPurchased(IUniverse _universe, IMarket _market, address _account, uint256 _numCompleteSets) public returns (bool) {
        require(msg.sender == registry["CompleteSets"]);
        emit CompleteSetsPurchased(address(_universe), address(_market), _account, _numCompleteSets, getMarketOpenInterest(_market));
        return true;
    }

    function logCompleteSetsSold(IUniverse _universe, IMarket _market, address _account, uint256 _numCompleteSets) public returns (bool) {
        require(msg.sender == registry["CompleteSets"]);
        emit CompleteSetsSold(address(_universe), address(_market), _account, _numCompleteSets, getMarketOpenInterest(_market));
        return true;
    }

    function getMarketOpenInterest(IMarket _market) public returns (uint256) {
        if (_market.isFinalized()) {
            return 0;
        }
        return _market.getShareToken(0).totalSupply().mul(_market.getNumTicks());
    }

    function logTradingProceedsClaimed(IUniverse _universe, address _shareToken, address _sender, address _market, uint256 _numShares, uint256 _numPayoutTokens, uint256 _finalTokenBalance) public returns (bool) {
        require(msg.sender == registry["ClaimTradingProceeds"]);
        emit TradingProceedsClaimed(address(_universe), _shareToken, _sender, _market, _numShares, _numPayoutTokens, _finalTokenBalance);
        return true;
    }

    function logUniverseForked() public returns (bool) {
        require(universes[msg.sender]);
        emit UniverseForked(msg.sender);
        return true;
    }

    function logReputationTokensTransferred(IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.getReputationToken() == IReputationToken(msg.sender));
        emit TokensTransferred(address(_universe), msg.sender, _from, _to, _value, TokenType.ReputationToken, address(0), _fromBalance, _toBalance);
        return true;
    }

    function logDisputeCrowdsourcerTokensTransferred(IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) public returns (bool) {
        IDisputeCrowdsourcer _disputeCrowdsourcer = IDisputeCrowdsourcer(msg.sender);
        require(isKnownCrowdsourcer(_disputeCrowdsourcer));
        emit TokensTransferred(address(_universe), msg.sender, _from, _to, _value, TokenType.DisputeCrowdsourcer, address(_disputeCrowdsourcer.getMarket()), _fromBalance, _toBalance);
        return true;
    }

    function logDisputeOverloadTokensTransferred(IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) public returns (bool) {
        IDisputeOverloadToken _disputeOverloadToken = IDisputeOverloadToken(msg.sender);
        require(isKnownOverloadToken(_disputeOverloadToken));
        emit TokensTransferred(address(_universe), msg.sender, _from, _to, _value, TokenType.DisputeOverloadToken, address(_disputeOverloadToken.getMarket()), _fromBalance, _toBalance);
        return true;
    }

    function logShareTokensTransferred(IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) public returns (bool) {
        IShareToken _shareToken = IShareToken(msg.sender);
        require(isKnownShareToken(_shareToken));
        emit TokensTransferred(address(_universe), msg.sender, _from, _to, _value, TokenType.ShareToken, address(_shareToken.getMarket()), _fromBalance, _toBalance);
        return true;
    }

    function logReputationTokenBurned(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.getReputationToken() == IReputationToken(msg.sender));
        emit TokensBurned(address(_universe), msg.sender, _target, _amount, TokenType.ReputationToken, address(0), _totalSupply);
        return true;
    }

    function logReputationTokenMinted(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply) public returns (bool) {
        require(isKnownUniverse(_universe));
        require(_universe.getReputationToken() == IReputationToken(msg.sender));
        emit TokensMinted(address(_universe), msg.sender, _target, _amount, TokenType.ReputationToken, address(0), _totalSupply);
        return true;
    }

    function logShareTokenBurned(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply) public returns (bool) {
        IShareToken _shareToken = IShareToken(msg.sender);
        require(isKnownShareToken(_shareToken));
        emit TokensBurned(address(_universe), msg.sender, _target, _amount, TokenType.ShareToken, address(_shareToken.getMarket()), _totalSupply);
        return true;
    }

    function logShareTokenMinted(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply) public returns (bool) {
        IShareToken _shareToken = IShareToken(msg.sender);
        require(isKnownShareToken(_shareToken));
        emit TokensMinted(address(_universe), msg.sender, _target, _amount, TokenType.ShareToken, address(_shareToken.getMarket()), _totalSupply);
        return true;
    }

    function logDisputeCrowdsourcerTokensBurned(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply) public returns (bool) {
        IDisputeCrowdsourcer _disputeCrowdsourcer = IDisputeCrowdsourcer(msg.sender);
        require(isKnownCrowdsourcer(_disputeCrowdsourcer));
        emit TokensBurned(address(_universe), msg.sender, _target, _amount, TokenType.DisputeCrowdsourcer, address(_disputeCrowdsourcer.getMarket()), _totalSupply);
        return true;
    }

    function logDisputeCrowdsourcerTokensMinted(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply) public returns (bool) {
        IDisputeCrowdsourcer _disputeCrowdsourcer = IDisputeCrowdsourcer(msg.sender);
        require(isKnownCrowdsourcer(_disputeCrowdsourcer));
        emit TokensMinted(address(_universe), msg.sender, _target, _amount, TokenType.DisputeCrowdsourcer, address(_disputeCrowdsourcer.getMarket()), _totalSupply);
        return true;
    }

    function logDisputeOverloadTokensBurned(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply) public returns (bool) {
        IDisputeOverloadToken _disputeOverloadToken = IDisputeOverloadToken(msg.sender);
        require(isKnownOverloadToken(_disputeOverloadToken));
        emit TokensBurned(address(_universe), msg.sender, _target, _amount, TokenType.DisputeOverloadToken, address(_disputeOverloadToken.getMarket()), _totalSupply);
        return true;
    }

    function logDisputeOverloadTokensMinted(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply) public returns (bool) {
        IDisputeOverloadToken _disputeOverloadToken = IDisputeOverloadToken(msg.sender);
        require(isKnownOverloadToken(_disputeOverloadToken));
        emit TokensMinted(address(_universe), msg.sender, _target, _amount, TokenType.DisputeOverloadToken, address(_disputeOverloadToken.getMarket()), _totalSupply);
        return true;
    }

    function logDisputeWindowCreated(IDisputeWindow _disputeWindow, uint256 _id, bool _initial) public returns (bool) {
        require(universes[msg.sender]);
        emit DisputeWindowCreated(msg.sender, address(_disputeWindow), _disputeWindow.getStartTime(), _disputeWindow.getEndTime(), _id, _initial);
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

    function logAuctionTokensTransferred(IUniverse _universe, address _from, address _to, uint256 _value, uint256 _fromBalance, uint256 _toBalance) public returns (bool) {
        require(isKnownAuctionToken(IAuctionToken(msg.sender)));
        emit TokensTransferred(address(_universe), msg.sender, _from, _to, _value, TokenType.AuctionToken, address(0), _fromBalance, _toBalance);
        return true;
    }

    function logAuctionTokenBurned(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply) public returns (bool) {
        require(isKnownAuctionToken(IAuctionToken(msg.sender)));
        emit TokensBurned(address(_universe), msg.sender, _target, _amount, TokenType.AuctionToken, address(0), _totalSupply);
        return true;
    }

    function logAuctionTokenMinted(IUniverse _universe, address _target, uint256 _amount, uint256 _totalSupply) public returns (bool) {
        require(isKnownAuctionToken(IAuctionToken(msg.sender)));
        emit TokensMinted(address(_universe), msg.sender, _target, _amount, TokenType.AuctionToken, address(0), _totalSupply);
        return true;
    }

    function logOrderPriceChanged(IUniverse _universe, bytes32 _orderId, uint256 _price) public returns (bool) {
        require(msg.sender == registry["Orders"]);
        emit OrderPriceChanged(address(_universe), _orderId, _price);
        return true;
    }

    function logMarketVolumeChanged(IUniverse _universe, address _market, uint256 _volume) public returns (bool) {
        require(msg.sender == registry["FillOrder"]);
        emit MarketVolumeChanged(address(_universe), _market, _volume);
        return true;
    }
}
