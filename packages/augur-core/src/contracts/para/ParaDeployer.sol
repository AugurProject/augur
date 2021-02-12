pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/para/interfaces/IParaAugur.sol';
import 'ROOT/para/interfaces/IParaAugurTrading.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/reporting/IRepOracle.sol';
import 'ROOT/para/interfaces/IOINexus.sol';
import 'ROOT/para/deployerFactories/interfaces/IParaAugurFactory.sol';
import 'ROOT/para/deployerFactories/interfaces/IParaAugurTradingFactory.sol';
import 'ROOT/para/deployerFactories/interfaces/IParaShareTokenFactory.sol';
import 'ROOT/para/deployerFactories/interfaces/ICancelOrderFactory.sol';
import 'ROOT/para/deployerFactories/interfaces/ICreateOrderFactory.sol';
import 'ROOT/para/deployerFactories/interfaces/IFillOrderFactory.sol';
import 'ROOT/para/deployerFactories/interfaces/IOrdersFactory.sol';
import 'ROOT/para/deployerFactories/interfaces/IProfitLossFactory.sol';
import 'ROOT/para/deployerFactories/interfaces/ISimulateTradeFactory.sol';
import 'ROOT/para/deployerFactories/interfaces/ITradeFactory.sol';
import 'ROOT/para/deployerFactories/interfaces/IZeroXTradeFactory.sol';
import 'ROOT/libraries/Ownable.sol';
import "ROOT/trading/ITrade.sol";

interface ITradingInitializable {
    function initialize(IParaAugur, IParaAugurTrading) external;
}

contract ParaDeployer is Ownable {
    event ParaAugurDeployFinished(IParaAugur paraAugur, IParaShareToken shareToken, ICash cash, IOINexus OINexus);
    event ParaAugurTradingDeployed(IParaAugurTrading paraAugur, ICash cash);

    enum DeployProgress {
        NOT_ALLOWED,
        NOT_STARTED,
        SHARE_TOKEN,
        AUGUR_TRADING,
        CREATE_ORDER,
        CANCEL_ORDER,
        FILL_ORDER,
        ORDERS,
        PROFIT_LOSS,
        SIMULATE_TRADE,
        TRADE,
        ZEROX_TRADE,
        INITIALIZE,
        GENESIS_UNIVERSE,
        WRAPPED_SHARE_TOKEN_FACTORY,
        FINISHED
    }

    struct Factories {
        IParaAugurFactory paraAugurFactory;
        IParaAugurTradingFactory paraAugurTradingFactory;
        IParaShareTokenFactory paraShareTokenFactory;
        ICancelOrderFactory cancelOrderFactory;
        ICreateOrderFactory createOrderFactory;
        IFillOrderFactory fillOrderFactory;
        IOrdersFactory ordersFactory;
        IProfitLossFactory profitLossFactory;
        ISimulateTradeFactory simulateTradeFactory;
        ITradeFactory tradeFactory;
        IZeroXTradeFactory zeroXTradeFactory;
    }

    mapping (address => IParaAugur) public paraAugurs;
    mapping (address => IParaAugurTrading) public paraAugurTradings;
    mapping (address => DeployProgress) public paraDeployProgress;
    mapping (address => uint256) public tokenTradeIntervalModifier;
    Factories public factories;
    IAugur public augur;
    address public feePotFactory;
    address public paraUniverseFactory;
    address public openInterestCashFactory;
    address public OICash;
    address public zeroXExchange;
    address public WETH9;
    IOINexus public OINexus;

    constructor(IAugur _augur, address _feePotFactory, address _paraUniverseFactory, address _openInterestCashFactory, address _OICash, IOINexus _OINexus, address _zeroXExchange, address _WETH9, Factories memory _factories) public {
        factories = _factories;
        require(_augur != IAugur(0), "Augur must be provided");
        require(_feePotFactory != address(0), "_feePotFactory must be provided");
        require(_paraUniverseFactory != address(0), "_paraUniverseFactory must be provided");
        require(_openInterestCashFactory != address(0), "_openInterestCashFactory must be provided");
        require(_OICash != address(0), "_OICash must be provided");
        require(_OINexus != IOINexus(0), "_OINexus must be provided");
        require(_zeroXExchange != address(0), "_zeroXExchange must be provided");
        require(_WETH9 != address(0), "_WETH9 must be provided");
        augur = _augur;
        feePotFactory = _feePotFactory;
        paraUniverseFactory = _paraUniverseFactory;
        openInterestCashFactory = _openInterestCashFactory;
        OICash = _OICash;
        zeroXExchange = _zeroXExchange;
        WETH9 = _WETH9;
        OINexus = _OINexus;
    }

    function addToken(address _token, uint256 _tradeIntervalModifier) public onlyOwner returns (bool) {
        require(paraDeployProgress[_token] == DeployProgress.NOT_ALLOWED, "Token is already allowed");
        paraDeployProgress[_token] = DeployProgress.NOT_STARTED;
        tokenTradeIntervalModifier[_token] = _tradeIntervalModifier;
        return true;
    }

    function burnOwnership() public onlyOwner returns (bool) {
        owner = address(0);
        return true;
    }

    function progressDeployment(address _token) public returns (bool) {
        DeployProgress _tokenProgress = paraDeployProgress[_token];
        require(_tokenProgress != DeployProgress.NOT_ALLOWED, "Token is not a valid deploy candidate");
        require(_tokenProgress != DeployProgress.FINISHED, "Token is already fully deployed");
        if (_tokenProgress == DeployProgress.NOT_STARTED) {
            deployParaAugur(_token);
        } else if (_tokenProgress == DeployProgress.SHARE_TOKEN) {
            deployParaShareToken(_token);
        } else if (_tokenProgress == DeployProgress.AUGUR_TRADING) {
            deployParaAugurTrading(_token);
        } else if (_tokenProgress == DeployProgress.CREATE_ORDER) {
            deployCreateOrder(_token);
        } else if (_tokenProgress == DeployProgress.CANCEL_ORDER) {
            deployCancelOrder(_token);
        } else if (_tokenProgress == DeployProgress.FILL_ORDER) {
            deployFillOrder(_token);
        } else if (_tokenProgress == DeployProgress.ORDERS) {
            deployOrders(_token);
        } else if (_tokenProgress == DeployProgress.PROFIT_LOSS) {
            deployProfitLoss(_token);
        } else if (_tokenProgress == DeployProgress.SIMULATE_TRADE) {
            deploySimulateTrade(_token);
        } else if (_tokenProgress == DeployProgress.TRADE) {
            deployTrade(_token);
        } else if (_tokenProgress == DeployProgress.ZEROX_TRADE) {
            deployZeroXTrade(_token);
        } else if (_tokenProgress == DeployProgress.INITIALIZE) {
            initialize(_token);
        } else if (_tokenProgress == DeployProgress.GENESIS_UNIVERSE) {
            createGenesisUniverse(_token);
        } else if (_tokenProgress == DeployProgress.WRAPPED_SHARE_TOKEN_FACTORY) {

        }
        paraDeployProgress[_token] = DeployProgress(uint256(_tokenProgress) + 1);

        if(paraDeployProgress[_token] == DeployProgress.FINISHED) {
            IParaAugur _paraAugur =  paraAugurs[_token];
            emit ParaAugurDeployFinished(_paraAugur, _paraAugur.shareToken(), _paraAugur.cash(), _paraAugur.OINexus());
        }

        return true;
    }

    function deployParaAugur(address _token) private {
        IParaAugur _paraAugur = factories.paraAugurFactory.createParaAugur(augur, tokenTradeIntervalModifier[_token]);
        paraAugurs[_token] = _paraAugur;
        _paraAugur.registerContract("FeePotFactory", feePotFactory);
        _paraAugur.registerContract("ParaUniverseFactory", paraUniverseFactory);
        _paraAugur.registerContract("ParaOICashFactory", openInterestCashFactory);
        _paraAugur.registerContract("ParaOICash", OICash);
        _paraAugur.registerContract("OINexus", address(OINexus));
        _paraAugur.registerContract("Cash", _token);
        OINexus.addParaAugur(address(paraAugurs[_token]));
    }

    function deployParaShareToken(address _token) private {
        address _paraShareToken = factories.paraShareTokenFactory.createParaShareToken();
        paraAugurs[_token].registerContract("ShareToken", _paraShareToken);
    }

    function deployParaAugurTrading(address _token) private {
        IParaAugurTrading _paraAugurTrading = factories.paraAugurTradingFactory.createParaAugurTrading(IAugur(address(paraAugurs[_token])));
        paraAugurTradings[_token] = _paraAugurTrading;
        _paraAugurTrading.registerContract("ZeroXExchange", zeroXExchange);
        _paraAugurTrading.registerContract("WETH9", WETH9);

        emit ParaAugurTradingDeployed(_paraAugurTrading, ICash(_token));
    }

    function deployCreateOrder(address _token) private {
        address _createOrder = factories.createOrderFactory.createCreateOrder();
        paraAugurTradings[_token].registerContract("CreateOrder", _createOrder);
    }

    function deployCancelOrder(address _token) private {
        address _cancelOrder = factories.cancelOrderFactory.createCancelOrder();
        paraAugurTradings[_token].registerContract("CancelOrder", _cancelOrder);
    }

    function deployFillOrder(address _token) private {
        address _fillOrder = factories.fillOrderFactory.createFillOrder();
        paraAugurTradings[_token].registerContract("FillOrder", _fillOrder);
    }

    function deployOrders(address _token) private {
        address _orders = factories.ordersFactory.createOrders();
        paraAugurTradings[_token].registerContract("Orders", _orders);
    }

    function deployProfitLoss(address _token) private {
        address _profitLoss = factories.profitLossFactory.createProfitLoss();
        paraAugurTradings[_token].registerContract("ProfitLoss", _profitLoss);
    }

    function deploySimulateTrade(address _token) private {
        address _simulateTrade = factories.simulateTradeFactory.createSimulateTrade();
        paraAugurTradings[_token].registerContract("SimulateTrade", _simulateTrade);
    }

    function deployTrade(address _token) private {
        address _trade = factories.tradeFactory.createTrade();
        paraAugurTradings[_token].registerContract("Trade", _trade);
    }

    function deployZeroXTrade(address _token) private {
        address _zeroXTrade = factories.zeroXTradeFactory.createZeroXTrade();
        paraAugurTradings[_token].registerContract("ZeroXTrade", _zeroXTrade);
    }

    function initialize(address _token) private {
        IParaAugur _paraAugur = paraAugurs[_token];
        IParaAugurTrading _paraAugurTrading = paraAugurTradings[_token];
        address _originalShareToken = augur.lookup("ShareToken");
        IParaShareToken(_paraAugur.lookup("ShareToken")).initialize(address(_paraAugur), _originalShareToken);
        ITradingInitializable(_paraAugurTrading.lookup("CreateOrder")).initialize(_paraAugur, _paraAugurTrading);
        ITradingInitializable(_paraAugurTrading.lookup("CancelOrder")).initialize(_paraAugur, _paraAugurTrading);
        ITradingInitializable(_paraAugurTrading.lookup("FillOrder")).initialize(_paraAugur, _paraAugurTrading);
        ITradingInitializable(_paraAugurTrading.lookup("Orders")).initialize(_paraAugur, _paraAugurTrading);
        ITradingInitializable(_paraAugurTrading.lookup("ProfitLoss")).initialize(_paraAugur, _paraAugurTrading);
        ITradingInitializable(_paraAugurTrading.lookup("SimulateTrade")).initialize(_paraAugur, _paraAugurTrading);
        ITradingInitializable(_paraAugurTrading.lookup("Trade")).initialize(_paraAugur, _paraAugurTrading);
        ITradingInitializable(_paraAugurTrading.lookup("ZeroXTrade")).initialize(_paraAugur, _paraAugurTrading);
        _paraAugurTrading.doApprovals();
    }

    function createGenesisUniverse(address _token) private {
        IUniverse _universe = augur.genesisUniverse();
        IParaUniverse _paraUniverse = paraAugurs[_token].generateParaUniverse(_universe);
    }

    function onTransferOwnership(address, address) internal {}
}
