pragma solidity 0.5.4;

import 'ROOT/IAugur.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/external/IDaiVat.sol';
import 'ROOT/external/IDaiJoin.sol';


/**
 * @title Cash
 * @dev Test contract for CASH
 */
contract Cash is ITyped, VariableSupplyToken, ICash {

    mapping (address => uint) public wards;
    modifier auth {
        require(wards[msg.sender] == 1);
        _;
    }

    string constant public name = "Cash";
    string constant public symbol = "CASH";

    uint256 constant public DAI_ONE = 10 ** 27;

    IDaiVat public daiVat;
    IDaiJoin public daiJoin;

    function initialize(IAugur _augur) public returns (bool) {
        erc820Registry = IERC820Registry(_augur.lookup("ERC820Registry"));
        initialize820InterfaceImplementations();
        daiJoin = IDaiJoin(_augur.lookup("DaiJoin"));
        daiVat = IDaiVat(_augur.lookup("DaiVat"));
        wards[address(this)] = 1;
        wards[address(daiJoin)] = 1;
        return true;
    }

    function faucet(uint256 _amount) public returns (bool) {
        daiVat.faucet(address(daiJoin), _amount * DAI_ONE);
        mint(msg.sender, _amount);
        return true;
    }

    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x, "math-sub-underflow");
    }

    function joinMint(address usr, uint wad) public auth returns (bool) {
        return mint(usr, wad);
    }

    function joinBurn(address usr, uint wad) public returns (bool) {
        if (usr != msg.sender && allowed[usr][msg.sender] != uint(-1)) {
            allowed[usr][msg.sender] = sub(allowed[usr][msg.sender], wad);
        }
        return burn(usr, wad);
    }

    function getTypeName() public view returns (bytes32) {
        return "Cash";
    }

    function onMint(address, uint256) internal returns (bool) {
        return true;
    }

    function onBurn(address, uint256) internal returns (bool) {
        return true;
    }

    function onTokenTransfer(address, address, uint256) internal returns (bool) {
        return true;
    }
}
