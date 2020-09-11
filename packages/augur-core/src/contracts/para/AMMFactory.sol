pragma solidity 0.5.15;

import 'ROOT/libraries/CloneFactory2.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/para/AMMExchange.sol';
import 'ROOT/reporting/IMarket.sol';

contract AMMFactory is CloneFactory2 {
    // market -> para -> amm
    AMMExchange internal proxyToClone;
    uint256 public fee; // [0-1000] how many thousandths of swaps should be kept as fees

    constructor(address _proxyToClone, uint256 _fee) public {
        require(_fee <= 1000); // fee must be [0,1000]
        fee = _fee;
        proxyToClone = AMMExchange(_proxyToClone);
    }

    function addAMM(IMarket _market, IParaShareToken _para) external returns (AMMExchange) {
        AMMExchange _amm = AMMExchange(createClone2(address(proxyToClone), salt(_market, _para)));
        _amm.initialize(_market, _para, fee);
        return _amm;
    }

    function getAMM(IMarket _market, IParaShareToken _para) external view returns (AMMExchange) {
        return AMMExchange(clone2Address(address(proxyToClone), salt(_market, _para), address(this)));
    }

    function salt(IMarket _market, IParaShareToken _para) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_market, _para)));
    }
}
