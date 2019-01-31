pragma solidity 0.4.24;

import 'libraries/IERC820Registry.sol';
import 'reporting/IUniverse.sol';
import 'reporting/IAuctionToken.sol';
import 'libraries/token/VariableSupplyToken.sol';
import 'libraries/ITyped.sol';
import 'trading/ICash.sol';
import 'libraries/Initializable.sol';
import 'reporting/IAuction.sol';


contract AuctionToken is ITyped, Initializable, VariableSupplyToken, IAuctionToken {

    string constant public name = "Auction Token";
    string constant public symbol = "AUC";

    IAugur public augur;
    IAuction public auction;
    IUniverse public universe;
    ICash public cash;
    ERC20Token public redemptionToken; // The token being auctioned off and recieved at redemption
    uint256 public auctionIndex;

    function initialize(IAugur _augur, IAuction _auction, ERC20Token _redemptionToken, uint256 _auctionIndex, address _erc820RegistryAddress) public beforeInitialized returns(bool) {
        endInitialization();
        augur = _augur;
        auction = _auction;
        universe = auction.getUniverse();
        cash = ICash(augur.lookup("Cash"));
        redemptionToken = _redemptionToken;
        auctionIndex = _auctionIndex;
        erc820Registry = IERC820Registry(_erc820RegistryAddress);
        initialize820InterfaceImplementations();
        return true;
    }

    function mintForPurchaser(address _purchaser, uint256 _amount) public returns (bool) {
        require(msg.sender == address(auction));
        mint(_purchaser, _amount);
        return true;
    }

    function redeem() public returns (bool) {
        require(auction.getAuctionIndexForCurrentTime() > auctionIndex);
        uint256 _ownerBalance = balances[msg.sender];
        uint256 _tokenBalance = redemptionToken.balanceOf(this);
        uint256 _redemptionAmount = _ownerBalance.mul(_tokenBalance).div(totalSupply());
        burn(msg.sender, _ownerBalance);
        redemptionToken.transfer(msg.sender, _redemptionAmount);
        return true;
    }

    function retrieveFunds() public returns (bool) {
        require(msg.sender == address(auction));
        // If no participants have claim to any funds remaining we send them back to the auction
        if (totalSupply() == 0) {
            redemptionToken.transfer(msg.sender, redemptionToken.balanceOf(this));
        }
        return true;
    }

    function getTypeName() public view returns(bytes32) {
        return "AuctionToken";
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal returns (bool) {
        augur.logAuctionTokensTransferred(universe, _from, _to, _value);
        return true;
    }

    function onMint(address _target, uint256 _amount) internal returns (bool) {
        maxSupply = maxSupply.max(totalSupply());
        augur.logAuctionTokenMinted(universe, _target, _amount);
        return true;
    }

    function onBurn(address _target, uint256 _amount) internal returns (bool) {
        augur.logAuctionTokenBurned(universe, _target, _amount);
        return true;
    }
}
