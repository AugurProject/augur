pragma solidity 0.5.15;

interface ITokenFactory {
  function deploy() external returns(address);
}
