pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import "ROOT/trading/wrappedShareToken/WrappedShareTokenFactory.sol";
import "ROOT/trading/wrappedShareToken/WrappedShareToken.sol";
import 'ROOT/para/interfaces/IParaShareToken.sol';
import "ROOT/libraries/CloneFactory2.sol";


contract WrappedShareTokenFactoryFactory is CloneFactory2 {
    // shareToken => factory
    mapping(address => address) public factories;
    WrappedShareTokenFactory public factoryTemplate;
    WrappedShareToken public tokenTemplate;

    event WrappedShareTokenFactoryCreated(WrappedShareTokenFactory _wrappedShareTokenFactory);

    constructor(WrappedShareTokenFactory _factoryTemplate, WrappedShareToken _tokenTemplate) public {
         factoryTemplate = _factoryTemplate;
         tokenTemplate = _tokenTemplate;
    }

    function createWrappedShareTokenFactory(
        IParaShareToken _shareToken
    ) public returns (WrappedShareTokenFactory) {
        require(factories[address(_shareToken)] == address(0), "WrappedShareTokenFactory already created");

        address _wrappedShareTokenFactoryAddress = createClone2(address(factoryTemplate), salt(_shareToken));
        WrappedShareTokenFactory _wrappedShareTokenFactory = WrappedShareTokenFactory(_wrappedShareTokenFactoryAddress);

        // TODO these do not run the actual code, but neither do they error
        _wrappedShareTokenFactory.initializea(_shareToken, tokenTemplate);
        _wrappedShareTokenFactory.initializea(_shareToken, tokenTemplate);

        factories[address(_shareToken)] = address(_wrappedShareTokenFactory);

        emit WrappedShareTokenFactoryCreated(_wrappedShareTokenFactory);
        return _wrappedShareTokenFactory;
    }

    function getOrCreateWrappedShareTokenFactory(IParaShareToken _shareToken) external returns (WrappedShareTokenFactory){
        if (factories[address(_shareToken)] == address(0)) {
            return createWrappedShareTokenFactory(_shareToken);
        } else {
            return WrappedShareTokenFactory(factories[address(_shareToken)]);
        }
    }

    function calculateFactoryAddress(IParaShareToken _shareToken) public view returns (address) {
        return clone2Address(address(factoryTemplate), salt(_shareToken), address(this));
    }

    function salt(IParaShareToken _shareToken) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_shareToken)));
    }
}
