pragma solidity 0.5.15;

import "ROOT/trading/wrappedShareToken/WrappedShareTokenFactory.sol";
import 'ROOT/para/interfaces/IParaShareToken.sol';

contract WrappedShareTokenFactoryFactory {
    IParaShareToken public shareToken;
    IERC20 public cash;

    mapping(address => address) public factories;

    event WrappedShareTokenFactoryCreated(WrappedShareTokenFactory _wrappedShareTokenFactory);

    function newWrappedShareTokenFactory(
        IParaShareToken _shareToken
    ) public returns (WrappedShareTokenFactory) {
        require(factories[address(_shareToken)] == address(0), "WrappedShareTokenFactory Salready created");
        // @todo: Use create2 here.
        WrappedShareTokenFactory wrappedShareTokenFactory = new WrappedShareTokenFactory(
            _shareToken
        );
        factories[address(_shareToken)] = address(wrappedShareTokenFactory);
        emit WrappedShareTokenFactoryCreated(wrappedShareTokenFactory);

        return wrappedShareTokenFactory;
    }

    function getOrCreateWrappedShareTokenFactory(IParaShareToken _shareToken) external returns (WrappedShareTokenFactory){
        if(factories[address(_shareToken)] == address(0)) {
            return newWrappedShareTokenFactory(_shareToken);
        } else {
            return WrappedShareTokenFactory(factories[address(_shareToken)]);
        }
    }
}
