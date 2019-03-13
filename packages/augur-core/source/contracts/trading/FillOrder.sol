pragma solidity 0.5.4;


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


// CONSIDER: At some point it would probably be a good idea to shift much of the logic from trading contracts into extensions. In particular this means sorting for making and WCL calculcations + order walking for taking.
library Trade {
    using SafeMathUint256 for uint256;

    enum Direction {
        Long,
        Short
    }

    struct Contracts {
        IOrders orders;
        IMarket market;
        ICompleteSets completeSets;
        ICash denominationToken;
        IShareToken longShareToken;
        IShareToken[] shortShareTokens;
        IAugur augur;
    }

    struct FilledOrder {
        bytes32 orderId;
        uint256 outcome;
        ERC20Token kycToken;
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
        address affiliateAddress;
    }

    //
    // Constructor
    //

    function create(IAugur _augur, bytes32 _orderId, address _fillerAddress, uint256 _fillerSize, bool _ignoreShares, address _affiliateAddress) internal view returns (Data memory) {
        Contracts memory _contracts = getContracts(_augur, _orderId);
        FilledOrder memory _order = getOrder(_contracts, _orderId);
        Order.Types _orderOrderType = _contracts.orders.getOrderType(_orderId);
        Participant memory _creator = getMaker(_contracts, _order, _orderOrderType);
        Participant memory _filler = getFiller(_contracts, _orderOrderType, _fillerAddress, _fillerSize, _ignoreShares);

        return Data({
            contracts: _contracts,
            order: _order,
            creator: _creator,
            filler: _filler,
            affiliateAddress: _affiliateAddress
        });
    }

    //
    // "public" functions
    //

    function tradeMakerSharesForFillerShares(Data memory _data) internal returns (uint256, uint256) {
        uint256 _numberOfCompleteSets = _data.creator.sharesToSell.min(_data.filler.sharesToSell);
        if (_numberOfCompleteSets == 0) {
            return (0, 0);
        }

        // transfer shares to this contract from each participant
        _data.contracts.longShareToken.trustedFillOrderTransfer(getLongShareSellerSource(_data), address(this), _numberOfCompleteSets);
        for (uint256 _i = 0; _i < _data.contracts.shortShareTokens.length; ++_i) {
            _data.contracts.shortShareTokens[_i].trustedFillOrderTransfer(getShortShareSellerSource(_data), address(this), _numberOfCompleteSets);
        }

        // sell complete sets
        uint256 _marketCreatorFees;
        uint256 _reporterFees;
        (_marketCreatorFees, _reporterFees) = _data.contracts.completeSets.sellCompleteSets(address(this), _data.contracts.market, _numberOfCompleteSets, _data.affiliateAddress);

        // distribute payout proportionately (fees will have been deducted)
        uint256 _payout = _data.contracts.denominationToken.balanceOf(address(this));
        uint256 _longShare = _payout.mul(_data.order.sharePriceLong) / _data.order.sharePriceRange;
        uint256 _shortShare = _payout.sub(_longShare);
        _data.contracts.denominationToken.transfer(getLongShareSellerDestination(_data), _longShare);
        _data.contracts.denominationToken.transfer(getShortShareSellerDestination(_data), _shortShare);

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
            _data.contracts.longShareToken.trustedFillOrderTransfer(address(_data.contracts.market), _data.filler.participantAddress, _numberOfSharesToTrade);
        } else {
            for (uint256 _i = 0; _i < _data.contracts.shortShareTokens.length; ++_i) {
                _data.contracts.shortShareTokens[_i].trustedFillOrderTransfer(address(_data.contracts.market), _data.filler.participantAddress, _numberOfSharesToTrade);
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
            for (uint256 _i = 0; _i < _data.contracts.shortShareTokens.length; ++_i) {
                _data.contracts.shortShareTokens[_i].trustedFillOrderTransfer(_data.filler.participantAddress, _data.creator.participantAddress, _numberOfSharesToTrade);
            }
        }

        // transfer tokens from creator (escrowed in market) to filler
        uint256 _tokensToCover = getTokensToCover(_data, _data.creator.direction, _numberOfSharesToTrade);
        _data.contracts.denominationToken.transferFrom(address(_data.contracts.market), _data.filler.participantAddress, _tokensToCover);

        // update available assets for creator and filler
        _data.creator.sharesToBuy -= _numberOfSharesToTrade;
        _data.filler.sharesToSell -= _numberOfSharesToTrade;
        return true;
    }

    function tradeMakerTokensForFillerTokens(Data memory _data) internal returns (bool) {
        uint256 _numberOfCompleteSets = _data.creator.sharesToBuy.min(_data.filler.sharesToBuy);
        if (_numberOfCompleteSets == 0) {
            return true;
        }

        // transfer tokens to this contract
        uint256 _creatorTokensToCover = getTokensToCover(_data, _data.creator.direction, _numberOfCompleteSets);
        uint256 _fillerTokensToCover = getTokensToCover(_data, _data.filler.direction, _numberOfCompleteSets);

        // If someone is filling their own order with ETH both ways we just return the ETH
        if (_data.creator.participantAddress == _data.filler.participantAddress) {
            require(_data.contracts.denominationToken.transferFrom(address(_data.contracts.market), _data.creator.participantAddress, _creatorTokensToCover));

            _data.creator.sharesToBuy -= _numberOfCompleteSets;
            _data.filler.sharesToBuy -= _numberOfCompleteSets;
            return true;
        }

        require(_data.contracts.denominationToken.transferFrom(address(_data.contracts.market), address(this), _creatorTokensToCover));
        _data.contracts.augur.trustedTransfer(_data.contracts.denominationToken, _data.filler.participantAddress, address(this), _fillerTokensToCover);

        // buy complete sets
        uint256 _cost = _numberOfCompleteSets.mul(_data.contracts.market.getNumTicks());
        if (_data.contracts.denominationToken.allowance(address(this), address(_data.contracts.augur)) < _cost) {
            require(_data.contracts.denominationToken.approve(address(_data.contracts.augur), _cost));
        }
        _data.contracts.completeSets.buyCompleteSets(address(this), _data.contracts.market, _numberOfCompleteSets);

        // distribute shares to participants
        address _longBuyer = getLongShareBuyerDestination(_data);
        address _shortBuyer = getShortShareBuyerDestination(_data);
        require(_data.contracts.longShareToken.transfer(_longBuyer, _numberOfCompleteSets));
        for (uint256 _i = 0; _i < _data.contracts.shortShareTokens.length; ++_i) {
            require(_data.contracts.shortShareTokens[_i].transfer(_shortBuyer, _numberOfCompleteSets));
        }

        _data.creator.sharesToBuy -= _numberOfCompleteSets;
        _data.filler.sharesToBuy -= _numberOfCompleteSets;
        return true;
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

    function getContracts(IAugur _augur, bytes32 _orderId) private view returns (Contracts memory) {
        IOrders _orders = IOrders(_augur.lookup("Orders"));
        IMarket _market = _orders.getMarket(_orderId);
        uint256 _outcome = _orders.getOutcome(_orderId);
        return Contracts({
            orders: _orders,
            market: _market,
            completeSets: ICompleteSets(_augur.lookup("CompleteSets")),
            denominationToken: _market.getDenominationToken(),
            longShareToken: _market.getShareToken(_outcome),
            shortShareTokens: getShortShareTokens(_market, _outcome),
            augur: _augur
        });
    }

    function getOrder(Contracts memory _contracts, bytes32 _orderId) private view returns (FilledOrder memory) {
        uint256 _sharePriceRange;
        uint256 _sharePriceLong;
        uint256 _sharePriceShort;
        (_sharePriceRange, _sharePriceLong, _sharePriceShort) = getSharePriceDetails(_contracts.market, _contracts.orders, _orderId);
        return FilledOrder({
            orderId: _orderId,
            outcome: _contracts.orders.getOutcome(_orderId),
            kycToken: _contracts.orders.getKYCToken(_orderId),
            sharePriceRange: _sharePriceRange,
            sharePriceLong: _sharePriceLong,
            sharePriceShort: _sharePriceShort
        });
    }

    function getMaker(Contracts memory _contracts, FilledOrder memory _order, Order.Types _orderOrderType) private view returns (Participant memory) {
        Direction _direction = (_orderOrderType == Order.Types.Bid) ? Direction.Long : Direction.Short;
        uint256 _sharesToSell = _contracts.orders.getOrderSharesEscrowed(_order.orderId);
        uint256 _sharesToBuy = _contracts.orders.getAmount(_order.orderId).sub(_sharesToSell);
        return Participant({
            participantAddress: _contracts.orders.getOrderCreator(_order.orderId),
            direction: _direction,
            startingSharesToSell: _sharesToSell,
            startingSharesToBuy: _sharesToBuy,
            sharesToSell: _sharesToSell,
            sharesToBuy: _sharesToBuy
        });
    }

    function getFiller(Contracts memory _contracts, Order.Types _orderOrderType, address _address, uint256 _size, bool _ignoreShares) private view returns (Participant memory) {
        Direction _direction = (_orderOrderType == Order.Types.Bid) ? Direction.Short : Direction.Long;
        uint256 _sharesToSell = 0;
        if (!_ignoreShares) {
            _sharesToSell = getFillerSharesToSell(_contracts.longShareToken, _contracts.shortShareTokens, _address, _direction, _size);
        }
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

    function getShortShareTokens(IMarket _market, uint256 _longOutcome) private view returns (IShareToken[] memory) {
        IShareToken[] memory _shortShareTokens = new IShareToken[](_market.getNumberOfOutcomes() - 1);
        for (uint256 _outcome = 0; _outcome < _shortShareTokens.length + 1; ++_outcome) {
            if (_outcome == _longOutcome) {
                continue;
            }
            uint256 _index = (_outcome < _longOutcome) ? _outcome : _outcome - 1;
            _shortShareTokens[_index] = _market.getShareToken(_outcome);
        }
        return _shortShareTokens;
    }

    function getSharePriceDetails(IMarket _market, IOrders _orders, bytes32 _orderId) private view returns (uint256 _sharePriceRange, uint256 _sharePriceLong, uint256 _sharePriceShort) {
        uint256 _numTicks = _market.getNumTicks();
        uint256 _orderPrice = _orders.getPrice(_orderId);
        _sharePriceShort = uint256(_numTicks.sub(_orderPrice));
        return (_numTicks, _orderPrice, _sharePriceShort);
    }

    function getFillerSharesToSell(IShareToken _longShareToken, IShareToken[] memory _shortShareTokens, address _filler, Direction _fillerDirection, uint256 _fillerSize) private view returns (uint256) {
        uint256 _sharesAvailable = SafeMathUint256.getUint256Max();
        if (_fillerDirection == Direction.Short) {
            _sharesAvailable = _longShareToken.balanceOf(_filler);
        } else {
            for (uint256 _outcome = 0; _outcome < _shortShareTokens.length; ++_outcome) {
                _sharesAvailable = _shortShareTokens[_outcome].balanceOf(_filler).min(_sharesAvailable);
            }
        }
        return _sharesAvailable.min(_fillerSize);
    }
}


contract FillOrder is Initializable, ReentrancyGuard, IFillOrder {
    using SafeMathUint256 for uint256;
    using Trade for Trade.Data;

    IAugur public augur;
    IOrders public orders;
    IProfitLoss public profitLoss;
    address public trade;

    mapping (address => uint256) public marketVolume;

    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        orders = IOrders(augur.lookup("Orders"));
        trade = augur.lookup("Trade");
        profitLoss = IProfitLoss(augur.lookup("ProfitLoss"));
        return true;
    }

    function publicFillOrder(bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, bool _ignoreShares, address _affiliateAddress) external afterInitialized returns (uint256) {
        uint256 _result = this.fillOrder(msg.sender, _orderId, _amountFillerWants, _tradeGroupId, _ignoreShares, _affiliateAddress);
        IMarket _market = orders.getMarket(_orderId);
        _market.assertBalances();
        return _result;
    }

    function fillOrder(address _filler, bytes32 _orderId, uint256 _amountFillerWants, bytes32 _tradeGroupId, bool _ignoreShares, address _affiliateAddress) external afterInitialized nonReentrant returns (uint256) {
        require(msg.sender == trade || msg.sender == address(this));
        Trade.Data memory _tradeData = Trade.create(augur, _orderId, _filler, _amountFillerWants, _ignoreShares, _affiliateAddress);
        require(_tradeData.order.kycToken == ERC20Token(0) || _tradeData.order.kycToken.balanceOf(_filler) > 0);
        uint256 _marketCreatorFees;
        uint256 _reporterFees;
        if (!_ignoreShares) {
            (_marketCreatorFees, _reporterFees) = _tradeData.tradeMakerSharesForFillerShares();
            _tradeData.tradeMakerTokensForFillerShares();
        }
        _tradeData.tradeMakerSharesForFillerTokens();
        _tradeData.tradeMakerTokensForFillerTokens();

        // Sell any complete sets the maker or filler may have ended up holding
        if (!_ignoreShares) {
            sellCompleteSets(_tradeData);
        }

        uint256 _amountRemainingFillerWants = _tradeData.filler.sharesToSell.add(_tradeData.filler.sharesToBuy);
        uint256 _amountFilled = _amountFillerWants.sub(_amountRemainingFillerWants);
        logOrderFilled(_tradeData, _marketCreatorFees, _reporterFees, _amountFilled, _tradeGroupId);
        logAndUpdateVolume(_tradeData);
        updateProfitLoss(_tradeData, _amountFilled);
        _tradeData.contracts.orders.recordFillOrder(_orderId, _tradeData.getMakerSharesDepleted(), _tradeData.getMakerTokensDepleted(), _amountFilled);
        return _amountRemainingFillerWants;
    }

    function sellCompleteSets(Trade.Data memory _tradeData) internal returns (bool) {
        address _filler = _tradeData.filler.participantAddress;
        address _creator = _tradeData.creator.participantAddress;
        IMarket _market = _tradeData.contracts.market;

        uint256 _fillerCompleteSets = _market.getShareToken(0).balanceOf(_filler);
        uint256 _creatorCompleteSets = _market.getShareToken(0).balanceOf(_creator);

        for (uint256 _outcome = 1; _outcome < _market.getNumberOfOutcomes(); ++_outcome) {
            IShareToken _shareToken = _market.getShareToken(_outcome);
            _creatorCompleteSets = _creatorCompleteSets.min(_shareToken.balanceOf(_creator));
            _fillerCompleteSets = _fillerCompleteSets.min(_shareToken.balanceOf(_filler));
        }

        if (_fillerCompleteSets > 0) {
            _tradeData.contracts.completeSets.sellCompleteSets(_filler, _market, _fillerCompleteSets, _tradeData.affiliateAddress);
        }

        if (_creatorCompleteSets > 0) {
            _tradeData.contracts.completeSets.sellCompleteSets(_creator, _market, _creatorCompleteSets, _tradeData.affiliateAddress);
        }

        return true;
    }

    function logOrderFilled(Trade.Data memory _tradeData, uint256 _marketCreatorFees, uint256 _reporterFees, uint256 _amountFilled, bytes32 _tradeGroupId) private returns (bool) {
        augur.logOrderFilled(_tradeData.contracts.market.getUniverse(), address(_tradeData.contracts.longShareToken), _tradeData.filler.participantAddress, _tradeData.order.orderId, _tradeData.getMakerSharesDepleted(), _tradeData.getMakerTokensDepleted(), _tradeData.getFillerSharesDepleted(), _tradeData.getFillerTokensDepleted(), _marketCreatorFees, _reporterFees, _amountFilled, _tradeGroupId);
        return true;
    }

    function logAndUpdateVolume(Trade.Data memory _tradeData) private returns (uint256) {
        IMarket _market = _tradeData.contracts.market;
        uint256 _volume = marketVolume[address(_market)];
        uint256 _makerSharesDepleted = _tradeData.getMakerSharesDepleted();
        uint256 _fillerSharesDepleted = _tradeData.getFillerSharesDepleted();
        uint256 _makerTokensDepleted = _tradeData.getMakerTokensDepleted();
        uint256 _fillerTokensDepleted = _tradeData.getFillerTokensDepleted();
        uint256 _completeSetTokens = _makerSharesDepleted.min(_fillerSharesDepleted).mul(_market.getNumTicks());
        _volume = _volume.add(_makerTokensDepleted).add(_fillerTokensDepleted).add(_completeSetTokens);
        marketVolume[address(_market)] = _volume;
        augur.logMarketVolumeChanged(_tradeData.contracts.market.getUniverse(), address(_market), _volume);
        return _volume;
    }

    function updateProfitLoss(Trade.Data memory _tradeData, uint256 _amountFilled) private returns (bool) {
        uint256 _numLongTokens = _tradeData.creator.direction == Trade.Direction.Long ? _tradeData.getMakerTokensDepleted() : _tradeData.getFillerTokensDepleted();
        uint256 _numShortTokens = _tradeData.creator.direction == Trade.Direction.Short ? _tradeData.getMakerTokensDepleted() : _tradeData.getFillerTokensDepleted();
        uint256 _numLongShares = _tradeData.creator.direction == Trade.Direction.Long ? _tradeData.getMakerSharesDepleted() : _tradeData.getFillerSharesDepleted();
        uint256 _numShortShares = _tradeData.creator.direction == Trade.Direction.Short ? _tradeData.getMakerSharesDepleted() : _tradeData.getFillerSharesDepleted();
        profitLoss.recordTrade(_tradeData.contracts.market, _tradeData.getLongShareBuyerDestination(), _tradeData.getShortShareBuyerDestination(), _tradeData.order.outcome, int256(_amountFilled), int256(_tradeData.order.sharePriceLong), _numLongTokens, _numShortTokens, _numLongShares, _numShortShares);
        return true;
    }
}
