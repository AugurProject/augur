pragma solidity 0.5.4;

import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/token/ERC20Token.sol';
import 'ROOT/reporting/IAuction.sol';
import 'ROOT/IAugur.sol';


contract IAuctionToken is ITyped, ERC20Token {
    uint256 public maxSupply;
    function initialize(IAugur _augur, IAuction _auction, ERC20Token _redemptionToken, uint256 _auctionIndex, address _erc820RegistryAddress) public returns (bool);
    function mintForPurchaser(address _purchaser, uint256 _amount) public returns (bool);
    function retrieveFunds() public returns (bool);
}
