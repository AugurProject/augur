
<p align="center"><img src="https://raw.githubusercontent.com/AugurProject/branding/master/name-horizontal/Augur-Mark-Inline.png" width="500"></p>

# <p align="center">Augur Monorepo<a name="install" ></a></p>

<p align="center"><a href="https://github.com/AugurProject/augur-app/graphs/contributors"><img src="https://img.shields.io/github/contributors/AugurProject/augur.svg"></a>
<br>
<a href="https://github.com/AugurProject/augur/issues"><img src="https://img.shields.io/github/issues-raw/AugurProject/augur.svg"></a> <a href="https://github.com/AugurProject/augur/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+"><img src="https://img.shields.io/github/issues-closed-raw/AugurProject/augur.svg"></a>
<br>
<a href="https://github.com/AugurProject/augur/pulls"><img src="https://img.shields.io/github/issues-pr-raw/AugurProject/augur.svg"></a>
<a href="https://github.com/AugurProject/augur/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aclosed"><img src="https://img.shields.io/github/issues-pr-closed-raw/AugurProject/augur.svg"></a>
<br>
<a href="https://invite.augur.net"><img src="https://img.shields.io/discord/378030344374583298.svg"></a>
<a href="https://github.com/AugurProject/augur/issues"><img src="https://img.shields.io/badge/contributions-welcome-orange.svg"></a>
<a href="https://github.com/AugurProject/augur/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
</p>

<p align="center">Augur is a decentralized oracle and peer to peer protocol for prediction markets. Augur is free, public, open source software, portions of which are licensed under the General Public License (GPL) and portions of which are licensed under the Massachusetts Institute of Technology (MIT) license. Augur is a set of smart contracts written in Solidity that can be deployed to the Ethereum blockchain.</p>

<p align="center">Augur is a protocol, freely available for anyone to use however they please. Augur is accessible through a desktop client app, similar to interacting with an Ethereum or Bitcoin node. Users of the Augur protocol must themselves ensure that the actions they are performing are compliant with the laws in all applicable jurisdictions and must acknowledge that others’ use of the Augur protocol may not be compliant. Users of the Augur protocol do so at their own risk.</p>

<p align="center">For more information about the Augur protocol, <a href="https://www.augur.net/faq/">check out the FAQ.</a></p>

### <p align="center">Augur Monorepo<a name="install" ></a></p>

<p align="center">This repository will soon become Augur's monorepo. For the time being, this repository is being used for global issues, pull requests, and project milestones. Click on the issues board below to browse active projects, development pipeline, weekly sprints and more.  </p>

<p align="center"><a href="https://github.com/AugurProject/augur/projects?query=is%3Aopen"><img src="https://i.imgur.com/uSIQot3.png"></a></p>

<h4><p align="center">Looking for Augur App? Click Below: <h4></p>

<p align="center"><a href="https://github.com/AugurProject/augur-app/releases/latest"> <img width="200" src="https://augur.net/dist/images/meta_logo.png"> </a></p>

## Repository Typescript build commands

NOTE: Run `yarn` at the base of the repository to install dependencies before running any of the following.

| Command               | Purpose       |
| -------------         | ------------- |
|  `yarn build`         |  Build all everything but the UI once. |
|  `yarn build:watch`   |  Build everything but the UI continuously. |
|  `yarn build:clean`   |  Remove JUST typescript build artifacts |
|  `yarn clean`         |  Remove everything that isn't currently being tracked by git (node_modules, build aretifacts, etc.) |

## UI development
Run the following 4 commands, each in a separate terminal session from the root of the project.

`yarn; yarn build:watch`

or alternatively using docker-compose:

`docker-compose -f support/gitstart/gitstart.yml up`

### docker images available
 * `yarn workspace @augurproject/tools docker:geth:pop-15`
   - 15 second block times, real time, has contracts and canned market data
 * `yarn workspace @augurproject/tools docker:geth:pop`
   - 5 second block times, fake time, use flash scripts to move time manually. has contracts and canned market data
 * `yarn workspace @augurproject/tools docker:geth:pop-normal-time`
   - 5 second block times, real time, has contracts and canned market data
 * `yarn workspace @augurproject/tools docker:geth`
   - 5 second block times, no contracts uploaded, use `dp` to upload contracts ...

`yarn workspace @augurproject/ui dev`

## 100% Open Source

All parts of Augur are entirely open source. You can view, edit, and contribute to Augur via the repositories hosted on GitHub!

- [Augur Core](packages/augur-core) - The core implementation of the Augur Project as Smart Contracts written in Solidity for the Ethereum Network.
- [Augur.js](packages/augur.js) - Javascript library for Node.js and the browser to help you communicate with the Augur smart contracts, and Augur Node.
- [Augur Node](packages/augur-node) - Helper application to aggregate the activity of the Augur community on the Ethereum Network. Allows you to quickly build responsive and performant user interfaces.
- [Augur UI](packages/augur-ui/) - A reference client UI which uses Augur Node and a connection to the Ethereum Network to interact with the Augur community.

## Documentation and Whitepaper

Developer documentation is available on [the Augur documentation site](https://docs.augur.net/). If you find any mistakes or want to add any clarifications, you can submit pull requests for updates to [the GitHub repository](https://github.com/AugurProject/docs).

If you're interested in going in-depth with Augur, the Augur [whitepaper](https://github.com/AugurProject/whitepaper) provides an in-depth look at the game theory behind the Augur protocol.

## Report Issues

Augur needs community support to find and fix issues in the protocol, middleware, client libraries, and applications. If you have an issue, or find a bug please [create an issue](https://github.com/AugurProject/augur/issues/new) with any information needed to recreate the problem.

If you're a developer wanting to contribute to the Augur community, please check out [the open issues](https://github.com/AugurProject/augur/issues) and feel free to propose fixes by submitting a pull request to the appropriate repository.
