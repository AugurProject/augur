## 0x
### I'm seeing a LOT of errors where by browser cannot connect to servers?

If your browser is attempting to connect to IP addresses on port 60559 -- this is a part of the Gnosis 0x mesh Peer to Peer network. Generally speaking these issues are benign unless you are specifically looking into what two peers cannot communicate.

* It is normal to see a lot of errors *

#### But why is it trying to connect to localhost:60559 / 127.0.0.1:60559

So when you connect to the mesh, your browser will reach out to one of the bootstrap nodes that is in the default list. This node will then pass part of its current list of peers back to your browser, which will initiate trying to connect to them directly. The addresses of these nodes are determined by what *each peer* believes its address to be, and can be a mix of internal (127.0.0.1, 192.168.x.x, 10.0.0.x) and public addresses. These may not allow connections. There is an optimization that would try to ignore local addresses when not in dev mode that should happen in the mesh sometime.

### The 0x mesh in browser keeps dying with "Timed out waiting for newer block"
This happens when you restart your local eth node and don't delete the `0x-mesh-db` database from IndexedDB. Basically the mesh node is waiting for a block NEWER than what it already has, but since the POP docker has restarted that will always be the case.

Solution: Clear application state OR delete `0x-mesh-db` indexeddb!

### I am getting an error (422) back from the Safe Relayer API when trying to make a trade, WHAT IS HAPPENING?!?! [Kovan Edition]

- Step 1 -- Does the relayer still have eth?
  - Find the ProxyFactory for Kovan in https://github.com/AugurProject/augur/blob/master/packages/augur-artifacts/src/environments/YOUR_ENV.json
    - As of writing this value is: "0xA3F0206F2249Bd547c6bD22f9F8349D5C0cde5a3"
  - Click on a transaction, and check out the "From" address -- this is the kovan relayer address that forwarded eth to create your safe!
    - At the time of writing, the default Gnosis Safe Relayer configured in Augur is: 0x01D640Bff4B3a5e5cC720F0be37847F88EDf626e\
    - https://kovan.etherscan.io/address/0x01d640bff4b3a5e5cc720f0be37847f88edf626e

- Step 2 -- Is the EthExchange working correctly!
   - In order to have transactions be completely ETH free to the user, Augur will automatically pay 0x fees for that user by trading DAI in the wallet for ETH. To do this it will use Uniswap, but on kovan uses an internal.
   - Find the EthExchange contract address in addresses.json - https://github.com/AugurProject/augur/blob/master/packages/augur-artifacts/src/addresses.json#L98
     - At the time of writing, this is 0xee39774AE1298a67Be576E3003C94044b3E767eD
   - Look at it on etherscan, we'll be looking at the balances of both ETH and Cash on this contract: https://kovan.etherscan.io/address/0xee39774ae1298a67be576e3003c94044b3e767ed
   - In the constant product exchange, the exchange rate is set by the ratio of pooled liquidity. So the conversion rate between ETH and DAI is `balance_of_cash/balance_of_eth`
   - Example (as of writing):
       - Balance ETH: 1,010.997600004215061757
       - Balance DAI: 202,000.004766778529453829
       - Exchange Rate: 1 ETH = 200 CASH <-- This is reasonable!
   - IF the conversion rate is reasonable, move on.
   - IF the conversion rate is NOT reasonable, (or the eth balance is 0!), send this thing eth!
    - `yarn flash add-eth-exchange-liquidity -c e 4 -c 6000`

- Step 3 -- As a sanity check, will this transaction work if you have ETH in your Safe?
   - Send some ETH to your account address listed in the UI'
   - Try the txn again
   - If this still fails, then the issue isn't with the EthExchange -- since its failing even when you have enough ETH to cover.
```

