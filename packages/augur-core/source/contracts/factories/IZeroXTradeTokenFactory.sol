pragma solidity 0.5.10;

import 'ROOT/IAugur.sol';
import 'ROOT/trading/IZeroXTradeToken.sol';


contract IZeroXTradeTokenFactory {
    function createZeroXTradeToken(IAugur _augur) public returns (IZeroXTradeToken);
}
