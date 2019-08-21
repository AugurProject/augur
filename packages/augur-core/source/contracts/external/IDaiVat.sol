pragma solidity 0.5.10;


contract IDaiVat {
    mapping (address => uint256) public dai;  // [rad]
    function hope(address usr) public;
    function move(address src, address dst, uint256 rad) public;
    function suck(address u, address v, uint rad) public;
    function faucet(address _target, uint256 _amount) public;
}