pragma solidity 0.5.10;

import 'ROOT/libraries/CloneFactory.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/factories/IZeroXTradeTokenFactory.sol';
import 'ROOT/trading/IZeroXTradeToken.sol';


/**
 * @title Zero X Trade Token Factory
 * @notice A Factory contract to create Zero X Trade Token contracts
 * @dev Only meant to be used by the market corresponding to the token.
 */
contract ZeroXTradeTokenFactory is IZeroXTradeTokenFactory, CloneFactory {
    function createZeroXTradeToken(IAugur _augur) public returns (IZeroXTradeToken) {
        IMarket _market = IMarket(msg.sender);
        IZeroXTradeToken _zeroXTradeToken = IZeroXTradeToken(createClone(_augur.lookup("ZeroXTradeToken")));
        _zeroXTradeToken.initialize(address(_augur), address(_market));
        return _zeroXTradeToken;
    }
}
