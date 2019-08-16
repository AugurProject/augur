pragma solidity 0.5.10;
pragma experimental ABIEncoderV2;

import "ROOT/libraries/math/SafeMathUint256.sol";
import "ROOT/libraries/ContractExists.sol";
import "ROOT/libraries/token/IERC20.sol";
import "ROOT/external/IExchange.sol";
import "ROOT/trading/ICreateOrder.sol";
import "ROOT/trading/IFillOrder.sol";
import "ROOT/trading/Order.sol";
import 'ROOT/libraries/Initializable.sol';
import "ROOT/IAugur.sol";


contract ZeroXTradeToken is Initializable {
    using SafeMathUint256 for uint256;

    struct AugurOrderData {
        address marketAddress;                  // Market Address
        uint256 price;                          // Price
        uint8 outcome;                          // Outcome
        uint8 orderType;                        // Order Type
        bool ignoreShares;                      // Ignore Shares
        address kycToken;                       // KYC Token
    }

    bool transferFromAllowed = false;

    // EIP191 header for EIP712 prefix
    string constant internal EIP191_HEADER = "\x19\x01";

    // EIP712 Domain Name value
    string constant internal EIP712_DOMAIN_NAME = "0x Protocol";

    // EIP712 Domain Version value
    string constant internal EIP712_DOMAIN_VERSION = "2";

    // Hash of the EIP712 Domain Separator Schema
    bytes32 constant internal EIP712_DOMAIN_SEPARATOR_SCHEMA_HASH = keccak256(abi.encodePacked(
        "EIP712Domain(",
        "string name,",
        "string version,",
        "address verifyingContract",
        ")"
    ));

    bytes32 constant internal EIP712_ORDER_SCHEMA_HASH = keccak256(abi.encodePacked(
        "Order(",
        "address makerAddress,",
        "address takerAddress,",
        "address feeRecipientAddress,",
        "address senderAddress,",
        "uint256 makerAssetAmount,",
        "uint256 takerAssetAmount,",
        "uint256 makerFee,",
        "uint256 takerFee,",
        "uint256 expirationTimeSeconds,",
        "uint256 salt,",
        "bytes makerAssetData,",
        "bytes takerAssetData",
        ")"
    ));

    // Hash of the EIP712 Domain Separator data
    // solhint-disable-next-line var-name-mixedcase
    bytes32 public EIP712_DOMAIN_HASH;

    uint256 constant ORDER_DATA_LENGTH = 680;

    ICreateOrder public createOrder;
    IFillOrder public fillOrder;
    IExchange public exchange;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        createOrder = ICreateOrder(_augur.lookup("CreateOrder"));
        fillOrder = IFillOrder(_augur.lookup("FillOrder"));
        exchange = IExchange(_augur.lookup("ZeroXExchange"));

        EIP712_DOMAIN_HASH = keccak256(
            abi.encodePacked(
                EIP712_DOMAIN_SEPARATOR_SCHEMA_HASH,
                keccak256(bytes(EIP712_DOMAIN_NAME)),
                keccak256(bytes(EIP712_DOMAIN_VERSION)),
                uint256(address(this))
            )
        );
    }

    // ERC20
    // TODO make other interface members error?

    function transferFrom(address holder, address recipient, uint256 amount) public returns (bool) {
        require(transferFromAllowed);
        return true;
    }

    // Trade

    /**
     * Perform Augur Trades using 0x signed orders
     *
     * @param  requestedFillAmount  Share amount to fill
     * @param  ignoreShares         If true will ignore owned shares and only use dai
     * @param  affiliateAddress     Address of affiliate to be paid fees if any
     * @param  tradeGroupId         Random id to correlate these fills as one trade action
     * @param  orders               Array of encoded Order struct data
     * @param  signatures           Array of signature data
     * @return                      The amount the taker still wants
     */
    function trade(
        uint256 requestedFillAmount,
        bool ignoreShares,
        address affiliateAddress,
        bytes32 tradeGroupId,
        IExchange.Order[] memory orders,
        bytes[] memory signatures
    )
        public
        returns (uint256)
    {
        uint256 _fillAmountRemaining = requestedFillAmount;

        transferFromAllowed = true;

        // Do the actual asset exchanges
        for (uint256 i = 0; i < orders.length && _fillAmountRemaining != 0; i++) {
            IExchange.Order memory _order = orders[i];

            // Update 0x. This will also validate signatures and order state for us.
            IExchange.FillResults memory totalFillResults = exchange.fillOrder(
                _order,
                _fillAmountRemaining,
                signatures[i]
            );
            if (totalFillResults.takerAssetFilledAmount == 0) {
                continue;
            }
            _fillAmountRemaining = _fillAmountRemaining.sub(totalFillResults.takerAssetFilledAmount);

            doTrade(_order, msg.sender, totalFillResults.takerAssetFilledAmount, ignoreShares, affiliateAddress, tradeGroupId);
        }

        transferFromAllowed = false;

        return _fillAmountRemaining;
    }

    // TODO find ways to optimize this. Highly inneficient
    function doTrade(IExchange.Order memory _order, address _taker, uint256 _amount, bool _ignoreShares, address _affiliateAddress, bytes32 _tradeGroupId) private {
        AugurOrderData memory _augurOrderData = parseAssetData(_order.takerAssetData);
        bytes32 _orderId = createOrder.createOrder(_order.makerAddress, Order.Types(_augurOrderData.orderType), _amount, _augurOrderData.price, IMarket(_augurOrderData.marketAddress), _augurOrderData.outcome, bytes32(0), bytes32(0), _tradeGroupId, _augurOrderData.ignoreShares, IERC20(_augurOrderData.kycToken));
        fillOrder.fillOrder(_taker, _orderId, _amount, _tradeGroupId, _ignoreShares, _affiliateAddress);
    }

    /**
     * Get 0xV2 assetData
     */
    function getBasicTokenAssetData()
        private
        view
        returns (bytes memory)
    {
        bytes memory result = new bytes(36);

        // padded version of bytes4(keccak256("ERC20Token(address)"));
        bytes32 selector = 0xf47261b000000000000000000000000000000000000000000000000000000000;
        address tokenAddress = address(this);

        /* solium-disable-next-line security/no-inline-assembly */
        assembly {
            // Store the selector and address in the asset data
            // The first 32 bytes of an array are the length (already set above)
            mstore(add(result, 32), selector)
            mstore(add(result, 36), tokenAddress)
        }

        return result;
    }

    /**
     * Get 0xV2 assetData with Augur order metadata
     */
    function getAugurTokenAssetData(address _marketAddress, uint256 _price, uint8 _outcome, uint8 _orderType, bool _ignoreShares, address _kycToken)
        private
        view
        returns (bytes memory)
    {
        bytes memory result = new bytes(228);

        // padded version of bytes4(keccak256("ERC20Token(address)"));
        bytes32 selector = 0xf47261b000000000000000000000000000000000000000000000000000000000;
        address tokenAddress = address(this);

        /* solium-disable-next-line security/no-inline-assembly */
        assembly {
            // Store the selector and address in the asset data
            // The first 32 bytes of an array are the length (already set above)
            mstore(add(result, 32), selector)
            mstore(add(result, 36), tokenAddress)
            mstore(add(result, 68), _marketAddress)
            mstore(add(result, 100), _price)
            mstore(add(result, 132), _outcome)
            mstore(add(result, 164), _orderType)
            mstore(add(result, 196), _ignoreShares)
            mstore(add(result, 228), _kycToken)
        }

        return result;
    }

    function parseAssetData(bytes memory _assetData) public returns (AugurOrderData memory _data) {
        /* solium-disable-next-line security/no-inline-assembly */
        assembly {
            // The load offset begins where the standard ERC20 Proxy data ends at 36 bytes + 32 bytes array initial length data
            mstore(_data,           mload(add(_assetData, 68)))     // marketAddress
            mstore(add(_data, 32),  mload(add(_assetData, 100)))    // price
            mstore(add(_data, 64),  mload(add(_assetData, 132)))    // outcome
            mstore(add(_data, 96),  mload(add(_assetData, 164)))    // orderType
            mstore(add(_data, 128), mload(add(_assetData, 196)))    // ignoreShares
            mstore(add(_data, 160), mload(add(_assetData, 228)))    // kycToken
        }
    }

    function createZeroXOrder(uint8 _type, uint256 _attoshares, uint256 _price, address _market, uint8 _outcome, bool _ignoreShares, address _kycToken, uint256 _expirationTimeSeconds, uint256 _salt) public returns (IExchange.Order memory _zeroXOrder, bytes32 _orderHash) {
        _zeroXOrder.makerAddress = msg.sender;
        _zeroXOrder.takerAddress = address(0);
        _zeroXOrder.feeRecipientAddress = address(0);
        _zeroXOrder.senderAddress = address(0);
        _zeroXOrder.makerAssetAmount = _attoshares;
        _zeroXOrder.takerAssetAmount = _attoshares;
        _zeroXOrder.makerFee = 0;
        _zeroXOrder.takerFee = 0;
        _zeroXOrder.expirationTimeSeconds = _expirationTimeSeconds;
        _zeroXOrder.salt = _salt;
        _zeroXOrder.makerAssetData = getBasicTokenAssetData();
        _zeroXOrder.takerAssetData = getAugurTokenAssetData(_market, _price, _outcome, _type, _ignoreShares, _kycToken);
        _orderHash = exchange.getOrderInfo(_zeroXOrder).orderHash;
    }
}