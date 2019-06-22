pragma solidity 0.5.4;

import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/reporting/IAuction.sol';
import 'ROOT/IAugur.sol';


contract IAuctionToken is ITyped, IERC20 {
    uint256 public maxSupply;
    function initialize(IAugur _augur, IAuction _auction, IERC20 _redemptionToken, uint256 _auctionIndex, address _erc1820RegistryAddress) public returns (bool);
    function mintForPurchaser(address _purchaser, uint256 _amount) public returns (bool);
    function retrieveFunds() public returns (bool);
}
