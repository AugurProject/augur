pragma solidity 0.5.15;

import 'ROOT/trading/ProfitLoss.sol';


contract ProfitLossFactory {
    function createProfitLoss() public returns (address) {
        return address(new ProfitLoss());
    }
}