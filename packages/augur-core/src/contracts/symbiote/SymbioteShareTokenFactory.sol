pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/symbiote/SymbioteShareToken.sol';
import 'ROOT/libraries/Initializable.sol';


contract SymbioteShareTokenFactory is Initializable {

    string constant public INVALID_SYMBOL = "INVALID";
    string constant public INVALID_NAME = "INVALID SHARE";
    
    address public hatchery;

    function initialize(address _hatchery) public returns (bool) {
        endInitialization();
        hatchery = _hatchery;
        return true;
    }

    function createShareTokens(bytes32[] calldata _names, string[] calldata _symbols) external returns (ISymbioteShareToken[] memory) {
        require(msg.sender == hatchery, "Only hatchery may create new share tokens");
        uint256 _numOutcomes = _names.length + 1;
        ISymbioteShareToken[] memory _tokens = new ISymbioteShareToken[](_numOutcomes);
        _tokens[0] = new SymbioteShareToken(INVALID_SYMBOL, INVALID_NAME, hatchery);
        for (uint256 _i = 1; _i < _numOutcomes; _i++) {
            _tokens[_i] = new SymbioteShareToken(_symbols[_i-1], string(abi.encodePacked(_names[_i-1])), hatchery);
        }
        return _tokens;
    }
}