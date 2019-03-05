declare module "ganache-core" {
    // Mostly ripped from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/ganache-core/index.d.ts
    // Project: https://github.com/trufflesuite/ganache-core#readme
    // Definitions by: Leonid Logvinov <https://github.com/LogvinovLeon>
    // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
    // TypeScript Version: 2.4

    import { Provider } from "ethereum-protocol";
    export type Account = {
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
        vmErrorsOnRPCResponse?: boolean;
        db_path?: string;
        accounts?: Account[];
        allowUnlimitedContractSize?: boolean;
    }
    export function provider(opts?: GanacheOpts): Provider;

    import * as http from "http";
    import * as https from "https";

    export function server(opts?: GanacheOpts): http.Server | https.Server;
}
