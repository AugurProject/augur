# UI

## How do I connect to the my local network or a specific testnet?

The webpack dev server builds the UI with a default endpoint connection based upon the environment variable `ETHEREUM_NETWORK` . If this value is undefined, the UI will default to connecting to `localhost:8545` / `localhost:8546` for a local ethereum node.

Currently, the only other useful value is `kovan` since this will default to the Kovan testnet which is the only place where the contracts are regularly deployed. If you think something is wrong or the contracts need re-deployment, @petong on discord handles the deployments.

## 



