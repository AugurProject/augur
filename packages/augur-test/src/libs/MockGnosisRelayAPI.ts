import {
    IGnosisRelayAPI,
    CreateSafeData,
    SafeResponse,
    CheckSafeResponse,
    RelayTransaction
} from "@augurproject/gnosis-relay-api";

export class MockGnosisRelayAPI implements IGnosisRelayAPI {
  
    private safeResponse: SafeResponse;
    private checkSafeResponse: CheckSafeResponse;

    constructor() {
        this.safeResponse = {
            safe: null,
            payment: null
        };
        
        this.checkSafeResponse = {
            blockNumber: null,
            txHash: null,
        }
    }

    public setSafeResponse(safeResponse: SafeResponse): void {
        this.safeResponse = safeResponse;
    }

    public setCheckSafeResponse(checkSafeResponse: CheckSafeResponse): void {
        this.checkSafeResponse = checkSafeResponse;
    }
  
    public async createSafe(createSafeTx: CreateSafeData): Promise<SafeResponse> {
      return this.safeResponse;
    }
  
    public async checkSafe(safeAddress: string): Promise<CheckSafeResponse> {
      return this.checkSafeResponse;
    }
  
    public async execTransaction(relayTx: RelayTransaction): Promise<string> {
      throw new Error("Not Implemented");
    }
  }