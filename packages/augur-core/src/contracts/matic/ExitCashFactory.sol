pragma solidity 0.5.15;

import "ROOT/Cash.sol";
import "ROOT/matic/ITokenFactory.sol";

contract ExitCashFactory is ITokenFactory {
  function deploy() public returns(address) {
    return address(new Cash());
  }
}
