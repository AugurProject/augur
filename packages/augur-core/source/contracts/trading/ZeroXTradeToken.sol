pragma solidity 0.5.10;
pragma experimental ABIEncoderV2;

import "ROOT/libraries/math/SafeMathUint256.sol";
import "ROOT/trading/ICash.sol";
import "ROOT/trading/IZeroXTrade.sol";
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/IAugur.sol';


/**
 * @title ZeroXTradeToken
 * @notice A synthetic token exposing an ERC1155-like interface in order to support filling 0x orders through the ZeroXTrade contract
 */
contract ZeroXTradeToken is IERC1155, Initializable {
    using SafeMathUint256 for uint256;

    ICash public cash;
    IZeroXTrade public zeroXTrade;
    IMarket public market;

    function initialize(address _augur, address _market) external beforeInitialized {
        endInitialization();
        cash = ICash(IAugur(_augur).lookup("Cash"));
        zeroXTrade = IZeroXTrade(IAugur(_augur).lookup("ZeroXTrade"));
        market = IMarket(_market);
    }

    /// @notice Transfers value amount of an _id from the _from address to the _to address specified.
    /// @dev MUST emit TransferSingle event on success.
    /// @param from    Source address
    /// @param to      Target address
    /// @param id      ID of the token type
    /// @param value   Transfer amount
    /// @param data    Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes calldata data) external {
        require(zeroXTrade.getTransferFromAllowed());
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
        require(zeroXTrade.getTransferFromAllowed());
        emit TransferBatch(msg.sender, from, to, ids, values);
    }

    /// @notice Get the balance of an account's Tokens.
    /// @param owner  The address of the token holder
    /// @param id     ID of the Token
    /// @return        The _owner's balance of the Token type requested
    function balanceOf(address owner, uint256 id) external view returns (uint256) {
        (uint256 _price, uint8 _outcome, uint8 _type) = zeroXTrade.unpackTokenId(id);
        Order.Types _orderType = Order.Types(_type);
        if (_orderType == Order.Types.Ask) {
            return askBalance(owner, _outcome, _price);
        } else if (_orderType == Order.Types.Bid) {
            return bidBalance(owner, _outcome, _price);
        }
    }

    function bidBalance(address _owner, uint8 _outcome, uint256 _price) private view returns (uint256) {
        uint256 _numberOfOutcomes = market.getNumberOfOutcomes();

        // Figure out how many almost-complete-sets (just missing `outcome` share) the creator has
        uint256 _attoSharesOwned = 2**254;
        for (uint256 _i = 0; _i < _numberOfOutcomes; _i++) {
            if (_i != _outcome) {
                uint256 _creatorShareTokenBalance = market.getShareToken(_i).balanceOf(_owner);
                _attoSharesOwned = _creatorShareTokenBalance.min(_attoSharesOwned);
            }
        }

        uint256 _attoSharesPurchasable = cash.balanceOf(_owner).div(_price);

        return _attoSharesOwned.add(_attoSharesPurchasable);
    }

    function askBalance(address _owner, uint8 _outcome, uint256 _price) private view returns (uint256) {
        uint256 _attoSharesOwned = market.getShareToken(_outcome).balanceOf(_owner);
        uint256 _attoSharesPurchasable = cash.balanceOf(_owner).div(market.getNumTicks().sub(_price));

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

    function getMarket() public view returns (address) {
        return address(market);
    }
}