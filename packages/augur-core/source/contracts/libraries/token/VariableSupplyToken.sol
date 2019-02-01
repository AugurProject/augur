pragma solidity 0.4.24;


import 'libraries/token/StandardToken.sol';


contract VariableSupplyToken is StandardToken {
    using SafeMathUint256 for uint256;

    event Mint(address indexed target, uint256 value);
    event Burn(address indexed target, uint256 value);

    function mint(address _target, uint256 _amount) internal returns (bool) {
        balances[_target] = balances[_target].add(_amount);
        supply = supply.add(_amount);
        emit Mint(_target, _amount);
        emit Transfer(address(0), _target, _amount);
        onMint(_target, _amount);
        return true;
    }

    function burn(address _target, uint256 _amount) internal returns (bool) {
        doBurn(this, _target, _amount, "", "");
        onBurn(_target, _amount);
        return true;
    }

    // Subclasses of this token may want to send additional logs through the centralized Augur log emitter contract
    function onMint(address, uint256) internal returns (bool);

    // Subclasses of this token may want to send additional logs through the centralized Augur log emitter contract
    function onBurn(address, uint256) internal returns (bool);
}
