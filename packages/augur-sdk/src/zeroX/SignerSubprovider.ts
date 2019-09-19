import { marshaller, Web3Wrapper } from '@0xproject/web3-wrapper';
import { JSONRPCRequestPayload } from 'ethereum-types';
import { Subprovider, Callback, ErrorCallback } from '@0x/subproviders';
import { EthersSigner } from 'contract-dependencies-ethers';

// NOTE: this only support signing messages at the moment. More logic would be required to fulfil the whole range of API possibilities (sending transactions for example)

export class SignerSubprovider extends Subprovider {
    private readonly signer: EthersSigner;
    /**
     * Instantiates a new SignerSubprovider
     * @param signer Ethers Signer that should handle signing messages and returning accounts capable of signing
     */
    constructor(signer: EthersSigner) {
        super();
        this.signer = signer;
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
        switch (payload.method) {
            case 'eth_accounts':
                try {
                    const account = await this.signer.getAddress();
                    end(null, [account.toLowerCase()]);
                } catch (err) {
                    end(err);
                }
                return;
            case 'eth_sign':
                const [address, message] = payload.params;
                try {
                    const signature = await this.signer.signMessage(message);
                    end(null, signature);
                } catch (err) {
                    end(err);
                }
                return;
            default:
                next();
                return;
        }
    }
}