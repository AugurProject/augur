pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/ICPExchange.sol';


contract IRepExchangeFactory {
    function createRepExchange(IAugur _augur, address _repTokenAddress) public returns (ICPExchange);
}
