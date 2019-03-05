import { queue, retryable } from "async";
import { AsyncSendable } from "ethers/providers/web3-provider";
import { HttpProvider } from "web3/providers";

export class Web3AsyncSendable implements AsyncSendable {
    private asyncQueue: any;

    constructor(
        httpProvider: HttpProvider,
        times: number, 
        interval: number, 
        concurrency: number
    ) 
    {
        const send: any = async function(task: any, callback: any) {
            try {
                const response = await httpProvider.send(task.request, task.callback);
                callback(null, response);
            } catch (err) {
                callback(err);
            }
        }
        this.asyncQueue = queue(retryable({ times, interval }, send), concurrency);
    }

    public async send(request: any, callback: (error: any, response: any) => void): Promise<void> {
        await this.asyncQueue.push(
            { request, callback },
            function(err: Error, response: any) {
                if (err) {
                    Promise.reject("Send failed: " + err);
                } else {
                    Promise.resolve(response);
                }
            }
        );
    }
}