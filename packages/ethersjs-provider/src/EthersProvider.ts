import { NetworkId } from "augur-artifacts";
import { Filter, Log, LogValues, Provider } from "augur-api";
import { ethers } from "ethers";
import { Abi } from "ethereum";
import * as _ from "lodash";
import { TransactionRequest } from "ethers/providers";

interface ContractMapping {
    [contractName: string]: ethers.utils.Interface;
}

export class EthersProvider extends ethers.providers.JsonRpcProvider implements Provider {
    private contractMapping: ContractMapping = {};

    public async call(transaction: TransactionRequest): Promise<string> {
        return await super.call(transaction);
    }

    public async getNetworkId(): Promise<NetworkId> {
        return <NetworkId>(await this.getNetwork()).chainId.toString();
    }

    public async getBlockNumber(): Promise<number> {
        return await super.getBlockNumber();
    }

    public storeAbiData(abi: Abi, contractName: string): void {
        this.contractMapping[contractName] = new ethers.utils.Interface(abi);
    }

    public getEventTopic(contractName: string, eventName: string): string {
        const contractInterface = this.contractMapping[contractName];
        if (!contractInterface) {
            throw new Error(`Contract name ${contractName} not found in EthersJSProvider. Call 'storeAbiData' first with this name and the contract abi`);
        }
        return contractInterface.events[eventName].topic;
    }

    public parseLogValues(contractName: string, log: Log): LogValues {
        const contractInterface = this.contractMapping[contractName];
        if (!contractInterface) {
            throw new Error(`Contract name ${contractName} not found in EthersJSProvider. Call 'storeAbiData' first with this name and the contract abi`);
        }
        const parsedLog = contractInterface.parseLog(log);
        let omittedValues = _.map(_.range(parsedLog.values.length), (n) => n.toString());
        omittedValues.push('length');
        let logValues = _.omit(parsedLog.values, omittedValues);
        logValues = _.mapValues(logValues, (val) => {
            if (val._hex) {
            return val._hex;
            }
            return val;
        });
        return logValues;
    }

    public async getLogs(filter: Filter): Promise<Array<Log>> {
        return super.getLogs(filter);
    }
}
