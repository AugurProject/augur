pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/trading/IAugurTrading.sol';
import 'ROOT/AugurWallet.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/ContractExists.sol';


/**
 * @title Augur Wallet Factory
 * @notice A Factory contract to create AugurWallet contracts
 */
contract AugurWalletFactory is Initializable {
    using ContractExists for address;

    IAugur public augur;
    IAugurTrading public augurTrading;
    IERC20 public cash;
    address public affiliates;
    address public shareToken;
    address public createOrder;
    address public fillOrder;
    address public zeroXTrade;
    address public augurWalletRegistry;
    address public augurWalletRegistryV2;

    function initialize(IAugur _augur, IAugurTrading _augurTrading) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        cash = IERC20(_augur.lookup("Cash"));
        affiliates = augur.lookup("Affiliates");
        shareToken = augur.lookup("ShareToken");

        augurTrading = _augurTrading;
        createOrder = _augurTrading.lookup("CreateOrder");
        fillOrder = _augurTrading.lookup("FillOrder");
        zeroXTrade = _augurTrading.lookup("ZeroXTrade");
        augurWalletRegistry = _augurTrading.lookup("AugurWalletRegistry");
        augurWalletRegistryV2 = _augurTrading.lookup("AugurWalletRegistryV2");
        return true;
    }

    function createAugurWallet(address _owner, address _referralAddress, bytes32 _fingerprint) public returns (IAugurWallet) {
        // Create2 creation of wallet based on owner
        address _walletAddress = getCreate2WalletAddress(_owner);
        if (_walletAddress.exists()) {
            return IAugurWallet(_walletAddress);
        }
        {
            bytes32 _salt = keccak256(abi.encodePacked(_owner));
            bytes memory _deploymentData = abi.encodePacked(type(AugurWallet).creationCode);
            assembly {
                _walletAddress := create2(0x0, add(0x20, _deploymentData), mload(_deploymentData), _salt)
                if iszero(extcodesize(_walletAddress)) {
                    revert(0, 0)
                }
            }
        }
        IAugurWallet _wallet = IAugurWallet(_walletAddress);
        _wallet.initialize(_owner, _referralAddress, _fingerprint, address(augur), augurWalletRegistry, augurWalletRegistryV2, cash, IAffiliates(affiliates), IERC1155(shareToken), createOrder, fillOrder, zeroXTrade);
        return _wallet;
    }

    function getCreate2WalletAddress(address _owner) public view returns (address) {
        bytes1 _const = 0xff;
        bytes32 _salt = keccak256(abi.encodePacked(_owner));
        return address(uint160(uint256(keccak256(abi.encodePacked(
            _const,
            address(this),
            _salt,
            keccak256(abi.encodePacked(type(AugurWallet).creationCode))
        )))));
    }
}
