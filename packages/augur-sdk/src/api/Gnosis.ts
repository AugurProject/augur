import * as _ from "lodash";
import { Augur } from "../Augur";
import { BigNumber } from "bignumber.js";
import * as ethUtil from "ethereumjs-util";

export interface GetGnosisSafeAddressParams {
    owner: string;
    paymentToken: string;
    payment: BigNumber;
    creationNonce: BigNumber;
}

export class Gnosis {
  private readonly augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;
  }
  
  async getGnosisSafeAddress(params: GetGnosisSafeAddressParams): Promise<string> {
    const gnosisSafeData = await GnosisSafe.contract.setup.getData([params.owner], 1, 0, "0x", 0, params.paymentToken, params.payment, 0);

    let proxyCreationCode = await ProxyFactory.proxyCreationCode();
    let constructorData = abi.rawEncode(
        ['address'],
        [GnosisSafe.address]
    ).toString('hex')

    let encodedNonce = abi.rawEncode(['uint256'], [params.creationNonce]).toString('hex')

    return "0x" + ethUtil.generateAddress2(ProxyFactory.address, ethUtil.keccak256("0x" + ethUtil.keccak256(gnosisSafeData).toString("hex") + encodedNonce), proxyCreationCode + constructorData).toString("hex")
  }
}
