pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/reporting/Universe.sol';
import 'ROOT/ICPExchange.sol';
import 'ROOT/CPExchange.sol';


/**
 * @title RepExchange Factory
 * @notice A Factory contract to create Rep Exchange contracts
 */
contract RepExchangeFactory {
    function createRepExchange(IAugur _augur, address _repTokenAddress) public returns (ICPExchange) {
        CPExchange _exchange = new CPExchange();
        _exchange.initialize(address(_augur), _repTokenAddress);
        return ICPExchange(address(_exchange));
    }
}
