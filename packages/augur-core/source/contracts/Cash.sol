pragma solidity 0.5.4;

import 'ROOT/IAugur.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';


/**
 * @title Cash
 * @dev Test contract for CASH
 */
contract Cash is ITyped, VariableSupplyToken, ICash {

    string constant public name = "Cash";
    string constant public symbol = "CASH";

    function initialize(IAugur _augur) public returns (bool) {
        erc1820Registry = IERC1820Registry(_augur.lookup("ERC1820Registry"));
        initialize1820InterfaceImplementations();
        return true;
    }

    function faucet(uint256 _amount) public returns (bool) {
        mint(msg.sender, _amount);
        return true;
    }

    function getTypeName() public view returns (bytes32) {
        return "Cash";
    }

    function onMint(address, uint256) internal returns (bool) {
        return true;
    }

    function onBurn(address, uint256) internal returns (bool) {
        return true;
    }

    function onTokenTransfer(address, address, uint256) internal returns (bool) {
        return true;
    }
}
