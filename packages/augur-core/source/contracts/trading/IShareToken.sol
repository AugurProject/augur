pragma solidity 0.4.24;


import 'libraries/ITyped.sol';
import 'libraries/token/ERC20Token.sol';
import 'reporting/IMarket.sol';
import 'IAugur.sol';


contract IShareToken is ITyped, ERC20Token {
    function initialize(IAugur _augur, IMarket _market, uint256 _outcome, address _erc820RegistryAddress) external returns (bool);
    function createShares(address _owner, uint256 _amount) external returns (bool);
    function destroyShares(address, uint256 balance) external returns (bool);
    function getMarket() external view returns (IMarket);
    function getOutcome() external view returns (uint256);
    function trustedOrderTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedFillOrderTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedCancelOrderTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool);
}
