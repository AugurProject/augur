pragma solidity 0.5.10;


contract IDaiJoin {
    function join(address urn, uint wad) public;
    function exit(address usr, uint wad) public;
}