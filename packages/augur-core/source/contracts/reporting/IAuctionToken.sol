pragma solidity 0.4.24;

import 'libraries/ITyped.sol';
import 'libraries/token/ERC20.sol';
import 'reporting/IAuction.sol';
import 'IAugur.sol';


contract IAuctionToken is ITyped, ERC20 {
    uint256 public maxSupply;
    function initialize(IAugur _augur, IAuction _auction, ERC20 _redemptionToken, uint256 _auctionIndex) public returns (bool);
    function mintForPurchaser(address _purchaser, uint256 _amount) public returns (bool);
    function retrieveFunds() public returns (bool);
}
