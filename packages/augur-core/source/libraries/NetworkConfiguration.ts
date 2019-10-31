import { ethers } from 'ethers';
import { NetworkId } from '@augurproject/artifacts';

type NetworkOptions = {
    isProduction: boolean;
    http: string;
    ws?: string;
    ipc?: string;
    privateKey?: string;
    gasPrice: ethers.utils.BigNumber;
    gasLimit: ethers.utils.BigNumber;
}

export const NETWORKS = [
  'aura',
  'clique',
  'environment',
  'rinkeby',
  'ropsten',
  'kovan',
  'thunder',
  'testrpc',
  "mainnet",
] as const;

export type NETWORKS = typeof NETWORKS[number];

export function isNetwork(x: any): x is NETWORKS {
  return NETWORKS.includes(x);
}

export type NetworkIdToNetwork = {
    [P in NetworkId]?: NETWORKS;
}

export const NETID_TO_NETWORK: NetworkIdToNetwork = {
    1: "mainnet",
    3: "ropsten",
    4: "rinkeby",
    42: "kovan",
}

type NetworksToOptions = {
    [P in NETWORKS]?: NetworkOptions;
}

const networks: NetworksToOptions = {
    ropsten: {
        isProduction: false,
        http: "https://eth-ropsten.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM",
        privateKey: process.env.ROPSTEN_PRIVATE_KEY,
        gasPrice: new ethers.utils.BigNumber(20*1000000000),
        gasLimit:
          (typeof process.env.ETHEREUM_GAS_LIMIT === "undefined")
            ? new ethers.utils.BigNumber(7500000)
            : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT)
    },
    kovan: {
        isProduction: false,
        http: "https://eth-kovan.alchemyapi.io/jsonrpc/1FomA6seLdWDvpIRvL9J5NhwPHLIGbWA",
        privateKey: process.env.KOVAN_PRIVATE_KEY,
        gasPrice: new ethers.utils.BigNumber(1),
        gasLimit:
          (typeof process.env.ETHEREUM_GAS_LIMIT === "undefined")
            ? new ethers.utils.BigNumber(7500000)
            : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT)
    },
    rinkeby: {
        isProduction: false,
        http: "https://eth-rinkeby.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM",
        ws: "wss://rinkeby.augur.net/ethereum-ws",
        privateKey: process.env.RINKEBY_PRIVATE_KEY,
        gasPrice: new ethers.utils.BigNumber(31*1000000000),
        gasLimit:
          (typeof process.env.ETHEREUM_GAS_LIMIT === "undefined")
            ? new ethers.utils.BigNumber(6900000)
            : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT)
    },
    clique: {
        isProduction: false,
        http: "http://clique.ethereum.nodes.augur.net",
        privateKey: process.env.CLIQUE_PRIVATE_KEY || "fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a",
        gasPrice: new ethers.utils.BigNumber(1),
        gasLimit:
          (typeof process.env.ETHEREUM_GAS_LIMIT === "undefined")
            ? new ethers.utils.BigNumber(7500000)
            : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT)
    },
    environment: {
        isProduction: process.env.PRODUCTION === "true" || false,
        http: "http://localhost:8545",
        ws: "ws://localhost:8546",
        privateKey: process.env.ETHEREUM_PRIVATE_KEY || "fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a",
        gasPrice: ((typeof process.env.ETHEREUM_GAS_PRICE_IN_NANOETH === "undefined") ? new ethers.utils.BigNumber(20) : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_PRICE_IN_NANOETH!)).mul(new ethers.utils.BigNumber(1000000000)),
        gasLimit:
          (typeof process.env.ETHEREUM_GAS_LIMIT === "undefined")
            ? new ethers.utils.BigNumber(7500000)
            : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT)
    },
    mainnet: {
        isProduction: true,
        http: "https://eth-mainnet.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM",
        privateKey: process.env.ETHEREUM_PRIVATE_KEY || "fae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a",
        gasPrice: (
          (typeof process.env.ETHEREUM_GAS_PRICE_IN_NANOETH === "undefined")
            ? new ethers.utils.BigNumber(20)
            : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_PRICE_IN_NANOETH!)).mul(new ethers.utils.BigNumber(1e9)),
        gasLimit:
          (typeof process.env.ETHEREUM_GAS_LIMIT === "undefined")
            ? new ethers.utils.BigNumber(7500000)
            : new ethers.utils.BigNumber(process.env.ETHEREUM_GAS_LIMIT)
    },
};

export class NetworkConfiguration {

    public constructor(public readonly networkName: NETWORKS, public readonly isProduction: boolean, public readonly gasPrice: ethers.utils.BigNumber, public readonly gasLimit: ethers.utils.BigNumber, public readonly http: string, public readonly ws?: string, public readonly ipc?: string, public readonly privateKey?: string) {
    }

    public static create(networkName:NETWORKS=(typeof process.env.TESTRPC === 'undefined') ? "environment" : 'testrpc', validatePrivateKey: boolean=true): NetworkConfiguration {
        const network = networks[networkName];
        if (networkName === "environment" &&
            (process.env.ETHEREUM_HTTP || process.env.ETHEREUM_WS || process.env.ETHEREUM_IPC)) {
            Object.assign(network, {
                http: process.env.ETHEREUM_HTTP,
                ws: process.env.ETHEREUM_WS,
                ipc: process.env.ETHEREUM_IPC,
            });
        }
        if (network === undefined || network === null) throw new Error(`Network configuration ${networkName} not found`);
        if (validatePrivateKey && (network.privateKey === undefined || network.privateKey === null)) throw new Error(`Network configuration for ${networkName} has no private key available. Check that this key is in the environment ${networkName == "environment" ? "ETHEREUM" : networkName.toUpperCase()}_PRIVATE_KEY`);

        return new NetworkConfiguration(networkName, network.isProduction, network.gasPrice, network.gasLimit, network.http, network.ws, network.ipc, network.privateKey);
    }
}
