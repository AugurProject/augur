declare module "augur-artifacts" {
    export type NetworkId =
        '1'
        | '3'
        | '4'
        | '19'
        | '42'
        | '101'
        | '102'
        | '103'
        | '104'

    export interface ContractAddresses {
        Universe: string;
        Augur: string;
        LegacyReputationToken: string;
        CancelOrder: string;
        Cash: string;
        ClaimTradingProceeds: string;
        CompleteSets: string;
        CreateOrder: string;
        FillOrder: string;
        Order: string;
        Orders: string;
        ShareToken: string;
        Trade: string;
        Controller?: string;
        OrdersFinder?: string;
        OrdersFetcher?: string;
        TradingEscapeHatch?: string;
    }

    // TS doesn't allow mapping of any type but string or number so we list it out manually
    export interface NetworkContractAddresses {
        1: ContractAddresses;
        3: ContractAddresses;
        4: ContractAddresses;
        19: ContractAddresses;
        42: ContractAddresses;
        101: ContractAddresses;
        102: ContractAddresses;
        103: ContractAddresses;
        104: ContractAddresses;
    }
}
