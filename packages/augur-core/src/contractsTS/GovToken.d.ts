/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface GovTokenInterface extends ethers.utils.Interface {
  functions: {
    "DELEGATION_TYPEHASH()": FunctionFragment;
    "DOMAIN_TYPEHASH()": FunctionFragment;
    "allowance(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "burn(address,uint256)": FunctionFragment;
    "checkpoints(address,uint32)": FunctionFragment;
    "decimals()": FunctionFragment;
    "delegate(address)": FunctionFragment;
    "delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)": FunctionFragment;
    "delegates(address)": FunctionFragment;
    "getCurrentVotes(address)": FunctionFragment;
    "getOwner()": FunctionFragment;
    "getPriorVotes(address,uint256)": FunctionFragment;
    "mint(address,uint256)": FunctionFragment;
    "mintAlowance(address)": FunctionFragment;
    "name()": FunctionFragment;
    "nonces(address)": FunctionFragment;
    "numCheckpoints(address)": FunctionFragment;
    "setMintAllowance(address,uint256)": FunctionFragment;
    "symbol()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "DELEGATION_TYPEHASH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "DOMAIN_TYPEHASH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "burn",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "checkpoints",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(functionFragment: "delegate", values: [string]): string;
  encodeFunctionData(
    functionFragment: "delegateBySig",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(functionFragment: "delegates", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getCurrentVotes",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getOwner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getPriorVotes",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "mintAlowance",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "nonces", values: [string]): string;
  encodeFunctionData(
    functionFragment: "numCheckpoints",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setMintAllowance",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "DELEGATION_TYPEHASH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "DOMAIN_TYPEHASH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "checkpoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "delegate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "delegateBySig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "delegates", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentVotes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPriorVotes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "mintAlowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "numCheckpoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMintAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "DelegateChanged(address,address,address)": EventFragment;
    "DelegateVotesChanged(address,uint256,uint256)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DelegateChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DelegateVotesChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export class GovToken extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  listeners<T, G>(
    eventFilter?: TypedEventFilter<T, G>
  ): Array<TypedListener<T, G>>;
  off<T, G>(
    eventFilter: TypedEventFilter<T, G>,
    listener: TypedListener<T, G>
  ): this;
  on<T, G>(
    eventFilter: TypedEventFilter<T, G>,
    listener: TypedListener<T, G>
  ): this;
  once<T, G>(
    eventFilter: TypedEventFilter<T, G>,
    listener: TypedListener<T, G>
  ): this;
  removeListener<T, G>(
    eventFilter: TypedEventFilter<T, G>,
    listener: TypedListener<T, G>
  ): this;
  removeAllListeners<T, G>(eventFilter: TypedEventFilter<T, G>): this;

  queryFilter<T, G>(
    event: TypedEventFilter<T, G>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<T & G>>>;

  interface: GovTokenInterface;

  functions: {
    DELEGATION_TYPEHASH(overrides?: CallOverrides): Promise<[string]>;

    "DELEGATION_TYPEHASH()"(overrides?: CallOverrides): Promise<[string]>;

    DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<[string]>;

    "DOMAIN_TYPEHASH()"(overrides?: CallOverrides): Promise<[string]>;

    allowance(
      account: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "allowance(address,address)"(
      account: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    approve(
      spender: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "approve(address,uint256)"(
      spender: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    burn(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "burn(address,uint256)"(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    checkpoints(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number, BigNumber] & { fromBlock: number; votes: BigNumber }>;

    "checkpoints(address,uint32)"(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number, BigNumber] & { fromBlock: number; votes: BigNumber }>;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    "decimals()"(overrides?: CallOverrides): Promise<[number]>;

    delegate(
      delegatee: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "delegate(address)"(
      delegatee: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    delegateBySig(
      delegatee: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)"(
      delegatee: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    delegates(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    "delegates(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getCurrentVotes(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getCurrentVotes(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getOwner(overrides?: CallOverrides): Promise<[string]>;

    "getOwner()"(overrides?: CallOverrides): Promise<[string]>;

    getPriorVotes(
      account: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getPriorVotes(address,uint256)"(
      account: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    mint(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "mint(address,uint256)"(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    mintAlowance(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    "mintAlowance(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    "name()"(overrides?: CallOverrides): Promise<[string]>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    "nonces(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    numCheckpoints(arg0: string, overrides?: CallOverrides): Promise<[number]>;

    "numCheckpoints(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[number]>;

    setMintAllowance(
      _target: string,
      _mintAllowance: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setMintAllowance(address,uint256)"(
      _target: string,
      _mintAllowance: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    "symbol()"(overrides?: CallOverrides): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    "totalSupply()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    transfer(
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "transfer(address,uint256)"(
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    transferFrom(
      src: string,
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "transferFrom(address,address,uint256)"(
      src: string,
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    transferOwnership(
      _newOwner: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "transferOwnership(address)"(
      _newOwner: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  DELEGATION_TYPEHASH(overrides?: CallOverrides): Promise<string>;

  "DELEGATION_TYPEHASH()"(overrides?: CallOverrides): Promise<string>;

  DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<string>;

  "DOMAIN_TYPEHASH()"(overrides?: CallOverrides): Promise<string>;

  allowance(
    account: string,
    spender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "allowance(address,address)"(
    account: string,
    spender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  approve(
    spender: string,
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "approve(address,uint256)"(
    spender: string,
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  "balanceOf(address)"(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  burn(
    _target: string,
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "burn(address,uint256)"(
    _target: string,
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  checkpoints(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[number, BigNumber] & { fromBlock: number; votes: BigNumber }>;

  "checkpoints(address,uint32)"(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[number, BigNumber] & { fromBlock: number; votes: BigNumber }>;

  decimals(overrides?: CallOverrides): Promise<number>;

  "decimals()"(overrides?: CallOverrides): Promise<number>;

  delegate(
    delegatee: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "delegate(address)"(
    delegatee: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  delegateBySig(
    delegatee: string,
    nonce: BigNumberish,
    expiry: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)"(
    delegatee: string,
    nonce: BigNumberish,
    expiry: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  delegates(arg0: string, overrides?: CallOverrides): Promise<string>;

  "delegates(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<string>;

  getCurrentVotes(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getCurrentVotes(address)"(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getOwner(overrides?: CallOverrides): Promise<string>;

  "getOwner()"(overrides?: CallOverrides): Promise<string>;

  getPriorVotes(
    account: string,
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getPriorVotes(address,uint256)"(
    account: string,
    blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  mint(
    _target: string,
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "mint(address,uint256)"(
    _target: string,
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  mintAlowance(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  "mintAlowance(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  name(overrides?: CallOverrides): Promise<string>;

  "name()"(overrides?: CallOverrides): Promise<string>;

  nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  "nonces(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  numCheckpoints(arg0: string, overrides?: CallOverrides): Promise<number>;

  "numCheckpoints(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<number>;

  setMintAllowance(
    _target: string,
    _mintAllowance: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setMintAllowance(address,uint256)"(
    _target: string,
    _mintAllowance: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  symbol(overrides?: CallOverrides): Promise<string>;

  "symbol()"(overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

  transfer(
    dst: string,
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "transfer(address,uint256)"(
    dst: string,
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  transferFrom(
    src: string,
    dst: string,
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "transferFrom(address,address,uint256)"(
    src: string,
    dst: string,
    _amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  transferOwnership(
    _newOwner: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "transferOwnership(address)"(
    _newOwner: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    DELEGATION_TYPEHASH(overrides?: CallOverrides): Promise<string>;

    "DELEGATION_TYPEHASH()"(overrides?: CallOverrides): Promise<string>;

    DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<string>;

    "DOMAIN_TYPEHASH()"(overrides?: CallOverrides): Promise<string>;

    allowance(
      account: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "allowance(address,address)"(
      account: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "approve(address,uint256)"(
      spender: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(
      _target: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "burn(address,uint256)"(
      _target: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    checkpoints(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number, BigNumber] & { fromBlock: number; votes: BigNumber }>;

    "checkpoints(address,uint32)"(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number, BigNumber] & { fromBlock: number; votes: BigNumber }>;

    decimals(overrides?: CallOverrides): Promise<number>;

    "decimals()"(overrides?: CallOverrides): Promise<number>;

    delegate(delegatee: string, overrides?: CallOverrides): Promise<void>;

    "delegate(address)"(
      delegatee: string,
      overrides?: CallOverrides
    ): Promise<void>;

    delegateBySig(
      delegatee: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)"(
      delegatee: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    delegates(arg0: string, overrides?: CallOverrides): Promise<string>;

    "delegates(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getCurrentVotes(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getCurrentVotes(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOwner(overrides?: CallOverrides): Promise<string>;

    "getOwner()"(overrides?: CallOverrides): Promise<string>;

    getPriorVotes(
      account: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getPriorVotes(address,uint256)"(
      account: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    mint(
      _target: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "mint(address,uint256)"(
      _target: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    mintAlowance(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "mintAlowance(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<string>;

    "name()"(overrides?: CallOverrides): Promise<string>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "nonces(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    numCheckpoints(arg0: string, overrides?: CallOverrides): Promise<number>;

    "numCheckpoints(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<number>;

    setMintAllowance(
      _target: string,
      _mintAllowance: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "setMintAllowance(address,uint256)"(
      _target: string,
      _mintAllowance: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<string>;

    "symbol()"(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      dst: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "transfer(address,uint256)"(
      dst: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferFrom(
      src: string,
      dst: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "transferFrom(address,address,uint256)"(
      src: string,
      dst: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferOwnership(
      _newOwner: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "transferOwnership(address)"(
      _newOwner: string,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    Approval(
      owner: string | null,
      spender: string | null,
      amount: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { owner: string; spender: string; amount: BigNumber }
    >;

    DelegateChanged(
      delegator: string | null,
      fromDelegate: string | null,
      toDelegate: string | null
    ): TypedEventFilter<
      [string, string, string],
      { delegator: string; fromDelegate: string; toDelegate: string }
    >;

    DelegateVotesChanged(
      delegate: string | null,
      previousBalance: null,
      newBalance: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { delegate: string; previousBalance: BigNumber; newBalance: BigNumber }
    >;

    Transfer(
      from: string | null,
      to: string | null,
      amount: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; amount: BigNumber }
    >;
  };

  estimateGas: {
    DELEGATION_TYPEHASH(overrides?: CallOverrides): Promise<BigNumber>;

    "DELEGATION_TYPEHASH()"(overrides?: CallOverrides): Promise<BigNumber>;

    DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<BigNumber>;

    "DOMAIN_TYPEHASH()"(overrides?: CallOverrides): Promise<BigNumber>;

    allowance(
      account: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "allowance(address,address)"(
      account: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "approve(address,uint256)"(
      spender: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    burn(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "burn(address,uint256)"(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    checkpoints(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "checkpoints(address,uint32)"(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    "decimals()"(overrides?: CallOverrides): Promise<BigNumber>;

    delegate(delegatee: string, overrides?: Overrides): Promise<BigNumber>;

    "delegate(address)"(
      delegatee: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    delegateBySig(
      delegatee: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)"(
      delegatee: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    delegates(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "delegates(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getCurrentVotes(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getCurrentVotes(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOwner(overrides?: CallOverrides): Promise<BigNumber>;

    "getOwner()"(overrides?: CallOverrides): Promise<BigNumber>;

    getPriorVotes(
      account: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getPriorVotes(address,uint256)"(
      account: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    mint(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "mint(address,uint256)"(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    mintAlowance(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "mintAlowance(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    "name()"(overrides?: CallOverrides): Promise<BigNumber>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "nonces(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    numCheckpoints(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "numCheckpoints(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setMintAllowance(
      _target: string,
      _mintAllowance: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setMintAllowance(address,uint256)"(
      _target: string,
      _mintAllowance: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    "symbol()"(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "transfer(address,uint256)"(
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    transferFrom(
      src: string,
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "transferFrom(address,address,uint256)"(
      src: string,
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    transferOwnership(
      _newOwner: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "transferOwnership(address)"(
      _newOwner: string,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DELEGATION_TYPEHASH(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "DELEGATION_TYPEHASH()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "DOMAIN_TYPEHASH()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    allowance(
      account: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "allowance(address,address)"(
      account: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      spender: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "approve(address,uint256)"(
      spender: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    balanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    burn(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "burn(address,uint256)"(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    checkpoints(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "checkpoints(address,uint32)"(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "decimals()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    delegate(
      delegatee: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "delegate(address)"(
      delegatee: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    delegateBySig(
      delegatee: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)"(
      delegatee: string,
      nonce: BigNumberish,
      expiry: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    delegates(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "delegates(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getCurrentVotes(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getCurrentVotes(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getOwner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPriorVotes(
      account: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getPriorVotes(address,uint256)"(
      account: string,
      blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mint(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "mint(address,uint256)"(
      _target: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    mintAlowance(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "mintAlowance(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "name()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nonces(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "nonces(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    numCheckpoints(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "numCheckpoints(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setMintAllowance(
      _target: string,
      _mintAllowance: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setMintAllowance(address,uint256)"(
      _target: string,
      _mintAllowance: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "symbol()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "totalSupply()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transfer(
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "transfer(address,uint256)"(
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    transferFrom(
      src: string,
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "transferFrom(address,address,uint256)"(
      src: string,
      dst: string,
      _amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      _newOwner: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "transferOwnership(address)"(
      _newOwner: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
