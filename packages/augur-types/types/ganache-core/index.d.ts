declare module "ganache-core" {
    // Mostly ripped from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/ganache-core/index.d.ts
    // Project: https://github.com/trufflesuite/ganache-core#readme
    // Definitions by: Leonid Logvinov <https://github.com/LogvinovLeon>
    // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
    // TypeScript Version: 2.4

  import { AsyncSendable } from "ethers.providers.Web3Provider";
  import * as http from "http";

  export interface GanacheServer extends http.Server {
    ganacheProvider: AsyncSendable;
  }

  export interface Account {
        balance: number;
        secretKey?: string;
        publicKey?: string;
    }
    export interface GanacheOpts {
        verbose?: boolean;
        logger?: {
            log(msg: string): void;
        };
        port?: number;
        network_id?: number;
        networkId?: number;
        mnemonic?: string;
        gasLimit?: number;
        db_path?: string;
        db?: {};

        fork?: boolean;
        blockTime?: number;

        total_accounts?: number;
        accounts?: Account[];

        vmErrorsOnRPCResponse?: boolean;
        allowUnlimitedContractSize?: boolean;
        defaultTransactionGasLimit?: string;
        debug?: boolean;
    }

    export function provider(opts?: GanacheOpts): AsyncSendable;
    export function server(opts?: GanacheOpts): GanacheServer;
}
