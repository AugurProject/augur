pragma solidity 0.5.4;

import 'ROOT/libraries/IERC820Registry.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IAuctionToken.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/libraries/ITyped.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/reporting/IAuction.sol';


contract AuctionToken is ITyped, Initializable, VariableSupplyToken, IAuctionToken {

    string constant public name = "Auction Token";
    string constant public symbol = "AUC";

    IAugur public augur;
    IAuction public auction;
    IUniverse public universe;
    ERC20Token public redemptionToken; // The token being auctioned off and recieved at redemption
    uint256 public auctionIndex;

    function initialize(IAugur _augur, IAuction _auction, ERC20Token _redemptionToken, uint256 _auctionIndex, address _erc820RegistryAddress) public beforeInitialized returns(bool) {
        endInitialization();
        augur = _augur;
        auction = _auction;
        universe = auction.getUniverse();
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
        require(auction.getAuctionIndexForCurrentTime() > auctionIndex || auction.auctionOver(this));
        uint256 _ownerBalance = balances[msg.sender];
        uint256 _tokenBalance = redemptionToken.balanceOf(address(this));
        uint256 _redemptionAmount = _ownerBalance.mul(_tokenBalance).div(totalSupply());
        burn(msg.sender, _ownerBalance);
        redemptionToken.transfer(msg.sender, _redemptionAmount);
        return true;
    }

    function retrieveFunds() public returns (bool) {
        require(msg.sender == address(auction));
        // If no participants have claim to any funds remaining we send them back to the auction
        if (totalSupply() == 0) {
            redemptionToken.transfer(msg.sender, redemptionToken.balanceOf(address(this)));
        }
        return true;
    }

    function getTypeName() public view returns(bytes32) {
        return "AuctionToken";
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal returns (bool) {
        augur.logAuctionTokensTransferred(universe, _from, _to, _value, balances[_from], balances[_to]);
        return true;
    }

    function onMint(address _target, uint256 _amount) internal returns (bool) {
        maxSupply = maxSupply.max(totalSupply());
        augur.logAuctionTokensMinted(universe, _target, _amount, totalSupply(), balances[_target]);
        return true;
    }

    function onBurn(address _target, uint256 _amount) internal returns (bool) {
        augur.logAuctionTokensBurned(universe, _target, _amount, totalSupply(), balances[_target]);
        return true;
    }
}
