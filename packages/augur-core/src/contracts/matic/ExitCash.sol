pragma solidity 0.5.15;

import 'ROOT/ICash.sol';
import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/matic/ExecutorAcl.sol';
import 'ROOT/matic/IExitCash.sol';


/**
 * @title Cash
 * @dev Test contract for CASH (Dai)
 */
contract ExitCash is IExitCash, VariableSupplyToken, ExecutorAcl, ITyped, ICash {
    using SafeMathUint256 for uint256;

    string constant public name = "Cash";
    string constant public symbol = "CASH";

    function faucet(address _account, uint256 _amount) public isExecuting returns (bool) {
        mint(_account, _amount);
        return true;
    }

    function getTypeName() public view returns (bytes32) {
        return "Cash";
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {}

    function initializeFromPredicate() external beforeInitialized {
        endInitialization();
        _augurPredicate = msg.sender;
    }

    function transfer(address _to, uint256 _amount) public isExecuting returns (bool) {
        return super.transfer(_to, _amount);
    }

    function transferFrom(address _from, address _to, uint256 _amount) public isExecuting returns (bool) {
        _transfer(_from, _to, _amount);
        return true;
    }

    function increaseAllowance(address _spender, uint _addedValue) public isExecuting returns (bool) {
        return super.increaseAllowance(_spender, _addedValue);
    }

    function decreaseAllowance(address _spender, uint _subtractedValue) public isExecuting returns (bool) {
        return super.decreaseAllowance(_spender, _subtractedValue);
    }
}
