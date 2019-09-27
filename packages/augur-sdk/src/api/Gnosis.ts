import * as _ from "lodash";
import { Provider } from "..";
import { Augur } from "../Augur";
import { BigNumber } from "bignumber.js";
import { abi } from "@augurproject/artifacts";
import { Abi } from "ethereum";
import { NULL_ADDRESS } from "../constants";
import { IGnosisRelayAPI } from "@augurproject/gnosis-relay-api";

export interface GetGnosisSafeAddressParams {
    owner: string;
    paymentToken: string;
    payment: BigNumber;
}

export class Gnosis {
  private readonly provider: Provider;
  private readonly augur: Augur;
  private readonly gnosisRelay: IGnosisRelayAPI;

  constructor(provider: Provider, gnosisRelay: IGnosisRelayAPI, augur: Augur) {
    this.provider = provider;
    this.augur = augur;
    this.gnosisRelay = gnosisRelay;
    this.provider.storeAbiData(abi.GnosisSafe as Abi, "GnosisSafe");
    this.provider.storeAbiData(abi.ProxyFactory as Abi, "ProxyFactory");
    this.provider.storeAbiData(abi.GnosisSafeRegistry as Abi, "GnosisSafeRegistry");
  }
  
  async getGnosisSafeAddress(account: string): Promise<string> {
    return this.augur.contracts.gnosisSafeRegistry.getSafe_(account);
  }

  async createGnosisSafeDirectlyWithETH(account: string): Promise<string> {
    const gnosisSafeRegistryAddress = this.augur.contracts.gnosisSafeRegistry.address;
    const registrationData = await this.provider.encodeContractFunction("GnosisSafeRegistry", "callRegister", [gnosisSafeRegistryAddress]);
    const gnosisSafeData = await this.provider.encodeContractFunction("GnosisSafe", "setup", [[account], 1, gnosisSafeRegistryAddress, registrationData, NULL_ADDRESS, 0, NULL_ADDRESS]);
    // Make transaction to proxy factory
    const nonce = Date.now();
    const proxy = this.augur.contracts.proxyFactory.createProxyWithNonce_(this.augur.contracts.gnosisSafe.address, gnosisSafeData, new BigNumber(nonce));
    await this.augur.contracts.proxyFactory.createProxyWithNonce(this.augur.contracts.gnosisSafe.address, gnosisSafeData, new BigNumber(nonce));
    return proxy;
  }

  async createGnosisSafeViaRelay(params: GetGnosisSafeAddressParams): Promise<string> {
    const gnosisSafeRegistryAddress = this.augur.contracts.gnosisSafeRegistry.address;
    const registrationData = await this.provider.encodeContractFunction("GnosisSafeRegistry", "callRegister", [gnosisSafeRegistryAddress]);
    if (this.gnosisRelay === undefined) throw new Error("No Gnosis Relay provided to Augur SDK");
    const nonce = Date.now();
    const response = await this.gnosisRelay.createSafe({
      saltNonce: nonce,
      owners: [params.owner],
      threshold: 1,
      to: gnosisSafeRegistryAddress,
      data: registrationData,
      paymentToken: params.paymentToken
    });
    return response.safe;
  }

  async getGnosisSafeDeploymentStatusViaRelay(safeAddress: string): Promise<boolean> {
    if (this.gnosisRelay === undefined) throw new Error("No Gnosis Relay provided to Augur SDK");
    const response = await this.gnosisRelay.checkSafe(safeAddress);
    return response.blockNumber !== null;
  }
}
