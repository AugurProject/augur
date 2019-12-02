
<p align="center"><img src="https://raw.githubusercontent.com/AugurProject/branding/master/name-horizontal/Augur-Mark-Inline.png" width="500"></p>

[![](https://img.shields.io/discord/378030344374583298.svg)](https://invite.augur.net)
[![](https://img.shields.io/badge/contributions-welcome-orange.svg)](https://github.com/AugurProject/augur/issues)
[![](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/AugurProject/augur/pulls)
[![](https://img.shields.io/github/contributors/AugurProject/augur.svg)](https://github.com/AugurProject/augur-app/graphs/contributors) <br/>
[![](https://img.shields.io/github/issues-raw/AugurProject/augur.svg)](https://github.com/AugurProject/augur/issues)
[![](https://img.shields.io/github/issues-closed-raw/AugurProject/augur.svg)](https://github.com/AugurProject/augur/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+)
[![](https://img.shields.io/github/issues-pr-raw/AugurProject/augur.svg)](https://github.com/AugurProject/augur/pulls)
[![](https://img.shields.io/github/issues-pr-closed-raw/AugurProject/augur.svg)](https://github.com/AugurProject/augur/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aclosed)

Augur is a decentralized oracle and peer to peer protocol for prediction markets. Augur is free, public, open source software, portions of which are licensed under the General Public License (GPL) and portions of which are licensed under the Massachusetts Institute of Technology (MIT) license. Augur is a set of smart contracts written in Solidity that can be deployed to the Ethereum blockchain.</p>

Augur is a protocol, freely available for anyone to use however they please. Augur is accessible through a desktop client app, similar to interacting with an Ethereum or Bitcoin node. Users of the Augur protocol must themselves ensure that the actions they are performing are compliant with the laws in all applicable jurisdictions and must acknowledge that others’ use of the Augur protocol may not be compliant. Users of the Augur protocol do so at their own risk.</p>

For more information about the Augur protocol, [check out the FAQ.](https://www.augur.net/faq/)

<h4><p align="center">Looking for Augur App? Click Below: <h4></p>
<p align="center"><a href="https://github.com/AugurProject/augur-app/releases/latest"> <img width="200" src="https://augur.net/dist/images/meta_logo.png"> </a></p>

## Installation

Clone Augur's Monorepo.

* `git clone https://github.com/AugurProject/augur.git`

Then, install the packages using Yarn -- installation *must* be done via `yarn` and not `npm` since Augur utilizes the Yarn Workspace funcitonality for monorepo support.

* `yarn`

## Repository Typescript build commands

NOTE: Run `yarn` at the base of the repository to install dependencies before running any of the following.

| Command               | Purpose       |
| -------------         | ------------- |
|  `yarn build`         |  Build all everything but the UI once. |
|  `yarn build:watch`   |  Build everything but the UI continuously. |
|  `yarn build:clean`   |  Remove JUST typescript build artifacts |
|  `yarn clean`         |  Remove everything that isn't currently being tracked by git (node_modules, build aretifacts, etc.) |

## UI development

Run the following command:

* `yarn build:watch`

Or alternatively using docker-compose:

* `docker-compose -f support/gitstart/gitstart.yml up`

On a different terminal window, you can either run *with* the variable ETHEREUM_NETWORK set to "kovan", that is one of the [testnets of the Ethereum Network](https://docs.ethhub.io/using-ethereum/test-networks/), or *without* this variable, in which case it will search for data in your localhost/127.0.0.1. As of right now, "kovan" is the only testnet supported.

Running on localhost:

* `yarn workspace @augurproject/ui dev`

Running on the "kovan" testnet

* `ETHEREUM_NETWORK=kovan yarn workspace @augurproject/ui dev`

<span style="color: #999; font-size: .9em;">*Running the workspace currently shows quite a few warnings regarding source mappings. We will fix this as soon as possible.*</span>

### Docker images available

| Command                               | Purpose       |
| -------------                         | ------------- |
|  `yarn docker:geth:pop-15`            |  15 second block times, real time, has contracts and canned market data. |
|  `yarn docker:geth:pop`               |  5 second block times, fake time, use flash scripts to move time . |
|  `yarn docker:geth:pop-normal-time`   |  5 second block times, real time, has contracts and canned market data. |
|  `yarn docker:geth`                   |  5 second block times, blank image with no contracts uploaded. <br><br>Use `deploy` script from `augur-tools` to manually deploy the contracts. <br/>```yarn tools deploy``` <br><br> See [Augur Tools](packages/augur-tools) for more information.|
|  `yarn docker:gnosis`                 |  Local Gnosis relayer for local development work. |

## Gnosis Development

For development/testing, we have a Gnosis relayer deployed on Kovan.

The best way to dev against this is to use the running on the "kovan" testnet flow.
* `ETHEREUM_NETWORK=kovan yarn workspace @augurproject/ui dev`

Here are some LOADED Portis ACCOUNTS.
```
test1@augur.net
test2@augur.net
test3@augur.net
test5@augur.net

password: ** as team **
```

Also, you can find the kovan relayer API below -- usful for getting status checks on safes
https://gnosis.kovan.augur.net/api/v2/safes/{CHECKSUM_ADDRESS}/funded/

## 100% Open Source

All parts of Augur are entirely open source. You can view, edit, and contribute to Augur via the repositories hosted on GitHub!

- [Augur Core](packages/augur-core) - The core implementation of the Augur Project as Smart Contracts written in Solidity for the Ethereum Network.
- [Augur SDK](packages/augur-sdk) - Typescript library for Node.js and the browser to help communicate with the Augur smart contracts.
- [Augur UI](packages/augur-ui/) - A reference client UI which uses Augur Node and a connection to the Ethereum Network to interact with the Augur community.

## Documentation and Whitepaper

Developer documentation is available on [the Augur documentation site](https://docs.augur.net/). If you find any mistakes or want to add any clarifications, you can submit pull requests for updates to [the GitHub repository](https://github.com/AugurProject/docs).

If you're interested in going in-depth with Augur, the Augur [whitepaper](https://github.com/AugurProject/whitepaper) provides an in-depth look at the game theory behind the Augur protocol.

## Report Issues

Augur needs community support to find and fix issues in the protocol, middleware, client libraries, and applications. If you have an issue, or find a bug please [create an issue](https://github.com/AugurProject/augur/issues/new) with any information needed to recreate the problem.

If you're a developer wanting to contribute to the Augur community, please check out [the open issues](https://github.com/AugurProject/augur/issues) and feel free to propose fixes by submitting a pull request to the appropriate repository.
