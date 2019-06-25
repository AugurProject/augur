pragma solidity 0.5.4;


import 'ROOT/libraries/token/StandardToken.sol';


contract VariableSupplyToken is StandardToken {
    using SafeMathUint256 for uint256;

    function mint(address _target, uint256 _amount) internal returns (bool) {
        _mint(address(this), _target, _amount, "", "", false);
        onMint(_target, _amount);
        return true;
    }

    function burn(address _target, uint256 _amount) internal returns (bool) {
        _burn(address(this), _target, _amount, "", "", false);
        onBurn(_target, _amount);
        return true;
    }

    // Subclasses of this token may want to send additional logs through the centralized Augur log emitter contract
    function onMint(address, uint256) internal ;

    // Subclasses of this token may want to send additional logs through the centralized Augur log emitter contract
    function onBurn(address, uint256) internal ;
}
