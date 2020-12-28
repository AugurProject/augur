[![npm version](https://badge.fury.io/js/ethereum-multicall.svg)](https://badge.fury.io/js/ethereum-multicall)
![downloads](https://img.shields.io/npm/dw/ethereum-multicall)

# ethereum-multicall

ethereum-multicall is a lightweight library for interacting with the [multicall](https://github.com/makerdao/multicall/blob/master/src/Multicall.sol) smart contract.

Multicall allows multiple smart contract constant function calls to be grouped into a single call and the results aggregated into a single result. This reduces the number of separate JSON RPC requests that need to be sent over the network if using a remote node like Infura, and provides the guarantee that all values returned are from the same block. The latest block number is also returned along with the aggregated results.

ethereum-multicall is fully written in typescript so has full compile time support. The motivation of this package was to expose a super simple and easy to understand interface for you to take the full benefits of the multicalls. Also to not being opinionated on how you use it, you can use it with web3, ethers or even pass in a custom nodeUrl and we do it for you. This package takes care of the decoding for you but at the same time if you dont want it to you can turn that part off.

## Installation

### npm:

```js
$ npm install ethereum-multicall
```

### yarn:

```js
$ yarn add ethereum-multicall
```

## Usage

### Import examples:

### JavaScript (ES3)

```js
var ethereumMulticall = require('ethereum-multicall');
```

### JavaScript (ES5 or ES6)

```js
const ethereumMulticall = require('ethereum-multicall');
```

### JavaScript (ES6) / TypeScript

```js
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';
```

### ethers usage example

```ts
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';
import { ethers } from 'ethers';

let provider = ethers.getDefaultProvider();

// you can use any ethers provider context here this example is
// just shows passing in a default provider, ethers hold providers in
// other context like wallet, signer etc all can be passed in as well.
const multicall = new Multicall({ ethersProvider: wallet.provider });

const contractCallContext: ContractCallContext[] = [
    {
        reference: 'testContract',
        contractAddress: '0x6795b15f3b16Cf8fB3E56499bbC07F6261e9b0C3',
        abi: [ { name: 'foo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256' }] } ],
        calls: [{ reference: 'fooCall', methodName: 'foo', methodParameters: [42] }]
    },
    {
        reference: 'testContract2',
        contractAddress: '0x66BF8e2E890eA0392e158e77C6381b34E0771318',
        abi: [ { name: 'fooTwo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256', name: "path", "type": "address[]" }] } ],
        calls: [{ reference: 'fooTwoCall', methodName: 'fooTwo', methodParameters: [42] }]
    }
];

const results: ContractCallResults = await multicall.call(contractCallContext);
console.log(results);

// results:
{
  results: {
      testContract: {
          originalContractCallContext:  {
            reference: 'testContract',
            contractAddress: '0x6795b15f3b16Cf8fB3E56499bbC07F6261e9b0C3',
            abi: [ { name: 'foo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256' }] } ],
            calls: [{ reference: 'fooCall', methodName: 'foo', methodParameters: [42] }]
          },
          callsReturnContext: [{
              returnValues: [{ amounts: BigNumber }],
              decoded: true,
              reference: 'fooCall',
              methodName: 'foo',
              methodParameters: [42]
          }]
      },
      testContract2: {
          originalContractCallContext:  {
            reference: 'testContract2',
            contractAddress: '0x66BF8e2E890eA0392e158e77C6381b34E0771318',
            abi: [ { name: 'fooTwo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256[]' ] } ],
            calls: [{ reference: 'fooTwoCall', methodName: 'fooTwo', methodParameters: [42] }]
          },
          callsReturnContext: [{
              returnValues: [{ amounts: [BigNumber, BigNumber, BigNumber] }],
              decoded: true,
              reference: 'fooCall',
              methodName: 'foo',
              methodParameters: [42]
          }]
      }
  },
  blockNumber: 10994677
}
```

### web3 usage example

```ts
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';
import Web3 from 'web3';

const web3 = new Web3('https://some.local-or-remote.node:8546');

const multicall = new Multicall({ web3Instance: web3 });

const contractCallContext: ContractCallContext[] = [
    {
        reference: 'testContract',
        contractAddress: '0x6795b15f3b16Cf8fB3E56499bbC07F6261e9b0C3',
        abi: [ { name: 'foo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256' }] } ],
        calls: [{ reference: 'fooCall', methodName: 'foo', methodParameters: [42] }]
    },
    {
        reference: 'testContract2',
        contractAddress: '0x66BF8e2E890eA0392e158e77C6381b34E0771318',
        abi: [ { name: 'fooTwo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256', name: "path", "type": "address[]" }] } ],
        calls: [{ reference: 'fooTwoCall', methodName: 'fooTwo', methodParameters: [42] }]
    }
];

const results: ContractCallResults = await multicall.call(contractCallContext);
console.log(results);

// results:
{
  results: {
      testContract: {
          originalContractCallContext:  {
            reference: 'testContract',
            contractAddress: '0x6795b15f3b16Cf8fB3E56499bbC07F6261e9b0C3',
            abi: [ { name: 'foo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256' }] } ],
            calls: [{ reference: 'fooCall', methodName: 'foo', methodParameters: [42] }]
          },
          callsReturnContext: [{
              returnValues: [{ amounts: BigNumber }],
              decoded: true,
              reference: 'fooCall',
              methodName: 'foo',
              methodParameters: [42]
          }]
      },
      testContract2: {
          originalContractCallContext:  {
            reference: 'testContract2',
            contractAddress: '0x66BF8e2E890eA0392e158e77C6381b34E0771318',
            abi: [ { name: 'fooTwo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256[]' ] } ],
            calls: [{ reference: 'fooTwoCall', methodName: 'fooTwo', methodParameters: [42] }]
          },
          callsReturnContext: [{
              returnValues: [{ amounts: [BigNumber, BigNumber, BigNumber] }],
              decoded: true,
              reference: 'fooCall',
              methodName: 'foo',
              methodParameters: [42]
          }]
      }
  },
  blockNumber: 10994677
}
```

### custom jsonrpc provider usage example

```ts
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';

const multicall = new Multicall({ nodeUrl: 'https://some.local-or-remote.node:8546' });

const contractCallContext: ContractCallContext[] = [
    {
        reference: 'testContract',
        contractAddress: '0x6795b15f3b16Cf8fB3E56499bbC07F6261e9b0C3',
        abi: [ { name: 'foo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256' }] } ],
        calls: [{ reference: 'fooCall', methodName: 'foo', methodParameters: [42] }]
    },
    {
        reference: 'testContract2',
        contractAddress: '0x66BF8e2E890eA0392e158e77C6381b34E0771318',
        abi: [ { name: 'fooTwo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256', name: "path", "type": "address[]" }] } ],
        calls: [{ reference: 'fooTwoCall', methodName: 'fooTwo', methodParameters: [42] }]
    }
];

const results: ContractCallResults = await multicall.call(contractCallContext);
console.log(results);

// results:
{
  results: {
      testContract: {
          originalContractCallContext:  {
            reference: 'testContract',
            contractAddress: '0x6795b15f3b16Cf8fB3E56499bbC07F6261e9b0C3',
            abi: [ { name: 'foo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256' }] } ],
            calls: [{ reference: 'fooCall', methodName: 'foo', methodParameters: [42] }]
          },
          callsReturnContext: [{
              returnValues: [{ amounts: BigNumber }],
              decoded: true,
              reference: 'fooCall',
              methodName: 'foo',
              methodParameters: [42]
          }]
      },
      testContract2: {
          originalContractCallContext:  {
            reference: 'testContract2',
            contractAddress: '0x66BF8e2E890eA0392e158e77C6381b34E0771318',
            abi: [ { name: 'fooTwo', type: 'function', inputs: [ { name: 'example', type: 'uint256' } ], outputs: [ { name: 'amounts', type: 'uint256[]' ] } ],
            calls: [{ reference: 'fooTwoCall', methodName: 'fooTwo', methodParameters: [42] }]
          },
          callsReturnContext: [{
              returnValues: [{ amounts: [BigNumber, BigNumber, BigNumber] }],
              decoded: true,
              reference: 'fooCall',
              methodName: 'foo',
              methodParameters: [42]
          }]
      }
  },
  blockNumber: 10994677
}
```

### Multicall contracts

by default it looks at your network from the provider you passed in and makes the contract address to that:

- mainnet > '0xeefba1e63905ef1d7acba5a8513c70307c1ce441'
- kovan > '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a'
- rinkeby > '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821'
- ropsten > '0x53c43764255c17bd724f74c4ef150724ac50a3ed'

If you wanted this to point at a different multicall contract address just pass that in the options when creating the multicall instance, example:

```ts
const multicall = new Multicall({
  multicallCustomContractAddress: '0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2',
  // your rest of your config depending on the provider your using.
});
```

## Issues

Please raise any issues in the below link.

https://github.com/joshstevens19/ethereum-multicall/issues
