pragma solidity 0.5.10;
pragma experimental ABIEncoderV2;

import "ROOT/libraries/math/SafeMathUint256.sol";
import "ROOT/trading/ICash.sol";
import "ROOT/trading/IZeroXTrade.sol";
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/IAugur.sol';


/**
 * @title ZeroXTradeToken
 * @notice A synthetic token exposing an ERC1155-like interface in order to support filling 0x orders through the ZeroXTrade contract
 */
contract ZeroXTradeToken is IERC1155, Initializable {
    using SafeMathUint256 for uint256;

    ICash public cash;
    IZeroXTrade public zeroXTrade;
    address public market;

    function initialize(address _augur, address _market) external beforeInitialized {
        endInitialization();
        cash = ICash(IAugur(_augur).lookup("Cash"));
        zeroXTrade = IZeroXTrade(IAugur(_augur).lookup("ZeroXTrade"));
        market = _market;
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
        // TODO unpack data from id
        // Check balance of Cash / Price + Shares 
        return 0;
    }

    /// @notice Get the balance of multiple account/token pairs
    /// @param owners The addresses of the token holders
    /// @param ids    ID of the Tokens
    /// @return        The _owner's balance of the Token types requested
    function balanceOfBatch(address[] calldata owners, uint256[] calldata ids) external view returns (uint256[] memory balances_) {
        // TODO unpack data from ids
        // Check balance of Cash / Price + Shares 
    }

    function setApprovalForAll(address operator, bool approved) external {
        revert("Not supported");
    }

    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        return true;
    }

    function getMarket() public view returns (address) {
        return market;
    }
}