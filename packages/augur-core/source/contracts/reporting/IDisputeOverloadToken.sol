pragma solidity 0.4.24;

import 'libraries/token/ERC20Token.sol';
import 'reporting/IDisputeCrowdsourcer.sol';
import 'IAugur.sol';


contract IDisputeOverloadToken is ERC20Token {
    function initialize(IDisputeCrowdsourcer _disputeCrowdsourcer, address _erc820RegistryAddress) public returns (bool);
    function trustedMint(address _target, uint256 _amount) public returns (bool);
    function trustedBurn(address _target, uint256 _amount) public returns (bool);
}
