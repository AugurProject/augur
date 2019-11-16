import { Web3Provider } from 'ethers/providers';

export class PersonalSigningWeb3Provider extends Web3Provider {
  send(method: string, params: any): Promise<any> {
    if (method === 'eth_sign') {
      method = 'personal_sign';
      params = [params[1], params[0]];
    }

    return super.send(method, params);
  }
}
