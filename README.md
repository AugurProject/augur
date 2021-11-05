# Augur

[![](https://img.shields.io/discord/378030344374583298.svg)](https://invite.augur.net) [![](https://img.shields.io/badge/contributions-welcome-orange.svg)](https://github.com/AugurProject/augur/issues) [![](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/AugurProject/augur/pulls) [![](https://img.shields.io/github/contributors/AugurProject/augur.svg)](https://github.com/AugurProject/augur-app/graphs/contributors)
 [![](https://img.shields.io/github/issues-raw/AugurProject/augur.svg)](https://github.com/AugurProject/augur/issues) [![](https://img.shields.io/github/issues-closed-raw/AugurProject/augur.svg)](https://github.com/AugurProject/augur/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+) [![](https://img.shields.io/github/issues-pr-raw/AugurProject/augur.svg)](https://github.com/AugurProject/augur/pulls) [![](https://img.shields.io/github/issues-pr-closed-raw/AugurProject/augur.svg)](https://github.com/AugurProject/augur/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aclosed)

Augur is a decentralized oracle and peer to peer protocol for prediction markets. Augur is free, public, open source software, portions of which are licensed under the General Public License \(GPL\) and portions of which are licensed under the Massachusetts Institute of Technology \(MIT\) license. Augur is a set of smart contracts written in Solidity that can be deployed to the Ethereum blockchain.

Augur is a protocol, freely available for anyone to use however they please. Augur is accessible through a desktop client app, similar to interacting with an Ethereum or Bitcoin node. Users of the Augur protocol must themselves ensure that the actions they are performing are compliant with the laws in all applicable jurisdictions and must acknowledge that others’ use of the Augur protocol may not be compliant. Users of the Augur protocol do so at their own risk.

For more information about the Augur protocol, [check out the FAQ.](https://www.augur.net/faq/)

## Branches

* [release](https://github.com/AugurProject/augur/tree/release) -- This branch tracks the current release versions of Augur v2
* [dev](https://github.com/AugurProject/augur/tree/dev) -- The *default* branch is for future updates. *THIS BRANCH IS UNSTABLE*

## Development Guides

Clone Augur's Monorepo.

* `git clone https://github.com/AugurProject/augur.git`

Then, install the packages using Yarn -- installation _must_ be done via `yarn` and not `npm` since Augur utilizes the Yarn Workspace funcitonality for monorepo support.

* `yarn`

## Make commands

| Command | Purpose |
| :--- | :--- |
| `make build-typescript` | Build all everything but the UI and contracts once |
| `make watch-typescript` | Build everything but the UI and contracts continuously |
| `make build-ui` | Build the UI once |
| `make watch-ui` | Build the UI continuously |
| `make build-contracts` | Build the solidity contracts |
| `make test` | Run the typescript tests. |
| `make build-clean` | Remove JUST typescript build artifacts |
| `make clean` | Remove everything that isn't currently being tracked by git \(node\_modules, build aretifacts, etc.\) |
| `make docker-all` | Run all the needed dockers to run the UI in dev mode |
| `make ipfs-publish` | Publish augur-ui to dnslink for IPFS |
| `make ipfs-pin` | Publish augur-ui to IPFS, pinned in your local node |

## Repository Typescript build commands

NOTE: Run `yarn` at the base of the repository to install dependencies before running any of the following.

| Command | Purpose |
| :--- | :--- |
| `yarn build` | Build all everything but the UI once |
| `yarn build:watch` | Build everything but the UI continuously |
| `yarn build:clean` | Remove JUST typescript build artifacts |
| `yarn clean` | Remove everything that isn't currently being tracked by git \(node\_modules, build aretifacts, etc.\) |
| `yarn docker:all` | Run all the needed dockers to run the UI in dev mode |

## UI development

#### Simple startup steps:

1. Install yarn
2. Install docker \(docker desktop is a simple way\)
3. Install node &gt;= 10.14.2, supports node 11 and 12 too
4. Run these in console, then open localhost:8080 in your browser

```text
docker kill $(docker ps -a -q);
docker system prune -af
yarn clean
yarn
yarn build
yarn docker:all
yarn build -w
yarn workspace @augurproject/ui dev
```

Connect MetaMask to localhost:8545 and go to [http://localhost:8080](http://localhost:8080) in your browser. Click on "login", select MetaMask/web3, and check the Gnosis Safe checkbox. This will create a contract wallet for you which will automatically receive testnet DAI.

#### Getting Cash \(fake DAI\) for Testnet

1. copy signing wallet address from Account Summary bottom right.
2. paste in kovan ETH faucet, link is in Account Summary bottom right
3. after ETH lands, mash magic button in Account Summary bottom right
4. mash initialize GSN Wallet button on top bar.

#### [Startup steps for Ubuntu 18.04](https://github.com/AugurProject/augur/blob/master/docs/v2/docs/getting-started.md)

#### More advanced startup steps

Run the following command:

* `yarn build:watch`

Or alternatively using docker-compose:

* `docker-compose -f support/gitstart/gitstart.yml up`

On a different terminal window, you can either run _with_ the variable ETHEREUM\_NETWORK set to "kovan", that is one of the [testnets of the Ethereum Network](https://docs.ethhub.io/using-ethereum/test-networks/), or _without_ this variable, in which case it will search for data in your localhost/127.0.0.1. As of right now, "kovan" is the only testnet supported.

Running on localhost:

* `yarn workspace @augurproject/ui dev`

Running on the "kovan" testnet

* `ETHEREUM_NETWORK=kovan yarn workspace @augurproject/ui dev`

_Running the workspace currently shows quite a few warnings regarding source mappings. We will fix this as soon as possible._

### Docker images available

| Command | Purpose |
| :--- | :--- |
| `yarn docker:geth:pop-15` | 15 second block times, real time, has contracts and canned market data. |
| `yarn docker:geth:pop` | 5 second block times, fake time, use flash scripts to move time . |
| `yarn docker:geth:pop-normal-time` | 5 second block times, real time, has contracts and canned market data. |
| `yarn docker:geth` | 5 second block times, blank image with no contracts uploaded.   Use `deploy` script from `augur-tools` to manually deploy the contracts.  `yarn tools deploy`    See [Augur Tools](https://github.com/AugurProject/augur/tree/1dd7569fbcc3b0f195a191ed3f4f18728fb14531/packages/augur-tools/README.md) for more information |

## 100% Open Source

All parts of Augur are entirely open source. You can view, edit, and contribute to Augur via the repositories hosted on GitHub!

* [Augur Core](https://github.com/AugurProject/augur/tree/1dd7569fbcc3b0f195a191ed3f4f18728fb14531/packages/augur-core/README.md) - The core implementation of the Augur Project as Smart Contracts written in Solidity for the Ethereum Network.
* [Augur SDK](https://github.com/AugurProject/augur/tree/1dd7569fbcc3b0f195a191ed3f4f18728fb14531/packages/augur-sdk/README.md) - Typescript library for Node.js and the browser to help communicate with the Augur smart contracts.
* [Augur UI](https://github.com/AugurProject/augur/tree/1dd7569fbcc3b0f195a191ed3f4f18728fb14531/packages/augur-ui/README.md) - A reference client UI which uses Augur Node and a connection to the Ethereum Network to interact with the Augur community.

## Documentation and Whitepaper

Developer documentation is available on [the Augur documentation site](https://docs.augur.net/). If you find any mistakes or want to add any clarifications, you can submit pull requests for updates to [the GitHub repository](https://github.com/AugurProject/docs).

If you're interested in going in-depth with Augur, the Augur [whitepaper](https://github.com/AugurProject/whitepaper) provides an in-depth look at the game theory behind the Augur protocol.

## Report Issues

Augur needs community support to find and fix issues in the protocol, middleware, client libraries, and applications. If you have an issue, or find a bug please [create an issue](https://github.com/AugurProject/augur/issues/new) with any information needed to recreate the problem.

If you're a developer wanting to contribute to the Augur community, please check out [the open issues](https://github.com/AugurProject/augur/issues) and feel free to propose fixes by submitting a pull request to the appropriate repository.

