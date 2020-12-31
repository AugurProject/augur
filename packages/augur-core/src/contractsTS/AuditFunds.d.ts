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

interface AuditFundsInterface extends ethers.utils.Interface {
  functions: {
    "addressFrom(address,uint256)": FunctionFragment;
    "disputeCrowdsourcerFactory()": FunctionFragment;
    "getAvailableDisputes(address,uint256,uint256)": FunctionFragment;
    "getAvailableReports(address,uint256,uint256)": FunctionFragment;
    "getAvailableShareData(address,uint256,uint256)": FunctionFragment;
    "getInitialized()": FunctionFragment;
    "initialReporterFactory()": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "marketFactory()": FunctionFragment;
    "shareToken()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addressFrom",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "disputeCrowdsourcerFactory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAvailableDisputes",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAvailableReports",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAvailableShareData",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getInitialized",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialReporterFactory",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(
    functionFragment: "marketFactory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "shareToken",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "addressFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disputeCrowdsourcerFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAvailableDisputes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAvailableReports",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAvailableShareData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInitialized",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initialReporterFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "marketFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "shareToken", data: BytesLike): Result;

  events: {};
}

export class AuditFunds extends Contract {
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

  interface: AuditFundsInterface;

  functions: {
    addressFrom(
      _origin: string,
      _nonce: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "addressFrom(address,uint256)"(
      _origin: string,
      _nonce: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    disputeCrowdsourcerFactory(overrides?: CallOverrides): Promise<[string]>;

    "disputeCrowdsourcerFactory()"(
      overrides?: CallOverrides
    ): Promise<[string]>;

    getAvailableDisputes(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[],
        boolean
      ] & {
        _data: ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[];
        _done: boolean;
      }
    >;

    "getAvailableDisputes(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[],
        boolean
      ] & {
        _data: ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[];
        _done: boolean;
      }
    >;

    getAvailableReports(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[],
        boolean
      ] & {
        _data: ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[];
        _done: boolean;
      }
    >;

    "getAvailableReports(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[],
        boolean
      ] & {
        _data: ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[];
        _done: boolean;
      }
    >;

    getAvailableShareData(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, BigNumber] & { market: string; payout: BigNumber })[],
        boolean
      ] & {
        _data: ([string, BigNumber] & { market: string; payout: BigNumber })[];
        _done: boolean;
      }
    >;

    "getAvailableShareData(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, BigNumber] & { market: string; payout: BigNumber })[],
        boolean
      ] & {
        _data: ([string, BigNumber] & { market: string; payout: BigNumber })[];
        _done: boolean;
      }
    >;

    getInitialized(overrides?: CallOverrides): Promise<[boolean]>;

    "getInitialized()"(overrides?: CallOverrides): Promise<[boolean]>;

    initialReporterFactory(overrides?: CallOverrides): Promise<[string]>;

    "initialReporterFactory()"(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _augur: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "initialize(address)"(
      _augur: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    marketFactory(overrides?: CallOverrides): Promise<[string]>;

    "marketFactory()"(overrides?: CallOverrides): Promise<[string]>;

    shareToken(overrides?: CallOverrides): Promise<[string]>;

    "shareToken()"(overrides?: CallOverrides): Promise<[string]>;
  };

  addressFrom(
    _origin: string,
    _nonce: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  "addressFrom(address,uint256)"(
    _origin: string,
    _nonce: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  disputeCrowdsourcerFactory(overrides?: CallOverrides): Promise<string>;

  "disputeCrowdsourcerFactory()"(overrides?: CallOverrides): Promise<string>;

  getAvailableDisputes(
    _account: string,
    _offset: BigNumberish,
    _num: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      ([string, string, BigNumber] & {
        market: string;
        bond: string;
        amount: BigNumber;
      })[],
      boolean
    ] & {
      _data: ([string, string, BigNumber] & {
        market: string;
        bond: string;
        amount: BigNumber;
      })[];
      _done: boolean;
    }
  >;

  "getAvailableDisputes(address,uint256,uint256)"(
    _account: string,
    _offset: BigNumberish,
    _num: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      ([string, string, BigNumber] & {
        market: string;
        bond: string;
        amount: BigNumber;
      })[],
      boolean
    ] & {
      _data: ([string, string, BigNumber] & {
        market: string;
        bond: string;
        amount: BigNumber;
      })[];
      _done: boolean;
    }
  >;

  getAvailableReports(
    _account: string,
    _offset: BigNumberish,
    _num: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      ([string, string, BigNumber] & {
        market: string;
        bond: string;
        amount: BigNumber;
      })[],
      boolean
    ] & {
      _data: ([string, string, BigNumber] & {
        market: string;
        bond: string;
        amount: BigNumber;
      })[];
      _done: boolean;
    }
  >;

  "getAvailableReports(address,uint256,uint256)"(
    _account: string,
    _offset: BigNumberish,
    _num: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      ([string, string, BigNumber] & {
        market: string;
        bond: string;
        amount: BigNumber;
      })[],
      boolean
    ] & {
      _data: ([string, string, BigNumber] & {
        market: string;
        bond: string;
        amount: BigNumber;
      })[];
      _done: boolean;
    }
  >;

  getAvailableShareData(
    _account: string,
    _offset: BigNumberish,
    _num: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      ([string, BigNumber] & { market: string; payout: BigNumber })[],
      boolean
    ] & {
      _data: ([string, BigNumber] & { market: string; payout: BigNumber })[];
      _done: boolean;
    }
  >;

  "getAvailableShareData(address,uint256,uint256)"(
    _account: string,
    _offset: BigNumberish,
    _num: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      ([string, BigNumber] & { market: string; payout: BigNumber })[],
      boolean
    ] & {
      _data: ([string, BigNumber] & { market: string; payout: BigNumber })[];
      _done: boolean;
    }
  >;

  getInitialized(overrides?: CallOverrides): Promise<boolean>;

  "getInitialized()"(overrides?: CallOverrides): Promise<boolean>;

  initialReporterFactory(overrides?: CallOverrides): Promise<string>;

  "initialReporterFactory()"(overrides?: CallOverrides): Promise<string>;

  initialize(
    _augur: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "initialize(address)"(
    _augur: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  marketFactory(overrides?: CallOverrides): Promise<string>;

  "marketFactory()"(overrides?: CallOverrides): Promise<string>;

  shareToken(overrides?: CallOverrides): Promise<string>;

  "shareToken()"(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    addressFrom(
      _origin: string,
      _nonce: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "addressFrom(address,uint256)"(
      _origin: string,
      _nonce: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    disputeCrowdsourcerFactory(overrides?: CallOverrides): Promise<string>;

    "disputeCrowdsourcerFactory()"(overrides?: CallOverrides): Promise<string>;

    getAvailableDisputes(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[],
        boolean
      ] & {
        _data: ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[];
        _done: boolean;
      }
    >;

    "getAvailableDisputes(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[],
        boolean
      ] & {
        _data: ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[];
        _done: boolean;
      }
    >;

    getAvailableReports(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[],
        boolean
      ] & {
        _data: ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[];
        _done: boolean;
      }
    >;

    "getAvailableReports(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[],
        boolean
      ] & {
        _data: ([string, string, BigNumber] & {
          market: string;
          bond: string;
          amount: BigNumber;
        })[];
        _done: boolean;
      }
    >;

    getAvailableShareData(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, BigNumber] & { market: string; payout: BigNumber })[],
        boolean
      ] & {
        _data: ([string, BigNumber] & { market: string; payout: BigNumber })[];
        _done: boolean;
      }
    >;

    "getAvailableShareData(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        ([string, BigNumber] & { market: string; payout: BigNumber })[],
        boolean
      ] & {
        _data: ([string, BigNumber] & { market: string; payout: BigNumber })[];
        _done: boolean;
      }
    >;

    getInitialized(overrides?: CallOverrides): Promise<boolean>;

    "getInitialized()"(overrides?: CallOverrides): Promise<boolean>;

    initialReporterFactory(overrides?: CallOverrides): Promise<string>;

    "initialReporterFactory()"(overrides?: CallOverrides): Promise<string>;

    initialize(_augur: string, overrides?: CallOverrides): Promise<void>;

    "initialize(address)"(
      _augur: string,
      overrides?: CallOverrides
    ): Promise<void>;

    marketFactory(overrides?: CallOverrides): Promise<string>;

    "marketFactory()"(overrides?: CallOverrides): Promise<string>;

    shareToken(overrides?: CallOverrides): Promise<string>;

    "shareToken()"(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    addressFrom(
      _origin: string,
      _nonce: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "addressFrom(address,uint256)"(
      _origin: string,
      _nonce: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    disputeCrowdsourcerFactory(overrides?: CallOverrides): Promise<BigNumber>;

    "disputeCrowdsourcerFactory()"(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAvailableDisputes(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getAvailableDisputes(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAvailableReports(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getAvailableReports(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAvailableShareData(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getAvailableShareData(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getInitialized(overrides?: CallOverrides): Promise<BigNumber>;

    "getInitialized()"(overrides?: CallOverrides): Promise<BigNumber>;

    initialReporterFactory(overrides?: CallOverrides): Promise<BigNumber>;

    "initialReporterFactory()"(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(_augur: string, overrides?: Overrides): Promise<BigNumber>;

    "initialize(address)"(
      _augur: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    marketFactory(overrides?: CallOverrides): Promise<BigNumber>;

    "marketFactory()"(overrides?: CallOverrides): Promise<BigNumber>;

    shareToken(overrides?: CallOverrides): Promise<BigNumber>;

    "shareToken()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    addressFrom(
      _origin: string,
      _nonce: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "addressFrom(address,uint256)"(
      _origin: string,
      _nonce: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    disputeCrowdsourcerFactory(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "disputeCrowdsourcerFactory()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAvailableDisputes(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getAvailableDisputes(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAvailableReports(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getAvailableReports(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAvailableShareData(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getAvailableShareData(address,uint256,uint256)"(
      _account: string,
      _offset: BigNumberish,
      _num: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getInitialized(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getInitialized()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialReporterFactory(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "initialReporterFactory()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _augur: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "initialize(address)"(
      _augur: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    marketFactory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "marketFactory()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    shareToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "shareToken()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
