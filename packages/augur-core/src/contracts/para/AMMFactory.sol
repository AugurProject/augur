pragma solidity 0.5.15;

import 'ROOT/reporting/IMarket.sol';
import 'ROOT/libraries/CloneFactory2.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/para/interfaces/IAMMFactory.sol';
import 'ROOT/para/interfaces/IAMMExchange.sol';


contract AMMFactory is IAMMFactory, CloneFactory2 {
    IAMMExchange internal proxyToClone;

    constructor(address _proxyToClone, uint256 _fee) public {
        require(_fee <= 1000); // fee must be [0,1000]
        fee = _fee;
        proxyToClone = IAMMExchange(_proxyToClone);
    }

    function addAMM(IMarket _market, IParaShareToken _para) external returns (address) {
        IAMMExchange _amm = IAMMExchange(createClone2(address(proxyToClone), salt(_market, _para)));
        _amm.initialize(_market, _para, fee);
        exchanges[address(_market)][address(_para)] = address(_amm);
        return address(_amm);
    }

    function salt(IMarket _market, IParaShareToken _para) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_market, _para)));
    }

    function transferCash(IMarket _market, IParaShareToken _para, address sender, address recipient, uint256 quantity) public {
        IAMMExchange amm = IAMMExchange(exchanges[address(_market)][address(_para)]);
        require(msg.sender == address(amm), "AugurCP: non-exchange tried to send cash");
        amm.cash().transferFrom(sender, recipient, quantity);
    }
}
