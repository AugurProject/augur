# Augur App

Augur App is a lightweight Electron app that bundles the [Augur UI](https://github.com/AugurProject/augur) and [Augur Node](https://github.com/AugurProject/augur-node) together and deploys them locally to your machine. The Augur UI is a reference client used to interact with the Augur protocols core smart contracts on the Ethereum blockchain. Augur Node is a locally-run program that scans the Ethereum blockchain for event logs relevant to Augur, stores them in a database, and serves the respective data to the Augur UI. 

## Install 

### Executable Installer:

Download the executable of the [latest release](https://github.com/AugurProject/augur-app/releases) for your respective operating system:

**MacOS** : ```mac-augur-1.0.x.dmg```

**Windows** : ```win-augur-1.0.x.exe```

**Linux** : ```linux-augur-1.0.x.deb```

## Running

1. Download the executable for your respective operating system, double click to install.
2. Select your configuration: Mainnet, Local, Rinkeby, Ropsten, or Kovan. 
3. Select "Connect", and Augur App will begin to sync Augur Node in the background. 
4. Once synced to 100%, click "Open Augur App" to deploy the UI locally in your browser. 
5. Authenticate using [MetaMask](https://metamask.io/), [Edge](https://edge.app/), [Ledger](https://www.ledgerwallet.com/) or [Trezor](https://trezor.io/). 

## Selecting An Ethereum Node

You have two options for connecting to an Ethereum node: local or remote.

- Run a synced [Geth](https://github.com/ethereum/go-ethereum) or [Parity](https://www.parity.io) client locally.

    or

- Use a remote node, such as [Infura](https://infura.io/). This is the default configuration.

## Using Ledger Hardware Wallet

### Key Derivation Path

Augur derives Ledger account addresses using the [BIP0044 standard](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki), or the `m/44'/60'/0'/0` key derivation path. Commonly used client-side wallets such as MyCrypto and MyEtherWallet, and the Ledger ETH App, use the "non-standard" key derivation path `m/44'/60'/0'`. To access the address Augur derives for you on MyCrypto, MyEtherWallet, and the Ledger ETH App, you must change your key derivation path to `m/44'/60'/0'/0` (BIP0044). [Reference](https://github.com/ethereum/EIPs/issues/84#issuecomment-292324521). 

### Local SSL Cert

Ledger requires SSL, which isn't available by default while running software on localhost. If you plan to use a Ledger hardware wallet with Augur, you must first select **"Enable SSL For Ledger"** before clicking "Open Augur App". Selecting "Enable SSL For Ledger" generates a self-signed SSL certificate locally, allowing you to interact with your Ledger hardware wallet. Other available authentication methods do not require this.

### Firefox Not Supported

Due to the current architecture of this implementation, the use of self-signed SSL certificates, and Firefox's security model, using a Ledger with Firefox is **not currently supported**. We will be working to fix this issue. In the meantime, it is recommended to use Chrome with Ledger.

##  Clearing Configuration File

If you’ve installed a previous pre-release of Augur App locally on your machine prior to the main Ethereum network deployment, **you will need to clear your local Augur App configuration file in order to properly run this Augur App release and connect to the Ethereum main network.** 

Please delete the ```augur``` directory (or, just the ```config.json``` file) in the following location:

**MacOS** : ```~/Library/Application\ Support/augur```

**Windows** : ```%AppData%\augur```

**Linux** : ``` ~/.augur```

##  Logging

If you are looking for more information from augur-node and augur-app, checkout the logs. 

**MacOS** : ```~/Library/Logs/augur/log.log```

**Windows** : ```%USERPROFILE%\AppData\Roaming\augur\log.log```

**Linux** : ``` ~/.config/augur/log.log```


## Running UI on different port (change from 8080)

`uiPort` is a new property in config.json (see location above). Change `uiPort` property to whatever port you want. If you select the `reset configuration` in the menu the default config.json will be saved to harddrive. Here is an example of the uiPort property changed:

```
{
    "network": "mainnet",
        "version": "1.0.0",
        "uiPort": "8181",
        "networks": {
            "rinkeby": {
              ...
```



## Questions, Bugs and Issues

Please file any bugs or issues related to Augur App as a GitHub issue in the [Augur App](https://github.com/AugurProject/augur-app) repository. If your issue is related to Augur Node, use the [Augur Node](https://github.com/AugurProject/augur-app) repository. If you have a UI bug or issue to report, use the [Augur Client](https://github.com/AugurProject/augur)  repository. 

Alternatively, you can share feedback or seek help from community members in the [Augur Discord](https://discordapp.com/invite/faud6Fx). 

When filing a bug, it may helpful to include the log file generated Augur App:

**MacOS** : ~/Library/Logs/augur/log.log

**Windows** : %USERPROFILE%\AppData\Roaming\augur\log.log

**Linux** : ~/.config/augur/log.log

## License

[MIT](LICENSE.md)

# FAQ & Disclaimer

It is **highly encouraged and recommended** that users read the [FAQ](https://augur.net/faq) and [disclaimer](https://augur.net/disclaimer) prior to interacting with the Augur protocol on the main Ethereum network.
