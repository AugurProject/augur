import * as _ from "lodash";

export class ConnectOptions {
  public static createFromEnvironment(): ConnectOptions {
    const options = new ConnectOptions();
    options.readFromEnvironment();
    return options;
  }

  public http?: string = "http://localhost:8545";
  public ws?: string = "ws://localhost:8546";
  public ipc?: string;
  public propagationDelayWaitMillis?: number;
// maxRetries is the maximum number of retries for retryable Ethereum
// RPC requests. maxRetries is passed to augur.js's augur.connect() and
// then to ethrpc library.connect(), and is used internally by ethrpc
// for both HTTP and WS transports. When an ethrpc request errors, a
// subset of errors are statically configured as retryable, in which case
// ethrpc will opaquely re-insert the RPC request at its internal queue
// head, such that augur.js (and augur-node) are ignorant of requests
// that eventually succeed after N retries (where N < maxRetries).
  public maxRetries: number = 3;

  public blocksPerChunk?: number;
  private readFromEnvironment() {
    const env = process.env;
    if (_.isFinite(env.MAX_REQUEST_RETRIES)) this.maxRetries = parseInt(env.MAX_REQUEST_RETRIES!, 10);
    if (_.isFinite(env.DELAY_WAIT_MILLIS)) this.propagationDelayWaitMillis = parseInt(env.DELAY_WAIT_MILLIS!, 10);

    if (env.ETHEREUM_HTTP || env.ETHEREUM_WS || env.ETHEREUM_IPC) {
      this.http = env.ETHEREUM_HTTP;
      this.ws = env.ETHEREUM_WS;
      this.ipc = env.ETHEREUM_IPC;
    }
  }
}
