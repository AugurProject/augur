pragma solidity 0.5.10;


import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';


contract IShareToken is ITyped, IERC20 {
    function initialize(IAugur _augur, IMarket _market, uint256 _outcome, address _erc1820RegistryAddress) external;
    function setUniverse(IUniverse _universe) external;
    function createShares(address _owner, uint256 _amount) external returns (bool);
    function destroyShares(address, uint256 balance) external returns (bool);
    function getMarket() external view returns (IMarket);
    function getOutcome() external view returns (uint256);
    function trustedOrderTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedFillOrderTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedCancelOrderTransfer(address _source, address _destination, uint256 _attotokens) public returns (bool);
}
