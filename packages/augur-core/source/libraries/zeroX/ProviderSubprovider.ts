import { JSONRPCRequestPayload } from 'ethereum-types';
import { Subprovider, Callback, ErrorCallback } from '@0x/subproviders';
import { Provider } from '../ethereum/Provider';

// NOTE: this only support signing messages at the moment. More logic would be required to fulfil the whole range of API possibilities (sending transactions for example)

export class ProviderSubprovider extends Subprovider {
    // TODO make this generic provider
    private readonly provider: Provider;
    /**
     * Instantiates a new SignerSubprovider
     * @param signer Ethers provider that should handle sending RPC requests
     */
    constructor(provider: Provider) {
        super();
        this.provider = provider;
    }
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    // tslint:disable-next-line:prefer-function-over-method async-suffix
    public async handleRequest(payload: JSONRPCRequestPayload, next: Callback, end: ErrorCallback): Promise<void> {
        try {
            const response = await this.provider.sendAsync(payload);
            end(null, JSON.stringify(response));
        } catch (err) {
            end(err);
        }
        next();
        return;
    }
}
