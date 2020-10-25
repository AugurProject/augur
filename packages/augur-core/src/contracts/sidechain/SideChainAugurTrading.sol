pragma solidity 0.5.15;

import 'ROOT/sidechain/interfaces/ISideChainAugur.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/sidechain/interfaces/ISideChainShareToken.sol';
import 'ROOT/libraries/ContractExists.sol';
import 'ROOT/sidechain/IMarketGetter.sol';
import 'ROOT/trading/IProfitLoss.sol';
import 'ROOT/libraries/token/SafeERC20.sol';


// Centralized approval authority and event emissions for trading.

/**
 * @title AugurTrading
 * @notice The core global contract for the Augur Trading contracts. Provides a contract registry and and authority on which contracts should be trusted within Trading.
 */
contract SideChainAugurTrading {
    using SafeERC20 for IERC20;
    using SafeMathUint256 for uint256;
    using ContractExists for address;

    enum OrderEventType {
        Create,
        Cancel,
        Fill
    }
    //  addressData
    //  0:  orderCreator
    //  1:  orderFiller (Fill)
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
    event OrderEvent(address indexed universe, address indexed market, OrderEventType indexed eventType, uint8 orderType, bytes32 orderId, bytes32 tradeGroupId, address[] addressData, uint256[] uint256Data);
    event ProfitLossChanged(address indexed universe, address indexed market, address indexed account, uint256 outcome, int256 netPosition, uint256 avgPrice, int256 realizedProfit, int256 frozenFunds, int256 realizedCost, uint256 timestamp);
    event MarketVolumeChanged(address indexed universe, address indexed market, uint256 volume, uint256[] outcomeVolumes, uint256 totalTrades, uint256 timestamp);
    event CancelZeroXOrder(
        address indexed universe,
        address indexed market,
        address indexed account,
        uint256 outcome,
        uint256 price,
        uint256 amount,
        uint8 orderType,
        bytes32 orderHash
    );

    mapping(address => bool) public trustedSender;

    address public uploader;
    mapping(bytes32 => address) internal registry;

    ISideChainAugur public augur;
    ISideChainShareToken public shareToken;
    IMarketGetter public marketGetter;

    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    modifier onlyUploader() {
        require(msg.sender == uploader);
        _;
    }

    constructor(ISideChainAugur _augur) public {
        uploader = msg.sender;
        augur = _augur;
    }

    function registerContract(bytes32 _key, address _address) public onlyUploader returns (bool) {
        require(registry[_key] == address(0), "Augur.registerContract: key has already been used in registry");
        require(_address.exists());
        registry[_key] = _address;
        if (_key == "FillOrder") {
            doApproval();
        }
        return true;
    }

    function doApproval() private returns (bool) {
        address _fillOrder = registry["FillOrder"];
        shareToken = ISideChainShareToken(augur.lookup("ShareToken"));
        IERC20 _cash = IERC20(augur.lookup("Cash"));
        marketGetter = IMarketGetter(augur.lookup("MarketGetter"));

        require(shareToken != ISideChainShareToken(0));
        require(_cash != IERC20(0));

        shareToken.setApprovalForAll(_fillOrder, true);
        _cash.safeApprove(_fillOrder, MAX_APPROVAL_AMOUNT);
    }

    /**
     * @notice Find the contract address for a particular key
     * @param _key The key to lookup
     * @return the address of the registered contract if one exists for the given key
     */
    function lookup(bytes32 _key) public view returns (address) {
        return registry[_key];
    }

    function finishDeployment() public onlyUploader returns (bool) {
        uploader = address(1);
        return true;
    }

    /**
     * @notice Claims winnings for multiple markets and for a particular shareholder
     * @param _markets Array of markets to claim winnings for
     * @param _shareHolder The account to claim winnings for
     * @return Bool True
     */
    function claimMarketsProceeds(address[] calldata _markets, address _shareHolder) external returns (bool) {
        for (uint256 i=0; i < _markets.length; i++) {
            uint256[] memory _outcomeFees = shareToken.claimTradingProceeds(_markets[i], _shareHolder);
            IProfitLoss(registry['ProfitLoss']).recordClaim(IMarket(_markets[i]), _shareHolder, _outcomeFees);
        }
        return true;
    }

    /**
     * @notice Claims winnings for a market and for a particular shareholder
     * @param _market The market to claim winnings for
     * @param _shareHolder The account to claim winnings for
     * @return Bool True
     */
    function claimTradingProceeds(address _market, address _shareHolder) external returns (bool) {
        uint256[] memory _outcomeFees = shareToken.claimTradingProceeds(_market, _shareHolder);
        IProfitLoss(registry['ProfitLoss']).recordClaim(IMarket(_market), _shareHolder, _outcomeFees);
        return true;
    }

    //
    // Logs
    //

    function logProfitLossChanged(address _market, address _account, uint256 _outcome, int256 _netPosition, uint256 _avgPrice, int256 _realizedProfit, int256 _frozenFunds, int256 _realizedCost) public returns (bool) {
        require(msg.sender == registry["ProfitLoss"]);
        emit ProfitLossChanged(address(marketGetter.getUniverse(_market)), address(_market), _account, _outcome, _netPosition, _avgPrice, _realizedProfit, _frozenFunds, _realizedCost, block.timestamp);
        return true;
    }

    function logOrderFilled(IUniverse _universe, address _creator, address _filler, uint256 _price, uint256 _fees, uint256 _amountFilled, bytes32 _orderId, bytes32 _tradeGroupId) public returns (bool) {
        require(msg.sender == registry["FillOrder"]);
        IOrders _orders = IOrders(registry["Orders"]);
        (Order.Types _orderType, address[] memory _addressData, uint256[] memory _uint256Data) = _orders.getOrderDataForLogs(_orderId);
        _addressData[0] = _creator;
        _addressData[1] = _filler;
        _uint256Data[0] = _price;
        _uint256Data[5] = _fees;
        _uint256Data[6] = _amountFilled;
        _uint256Data[7] = block.timestamp;
        emit OrderEvent(address(_universe), address(_orders.getMarket(_orderId)), OrderEventType.Fill, uint8(_orderType), _orderId, _tradeGroupId, _addressData, _uint256Data);
        return true;
    }

    function logMarketVolumeChanged(IUniverse _universe, address _market, uint256 _volume, uint256[] memory _outcomeVolumes, uint256 _totalTrades) public returns (bool) {
        require(msg.sender == registry["FillOrder"]);
        emit MarketVolumeChanged(address(_universe), _market, _volume, _outcomeVolumes, _totalTrades, block.timestamp);
        return true;
    }

    function logZeroXOrderFilled(IUniverse _universe, address _market, bytes32 _orderHash, bytes32 _tradeGroupId, uint8 _orderType, address[] memory _addressData, uint256[] memory _uint256Data) public returns (bool) {
        require(msg.sender == registry["ZeroXTrade"]);
        _uint256Data[7] = block.timestamp;
        emit OrderEvent(address(_universe), address(_market), OrderEventType.Fill, _orderType, _orderHash, _tradeGroupId, _addressData, _uint256Data);
        return true;
    }
    
    function logZeroXOrderCanceled(address _universe, address _market, address _account, uint256 _outcome, uint256 _price, uint256 _amount, uint8 _type, bytes32 _orderHash) public {
        require(msg.sender == registry["ZeroXTrade"]);
        require(augur.isKnownMarket(address(_market)));
        emit CancelZeroXOrder(_universe, _market, _account, _outcome, _price, _amount, _type, _orderHash);
    }
}