# augur-core

Smart contracts for [Augur](https://augur.net), a decentralized prediction market platform on the [Ethereum](https://ethereum.org) blockchain.

## Quick Setup

If you just want to clone the repo and quickly have a local proof of authority network running with the contracts deployed then you can just clone the repo and run:
```
docker run -it -p 8545:8545 -p 8546:8546 augurproject/dev-node-geth:v1.9.9
yarn deploy:local
```
* Geth HTTP RPC will be available on localhost port `8545`.
* An abundant supply of ETH is available using the private key `0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a`.
* The log output will let you know what the address of the various Augur contracts are.

## Installation

You need system-wide installations of Python 3.6, Node.js 10+, and [Solidity 0.5.15](https://github.com/ethereum/solidity/releases/tag/v0.5.15).  (Or Docker; see below.)  Install the dependencies:

```bash
yarn
pip install -r requirements.txt
```

Note: on macOS, you'll need to use [virtualenv](https://python-guide-pt-br.readthedocs.io/en/latest/dev/virtualenvs/) or [homebrew](https://brew.sh/) Python to work around System Integrity Protection. To do this using virtualenv, run:

```bash
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
python3 -m pip install pytest
```

## Deployment

Solidity contract deployment is handled by `ContractDeployer.ts` and the wrapper programs located in `source/deployment`.

- Main Code
  - source/libraries/ContractCompiler.ts - All logic for compiling contracts, generating ABI
  - source/libraries/ContractDeployer.ts - All logic for uploading, initializing, and whitelisting contracts, generating addresses and block number outputs.

- Configuration
  - source/libraries/CompilerConfiguration.ts
  - source/libraries/DeployerConfiguration.ts
  - source/libraries/NetworkConfiguration.ts -

- Wrapper programs
  - source/deployment/compileAndDeploy.ts - Compiles and Uploads contracts in one step. Useful for integration testing.
  - source/deployment/compiledContracts.ts - Compile contract source (from source/contracts) and output contracts.json and abi.json. Outputs to output/contracts or CONTRACTS_OUTPUT_ROOT if defined.
  - source/deployment/deployNetworks.ts - Application that can upload / upgrade all contracts, reads contracts from CONTRACTS_OUTPUT_ROOT, and uses a named network configuration to connect to an ethereum node. The resulting contract addresses are stored in output/contracts or ARTIFACT_OUTPUT_ROOT if defined.

## Tests

The tests directory (augur-core/tests) contain tests and test fixtures to test the various functionalities present in Augur, including trading, reporting, and wcl tests.
- conftest.py -- contains the class ContractFixture, which deals with caching compiled contracts, signatures, etc. as well as resetting the blockchain before each test.
- delegation_sandbox.py -- tests the delegator contract.
- sandbox.py -- used for testing miscellaneous Solidity behaviors
- reporting -- contains tests for reporting purposes.
- trading -- contains tests for trading purposes.
- libraries -- tests for the libraries we use. Include Token tests, math, and various utility contracts
- solidity_test_helpers -- small contracts to help run tests.
- test_legacyRep.py -- tests for legacyRepToken's functionalities.
- utils.py -- contains useful functions for testing, such as conversion between different data types.
- wcl-in-python.py -- contains functions for making and taking various types of bids.
- wcl.txt -- explains tests for the various situations when filling a bid and filling an ask.

Use pytest to run Augur's test suite:

```bash
python3 -m pytest tests
```

This executes all the tests. To run a test individually, run the following:

```bash
python3 -m pytest tests::'name_of_test'
```

When writing tests, it is highly recommended to make use of the ContractFixtures class for "placeholder" variables. Python's unit testing framework comes handy here; encapsulate tests within functions that start with "test\_", and use `assert` statements when testing for certain values. Parameterized tests are recommended as well to test various possibilities and edge cases.

## Coverage Report

To generate a coverage report simply run the command:

```
yarn test:coverage
```

The results will be displayed on the command line and a much richer HTML output will be generated in the `coverage` folder of the project.

Make sure you actually have enough memory to run the command above. The coverage tool being used will pull a massive file into memory to generate the report and will fail with an OOM exception if not enough is available. Since tests take about 40 minutes to run with coverage enabled this will be a sad event.

## Docker

augur-core can optionally be built, run, and tested using Docker.  A number of Docker commands are included as npm scripts, which map to the non-Dockerized versions where this makes sense. Docker commands beginning with `docker:run` execute the command within the Docker image. Docker commands without `run` (e.g. `docker:test`) first build the image, then execute `docker:run:<command>`.

### Build

```bash
npm run docker:build
```

### Test

```bash
# With a pre-built image
npm run docker:run:test:unit:all

# Build and run all unit tests and integration tests
npm run docker:test

# Build and run just integration tests (using Geth)
npm run docker:run:test:integration:geth
# Build and run just integration tests (using Parity)
npm run docker:run:test:integration:parity
```

For quicker iteration on integration tests follow the instructions here to run tests locally against a node running in docker:

https://github.com/AugurProject/augur-core/blob/7272124d985a4c38a2b4f6f599cc16014615cec9/.vscode/launch.json#L28-L35


## Source code organization

Augur's smart contracts are organized into four folders:
- `source/contracts/factories`: Constructors for universes, markets, dispute windows, etc.
- `source/contracts/libraries`: Data structures used elsewhere in the source code.
- `source/contracts/reporting`: Creation and manipulation of universes, markets, dispute windows, and reporting-related tokens.
- `source/contracts/trading`: Functions to create, view, and fill orders, to issue and close out complete sets of shares, and for traders to claim proceeds after markets are closed.

## Additional notes

### General information about Augur

- [A Roadmap For Augur and What's Next](https://medium.com/@AugurProject/a-roadmap-for-augur-and-whats-next-930fe6c7f75a)
- [Augur Master Plan](https://medium.com/@AugurProject/augur-master-plan-42dda65a3e3d)

### Terminology

[Augur Terminology](http://blog.augur.net/faq/all-terms/)

### EVM numbers are always integers

There are no floating-point numbers in the EVM, only integers.  Therefore, Ether and Reputation values in contracts are always represented in units of wei (i.e., indivisible units of 10^-18 Ether or 10^-18 Reputation).

### Reporting diagrams

- [Reporting flow diagram](https://pasteboard.co/1FcgIDWR2.png)
- [More in-depth diagram](https://www.websequencediagrams.com/files/render?link=kUm7MBHLoO87M3m2dXzE)
- [Market object graph](https://pasteboard.co/1WHGfXjB3.png)

### Worst-case-loss escrow for trades

- [Some notes on worst-case-loss/value-at-risk](https://github.com/AugurProject/augur-core/blob/master/tests/wcl.txt)
