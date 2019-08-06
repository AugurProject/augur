import * as _ from "lodash";
import { Provider } from "..";
import { Augur } from "../Augur";
import { BigNumber } from "bignumber.js";
import { ethers } from 'ethers'
import { abi } from "@augurproject/artifacts";
import { Abi } from "ethereum";
import * as ethUtil from "ethereumjs-util";
import { NULL_ADDRESS } from "../constants";

const CREATION_GAS_ESTIMATE = new BigNumber(400000);
const CREATION_GAS_PRICE = new BigNumber(10**9);

const AUGUR_GNOSIS_SAFE_NONCE = ethUtil.keccak256("AUGUR_GNOSIS_SAFE_NONCE").readUIntLE(0, 6);

export interface ProxyCreationLog {
  proxy: string;
}

export interface GetGnosisSafeAddressParams {
    owner: string;
    paymentToken: string;
    payment: BigNumber;
}

export class Gnosis {
  private readonly provider: Provider;
  private readonly augur: Augur;

  constructor(provider: Provider, augur: Augur) {
    this.provider = provider;
    this.augur = augur;
    this.provider.storeAbiData(abi.GnosisSafe as Abi, "GnosisSafe");
    this.provider.storeAbiData(abi.ProxyFactory as Abi, "ProxyFactory");
  }
  
  async getGnosisSafeAddress(params: GetGnosisSafeAddressParams): Promise<string> {
    const gnosisSafeData = await this.provider.encodeContractFunction("GnosisSafe", "setup", [[params.owner], 1, NULL_ADDRESS, "0x", params.paymentToken, params.payment, NULL_ADDRESS]);

    // This _could_ be made into a constant if this ends up being a problem in any way
    const proxyCreationCode = await this.augur.contracts.proxyFactory.proxyCreationCode_();
    
    const abiCoder = new ethers.utils.AbiCoder();

    const constructorData = abiCoder.encode(['address'], [this.augur.contracts.gnosisSafe.address]);
    const encodedNonce = abiCoder.encode(['uint256'], [AUGUR_GNOSIS_SAFE_NONCE]);
    const salt = ethUtil.keccak256("0x" + ethUtil.keccak256(gnosisSafeData).toString("hex") + encodedNonce.substr(2));
    const initCode = proxyCreationCode + constructorData.substr(2);

    return "0x" + ethUtil.generateAddress2(this.augur.contracts.proxyFactory.address, salt, initCode).toString("hex");
  }

  async createGnosisSafeDirectlyWithETH(params: GetGnosisSafeAddressParams): Promise<string> {
    const gnosisSafeData = await this.provider.encodeContractFunction("GnosisSafe", "setup", [[params.owner], 1, NULL_ADDRESS, "0x", params.paymentToken, params.payment, NULL_ADDRESS]);
    const gnosisSafeAddress = await this.getGnosisSafeAddress(params);
    const userCosts = CREATION_GAS_ESTIMATE.multipliedBy(CREATION_GAS_PRICE);
    // Send eth to the safe
    await this.augur.sendETH(gnosisSafeAddress, userCosts);
    // Make transaction to proxy factory
    const result = await this.augur.contracts.proxyFactory.createProxyWithNonce(this.augur.contracts.gnosisSafe.address, gnosisSafeData, new BigNumber(AUGUR_GNOSIS_SAFE_NONCE));
    const creationLog = result[0].parameters as ProxyCreationLog;
    return creationLog.proxy;
  }

  // TODO createGnosisSafeWithRelay
}
