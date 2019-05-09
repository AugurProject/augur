pragma solidity 0.5.4;


contract IDaiVat {
    function hope(address usr) public;
    function move(address src, address dst, int256 rad) public;
    function heal(int rad) public;
    function faucet(address _target, uint256 _amount) public;
}
