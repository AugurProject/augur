---
description: >-
  An introduction to Augur's code structure, the monorepo, and the tools
  necessary to develop within it.
---

# Introduction

Augur has [moved all development](https://github.com/AugurProject/augur) into the monorepo structure popularized by huge javascript projects like React and Webpack. In a monorepo, all project packages, plugins, and components are bundled together into one physical git repository. This greatly simplifies dependency management, making cross-module changes in atomic commits, simplifies cross-module testing, and means developers to access all parts of the code without changing configurations.

The Augur Monorepo uses a feature built into the [Yarn Package Manager](https://yarnpkg.com) called [Workspaces](https://www.notion.so/Augur-Monorepo-39c77aaf99c84f31b54c2124653421f1). Yarn Workspaces manage the complexity of linking together the various packages, and give a nice CLI interface for working with sub-packages and sub-package NPM commands. For this reason, Augur requires the use of `yarn` for installing and managing dependencies.

The monorepo acts like most other projects in the javascript ecosystem. Starting with a clone of the git repo, you must first install dependencies, build any dependencies that need it, and then you're ready to start developing. In the case of Augur there are also a variety of other tools actually needed to develop in an end-to-end manner — but for the scope of this document we'll just be discussing how to interact with the monorepo itself.

## Prerequisites

### Basics

* Git - Any recent version
* Node.js - version 10+ \(_Optional: It is often convenient to use_ [_Node Version Manager \(nvm\)_](https://github.com/nvm-sh/nvm) _to manage multiple NodeJS versions.\)_
* [Yarn](https://classic.yarnpkg.com/en/docs/install) - version 1.22+

### Additional for full local development

* [Docker CE](https://docs.docker.com/install/) \(a recent built, currently 18.06+\)
* [docker-compose](https://docs.docker.com/compose/install/) \(supporting file version 3.7+\)

**Note on developing on Windows**

While windows has come a long way over the last few years, developing for Augur completely within the Windows ecosystem is quite painful. The recommendation is that if you're going to be doing any development on Augur itself, use [Windows Subsystem for Linux \(WSL\)](https://docs.microsoft.com/en-us/windows/wsl/wsl2-index) and do development in a virtualized Linux environment. You will be able to run your normal windows web browser in order to interact with the UI, as well as use windows-based IDEs such as Visual Studio Code or IntelliJ Webstorm with WSL system.

## Cloning the Repository

Augur's Github repository is accessible publicly and we accept pull requests directly to the main repository. The clone the repository locally the following in your terminal in the directory you want to begin developing augur.

```bash
> git clone https://augurproject.com/AugurProject/augur.git
```

This will create the output folder `augur` which will contain the entire augur source tree. For example

```bash
> ls ./augur
./             support/            azure-pipelines.yml  setup_tmux.sh*
../            .dockerignore       debugging.md         tsconfig-base.json
.git/          .editorconfig       issues-workflow.md   tsconfig.json
.github/       .gitignore          jest.config.js       tsconfig.release.json
docs/          .mergify.yml        lerna.json           tslint.json
infra/         .nvmrc              package.json         yarn.lock
node_modules/  CODE_OF_CONDUCT.md  peek.yaml
packages/      LICENSE             prettier.config.js
scripts/       README.md           renovate.json
```

## Installing Dependencies & Building

Once you've cloned the repository, the next step will be to install the dependencies. The first step to this will be to make sure you have the `yarn` package manager installed. If attempting to run yarn gives `Command not found` make sure you check out the install page of the Yarn Package Manager website. After yarn is installed:

```bash
> yarn
yarn install v1.22.0
[1/5] Validating package.json...
[2/5] Resolving packages...
... ( this will take a long time) ...
```

After all dependencies have been installed correctly, you can manually build all of the Augur source code, giving you the ability to run tools, a standalone SDK server, and tests.

```bash
> yarn build
... (this will take a long time) ...
```

If yarn build fails, and the error is coming from something referencing `node_gyp`, attempt to install without running install scripts, using `yarn --ignore-scripts`

## Tools and Helpers

There are various tools exposed via the npm scripts in the top-level `package.json` inside the Augur Monorepo. One of these was used above to build all of the augur source code. You can see the whole list by running `yarn run`. Many of these scripts are various helpers needed for specific circumstances but a few of them are general use. Also, there are standard `yarn` commands which are useful while using Augur.

### `yarn build`

Recursively build all packages in the `packages/` directory. Augur's source code is written in typescript and must be compiled into Javascript to be executed. This will intelligently build changed files based upon the rules specified in `tsconfig.json`.

Add`-w` to this command to watch the file system for changes and automatically build changed files.

### `yarn clean`

Completely cleans the source tree, deleting installed dependencies and built code.

### `yarn flash`

Flash is the name of the general CLI for augur. This includes a huge amount of tools and options, run `yarn flash --help` to get a full break down. Examples of things you can do with flash are: Run a full local development environment, deploy the Augur contracts to an Ethereum-compatible blockchain, create markets, create orders, make trades, and more.

### `yarn docker:all`

This is a shortcut for `yarn flash docker-all` and is used to spin up a local development environment which will allow a the UI to run, make trades, etc. In order to run this command, you must have the Docker & Docker Compose pre-requisites installed.

### `yarn workspace <package-name> <command>`

The `yarn workspace` command is a shortcut allowing you to easily run NPM scripts defined in one of the augur sub-packages. For example, you can add a module to a sub-package as follows:

```bash
> yarn workspace @augurproject/sdk add --exact MyDependency
```

For the most commonly used packages within augur have a helper to shorten this syntax. E.g:

```bash
>An  yarn ui <command> # Shortcut for yarn workspace @augurproject/ui <command>
> yarn tools <command>
> yarn sdk <command>
```



### Resources

[Monorepo Packages List](https://www.notion.so/Monorepo-Packages-List-970db04e410e49a590f9f1691a29a001)

