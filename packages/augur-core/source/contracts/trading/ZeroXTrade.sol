pragma solidity 0.5.10;
pragma experimental ABIEncoderV2;

import "ROOT/libraries/math/SafeMathUint256.sol";
import "ROOT/libraries/ContractExists.sol";
import "ROOT/libraries/token/IERC20.sol";
import "ROOT/external/IExchange.sol";
import "ROOT/trading/ICreateOrder.sol";
import "ROOT/trading/IFillOrder.sol";
import "ROOT/trading/ICash.sol";
import "ROOT/trading/Order.sol";
import "ROOT/trading/IZeroXTrade.sol";
import 'ROOT/libraries/Initializable.sol';
import "ROOT/IAugur.sol";
import 'ROOT/libraries/token/IERC1155.sol';


contract ZeroXTrade is Initializable, IZeroXTrade, IERC1155 {
    using SafeMathUint256 for uint256;

    bool transferFromAllowed = false;

    // ERC1155Assets(address,uint256[],uint256[],bytes)
    bytes4 constant public ERC1155_PROXY_ID = 0xa7cb5fb7;

    // EIP191 header for EIP712 prefix
    string constant internal EIP191_HEADER = "\x19\x01";

    // EIP712 Domain Name value
    string constant internal EIP712_DOMAIN_NAME = "0x Protocol";

    // EIP712 Domain Version value
    string constant internal EIP712_DOMAIN_VERSION = "2";

    // Hash of the EIP712 Domain Separator Schema
    bytes32 constant internal EIP712_DOMAIN_SEPARATOR_SCHEMA_HASH = keccak256(
        abi.encodePacked(
        "EIP712Domain(",
        "string name,",
        "string version,",
        "address verifyingContract",
        ")"
    ));

    bytes32 constant internal EIP712_ORDER_SCHEMA_HASH = keccak256(
        abi.encodePacked(
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

    ICreateOrder public createOrder;
    IFillOrder public fillOrder;
    ICash public cash;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        createOrder = ICreateOrder(_augur.lookup("CreateOrder"));
        fillOrder = IFillOrder(_augur.lookup("FillOrder"));
        cash = ICash(_augur.lookup("Cash"));

        EIP712_DOMAIN_HASH = keccak256(
            abi.encodePacked(
                EIP712_DOMAIN_SEPARATOR_SCHEMA_HASH,
                keccak256(bytes(EIP712_DOMAIN_NAME)),
                keccak256(bytes(EIP712_DOMAIN_VERSION)),
                uint256(address(this))
            )
        );
    }

    // ERC1155 Implementation
    /// @notice Transfers value amount of an _id from the _from address to the _to address specified.
    /// @dev MUST emit TransferSingle event on success.
    /// @param from    Source address
    /// @param to      Target address
    /// @param id      ID of the token type
    /// @param value   Transfer amount
    /// @param data    Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes calldata data) external {
        require(transferFromAllowed);
        emit TransferSingle(msg.sender, from, to, id, value);
    }

    /// @notice Send multiple types of Tokens from a 3rd party in one transfer (with safety call).
    /// @dev MUST emit TransferBatch event on success.
    /// @param from    Source addresses
    /// @param to      Target addresses
    /// @param ids     IDs of each token type
    /// @param values  Transfer amounts per token type
    /// @param data    Additional data with no specified format, sent in call to `_to`
    function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata values, bytes calldata data) external {
        require(transferFromAllowed);
        emit TransferBatch(msg.sender, from, to, ids, values);
    }

    /// @notice Get the balance of an account's Tokens.
    /// @param owner  The address of the token holder
    /// @param id     ID of the Token
    /// @return       The _owner's balance of the Token type requested
    function balanceOf(address owner, uint256 id) external view returns (uint256) {
        (address _market, uint256 _price, uint8 _outcome, uint8 _type) = unpackTokenId(id);
        Order.Types _orderType = Order.Types(_type);
        if (_orderType == Order.Types.Ask) {
            return askBalance(owner, IMarket(_market), _outcome, _price);
        } else if (_orderType == Order.Types.Bid) {
            return bidBalance(owner, IMarket(_market), _outcome, _price);
        }
    }

    function bidBalance(address _owner, IMarket _market, uint8 _outcome, uint256 _price) private view returns (uint256) {
        uint256 _numberOfOutcomes = _market.getNumberOfOutcomes();
        // Figure out how many almost-complete-sets (just missing `outcome` share) the creator has
        uint256 _attoSharesOwned = 2**254;
        for (uint256 _i = 0; _i < _numberOfOutcomes; _i++) {
            if (_i != _outcome) {
                uint256 _creatorShareTokenBalance = _market.getShareToken(_i).balanceOf(_owner);
                _attoSharesOwned = _creatorShareTokenBalance.min(_attoSharesOwned);
            }
        }

        uint256 _attoSharesPurchasable = cash.balanceOf(_owner).div(_price);

        return _attoSharesOwned.add(_attoSharesPurchasable);
    }

    function askBalance(address _owner, IMarket _market, uint8 _outcome, uint256 _price) private view returns (uint256) {
        uint256 _attoSharesOwned = _market.getShareToken(_outcome).balanceOf(_owner);
        uint256 _attoSharesPurchasable = cash.balanceOf(_owner).div(_market.getNumTicks().sub(_price));

        return _attoSharesOwned.add(_attoSharesPurchasable);
    }

    /// @notice Get the balance of multiple account/token pairs
    /// @param owners The addresses of the token holders
    /// @param ids    ID of the Tokens
    /// @return        The _owner's balance of the Token types requested
    function balanceOfBatch(address[] calldata owners, uint256[] calldata ids) external view returns (uint256[] memory balances_) {
        balances_ = new uint256[](owners.length);
        for (uint256 _i = 0; _i < owners.length; _i++) {
            balances_[_i] = this.balanceOf(owners[_i], ids[_i]);
        }
    }

    function setApprovalForAll(address operator, bool approved) external {
        revert("Not supported");
    }

    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return true;
    }

    // Trade functions

    /**
     * Perform Augur Trades using 0x signed orders
     *
     * @param  _requestedFillAmount  Share amount to fill
     * @param  _affiliateAddress     Address of affiliate to be paid fees if any
     * @param  _tradeGroupId         Random id to correlate these fills as one trade action
     * @param  _orders               Array of encoded Order struct data
     * @param  _signatures           Array of signature data
     * @return                       The amount the taker still wants
     */
    function trade(
        uint256 _requestedFillAmount,
        address _affiliateAddress,
        bytes32 _tradeGroupId,
        IExchange.Order[] memory _orders,
        bytes[] memory _signatures
    )
        public
        returns (uint256)
    {
        uint256 _fillAmountRemaining = _requestedFillAmount;

        transferFromAllowed = true;

        // Do the actual asset exchanges
        for (uint256 i = 0; i < _orders.length && _fillAmountRemaining != 0; i++) {
            IExchange.Order memory _order = _orders[i];
            validateOrder(_order);
            IExchange _exchange = getExchangeFromAssetData(_order.makerAssetData);

            // Update 0x. This will also validate signatures and order state for us.
            IExchange.FillResults memory totalFillResults = _exchange.fillOrderNoThrow(
                _order,
                _fillAmountRemaining,
                _signatures[i]
            );
            if (totalFillResults.takerAssetFilledAmount == 0) {
                continue;
            }

            uint256 _amountTraded = doTrade(_order, totalFillResults.takerAssetFilledAmount, _affiliateAddress, _tradeGroupId, msg.sender);

            _fillAmountRemaining = _fillAmountRemaining.sub(_amountTraded);
        }

        transferFromAllowed = false;

        return _fillAmountRemaining;
    }

    function validateOrder(IExchange.Order memory _order) internal pure {
        (IERC1155 _zeroXTradeToken, uint256 _tokenId) = getZeroXTradeTokenData(_order.makerAssetData);
        (IERC1155 _zeroXTradeTokenTaker, uint256 _tokenIdTaker) = getZeroXTradeTokenData(_order.takerAssetData);
        require(_zeroXTradeToken == _zeroXTradeTokenTaker);
        require(_tokenId == _tokenIdTaker);
        // XXX: Needs merge from master to work
        // XXX require(_zeroXTradeToken == this);
    }

    function doTrade(IExchange.Order memory _order, uint256 _amount, address _affiliateAddress, bytes32 _tradeGroupId, address _taker) private returns (uint256) {
        // parseOrderData will validate that the token being traded is the leigitmate one for the market
        AugurOrderData memory _augurOrderData = parseOrderData(_order);
        // If the signed order creator doesnt have enough funds we still want to continue and take their order out of the list
        // If the filler doesn't have funds this will just fail, which is fine
        if (!creatorHasFundsForTrade(_order, _amount)) {
            return 0;
        }
        // If the maker is also the taker we also just skip the trade
        if (_order.makerAddress == _taker) {
            return 0;
        }
        fillOrder.fillZeroXOrder(IMarket(_augurOrderData.marketAddress), _augurOrderData.outcome, IERC20(_augurOrderData.kycToken), _augurOrderData.price, Order.Types(_augurOrderData.orderType), _amount, _order.makerAddress, _tradeGroupId, _affiliateAddress, _taker);
        return _amount;
    }

    function creatorHasFundsForTrade(IExchange.Order memory _order, uint256 _amount) public view returns (bool) {
        uint256 _tokenId = getTokenIdFromOrder(_order);
        return _amount <= this.balanceOf(_order.makerAddress, _tokenId);
    }

    function getTransferFromAllowed() public view returns (bool) {
        return transferFromAllowed;
    }

    /// @dev Encode ERC-1155 asset data into the format described in the AssetProxy contract specification.
    /// @param _market The address of the market to trade on
    /// @param _price The price used to trade
    /// @param _outcome The outcome to trade on
    /// @param _type Either BID == 0 or ASK == 1
    /// @param _kycToken The kycToken used to restrict filling this order
    /// @return AssetProxy-compliant asset data describing the set of assets.
    function encodeAssetData(
        IMarket _market,
        uint256 _price,
        uint8 _outcome,
        uint8 _type,
        IERC20 _kycToken,
        IExchange _exchange
    )
        public
        view
        returns (bytes memory _assetData)
    {
        uint256[] memory _tokenIds = new uint256[](1);
        uint256[] memory _tokenValues = new uint256[](1);

        uint256 _tokenId = getTokenId(address(_market), _price, _outcome, _type);
        _tokenIds[0] = _tokenId;
        _tokenValues[0] = 1;
        bytes memory _callbackData = new bytes(0);
        _assetData = abi.encodeWithSelector(
            ERC1155_PROXY_ID,
            address(this),
            _tokenIds,
            _tokenValues,
            _callbackData,
            _kycToken,
            _exchange
        );
        return _assetData;
    }

    function getTokenId(address _market, uint256 _price, uint8 _outcome, uint8 _type) public pure returns (uint256 _tokenId) {
        // NOTE: we're assuming no one needs a full uint256 for the price value here and cutting to uint80 so we can pack this in a uint256.
        bytes memory _tokenIdBytes = abi.encodePacked(_market, uint80(_price), _outcome, _type);
        assembly {
            _tokenId := mload(add(_tokenIdBytes, add(0x20, 0)))
        }
    }

    function unpackTokenId(uint256 _tokenId) public pure returns (address _market, uint256 _price, uint8 _outcome, uint8 _type) {
        assembly {
            _market := shr(96, and(_tokenId, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000000))
            _price := shr(16,  and(_tokenId, 0x0000000000000000000000000000000000000000FFFFFFFFFFFFFFFFFFFF0000))
            _outcome := shr(8, and(_tokenId, 0x000000000000000000000000000000000000000000000000000000000000FF00))
            _type :=           and(_tokenId, 0x00000000000000000000000000000000000000000000000000000000000000FF)
        }
    }

    /// @dev Decode ERC-1155 asset data from the format described in the AssetProxy contract specification.
    /// @param _assetData AssetProxy-compliant asset data describing an ERC-1155 set of assets.
    /// @return The ERC-1155 AssetProxy identifier, the address of the ERC-1155
    /// contract hosting the assets, an array of the identifiers of the
    /// assets to be traded, an array of asset amounts to be traded, and
    /// callback data.  Each element of the arrays corresponds to the
    /// same-indexed element of the other array.  Return values specified as
    /// `memory` are returned as pointers to locations within the memory of
    /// the input parameter `assetData`.
    function decodeAssetData(bytes memory _assetData)
        public
        pure
        returns (
            bytes4 _assetProxyId,
            address _tokenAddress,
            uint256[] memory _tokenIds,
            uint256[] memory _tokenValues,
            bytes memory _callbackData,
            address _kycToken,
            IExchange _exchange
        )
    {
        assembly {
            // Skip selector and length to get to the first parameter:
            _assetData := add(_assetData, 36)
            // Read the value of the first parameter:
            _tokenAddress := mload(_assetData)
            _tokenIds := add(_assetData, mload(add(_assetData, 32)))
            _tokenValues := add(_assetData, mload(add(_assetData, 64)))
            _callbackData := add(_assetData, mload(add(_assetData, 96)))
            _kycToken := mload(add(_assetData, 128))
            _exchange := mload(add(_assetData, 160))
        }

        return (
            _assetProxyId,
            _tokenAddress,
            _tokenIds,
            _tokenValues,
            _callbackData,
            _kycToken,
            _exchange
        );
    }

    function getExchangeFromAssetData(bytes memory _assetData) public pure returns (IExchange _exchange) {
        assembly {
            _assetData := add(_assetData, 36)
            _exchange := mload(add(_assetData, 160))
        }
    }

    function parseOrderData(IExchange.Order memory _order) public view returns (AugurOrderData memory _data) {
        (bytes4 _assetProxyId, address _tokenAddress, uint256[] memory _tokenIds, uint256[] memory _tokenValues, bytes memory _callbackData, address _kycToken, IExchange _exchange) = decodeAssetData(_order.makerAssetData);
        (address _market, uint256 _price, uint8 _outcome, uint8 _type) = unpackTokenId(_tokenIds[0]);
        _data.marketAddress = _market;
        _data.price = _price;
        _data.orderType = _type;
        _data.outcome = _outcome;
        _data.kycToken = _kycToken;
    }

    function getZeroXTradeTokenData(bytes memory _assetData) public pure returns (IERC1155 _token, uint256 _tokenId) {
        (bytes4 _assetProxyId, address _tokenAddress, uint256[] memory _tokenIds, uint256[] memory _tokenValues, bytes memory _callbackData, address _kycToken, IExchange _exchange) = decodeAssetData(_assetData);
        _token = IERC1155(_tokenAddress);
    }

    function getTokenIdFromOrder(IExchange.Order memory _order) public pure returns (uint256 _tokenId) {
        (bytes4 _assetProxyId, address _tokenAddress, uint256[] memory _tokenIds, uint256[] memory _tokenValues, bytes memory _callbackData, address _kycToken, IExchange _exchange) = decodeAssetData(_order.makerAssetData);        
        _tokenId = _tokenIds[0];
    }

    function createZeroXOrder(uint8 _type, uint256 _attoshares, uint256 _price, address _market, uint8 _outcome, address _kycToken, uint256 _expirationTimeSeconds, IExchange _exchange, uint256 _salt) public view returns (IExchange.Order memory _zeroXOrder, bytes32 _orderHash) {
        bytes memory _assetData = encodeAssetData(IMarket(_market), _price, _outcome, _type, IERC20(_kycToken), _exchange);
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
        _zeroXOrder.makerAssetData = _assetData;
        _zeroXOrder.takerAssetData = _assetData;
        _orderHash = _exchange.getOrderInfo(_zeroXOrder).orderHash;
    }
}