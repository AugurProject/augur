import { Web3Provider } from 'ethers/providers';

let _nextId = 42;

export class PersonalSigningWeb3Provider extends Web3Provider {
  send(method: string, params: any): Promise<any> {
    if (method === 'eth_sign') {
      method = 'personal_sign';
      params = [params[1], params[0]];
    }
    return new Promise((resolve, reject) => {
      let request = {
        method: method,
        params: params,
        id: _nextId++,
        jsonrpc: '2.0',
      };

      this._sendAsync(request, function(error, result) {
        if (error) {
          reject(error);
          return;
        }

        if (result.error) {
          // @TODO: not any
          let error: any = new Error(result.error.message);
          error.code = result.error.code;
          error.data = result.error.data;
          reject(error);
          return;
        }

        resolve(result.result);
      });
    });
  }
}
