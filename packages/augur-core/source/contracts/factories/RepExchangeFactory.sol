pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/reporting/Universe.sol';
import 'ROOT/ISimpleDex.sol';
import 'ROOT/RepExchange.sol';


/**
 * @title RepExchange Factory
 * @notice A Factory contract to create Rep Exchange contracts
 */
contract RepExchangeFactory {
    function createRepExchange(IAugur _augur, address _repTokenAddress) public returns (ISimpleDex) {
        RepExchange _exchange = new RepExchange();
        _exchange.initialize(address(_augur), _repTokenAddress);
        return ISimpleDex(address(_exchange));
    }
}
