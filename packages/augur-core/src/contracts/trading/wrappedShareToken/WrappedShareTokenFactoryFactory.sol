pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import "ROOT/trading/wrappedShareToken/WrappedShareTokenFactory.sol";
import 'ROOT/para/interfaces/IParaShareToken.sol';

contract WrappedShareTokenFactoryFactory {
    // shareToken => factory
    mapping(address => address) public factories;

    event WrappedShareTokenFactoryCreated(WrappedShareTokenFactory _wrappedShareTokenFactory);

    function createWrappedShareTokenFactory(
        IParaShareToken _shareToken
    ) public returns (WrappedShareTokenFactory) {
        require(factories[address(_shareToken)] == address(0), "WrappedShareTokenFactory already created");
        // @todo: Use create2 here.
        WrappedShareTokenFactory _wrappedShareTokenFactory = new WrappedShareTokenFactory(
            _shareToken
        );
        factories[address(_shareToken)] = address(_wrappedShareTokenFactory);
        emit WrappedShareTokenFactoryCreated(_wrappedShareTokenFactory);

        return _wrappedShareTokenFactory;
    }

    function getOrCreateWrappedShareTokenFactory(IParaShareToken _shareToken) external returns (WrappedShareTokenFactory){
        if(factories[address(_shareToken)] == address(0)) {
            return createWrappedShareTokenFactory(_shareToken);
        } else {
            return WrappedShareTokenFactory(factories[address(_shareToken)]);
        }
    }
}
