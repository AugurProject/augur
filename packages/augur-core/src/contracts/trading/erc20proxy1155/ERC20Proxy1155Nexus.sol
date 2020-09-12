pragma solidity 0.5.15;

import 'ROOT/libraries/CloneFactory2.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/reporting/IShareToken.sol';
import 'ROOT/trading/erc20proxy1155/IERC20Proxy1155Nexus.sol';
import 'ROOT/trading/erc20proxy1155/IERC20Proxy1155.sol';
import 'ROOT/trading/erc20proxy1155/ERC20Proxy1155.sol';

// To use these ERC20s, the user will have to call
// setApprovalForAll(ERC20Proxy1155Nexus, true)
// on the ShareToken contract themselves.

contract ERC20Proxy1155Nexus is IERC20Proxy1155Nexus, CloneFactory2 {
    using SafeMathUint256 for uint256;

    IERC20Proxy1155 internal proxyToClone;

    // tokenId -> owner -> spender -> allowance
    // The spender is whoever called the proxy contract, which is msg.sender in the proxy and _caller here in the nexus.
    mapping (uint256 => mapping (address => mapping (address => uint256))) internal allowances;

    constructor(address _proxyToClone, IShareToken _target1155) public {
        proxyToClone = IERC20Proxy1155(_proxyToClone);
        target1155 = _target1155;
    }

    function newERC20(uint256 _tokenId) public returns (IERC20Proxy1155) {
        IERC20Proxy1155 _erc20 = IERC20Proxy1155(createClone2(address(proxyToClone), _tokenId));
        _erc20.initialize(this, _tokenId);
        return _erc20;
    }

    function newERC20s(uint256[] memory _tokenIds) public returns (IERC20Proxy1155[] memory) {
        IERC20Proxy1155[] memory erc20s = new IERC20Proxy1155[](_tokenIds.length);
        for (uint i = 0; i < _tokenIds.length; i++) {
            erc20s[i] = newERC20(_tokenIds[i]);
        }
        return erc20s;
    }

    function transfer(IERC20Proxy1155 _proxy, address _caller, address _to, uint256 _amount) public returns (bool) {
        _transfer(_proxy, _caller, _to, _amount);
        return true;
    }

    function transferFrom(IERC20Proxy1155 _proxy, address _caller, address _from, address _to, uint256 _amount) public returns (bool) {
        _transfer(_proxy, _from, _to, _amount);
        _approve(_proxy, _from, _caller, allowances[_proxy.tokenId()][_from][_caller].sub(_amount));
        return true;
    }

    function approve(IERC20Proxy1155 _proxy, address _caller, address _spender, uint256 _amount) public returns (bool) {
        _approve(_proxy, _caller, _spender, _amount);
        return true;
    }

    function allowance(IERC20Proxy1155 _proxy, address _owner, address _spender) public view returns (uint256) {
        uint256 _tokenId = _proxy.tokenId();
        return allowances[_tokenId][_owner][_spender];
    }

    function _transfer(IERC20Proxy1155 _proxy, address _from, address _to, uint256 _amount) internal {
        uint256 _tokenId = _proxy.tokenId();
        _gate(_proxy, _tokenId);

        target1155.unsafeTransferFrom(_from, _to, _tokenId, _amount);
        _proxy.logTransfer(_from, _to, _amount);
    }

    function _approve(IERC20Proxy1155 _proxy, address _owner, address _spender, uint256 _amount) internal {
        uint256 _tokenId = _proxy.tokenId();
        _gate(_proxy, _tokenId);

        allowances[_tokenId][_owner][_spender] = _amount;
        _proxy.logApproval(_owner, _spender, _amount);
    }

    // Guarantees that the calling function was invoked by a trusted proxy contract.
    // So we can trust its _caller to be the proxy's msg.sender.
    function _gate(IERC20Proxy1155 _proxy,  uint256 _tokenId) internal view {
        require(msg.sender == address(_proxy)); // only proxies may make calls
        require(getProxy(_tokenId) == _proxy); // no sneaky stuff!
    }

    function getProxy(uint256 _tokenId) public view returns (IERC20Proxy1155) {
        IERC20Proxy1155 _proxy = getProxyAddress(_tokenId);
        if (isContract(address(_proxy))) {
            return _proxy;
        } else {
            return IERC20Proxy1155(0);
        }
    }

    function getProxyAddress(uint256 _tokenId) public view returns (IERC20Proxy1155) {
        return IERC20Proxy1155(clone2Address(address(proxyToClone), _tokenId, address(this)));
    }

    function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }
}
