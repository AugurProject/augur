pragma solidity 0.5.10;
pragma experimental ABIEncoderV2;


import 'ROOT/trading/IFillOrder.sol';
import 'ROOT/libraries/ReentrancyGuard.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/trading/ICompleteSets.sol';
import 'ROOT/trading/IOrders.sol';
import 'ROOT/trading/IShareToken.sol';
import 'ROOT/trading/IProfitLoss.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/libraries/Initializable.sol';


library Trade {
    using SafeMathUint256 for uint256;

    enum Direction {
        Long,
        Short
    }

    struct StoredContracts {
        IAugur augur;
        IOrders orders;
        ICompleteSets completeSets;
        ICash denominationToken;
        IProfitLoss profitLoss;
    }

    struct Contracts {
        IOrders orders;
        IMarket market;
        ICompleteSets completeSets;
        ICash denominationToken;
        IShareToken longShareToken;
        IShareToken[] shareTokens;
        IAugur augur;
        IUniverse universe;
        IProfitLoss profitLoss;
    }

    struct FilledOrder {
        bytes32 orderId;
        uint256 outcome;
        IERC20 kycToken;
        uint256 sharePriceRange;
        uint256 sharePriceLong;
        uint256 sharePriceShort;
    }

    struct Participant {
        address participantAddress;
        Direction direction;
        uint256 startingSharesToSell;
        uint256 startingSharesToBuy;
        uint256 sharesToSell;
        uint256 sharesToBuy;
    }

    struct Data {
        Contracts contracts;
        FilledOrder order;
        Participant creator;
        Participant filler;
        address longFundsAccount;
        address shortFundsAccount;
        address affiliateAddress;
    }

    struct OrderData {
        IMarket market;
        uint256 outcome;
        IERC20 kycToken;
        uint256 price;
        Order.Types orderType;
        uint256 sharesEscrowed;
        uint256 amount;
        address creator;
        bytes32 orderId;
    }

    //
    // Constructor
    //

    function create(StoredContracts memory _storedContracts, bytes32 _orderId, address _fillerAddress, uint256 _fillerSize, address _affiliateAddress) internal view returns (Data memory) {
        OrderData memory _orderData = createOrderDataWithOrderId(_storedContracts, _orderId);

        return createWithData(_storedContracts, _orderData, _fillerAddress, _fillerSize, _affiliateAddress);
    }

    function createWithData(StoredContracts memory _storedContracts, OrderData memory _orderData, address _fillerAddress, uint256 _fillerSize, address _affiliateAddress) internal view returns (Data memory) {
        Contracts memory _contracts = getContracts(_storedContracts, _orderData.market, _orderData.outcome);
        FilledOrder memory _order = getOrder(_contracts, _orderData.outcome, _orderData.kycToken, _orderData.price, _orderData.orderId);
        Participant memory _creator = getMaker(_orderData.sharesEscrowed, _orderData.amount, _orderData.creator, _orderData.orderType);
        Participant memory _filler = getFiller(_contracts, _orderData.outcome, _orderData.orderType, _fillerAddress, _fillerSize);

        // Signed orders which have no order id get their funds from the signed order "creator" whereas on chain orders have funds escrowed.
        address _creatorFundsSource = _orderData.orderId == bytes32(0) ? _creator.participantAddress : address(_contracts.market);

        return Data({
            contracts: _contracts,
            order: _order,
            creator: _creator,
            filler: _filler,
            longFundsAccount: _creator.direction == Direction.Long ? _creatorFundsSource : _filler.participantAddress,
            shortFundsAccount: _creator.direction == Direction.Short ? _creatorFundsSource : _filler.participantAddress,
            affiliateAddress: _affiliateAddress
        });
    }

    function createOrderDataWithOrderId(StoredContracts memory _storedContracts, bytes32 _orderId) internal view returns (OrderData memory) {
        IOrders _orders = _storedContracts.orders;

        return OrderData({
            market: _orders.getMarket(_orderId),
            outcome: _orders.getOutcome(_orderId),
            kycToken: _orders.getKYCToken(_orderId),
            price: _orders.getPrice(_orderId),
            orderType: _orders.getOrderType(_orderId),
            sharesEscrowed: _orders.getOrderSharesEscrowed(_orderId),
            amount: _orders.getAmount(_orderId),
            creator: _orders.getOrderCreator(_orderId),
            orderId: _orderId
        });
    }

    function createOrderData(IMarket _market, uint256 _outcome, IERC20 _kycToken, uint256 _price, Order.Types _orderType, uint256 _amount, address _creator) internal view returns (OrderData memory) {
        uint256 _sharesAvailable = getSharesAvailable(_market, _orderType, _outcome, _amount, _creator);

        return OrderData({
            market: _market,
            outcome: _outcome,
            kycToken: _kycToken,
            price: _price,
            orderType: _orderType,
            sharesEscrowed: _sharesAvailable,
            amount: _amount,
            creator: _creator,
            orderId: bytes32(0)
        });
    }

    function getSharesAvailable(IMarket _market, Order.Types _orderType, uint256 _outcome, uint256 _amount, address _creator) private view returns (uint256) {
        // Figure out how many almost-complete-sets (just missing `outcome` share) the creator has
        uint256 _attosharesHeld = 2**254;
        if (_orderType == Order.Types.Bid) {
            IShareToken[] memory _shareTokens = _market.getShareTokens();
            uint256 _numOutcomes = _shareTokens.length;
            uint256 _i = 0;
            for (; _attosharesHeld > 0 && _i < _outcome; _i++) {
                uint256 _creatorShareTokenBalance = _shareTokens[_i].balanceOf(_creator);
                _attosharesHeld = _creatorShareTokenBalance.min(_attosharesHeld);
            }
            for (_i++; _attosharesHeld > 0 && _i < _numOutcomes; _i++) {
                uint256 _creatorShareTokenBalance = _shareTokens[_i].balanceOf(_creator);
                _attosharesHeld = _creatorShareTokenBalance.min(_attosharesHeld);
            }
        } else {
            _attosharesHeld = _market.getShareToken(_outcome).balanceOf(_creator);
        }

        return _attosharesHeld.min(_amount);
    }

    //
    // "public" functions
    //

    function tradeMakerSharesForFillerShares(Data memory _data) internal returns (uint256, uint256) {
        uint256 _numberOfCompleteSets = _data.creator.sharesToSell.min(_data.filler.sharesToSell);
        if (_numberOfCompleteSets == 0) {
            return (0, 0);
        }

        // transfer shares and sell complete sets distributing payouts based on the price
        uint256 _marketCreatorFees;
        uint256 _reporterFees;
        (_marketCreatorFees, _reporterFees) = _data.contracts.completeSets.jointSellCompleteSets(_data.contracts.market, _numberOfCompleteSets, _data.shortFundsAccount, _data.longFundsAccount, _data.order.outcome, getLongShareSellerDestination(_data), getShortShareSellerDestination(_data), _data.order.sharePriceLong, _data.affiliateAddress);

        // update available shares for creator and filler
        _data.creator.sharesToSell -= _numberOfCompleteSets;
        _data.filler.sharesToSell -= _numberOfCompleteSets;
        return (_marketCreatorFees, _reporterFees);
    }

    function tradeMakerSharesForFillerTokens(Data memory _data) internal returns (bool) {
        uint256 _numberOfSharesToTrade = _data.creator.sharesToSell.min(_data.filler.sharesToBuy);
        if (_numberOfSharesToTrade == 0) {
            return true;
        }

        // transfer shares from creator (escrowed in market) to filler
        if (_data.creator.direction == Direction.Short) {
            _data.contracts.longShareToken.trustedFillOrderTransfer(_data.shortFundsAccount, _data.filler.participantAddress, _numberOfSharesToTrade);
        } else {
            uint256 _i = 0;
            for (; _i < _data.order.outcome; ++_i) {
                _data.contracts.shareTokens[_i].trustedFillOrderTransfer(_data.longFundsAccount, _data.filler.participantAddress, _numberOfSharesToTrade);
            }
            for (++_i; _i < _data.contracts.shareTokens.length; ++_i) {
                _data.contracts.shareTokens[_i].trustedFillOrderTransfer(_data.longFundsAccount, _data.filler.participantAddress, _numberOfSharesToTrade);
            }
        }

        uint256 _tokensToCover = getTokensToCover(_data, _data.filler.direction, _numberOfSharesToTrade);
        _data.contracts.augur.trustedTransfer(_data.contracts.denominationToken, _data.filler.participantAddress, _data.creator.participantAddress, _tokensToCover);

        // update available assets for creator and filler
        _data.creator.sharesToSell -= _numberOfSharesToTrade;
        _data.filler.sharesToBuy -= _numberOfSharesToTrade;
        return true;
    }

    function tradeMakerTokensForFillerShares(Data memory _data) internal returns (bool) {
        uint256 _numberOfSharesToTrade = _data.filler.sharesToSell.min(_data.creator.sharesToBuy);
        if (_numberOfSharesToTrade == 0) {
            return true;
        }

        // transfer shares from filler to creator
        if (_data.filler.direction == Direction.Short) {
            _data.contracts.longShareToken.trustedFillOrderTransfer(_data.filler.participantAddress, _data.creator.participantAddress, _numberOfSharesToTrade);
        } else {
            uint256 _i = 0;
            for (; _i < _data.order.outcome; ++_i) {
                _data.contracts.shareTokens[_i].trustedFillOrderTransfer(_data.filler.participantAddress, _data.creator.participantAddress, _numberOfSharesToTrade);
            }
            for (++_i; _i < _data.contracts.shareTokens.length; ++_i) {
                _data.contracts.shareTokens[_i].trustedFillOrderTransfer(_data.filler.participantAddress, _data.creator.participantAddress, _numberOfSharesToTrade);
            }
        }

        // transfer tokens from creator (taken from the signer for signed orders, escrowed in market for on chain orders) to filler
        uint256 _tokensToCover = getTokensToCover(_data, _data.creator.direction, _numberOfSharesToTrade);
        if (_data.order.orderId == bytes32(0)) {
            // No order Id indicates this is a signed order
            _data.contracts.augur.trustedTransfer(_data.contracts.denominationToken, _data.creator.participantAddress, _data.filler.participantAddress, _tokensToCover);
        } else {
            _data.contracts.universe.withdraw(_data.filler.participantAddress, _tokensToCover, address(_data.contracts.market));
        }

        // update available assets for creator and filler
        _data.creator.sharesToBuy -= _numberOfSharesToTrade;
        _data.filler.sharesToSell -= _numberOfSharesToTrade;
        return true;
    }

    function tradeMakerTokensForFillerTokens(Data memory _data) internal returns (uint256) {
        uint256 _numberOfCompleteSets = _data.creator.sharesToBuy.min(_data.filler.sharesToBuy);
        if (_numberOfCompleteSets == 0) {
            return 0;
        }

        // If someone is filling their own order with CASH both ways we just return the CASH
        if (_data.creator.participantAddress == _data.filler.participantAddress) {
            uint256 _creatorTokensToCover = getTokensToCover(_data, _data.creator.direction, _numberOfCompleteSets);
            uint256 _fillerTokensToCover = getTokensToCover(_data, _data.filler.direction, _numberOfCompleteSets);
            _data.contracts.universe.withdraw(_data.creator.participantAddress, _creatorTokensToCover, address(_data.contracts.market));

            _data.creator.sharesToBuy -= _numberOfCompleteSets;
            _data.filler.sharesToBuy -= _numberOfCompleteSets;
            return _creatorTokensToCover.add(_fillerTokensToCover);
        }

        // buy complete sets and distribute shares to participants
        address _longRecipient = getLongShareBuyerDestination(_data);
        address _shortRecipient = getShortShareBuyerDestination(_data);

        _data.contracts.completeSets.jointBuyCompleteSets(_data.contracts.market, _numberOfCompleteSets, _data.longFundsAccount, _data.shortFundsAccount, _data.order.outcome, _longRecipient, _shortRecipient, _data.order.sharePriceLong);

        _data.creator.sharesToBuy -= _numberOfCompleteSets;
        _data.filler.sharesToBuy -= _numberOfCompleteSets;
        return 0;
    }

    //
    // Helpers
    //

    function getLongShareBuyerDestination(Data memory _data) internal pure returns (address) {
        return (_data.creator.direction == Direction.Long) ? _data.creator.participantAddress : _data.filler.participantAddress;
    }

    function getShortShareBuyerDestination(Data memory _data) internal pure returns (address) {
        return (_data.creator.direction == Direction.Short) ? _data.creator.participantAddress : _data.filler.participantAddress;
    }

    function getLongShareSellerSource(Data memory _data) internal pure returns (address) {
        return (_data.creator.direction == Direction.Short) ? address(_data.contracts.market) : _data.filler.participantAddress;
    }

    function getShortShareSellerSource(Data memory _data) internal pure returns (address) {
        return (_data.creator.direction == Direction.Long) ? address(_data.contracts.market) : _data.filler.participantAddress;
    }

    function getLongShareSellerDestination(Data memory _data) internal pure returns (address) {
        return (_data.creator.direction == Direction.Short) ? _data.creator.participantAddress : _data.filler.participantAddress;
    }

    function getShortShareSellerDestination(Data memory _data) internal pure returns (address) {
        return (_data.creator.direction == Direction.Long) ? _data.creator.participantAddress : _data.filler.participantAddress;
    }

    function getMakerSharesDepleted(Data memory _data) internal pure returns (uint256) {
        return _data.creator.startingSharesToSell.sub(_data.creator.sharesToSell);
    }

    function getFillerSharesDepleted(Data memory _data) internal pure returns (uint256) {
        return _data.filler.startingSharesToSell.sub(_data.filler.sharesToSell);
    }

    function getMakerTokensDepleted(Data memory _data) internal pure returns (uint256) {
        return getTokensDepleted(_data, _data.creator.direction, _data.creator.startingSharesToBuy, _data.creator.sharesToBuy);
    }

    function getFillerTokensDepleted(Data memory _data) internal pure returns (uint256) {
        return getTokensDepleted(_data, _data.filler.direction, _data.filler.startingSharesToBuy, _data.filler.sharesToBuy);
    }

    function getTokensDepleted(Data memory _data, Direction _direction, uint256 _startingSharesToBuy, uint256 _endingSharesToBuy) internal pure returns (uint256) {
        return _startingSharesToBuy
            .sub(_endingSharesToBuy)
            .mul((_direction == Direction.Long) ? _data.order.sharePriceLong : _data.order.sharePriceShort);
    }

    function getTokensToCover(Data memory _data, Direction _direction, uint256 _numShares) internal pure returns (uint256) {
        return getTokensToCover(_direction, _data.order.sharePriceLong, _data.order.sharePriceShort, _numShares);
    }

    //
    // Construction helpers
    //

    function getContracts(StoredContracts memory _storedContracts, IMarket _market, uint256 _outcome) private view returns (Contracts memory) {
        IShareToken[] memory _shareTokens = _market.getShareTokens();
        return Contracts({
            orders: _storedContracts.orders,
            market: _market,
            completeSets: _storedContracts.completeSets,
            denominationToken: _storedContracts.denominationToken,
            longShareToken: _shareTokens[_outcome],
            shareTokens: _shareTokens,
            augur: _storedContracts.augur,
            universe: _market.getUniverse(),
            profitLoss: _storedContracts.profitLoss
        });
    }

    function getOrder(Contracts memory _contracts, uint256 _outcome, IERC20 _kycToken, uint256 _price, bytes32 _orderId) private view returns (FilledOrder memory) {
        uint256 _sharePriceRange;
        uint256 _sharePriceLong;
        uint256 _sharePriceShort;
        (_sharePriceRange, _sharePriceLong, _sharePriceShort) = getSharePriceDetails(_contracts.market, _price);
        return FilledOrder({
            orderId: _orderId,
            outcome: _outcome,
            kycToken: _kycToken,
            sharePriceRange: _sharePriceRange,
            sharePriceLong: _sharePriceLong,
            sharePriceShort: _sharePriceShort
        });
    }

    function getMaker(uint256 _sharesEscrowed, uint256 _amount, address _creator, Order.Types _orderOrderType) private pure returns (Participant memory) {
        Direction _direction = (_orderOrderType == Order.Types.Bid) ? Direction.Long : Direction.Short;
        uint256 _sharesToBuy = _amount.sub(_sharesEscrowed);
        return Participant({
            participantAddress: _creator,
            direction: _direction,
            startingSharesToSell: _sharesEscrowed,
            startingSharesToBuy: _sharesToBuy,
            sharesToSell: _sharesEscrowed,
            sharesToBuy: _sharesToBuy
        });
    }

    function getFiller(Contracts memory _contracts, uint256 _longOutcome, Order.Types _orderOrderType, address _address, uint256 _size) private view returns (Participant memory) {
        Direction _direction = (_orderOrderType == Order.Types.Bid) ? Direction.Short : Direction.Long;
        uint256 _sharesToSell = 0;
        _sharesToSell = getFillerSharesToSell(_contracts.shareTokens, _longOutcome, _address, _direction, _size);
        uint256 _sharesToBuy = _size.sub(_sharesToSell);
        return Participant({
            participantAddress: _address,
            direction: _direction,
            startingSharesToSell: _sharesToSell,
            startingSharesToBuy: _sharesToBuy,
            sharesToSell: _sharesToSell,
            sharesToBuy: _sharesToBuy
        });
    }

    function getTokensToCover(Direction _direction, uint256 _sharePriceLong, uint256 _sharePriceShort, uint256 _numShares) internal pure returns (uint256) {
        return _numShares.mul((_direction == Direction.Long) ? _sharePriceLong : _sharePriceShort);
    }

    function getSharePriceDetails(IMarket _market, uint256 _price) private view returns (uint256 _sharePriceRange, uint256 _sharePriceLong, uint256 _sharePriceShort) {
        uint256 _numTicks = _market.getNumTicks();
        _sharePriceShort = uint256(_numTicks.sub(_price));
        return (_numTicks, _price, _sharePriceShort);
    }

    function getFillerSharesToSell(IShareToken[] memory _shareTokens, uint256 _longOutcome, address _filler, Direction _fillerDirection, uint256 _fillerSize) private view returns (uint256) {
        uint256 _sharesAvailable = SafeMathUint256.getUint256Max();
        if (_fillerDirection == Direction.Short) {
            _sharesAvailable = _shareTokens[_longOutcome].balanceOf(_filler);
        } else {
            uint256 _outcome = 0;
            for (; _sharesAvailable > 0 && _outcome < _longOutcome; ++_outcome) {
                _sharesAvailable = _shareTokens[_outcome].balanceOf(_filler).min(_sharesAvailable);
            }
            for (++_outcome; _sharesAvailable > 0 && _outcome < _shareTokens.length; ++_outcome) {
                _sharesAvailable = _shareTokens[_outcome].balanceOf(_filler).min(_sharesAvailable);
            }
        }
        return _sharesAvailable.min(_fillerSize);
    }
}


/**
 * @title Fill Order
 * @notice Exposes functions to fill an order on the book
 */
contract FillOrder is Initializable, ReentrancyGuard, IFillOrder {
    using SafeMathUint256 for uint256;
    using Trade for Trade.Data;

    address public ZeroXTrade;
    address public trade;

    Trade.StoredContracts private storedContracts;

    mapping (address => uint256[]) public marketOutcomeVolumes;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        storedContracts = Trade.StoredContracts({
            augur: _augur,
            orders: IOrders(_augur.lookup("Orders")),
            completeSets: ICompleteSets(_augur.lookup("CompleteSets")),
            denominationToken: ICash(_augur.lookup("Cash")),
            profitLoss: IProfitLoss(_augur.lookup("ProfitLoss"))
        });
        trade = _augur.lookup("Trade");
        ZeroXTrade = _augur.lookup("ZeroXTrade");
    }

    /**
     * @notice Fill an order
     * @param _orderId The id of the order to fill
     * @param _amountFillerWants The number of attoShares desired
     * @param _tradeGroupId A Bytes32 value used when attempting to associate multiple orderbook actions with a single TX
     * @param _affiliateAddress Address of an affiliate to receive a portion of settlement fees from this trade should settlement occur
     * @return The amount remaining the filler wants
     */
    function publicFillOrder(bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, address _affiliateAddress) external returns (uint256) {
        address _filler = msg.sender;
        Trade.Data memory _tradeData = Trade.create(storedContracts, _orderId, _filler, _amountFillerWants, _affiliateAddress);
        uint256 _result = fillOrderInternal(_filler, _tradeData, _amountFillerWants, _tradeGroupId);
        _tradeData.contracts.market.assertBalances(address(_tradeData.contracts.orders));
        return _result;
    }

    function fillOrder(address _filler, bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, address _affiliateAddress) external returns (uint256) {
        require(msg.sender == trade || msg.sender == address(this));
        Trade.Data memory _tradeData = Trade.create(storedContracts, _orderId, _filler, _amountFillerWants, _affiliateAddress);
        return fillOrderInternal(_filler, _tradeData, _amountFillerWants, _tradeGroupId);
    }

    function fillZeroXOrder(IMarket _market, uint256 _outcome, IERC20 _kycToken, uint256 _price, Order.Types _orderType, uint256 _amount, address _creator, bytes32 _tradeGroupId, address _affiliateAddress, address _filler) external returns (uint256) {
        require(msg.sender == ZeroXTrade);
        Trade.OrderData memory _orderData = Trade.createOrderData(_market, _outcome, _kycToken, _price, _orderType, _amount, _creator);
        Trade.Data memory _tradeData = Trade.createWithData(storedContracts, _orderData, _filler, _amount, _affiliateAddress);
        return fillOrderInternal(_filler, _tradeData, _amount, _tradeGroupId);
    }

    function fillOrderInternal(address _filler, Trade.Data memory _tradeData, uint256 _amountFillerWants, bytes32 _tradeGroupId) internal nonReentrant returns (uint256) {
        require(_tradeData.order.kycToken == IERC20(0) || _tradeData.order.kycToken.balanceOf(_filler) > 0, "FillOrder.fillOrder: KYC token failure");
        uint256 _marketCreatorFees;
        uint256 _reporterFees;
        (_marketCreatorFees, _reporterFees) = _tradeData.tradeMakerSharesForFillerShares();
        _tradeData.tradeMakerTokensForFillerShares();
        _tradeData.tradeMakerSharesForFillerTokens();
        uint256 _tokensRefunded = _tradeData.tradeMakerTokensForFillerTokens();

        sellCompleteSets(_tradeData);

        uint256 _amountRemainingFillerWants = _tradeData.filler.sharesToSell.add(_tradeData.filler.sharesToBuy);
        uint256 _amountFilled = _amountFillerWants.sub(_amountRemainingFillerWants);
        if (_tradeData.order.orderId != bytes32(0)) {
            _tradeData.contracts.orders.recordFillOrder(_tradeData.order.orderId, _tradeData.getMakerSharesDepleted(), _tradeData.getMakerTokensDepleted(), _amountFilled);
        }
        logOrderFilled(_tradeData, _tradeData.order.sharePriceLong, _marketCreatorFees.add(_reporterFees), _amountFilled, _tradeGroupId);
        logAndUpdateVolume(_tradeData);
        uint256 _totalFees = _marketCreatorFees.add(_reporterFees);
        if (_totalFees > 0) {
            uint256 _longFees = _totalFees.mul(_tradeData.order.sharePriceLong).div(_tradeData.contracts.market.getNumTicks());
            uint256 _shortFees = _totalFees.sub(_longFees);
            _tradeData.contracts.profitLoss.adjustTraderProfitForFees(_tradeData.contracts.market, _tradeData.getLongShareBuyerDestination(), _tradeData.order.outcome, _longFees);
            _tradeData.contracts.profitLoss.adjustTraderProfitForFees(_tradeData.contracts.market, _tradeData.getShortShareBuyerDestination(), _tradeData.order.outcome, _shortFees);
        }
        updateProfitLoss(_tradeData, _amountFilled);
        if (_tradeData.creator.participantAddress == _tradeData.filler.participantAddress) {
            _tradeData.contracts.profitLoss.recordFrozenFundChange(_tradeData.contracts.universe, _tradeData.contracts.market, _tradeData.creator.participantAddress, _tradeData.order.outcome, -int256(_tokensRefunded));
        }
        return _amountRemainingFillerWants;
    }

    function sellCompleteSets(Trade.Data memory _tradeData) internal returns (bool) {
        address _filler = _tradeData.filler.participantAddress;
        address _creator = _tradeData.creator.participantAddress;
        IMarket _market = _tradeData.contracts.market;

        uint256 _numOutcomes = _tradeData.contracts.shareTokens.length;

        uint256 _fillerCompleteSets = _tradeData.contracts.shareTokens[0].balanceOf(_filler);
        for (uint256 _outcome = 1; _fillerCompleteSets > 0 && _outcome < _numOutcomes; ++_outcome) {
            _fillerCompleteSets = _fillerCompleteSets.min(_tradeData.contracts.shareTokens[_outcome].balanceOf(_filler));
        }

        uint256 _creatorCompleteSets = _tradeData.contracts.shareTokens[0].balanceOf(_creator);
        for (uint256 _outcome = 1; _creatorCompleteSets > 0 && _outcome < _numOutcomes; ++_outcome) {
            _creatorCompleteSets = _creatorCompleteSets.min(_tradeData.contracts.shareTokens[_outcome].balanceOf(_creator));
        }

        if (_fillerCompleteSets > 0) {
            _tradeData.contracts.completeSets.sellCompleteSets(_filler, _market, _fillerCompleteSets, _tradeData.affiliateAddress);
        }

        if (_creatorCompleteSets > 0) {
            _tradeData.contracts.completeSets.sellCompleteSets(_creator, _market, _creatorCompleteSets, _tradeData.affiliateAddress);
        }

        return true;
    }

    // TODO when orderId is bytes32(0) will need special handling
    function logOrderFilled(Trade.Data memory _tradeData, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _tradeGroupId) private returns (bool) {
        if (_tradeData.order.orderId == bytes32(0)) {
            address[] memory _addressData = new address[](3);
            uint256[] memory _uint256Data = new uint256[](10);
            Order.Types _orderType = _tradeData.creator.direction == Trade.Direction.Long ? Order.Types.Bid : Order.Types.Ask;
            _addressData[0] = address(_tradeData.order.kycToken);
            _addressData[1] = _tradeData.creator.participantAddress;
            _addressData[2] = _tradeData.filler.participantAddress;
            _uint256Data[0] = _price;
            _uint256Data[1] = 0;
            _uint256Data[2] = _tradeData.order.outcome;
            _uint256Data[5] = _fees;
            _uint256Data[6] = _amountFilled;
            _uint256Data[8] = 0;
            _uint256Data[9] = 0;
            _tradeData.contracts.augur.logZeroXOrderFilled(_tradeData.contracts.universe, _tradeData.contracts.market, _tradeGroupId, _orderType, _addressData, _uint256Data);
            return true;
        }
        _tradeData.contracts.augur.logOrderFilled(_tradeData.contracts.universe, _tradeData.creator.participantAddress, _tradeData.filler.participantAddress, _price, _fees, _amountFilled, _tradeData.order.orderId, _tradeGroupId);
        return true;
    }

    function logAndUpdateVolume(Trade.Data memory _tradeData) private {
        IMarket _market = _tradeData.contracts.market;
        uint256 _makerSharesDepleted = _tradeData.getMakerSharesDepleted();
        uint256 _fillerSharesDepleted = _tradeData.getFillerSharesDepleted();
        uint256 _makerTokensDepleted = _tradeData.getMakerTokensDepleted();
        uint256 _fillerTokensDepleted = _tradeData.getFillerTokensDepleted();
        uint256 _completeSetTokens = _makerSharesDepleted.min(_fillerSharesDepleted).mul(_market.getNumTicks());
        if (marketOutcomeVolumes[address(_market)].length == 0) {
            marketOutcomeVolumes[address(_market)].length = _tradeData.contracts.shareTokens.length;
        }
        marketOutcomeVolumes[address(_market)][_tradeData.order.outcome] = marketOutcomeVolumes[address(_market)][_tradeData.order.outcome].add(_makerTokensDepleted).add(_fillerTokensDepleted).add(_completeSetTokens);

        uint256[] memory tmpMarketOutcomeVolumes = marketOutcomeVolumes[address(_market)];
        uint256 volume;
        for (uint256 i = 0; i < tmpMarketOutcomeVolumes.length; i++) {
            volume += tmpMarketOutcomeVolumes[i];
        }

        _tradeData.contracts.augur.logMarketVolumeChanged(_tradeData.contracts.universe, address(_market), volume, tmpMarketOutcomeVolumes);
    }

    function updateProfitLoss(Trade.Data memory _tradeData, uint256 _amountFilled) private returns (bool) {
        uint256 _numLongTokens = _tradeData.creator.direction == Trade.Direction.Long ? 0 : _tradeData.getFillerTokensDepleted();
        uint256 _numShortTokens = _tradeData.creator.direction == Trade.Direction.Short ? 0 : _tradeData.getFillerTokensDepleted();
        uint256 _numLongShares = _tradeData.creator.direction == Trade.Direction.Long ? _tradeData.getMakerSharesDepleted() : _tradeData.getFillerSharesDepleted();
        uint256 _numShortShares = _tradeData.creator.direction == Trade.Direction.Short ? _tradeData.getMakerSharesDepleted() : _tradeData.getFillerSharesDepleted();
        _tradeData.contracts.profitLoss.recordTrade(_tradeData.contracts.universe, _tradeData.contracts.market, _tradeData.getLongShareBuyerDestination(), _tradeData.getShortShareBuyerDestination(), _tradeData.order.outcome, int256(_amountFilled), int256(_tradeData.order.sharePriceLong), _numLongTokens, _numShortTokens, _numLongShares, _numShortShares);
        return true;
    }
}
