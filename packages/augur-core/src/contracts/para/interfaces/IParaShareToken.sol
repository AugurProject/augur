pragma solidity 0.5.15;

import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/ICash.sol';
import 'ROOT/reporting/IMarket.sol';

interface IParaShareToken {
    function cash() external view returns (ICash);
    function augur() external view returns (address);
    function initialize(address _augur, address _originalShareToken) external;
    function approveUniverse(IParaUniverse _paraUniverse) external;
    function buyCompleteSets(IMarket _market, address _account, uint256 _amount) external returns (bool);
    function claimTradingProceeds(IMarket _market, address _shareHolder, bytes32 _fingerprint) external returns (uint256[] memory _outcomeFees);
    function publicSellCompleteSets(IMarket _market, uint256 _amount) external returns (uint256 _creatorFee, uint256 _reportingFee);
    function publicBuyCompleteSets(IMarket _market, uint256 _amount) external returns (bool);
    function getTokenId(IMarket _market, uint256 _outcome) external pure returns (uint256 _tokenId);
    function unsafeTransferFrom(address _from, address _to, uint256 _id, uint256 _value) external;
    function balanceOf(address owner, uint256 id) external view returns (uint256);
    function balanceOfBatch(address[] calldata owners, uint256[] calldata ids) external view returns (uint256[] memory balances_);
    function unsafeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values) external;
    function getMarket(uint256 _tokenId) external pure returns(IMarket);
}
