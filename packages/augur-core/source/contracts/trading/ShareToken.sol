pragma solidity 0.5.10;

import 'ROOT/trading/IShareToken.sol';
import 'ROOT/libraries/token/ERC1155.sol';
import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/trading/IProfitLoss.sol';
import 'ROOT/IAugur.sol';


/**
 * @title Share Token
 * @notice ERC1155 contract to hold all Augur share token balances
 */
contract ShareToken is ITyped, Initializable, ERC1155, IShareToken {

    string constant public name = "Shares";
    string constant public symbol = "SHARE";

    mapping(address => uint256) marketOutcomes;

    IAugur public augur;
    address public createOrder;
    address public fillOrder;
    address public cancelOrder;
    address public completeSets;
    address public claimTradingProceeds;
    IProfitLoss public profitLoss;

    mapping(address => bool) private doesNotUpdatePnl;

    function initialize(IAugur _augur) external beforeInitialized {
        endInitialization();
        augur = _augur;

        address _createOrder = _augur.lookup("CreateOrder");
        address _fillOrder = _augur.lookup("FillOrder");
        address _cancelOrder = _augur.lookup("CancelOrder");

        doesNotUpdatePnl[_createOrder] = true;
        doesNotUpdatePnl[_fillOrder] = true;
        doesNotUpdatePnl[_cancelOrder] = true;

        createOrder = _createOrder;
        fillOrder = _fillOrder;
        cancelOrder = _cancelOrder;

        completeSets = _augur.lookup("CompleteSets");
        claimTradingProceeds = _augur.lookup("ClaimTradingProceeds");
        profitLoss = IProfitLoss(_augur.lookup("ProfitLoss"));
    }

    /**
        @dev Transfers `value` amount of an `id` from the `from` address to the `to` address specified.
        Caller must be approved to manage the tokens being transferred out of the `from` account.
        Regardless of if the desintation is a contract or not this will not call `onERC1155Received` on `to`
        @param _from Source address
        @param _to Target address
        @param _id ID of the token type
        @param _value Transfer amount
    */
    function unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value) public {
        _transferFrom(_from, _to, _id, _value, bytes(""), false);
    }

    /**
        @dev Transfers `values` amount(s) of `ids` from the `from` address to the
        `to` address specified. Caller must be approved to manage the tokens being
        transferred out of the `from` account. Regardless of if the desintation is
        a contract or not this will not call `onERC1155Received` on `to`
        @param _from Source address
        @param _to Target address
        @param _ids IDs of each token type
        @param _values Transfer amounts per token type
    */
    function unsafeBatchTransferFrom(address _from, address _to, uint256[] memory _ids, uint256[] memory _values) public {
        _batchTransferFrom(_from, _to, _ids, _values, bytes(""), false);
    }

    function initializeMarket(IMarket _market, uint256 _numOutcomes) public {
        require (augur.isKnownUniverse(IUniverse(msg.sender)));
        marketOutcomes[address(_market)] = _numOutcomes;
    }

    function createSet(IMarket _market, address _owner, uint256 _amount) external returns(bool) {
        require(msg.sender == completeSets);
        uint256 _marketNumOutcomes = marketOutcomes[address(_market)];
        uint256[] memory _tokenIds = new uint256[](_marketNumOutcomes);
        uint256[] memory _values = new uint256[](_marketNumOutcomes);

        for (uint256 _i = 0; _i < _marketNumOutcomes; _i++) {
            _tokenIds[_i] = getTokenId(_market, _i);
            _values[_i] = _amount;
        }
        _mintBatch(_owner, _tokenIds, _values, bytes(""), false);
        return true;
    }

    function destroySet(IMarket _market, address _owner, uint256 _amount) external returns(bool) {
        require(msg.sender == completeSets);
        uint256 _marketNumOutcomes = marketOutcomes[address(_market)];
        uint256[] memory _tokenIds = new uint256[](_marketNumOutcomes);
        uint256[] memory _values = new uint256[](_marketNumOutcomes);

        for (uint256 i = 0; i < _marketNumOutcomes; i++) {
            _tokenIds[i] = getTokenId(_market, i);
            _values[i] = _amount;
        }
        _burnBatch(_owner, _tokenIds, _values, bytes(""), false);
        return true;
    }

    function destroyShares(IMarket _market, uint256 _outcome, address _owner, uint256 _amount) external returns(bool) {
        require(msg.sender == claimTradingProceeds);
        uint256 _tokenId = getTokenId(_market, _outcome);
        _burn(_owner, _tokenId, _amount, bytes(""), false);
        return true;
    }

    function trustedOrderTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) public doesNotUpdatePL returns (bool) {
        require(msg.sender == createOrder);
        marketOutcomeTransfer(_market, _outcome, _source, _destination, _attotokens);
    }

    function trustedOrderBatchTransfer(IMarket _market, uint256[] memory _outcomes, address _source, address _destination, uint256 _attotokens) public doesNotUpdatePL returns (bool) {
        require(msg.sender == createOrder);
        marketOutcomesBatchTransfer(_market, _outcomes, _source, _destination, _attotokens);
    }

    function trustedFillOrderTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) public doesNotUpdatePL returns (bool) {
        require(msg.sender == fillOrder);
        marketOutcomeTransfer(_market, _outcome, _source, _destination, _attotokens);
    }

    function trustedFillOrderBatchTransfer(IMarket _market, uint256[] memory _outcomes, address _source, address _destination, uint256 _attotokens) public doesNotUpdatePL returns (bool) {
        require(msg.sender == fillOrder);
        marketOutcomesBatchTransfer(_market, _outcomes, _source, _destination, _attotokens);
    }

    function trustedCancelOrderTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) public doesNotUpdatePL returns (bool) {
        require(msg.sender == cancelOrder);
        marketOutcomeTransfer(_market, _outcome, _source, _destination, _attotokens);
    }

    function trustedCancelOrderBatchTransfer(IMarket _market, uint256[] memory _outcomes, address _source, address _destination, uint256 _attotokens) public doesNotUpdatePL returns (bool) {
        require(msg.sender == cancelOrder);
        marketOutcomesBatchTransfer(_market, _outcomes, _source, _destination, _attotokens);
    }

    function trustedCompleteSetTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) public doesNotUpdatePL returns (bool) {
        require(msg.sender == completeSets);
        marketOutcomeTransfer(_market, _outcome, _source, _destination, _attotokens);
    }

    function marketOutcomeTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) internal {
        uint256 _tokenId = getTokenId(_market, _outcome);
        // We do not call ERC1155 ERC165 hooks here as it would allow a malicious order creator to halt trading
        return _internalTransferFrom(_source, _destination, _tokenId, _attotokens, bytes(""), false);
    }

    function marketOutcomesBatchTransfer(IMarket _market, uint256[] memory _outcomes, address _source, address _destination, uint256 _attotokens) internal {
        uint256[] memory _tokenIds = new uint256[](_outcomes.length);
        uint256[] memory _values = new uint256[](_outcomes.length);

        for (uint256 _i = 0; _i < _outcomes.length; _i++) {
            _tokenIds[_i] = getTokenId(_market, _outcomes[_i]);
            _values[_i] = _attotokens;
        }
        // We do not call ERC1155 ERC165 hooks here as it may allow a malicious order creator to halt trading
        return _internalBatchTransferFrom(_source, _destination, _tokenIds, _values, bytes(""), false);
    }

    function getTypeName() public view returns(bytes32) {
        return "ShareToken";
    }

    /**
     * @return The market associated with this Share Token ID
     */
    function getMarket(uint256 _tokenId) external view returns(IMarket) {
        (address _market, uint256 _outcome) = unpackTokenId(_tokenId);
        return IMarket(_market);
    }

    /**
     * @return The outcome associated with this Share Token ID
     */
    function getOutcome(uint256 _tokenId) external view returns(uint256) {
        (address _market, uint256 _outcome) = unpackTokenId(_tokenId);
        return _outcome;
    }

    function totalSupplyForMarketOutcome(IMarket _market, uint256 _outcome) public view returns (uint256) {
        uint256 _tokenId = getTokenId(_market, _outcome);
        return totalSupply(_tokenId);
    }

    function balanceOfMarketOutcome(IMarket _market, uint256 _outcome, address _account) public view returns (uint256) {
        uint256 _tokenId = getTokenId(_market, _outcome);
        return balanceOf(_account, _tokenId);
    }

    function lowestBalanceOfMarketOutcomes(IMarket _market, uint256[] memory _outcomes, address _account) public view returns (uint256) {
        uint256 _lowest = SafeMathUint256.getUint256Max();
        for (uint256 _i = 0; _i < _outcomes.length; ++_i) {
            uint256 _tokenId = getTokenId(_market, _outcomes[_i]);
            _lowest = balanceOf(_account, _tokenId).min(_lowest);
        }
        return _lowest;
    }

    function getTokenId(IMarket _market, uint256 _outcome) public pure returns (uint256 _tokenId) {
        bytes memory _tokenIdBytes = abi.encodePacked(_market, uint8(_outcome));
        assembly {
            _tokenId := mload(add(_tokenIdBytes, add(0x20, 0)))
        }
    }

    function unpackTokenId(uint256 _tokenId) public pure returns (address _market, uint256 _outcome) {
        assembly {
            _market := shr(96,  and(_tokenId, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000000))
            _outcome := shr(88, and(_tokenId, 0x0000000000000000000000000000000000000000FF0000000000000000000000))
        }
    }

    function onTokenTransfer(uint256 _tokenId, address _from, address _to, uint256 _value) internal {
        (address _marketAddress, uint256 _outcome) = unpackTokenId(_tokenId);
        if (shouldUpdatePL) {
            profitLoss.recordExternalTransfer(IMarket(_marketAddress), _outcome, _from, _to, _value);
        }
        augur.logShareTokensBalanceChanged(_from, IMarket(_marketAddress), _outcome, balanceOf(_from, _tokenId));
        augur.logShareTokensBalanceChanged(_to, IMarket(_marketAddress), _outcome, balanceOf(_to, _tokenId));
    }

    function onMint(uint256 _tokenId, address _target, uint256 _amount) internal {
        (address _marketAddress, uint256 _outcome) = unpackTokenId(_tokenId);
        augur.logShareTokensBalanceChanged(_target, IMarket(_marketAddress), _outcome, balanceOf(_target, _tokenId));
    }

    function onBurn(uint256 _tokenId, address _target, uint256 _amount) internal {
        (address _marketAddress, uint256 _outcome) = unpackTokenId(_tokenId);
        augur.logShareTokensBalanceChanged(_target, IMarket(_marketAddress), _outcome, balanceOf(_target, _tokenId));
    }
}
