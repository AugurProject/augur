pragma solidity 0.5.15;


import 'ROOT/libraries/CloneFactory.sol';
import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/para/interfaces/IParaOICash.sol';
import 'ROOT/para/interfaces/IParaAugur.sol';


/**
 * @title OI Cash Factory (ETH variant)
 * @notice A Factory contract to create OI Cash Token contracts
 * @dev Should not be used directly. Only intended to be used by Universe contracts
 */
contract ParaOICashFactory is CloneFactory {
    function createParaOICash(IParaAugur _augur) external returns (IParaOICash) {
        IParaUniverse _universe = IParaUniverse(msg.sender);
        address _paraOICashReference = _augur.lookup("ParaOICash");
        require(_paraOICashReference != address(0));
        IParaOICash _openInterestCash = IParaOICash(createClone(_paraOICashReference));
        _openInterestCash.initialize(_augur, _universe);
        return _openInterestCash;
    }
}