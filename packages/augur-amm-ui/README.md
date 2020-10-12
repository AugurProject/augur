# AMM UI

### starts developing

### Installing dependencies
```bash
yarn && yarn build && yarn amm prepare:abis
```

### get needed abis
Extracts needed abis and puts in src/constants/abi folder

```bash
yarn amm prepare:abis
```
### Running dev server locally

```bash
AUGUR_ENV=v2 yarn amm start
```

### Building for production / with a specific config

```bash
AUGUR_ENV=config-name yarn amm start
```
