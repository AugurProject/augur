pragma solidity 0.5.10;


import 'ROOT/libraries/CloneFactory.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/IAugur.sol';


/**
 * @title Share Token Factory
 * @notice A Factory contract to create Share Token contracts
 * @dev Should not be used directly. Only intended to be used by Market contracts.
 */
contract ShareTokenFactory is CloneFactory {
    function createShareToken(IAugur _augur, uint256 _outcome) public returns (IShareToken) {
        IMarket _market = IMarket(msg.sender);
        IShareToken _shareToken = IShareToken(createClone(_augur.lookup("ShareToken")));
        _shareToken.initialize(_augur, _market, _outcome, _augur.lookup("ERC1820Registry"));
        return _shareToken;
    }
}
