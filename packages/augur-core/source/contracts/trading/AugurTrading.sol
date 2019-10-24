pragma solidity 0.5.10;

import 'ROOT/IAugur.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/trading/IAugurTrading.sol';
import 'ROOT/trading/IShareToken.sol';
import 'ROOT/trading/IOrders.sol';
import 'ROOT/trading/Order.sol';
import 'ROOT/libraries/ContractExists.sol';


// Centralized approval authority and event emissions for trading.

/**
 * @title AugurTrading
 * @notice The core global contract for the Augur Trading contracts. Provides a contract registry and and authority on which contracts should be trusted within Trading.
 */
contract AugurTrading is IAugurTrading {
    using SafeMathUint256 for uint256;
    using ContractExists for address;

    enum OrderEventType {
        Create,
        Cancel,
        Fill
    }
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
    event ProfitLossChanged(address indexed universe, address indexed market, address indexed account, uint256 outcome, int256 netPosition, uint256 avgPrice, int256 realizedProfit, int256 frozenFunds, int256 realizedCost, uint256 timestamp);

    mapping(address => bool) private trustedSender;

    address public uploader;
    mapping(bytes32 => address) private registry;

    modifier onlyUploader() {
        require(msg.sender == uploader);
        _;
    }

    constructor() public {
        uploader = msg.sender;
    }

    function registerContract(bytes32 _key, address _address) public onlyUploader returns (bool) {
        require(registry[_key] == address(0), "Augur.registerContract: key has already been used in registry");
        require(_address.exists());
        registry[_key] = _address;
        if (_key == "Orders" || _key == "CreateOrder" || _key == "CancelOrder" || _key == "FillOrder" || _key == "Trade") {
            trustedSender[_address] = true;
        }
        return true;
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

    //
    // Transfer
    //

    function trustedTransfer(IERC20 _token, address _from, address _to, uint256 _amount) public returns (bool) {
        require(trustedSender[msg.sender]);
        require(_token.transferFrom(_from, _to, _amount));
        return true;
    }

    function isTrustedSender(address _address) public returns (bool) {
        return trustedSender[_address];
    }
}