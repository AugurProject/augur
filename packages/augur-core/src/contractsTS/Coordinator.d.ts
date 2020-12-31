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
  PayableOverrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface CoordinatorInterface extends ethers.utils.Interface {
  functions: {
    "EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH()": FunctionFragment;
    "EIP712_COORDINATOR_DOMAIN_HASH()": FunctionFragment;
    "EIP712_COORDINATOR_DOMAIN_NAME()": FunctionFragment;
    "EIP712_COORDINATOR_DOMAIN_VERSION()": FunctionFragment;
    "EIP712_EXCHANGE_DOMAIN_HASH()": FunctionFragment;
    "assertValidCoordinatorApprovals(tuple,address,bytes,bytes[])": FunctionFragment;
    "decodeOrdersFromFillData(bytes)": FunctionFragment;
    "executeTransaction(tuple,address,bytes,bytes[])": FunctionFragment;
    "getCoordinatorApprovalHash(tuple)": FunctionFragment;
    "getSignerAddress(bytes32,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "EIP712_COORDINATOR_DOMAIN_HASH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "EIP712_COORDINATOR_DOMAIN_NAME",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "EIP712_COORDINATOR_DOMAIN_VERSION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "EIP712_EXCHANGE_DOMAIN_HASH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "assertValidCoordinatorApprovals",
    values: [
      {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      string,
      BytesLike,
      BytesLike[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "decodeOrdersFromFillData",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "executeTransaction",
    values: [
      {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      string,
      BytesLike,
      BytesLike[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getCoordinatorApprovalHash",
    values: [
      {
        txOrigin: string;
        transactionHash: BytesLike;
        transactionSignature: BytesLike;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getSignerAddress",
    values: [BytesLike, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "EIP712_COORDINATOR_DOMAIN_HASH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "EIP712_COORDINATOR_DOMAIN_NAME",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "EIP712_COORDINATOR_DOMAIN_VERSION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "EIP712_EXCHANGE_DOMAIN_HASH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "assertValidCoordinatorApprovals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "decodeOrdersFromFillData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executeTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCoordinatorApprovalHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSignerAddress",
    data: BytesLike
  ): Result;

  events: {};
}

export class Coordinator extends Contract {
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

  interface: CoordinatorInterface;

  functions: {
    EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH(
      overrides?: CallOverrides
    ): Promise<[string]>;

    "EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH()"(
      overrides?: CallOverrides
    ): Promise<[string]>;

    EIP712_COORDINATOR_DOMAIN_HASH(
      overrides?: CallOverrides
    ): Promise<[string]>;

    "EIP712_COORDINATOR_DOMAIN_HASH()"(
      overrides?: CallOverrides
    ): Promise<[string]>;

    EIP712_COORDINATOR_DOMAIN_NAME(
      overrides?: CallOverrides
    ): Promise<[string]>;

    "EIP712_COORDINATOR_DOMAIN_NAME()"(
      overrides?: CallOverrides
    ): Promise<[string]>;

    EIP712_COORDINATOR_DOMAIN_VERSION(
      overrides?: CallOverrides
    ): Promise<[string]>;

    "EIP712_COORDINATOR_DOMAIN_VERSION()"(
      overrides?: CallOverrides
    ): Promise<[string]>;

    EIP712_EXCHANGE_DOMAIN_HASH(overrides?: CallOverrides): Promise<[string]>;

    "EIP712_EXCHANGE_DOMAIN_HASH()"(
      overrides?: CallOverrides
    ): Promise<[string]>;

    assertValidCoordinatorApprovals(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: CallOverrides
    ): Promise<[void]>;

    "assertValidCoordinatorApprovals((uint256,uint256,uint256,address,bytes),address,bytes,bytes[])"(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: CallOverrides
    ): Promise<[void]>;

    decodeOrdersFromFillData(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [
        ([
          string,
          string,
          string,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          string,
          string,
          string,
          string
        ] & {
          makerAddress: string;
          takerAddress: string;
          feeRecipientAddress: string;
          senderAddress: string;
          makerAssetAmount: BigNumber;
          takerAssetAmount: BigNumber;
          makerFee: BigNumber;
          takerFee: BigNumber;
          expirationTimeSeconds: BigNumber;
          salt: BigNumber;
          makerAssetData: string;
          takerAssetData: string;
          makerFeeAssetData: string;
          takerFeeAssetData: string;
        })[]
      ] & {
        orders: ([
          string,
          string,
          string,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          string,
          string,
          string,
          string
        ] & {
          makerAddress: string;
          takerAddress: string;
          feeRecipientAddress: string;
          senderAddress: string;
          makerAssetAmount: BigNumber;
          takerAssetAmount: BigNumber;
          makerFee: BigNumber;
          takerFee: BigNumber;
          expirationTimeSeconds: BigNumber;
          salt: BigNumber;
          makerAssetData: string;
          takerAssetData: string;
          makerFeeAssetData: string;
          takerFeeAssetData: string;
        })[];
      }
    >;

    "decodeOrdersFromFillData(bytes)"(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [
        ([
          string,
          string,
          string,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          string,
          string,
          string,
          string
        ] & {
          makerAddress: string;
          takerAddress: string;
          feeRecipientAddress: string;
          senderAddress: string;
          makerAssetAmount: BigNumber;
          takerAssetAmount: BigNumber;
          makerFee: BigNumber;
          takerFee: BigNumber;
          expirationTimeSeconds: BigNumber;
          salt: BigNumber;
          makerAssetData: string;
          takerAssetData: string;
          makerFeeAssetData: string;
          takerFeeAssetData: string;
        })[]
      ] & {
        orders: ([
          string,
          string,
          string,
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          string,
          string,
          string,
          string
        ] & {
          makerAddress: string;
          takerAddress: string;
          feeRecipientAddress: string;
          senderAddress: string;
          makerAssetAmount: BigNumber;
          takerAssetAmount: BigNumber;
          makerFee: BigNumber;
          takerFee: BigNumber;
          expirationTimeSeconds: BigNumber;
          salt: BigNumber;
          makerAssetData: string;
          takerAssetData: string;
          makerFeeAssetData: string;
          takerFeeAssetData: string;
        })[];
      }
    >;

    executeTransaction(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    "executeTransaction((uint256,uint256,uint256,address,bytes),address,bytes,bytes[])"(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    getCoordinatorApprovalHash(
      approval: {
        txOrigin: string;
        transactionHash: BytesLike;
        transactionSignature: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<[string] & { approvalHash: string }>;

    "getCoordinatorApprovalHash((address,bytes32,bytes))"(
      approval: {
        txOrigin: string;
        transactionHash: BytesLike;
        transactionSignature: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<[string] & { approvalHash: string }>;

    getSignerAddress(
      hash: BytesLike,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string] & { signerAddress: string }>;

    "getSignerAddress(bytes32,bytes)"(
      hash: BytesLike,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string] & { signerAddress: string }>;
  };

  EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH(
    overrides?: CallOverrides
  ): Promise<string>;

  "EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH()"(
    overrides?: CallOverrides
  ): Promise<string>;

  EIP712_COORDINATOR_DOMAIN_HASH(overrides?: CallOverrides): Promise<string>;

  "EIP712_COORDINATOR_DOMAIN_HASH()"(
    overrides?: CallOverrides
  ): Promise<string>;

  EIP712_COORDINATOR_DOMAIN_NAME(overrides?: CallOverrides): Promise<string>;

  "EIP712_COORDINATOR_DOMAIN_NAME()"(
    overrides?: CallOverrides
  ): Promise<string>;

  EIP712_COORDINATOR_DOMAIN_VERSION(overrides?: CallOverrides): Promise<string>;

  "EIP712_COORDINATOR_DOMAIN_VERSION()"(
    overrides?: CallOverrides
  ): Promise<string>;

  EIP712_EXCHANGE_DOMAIN_HASH(overrides?: CallOverrides): Promise<string>;

  "EIP712_EXCHANGE_DOMAIN_HASH()"(overrides?: CallOverrides): Promise<string>;

  assertValidCoordinatorApprovals(
    transaction: {
      salt: BigNumberish;
      expirationTimeSeconds: BigNumberish;
      gasPrice: BigNumberish;
      signerAddress: string;
      data: BytesLike;
    },
    txOrigin: string,
    transactionSignature: BytesLike,
    approvalSignatures: BytesLike[],
    overrides?: CallOverrides
  ): Promise<void>;

  "assertValidCoordinatorApprovals((uint256,uint256,uint256,address,bytes),address,bytes,bytes[])"(
    transaction: {
      salt: BigNumberish;
      expirationTimeSeconds: BigNumberish;
      gasPrice: BigNumberish;
      signerAddress: string;
      data: BytesLike;
    },
    txOrigin: string,
    transactionSignature: BytesLike,
    approvalSignatures: BytesLike[],
    overrides?: CallOverrides
  ): Promise<void>;

  decodeOrdersFromFillData(
    data: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    ([
      string,
      string,
      string,
      string,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      string,
      string,
      string,
      string
    ] & {
      makerAddress: string;
      takerAddress: string;
      feeRecipientAddress: string;
      senderAddress: string;
      makerAssetAmount: BigNumber;
      takerAssetAmount: BigNumber;
      makerFee: BigNumber;
      takerFee: BigNumber;
      expirationTimeSeconds: BigNumber;
      salt: BigNumber;
      makerAssetData: string;
      takerAssetData: string;
      makerFeeAssetData: string;
      takerFeeAssetData: string;
    })[]
  >;

  "decodeOrdersFromFillData(bytes)"(
    data: BytesLike,
    overrides?: CallOverrides
  ): Promise<
    ([
      string,
      string,
      string,
      string,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      string,
      string,
      string,
      string
    ] & {
      makerAddress: string;
      takerAddress: string;
      feeRecipientAddress: string;
      senderAddress: string;
      makerAssetAmount: BigNumber;
      takerAssetAmount: BigNumber;
      makerFee: BigNumber;
      takerFee: BigNumber;
      expirationTimeSeconds: BigNumber;
      salt: BigNumber;
      makerAssetData: string;
      takerAssetData: string;
      makerFeeAssetData: string;
      takerFeeAssetData: string;
    })[]
  >;

  executeTransaction(
    transaction: {
      salt: BigNumberish;
      expirationTimeSeconds: BigNumberish;
      gasPrice: BigNumberish;
      signerAddress: string;
      data: BytesLike;
    },
    txOrigin: string,
    transactionSignature: BytesLike,
    approvalSignatures: BytesLike[],
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  "executeTransaction((uint256,uint256,uint256,address,bytes),address,bytes,bytes[])"(
    transaction: {
      salt: BigNumberish;
      expirationTimeSeconds: BigNumberish;
      gasPrice: BigNumberish;
      signerAddress: string;
      data: BytesLike;
    },
    txOrigin: string,
    transactionSignature: BytesLike,
    approvalSignatures: BytesLike[],
    overrides?: PayableOverrides
  ): Promise<ContractTransaction>;

  getCoordinatorApprovalHash(
    approval: {
      txOrigin: string;
      transactionHash: BytesLike;
      transactionSignature: BytesLike;
    },
    overrides?: CallOverrides
  ): Promise<string>;

  "getCoordinatorApprovalHash((address,bytes32,bytes))"(
    approval: {
      txOrigin: string;
      transactionHash: BytesLike;
      transactionSignature: BytesLike;
    },
    overrides?: CallOverrides
  ): Promise<string>;

  getSignerAddress(
    hash: BytesLike,
    signature: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  "getSignerAddress(bytes32,bytes)"(
    hash: BytesLike,
    signature: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH(
      overrides?: CallOverrides
    ): Promise<string>;

    "EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH()"(
      overrides?: CallOverrides
    ): Promise<string>;

    EIP712_COORDINATOR_DOMAIN_HASH(overrides?: CallOverrides): Promise<string>;

    "EIP712_COORDINATOR_DOMAIN_HASH()"(
      overrides?: CallOverrides
    ): Promise<string>;

    EIP712_COORDINATOR_DOMAIN_NAME(overrides?: CallOverrides): Promise<string>;

    "EIP712_COORDINATOR_DOMAIN_NAME()"(
      overrides?: CallOverrides
    ): Promise<string>;

    EIP712_COORDINATOR_DOMAIN_VERSION(
      overrides?: CallOverrides
    ): Promise<string>;

    "EIP712_COORDINATOR_DOMAIN_VERSION()"(
      overrides?: CallOverrides
    ): Promise<string>;

    EIP712_EXCHANGE_DOMAIN_HASH(overrides?: CallOverrides): Promise<string>;

    "EIP712_EXCHANGE_DOMAIN_HASH()"(overrides?: CallOverrides): Promise<string>;

    assertValidCoordinatorApprovals(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    "assertValidCoordinatorApprovals((uint256,uint256,uint256,address,bytes),address,bytes,bytes[])"(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    decodeOrdersFromFillData(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      ([
        string,
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        string,
        string,
        string,
        string
      ] & {
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumber;
        takerAssetAmount: BigNumber;
        makerFee: BigNumber;
        takerFee: BigNumber;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        makerAssetData: string;
        takerAssetData: string;
        makerFeeAssetData: string;
        takerFeeAssetData: string;
      })[]
    >;

    "decodeOrdersFromFillData(bytes)"(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      ([
        string,
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        string,
        string,
        string,
        string
      ] & {
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumber;
        takerAssetAmount: BigNumber;
        makerFee: BigNumber;
        takerFee: BigNumber;
        expirationTimeSeconds: BigNumber;
        salt: BigNumber;
        makerAssetData: string;
        takerAssetData: string;
        makerFeeAssetData: string;
        takerFeeAssetData: string;
      })[]
    >;

    executeTransaction(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    "executeTransaction((uint256,uint256,uint256,address,bytes),address,bytes,bytes[])"(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    getCoordinatorApprovalHash(
      approval: {
        txOrigin: string;
        transactionHash: BytesLike;
        transactionSignature: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<string>;

    "getCoordinatorApprovalHash((address,bytes32,bytes))"(
      approval: {
        txOrigin: string;
        transactionHash: BytesLike;
        transactionSignature: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<string>;

    getSignerAddress(
      hash: BytesLike,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    "getSignerAddress(bytes32,bytes)"(
      hash: BytesLike,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    EIP712_COORDINATOR_DOMAIN_HASH(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "EIP712_COORDINATOR_DOMAIN_HASH()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    EIP712_COORDINATOR_DOMAIN_NAME(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "EIP712_COORDINATOR_DOMAIN_NAME()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    EIP712_COORDINATOR_DOMAIN_VERSION(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "EIP712_COORDINATOR_DOMAIN_VERSION()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    EIP712_EXCHANGE_DOMAIN_HASH(overrides?: CallOverrides): Promise<BigNumber>;

    "EIP712_EXCHANGE_DOMAIN_HASH()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    assertValidCoordinatorApprovals(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "assertValidCoordinatorApprovals((uint256,uint256,uint256,address,bytes),address,bytes,bytes[])"(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    decodeOrdersFromFillData(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "decodeOrdersFromFillData(bytes)"(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    executeTransaction(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    "executeTransaction((uint256,uint256,uint256,address,bytes),address,bytes,bytes[])"(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<BigNumber>;

    getCoordinatorApprovalHash(
      approval: {
        txOrigin: string;
        transactionHash: BytesLike;
        transactionSignature: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getCoordinatorApprovalHash((address,bytes32,bytes))"(
      approval: {
        txOrigin: string;
        transactionHash: BytesLike;
        transactionSignature: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSignerAddress(
      hash: BytesLike,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getSignerAddress(bytes32,bytes)"(
      hash: BytesLike,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "EIP712_COORDINATOR_APPROVAL_SCHEMA_HASH()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    EIP712_COORDINATOR_DOMAIN_HASH(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "EIP712_COORDINATOR_DOMAIN_HASH()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    EIP712_COORDINATOR_DOMAIN_NAME(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "EIP712_COORDINATOR_DOMAIN_NAME()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    EIP712_COORDINATOR_DOMAIN_VERSION(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "EIP712_COORDINATOR_DOMAIN_VERSION()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    EIP712_EXCHANGE_DOMAIN_HASH(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "EIP712_EXCHANGE_DOMAIN_HASH()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    assertValidCoordinatorApprovals(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "assertValidCoordinatorApprovals((uint256,uint256,uint256,address,bytes),address,bytes,bytes[])"(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    decodeOrdersFromFillData(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "decodeOrdersFromFillData(bytes)"(
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    executeTransaction(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    "executeTransaction((uint256,uint256,uint256,address,bytes),address,bytes,bytes[])"(
      transaction: {
        salt: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        gasPrice: BigNumberish;
        signerAddress: string;
        data: BytesLike;
      },
      txOrigin: string,
      transactionSignature: BytesLike,
      approvalSignatures: BytesLike[],
      overrides?: PayableOverrides
    ): Promise<PopulatedTransaction>;

    getCoordinatorApprovalHash(
      approval: {
        txOrigin: string;
        transactionHash: BytesLike;
        transactionSignature: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getCoordinatorApprovalHash((address,bytes32,bytes))"(
      approval: {
        txOrigin: string;
        transactionHash: BytesLike;
        transactionSignature: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSignerAddress(
      hash: BytesLike,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getSignerAddress(bytes32,bytes)"(
      hash: BytesLike,
      signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
