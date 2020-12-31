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

interface AffiliatesInterface extends ethers.utils.Interface {
  functions: {
    "affiliateValidators(address)": FunctionFragment;
    "createAffiliateValidator()": FunctionFragment;
    "fingerprints(address)": FunctionFragment;
    "getAccountFingerprint(address)": FunctionFragment;
    "getAndValidateReferrer(address,address)": FunctionFragment;
    "getReferrer(address)": FunctionFragment;
    "referrals(address)": FunctionFragment;
    "setFingerprint(bytes32)": FunctionFragment;
    "setReferrer(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "affiliateValidators",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "createAffiliateValidator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fingerprints",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getAccountFingerprint",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getAndValidateReferrer",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "getReferrer", values: [string]): string;
  encodeFunctionData(functionFragment: "referrals", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setFingerprint",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "setReferrer", values: [string]): string;

  decodeFunctionResult(
    functionFragment: "affiliateValidators",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createAffiliateValidator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fingerprints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAccountFingerprint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAndValidateReferrer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReferrer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "referrals", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setFingerprint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setReferrer",
    data: BytesLike
  ): Result;

  events: {};
}

export class Affiliates extends Contract {
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

  interface: AffiliatesInterface;

  functions: {
    affiliateValidators(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "affiliateValidators(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    createAffiliateValidator(
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "createAffiliateValidator()"(
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    fingerprints(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    "fingerprints(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getAccountFingerprint(
      _account: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "getAccountFingerprint(address)"(
      _account: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getAndValidateReferrer(
      _account: string,
      _affiliateValidator: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "getAndValidateReferrer(address,address)"(
      _account: string,
      _affiliateValidator: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getReferrer(_account: string, overrides?: CallOverrides): Promise<[string]>;

    "getReferrer(address)"(
      _account: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    referrals(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    "referrals(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setFingerprint(
      _fingerprint: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setFingerprint(bytes32)"(
      _fingerprint: BytesLike,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    setReferrer(
      _referrer: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "setReferrer(address)"(
      _referrer: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  affiliateValidators(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "affiliateValidators(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  createAffiliateValidator(overrides?: Overrides): Promise<ContractTransaction>;

  "createAffiliateValidator()"(
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  fingerprints(arg0: string, overrides?: CallOverrides): Promise<string>;

  "fingerprints(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<string>;

  getAccountFingerprint(
    _account: string,
    overrides?: CallOverrides
  ): Promise<string>;

  "getAccountFingerprint(address)"(
    _account: string,
    overrides?: CallOverrides
  ): Promise<string>;

  getAndValidateReferrer(
    _account: string,
    _affiliateValidator: string,
    overrides?: CallOverrides
  ): Promise<string>;

  "getAndValidateReferrer(address,address)"(
    _account: string,
    _affiliateValidator: string,
    overrides?: CallOverrides
  ): Promise<string>;

  getReferrer(_account: string, overrides?: CallOverrides): Promise<string>;

  "getReferrer(address)"(
    _account: string,
    overrides?: CallOverrides
  ): Promise<string>;

  referrals(arg0: string, overrides?: CallOverrides): Promise<string>;

  "referrals(address)"(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<string>;

  setFingerprint(
    _fingerprint: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setFingerprint(bytes32)"(
    _fingerprint: BytesLike,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  setReferrer(
    _referrer: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "setReferrer(address)"(
    _referrer: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    affiliateValidators(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "affiliateValidators(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    createAffiliateValidator(overrides?: CallOverrides): Promise<string>;

    "createAffiliateValidator()"(overrides?: CallOverrides): Promise<string>;

    fingerprints(arg0: string, overrides?: CallOverrides): Promise<string>;

    "fingerprints(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getAccountFingerprint(
      _account: string,
      overrides?: CallOverrides
    ): Promise<string>;

    "getAccountFingerprint(address)"(
      _account: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getAndValidateReferrer(
      _account: string,
      _affiliateValidator: string,
      overrides?: CallOverrides
    ): Promise<string>;

    "getAndValidateReferrer(address,address)"(
      _account: string,
      _affiliateValidator: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getReferrer(_account: string, overrides?: CallOverrides): Promise<string>;

    "getReferrer(address)"(
      _account: string,
      overrides?: CallOverrides
    ): Promise<string>;

    referrals(arg0: string, overrides?: CallOverrides): Promise<string>;

    "referrals(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<string>;

    setFingerprint(
      _fingerprint: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    "setFingerprint(bytes32)"(
      _fingerprint: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setReferrer(_referrer: string, overrides?: CallOverrides): Promise<void>;

    "setReferrer(address)"(
      _referrer: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    affiliateValidators(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "affiliateValidators(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createAffiliateValidator(overrides?: Overrides): Promise<BigNumber>;

    "createAffiliateValidator()"(overrides?: Overrides): Promise<BigNumber>;

    fingerprints(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "fingerprints(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAccountFingerprint(
      _account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getAccountFingerprint(address)"(
      _account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAndValidateReferrer(
      _account: string,
      _affiliateValidator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getAndValidateReferrer(address,address)"(
      _account: string,
      _affiliateValidator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReferrer(
      _account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getReferrer(address)"(
      _account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    referrals(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "referrals(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setFingerprint(
      _fingerprint: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "setFingerprint(bytes32)"(
      _fingerprint: BytesLike,
      overrides?: Overrides
    ): Promise<BigNumber>;

    setReferrer(_referrer: string, overrides?: Overrides): Promise<BigNumber>;

    "setReferrer(address)"(
      _referrer: string,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    affiliateValidators(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "affiliateValidators(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createAffiliateValidator(
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "createAffiliateValidator()"(
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    fingerprints(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "fingerprints(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAccountFingerprint(
      _account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getAccountFingerprint(address)"(
      _account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAndValidateReferrer(
      _account: string,
      _affiliateValidator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getAndValidateReferrer(address,address)"(
      _account: string,
      _affiliateValidator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getReferrer(
      _account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getReferrer(address)"(
      _account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    referrals(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "referrals(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setFingerprint(
      _fingerprint: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setFingerprint(bytes32)"(
      _fingerprint: BytesLike,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    setReferrer(
      _referrer: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "setReferrer(address)"(
      _referrer: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
