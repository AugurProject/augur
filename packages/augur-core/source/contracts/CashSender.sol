pragma solidity 0.5.10;

import 'ROOT/ICash.sol';
import 'ROOT/external/IDaiVat.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';


contract CashSender {
    using SafeMathUint256 for uint256;

    ICash public cash;
    IDaiVat public vat;

    uint constant RAY = 10 ** 27;

    function initializeCashSender(address _vat, address _cash) internal {
        vat = IDaiVat(_vat);
        cash = ICash(_cash);
    }

    function cashTransfer(address _to, uint256 _amount) internal {
        address _from = address(this);
        if (vat.live() == 0) {
            _amount = shutdownTransfer(_from, _to, _amount);
            if (_amount == 0) {
                return;
            }
        }
        require(cash.transfer(_to, _amount));
    }

    function cashTransferFrom(address _from, address _to, uint256 _amount) internal {
        if (vat.live() == 0) {
            _amount = shutdownTransfer(_from, _to, _amount);
            if (_amount == 0) {
                return;
            }
        }
        require(cash.transferFrom(_from, _to, _amount));
    }

    function shutdownTransfer(address _from, address _to, uint256 _amount) internal returns (uint256) {
        if (cash.balanceOf(_from) < _amount) {
            uint256 _vDaiToTransfer = vat.dai(_from).min(daiToVatDai(_amount));
            vat.move(_from, _to, _vDaiToTransfer);
            _amount -= vatDaiToDai(_vDaiToTransfer);
        }
        return _amount;
    }

    function vatDaiToDai(uint256 _vDaiAmount) public pure returns (uint256) {
        return _vDaiAmount.div(RAY);
    }

    function daiToVatDai(uint256 _daiAmount) public pure returns (uint256) {
        return _daiAmount.mul(RAY);
    }
}