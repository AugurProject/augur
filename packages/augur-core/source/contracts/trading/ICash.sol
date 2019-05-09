pragma solidity 0.5.4;


import 'ROOT/libraries/token/ERC20Token.sol';


contract ICash is ERC20Token {
    function joinMint(address usr, uint wad) public returns (bool);
    function joinBurn(address usr, uint wad) public returns (bool);
}
