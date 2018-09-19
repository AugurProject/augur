# Augur App

Augur App is a lightweight Electron app that bundles the [Augur UI](https://github.com/AugurProject/augur-ui) and [Augur Node](https://github.com/AugurProject/augur-node) together and deploys them locally to your machine. The Augur UI is a reference client used to interact with the Augur protocols core smart contracts on the Ethereum blockchain. Augur Node is a locally-run program that scans the Ethereum blockchain for event logs relevant to Augur, stores them in a database, and serves the respective data to the Augur UI. 

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
4. When the sync progress gets to ~100%, the "Open Augur App" button will become clickable. Click it to deploy the UI locally in your browser.
5. Authenticate using [MetaMask](https://metamask.io/), [Edge](https://edge.app/), [Ledger](https://www.ledgerwallet.com/) or [Trezor](https://trezor.io/). 

### From source
If you want to run Augur App from source, you will need git and npm installed on your machine. Follow these steps:
```bash
# Clone this repository
git clone https://github.com/AugurProject/augur-app
# Go into the repository
cd augur-app
# Install dependencies
npm install
# Run the app. NOTE: This will have to install native dependencies which may take a long time depending on your environment.
npm start
```
Once the application is running, wait for the Sync progress to reach 100%, then the "Open Augur UI" button will light up and you can click on it to open the Augur UI. Note that the Augur App must remain open while using the UI, or it will stop functioning.

If the instructions above don't work try:
```
yarn
yarn start
```

### To build the binary

    Windows: npm run make-win  
    MacOs: npm run make-mac 
    Linux: npm run make-linux  
    All: npm run make-all

## Selecting An Ethereum Node

You have two options for connecting to an Ethereum node: local or remote.

- Run a synced [Geth](https://github.com/ethereum/go-ethereum) or [Parity](https://www.parity.io) client locally. (The quickest way to do this is by starting up a Geth light node by running the following command: `geth --syncmode="light" --rpc --ws --wsorigins='127.0.0.1,http://127.0.0.1:8080,https://127.0.0.1:8080'`). Running Parity in light mode won't work, due to [a bug](https://github.com/paritytech/parity-ethereum/issues/9184).

    or

- Use a remote node, such as [Gethnode.com](https://gethnode.com). This is the default configuration.

### Parity and Warp Sync

By default, Parity uses "warp sync" mode (sometimes referred to as "fast") to sync the blockchain. While this mode does sync significantly faster, it causes issues for any application that relies on historic logs. After warp sync is complete, your node might appear to be sychronized and fully up-to-date, but older blocks are missing while it backfills, which could take several days. It is also not obvious when that backfill has completed.

Augur recommends running your parity nodes with either
- `--no-warp` **or**
- `--warp-barrier 5900000`

If neither of these options are specified, the node could still be functional. See [this parity documentation](https://wiki.parity.io/FAQ#what-does-paritys-command-line-output-mean) for help determining if your Parity node is ready to answer historic requests. [Parity Issue #7411](https://github.com/paritytech/parity-ethereum/issues/7411)

## Using Ledger Hardware Wallet

### Key Derivation Path

Augur derives Ledger account addresses using the [BIP0044 standard](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki), or the `m/44'/60'/0'/0` key derivation path. Commonly used client-side wallets such as MyCrypto and MyEtherWallet, and the Ledger ETH App, use the "non-standard" key derivation path `m/44'/60'/0'`. To access the address Augur derives for you on MyCrypto, MyEtherWallet, and the Ledger ETH App, you must change your key derivation path to `m/44'/60'/0'/0` (BIP0044). [Reference](https://github.com/ethereum/EIPs/issues/84#issuecomment-292324521). 

### Local SSL Cert

Ledger requires SSL, which isn't available by default while running software on localhost. If you plan to use a Ledger hardware wallet with Augur, you must first select **"Enable SSL For Ledger"** before clicking "Open Augur App". Selecting "Enable SSL For Ledger" generates a self-signed SSL certificate locally, allowing you to interact with your Ledger hardware wallet. Other available authentication methods do not require this.

### Firefox Not Supported

Due to the current architecture of this implementation, the use of self-signed SSL certificates, and Firefox's security model, using a Ledger with Firefox is **not currently supported**. We will be working to fix this issue. In the meantime, it is recommended to use Chrome with Ledger.

##  Clearing Configuration File

If you've installed a previous pre-release of Augur App locally on your machine prior to the main Ethereum network deployment, **you will need to clear your local Augur App configuration file in order to properly run this Augur App release and connect to the Ethereum main network.**

Please delete the ```augur``` directory (or, just the ```app.config``` file) in the following location:

**MacOS** : ```~/Library/Application\ Support/augur```

**Windows** : ```%AppData%\augur```

**Linux** : ``` ~/.augur```

##  Logging

If you are looking for more information from augur-node and augur-app, checkout the logs. 

**MacOS** : ```~/Library/Logs/augur/log.log```

**Windows** : ```%USERPROFILE%\AppData\Roaming\augur\log.log```

**Linux** : ``` ~/.config/augur/log.log```


## Running UI on different port (change from 8080)

`uiPort` is a new property in config.json (see location above). Change `uiPort` property to whatever port you want. Here is an example of the uiPort property changed:

```
{
  "uiPort": "8181",
  "sslPort": "8443"
        ...
```



## Questions, Bugs and Issues

Please file any bugs or issues related to Augur App as a GitHub issue in the [Augur App](https://github.com/AugurProject/augur-app) repository. If your issue is related to Augur Node, use the [Augur Node](https://github.com/AugurProject/augur-app) repository. If you have a UI bug or issue to report, use the [Augur UI Client](https://github.com/AugurProject/augur-ui)  repository. 

Alternatively, you can share feedback or seek help from community members in the [Augur Discord](https://discordapp.com/invite/faud6Fx). 

When filing a bug, it may helpful to include the log file generated Augur App:

**MacOS** : ~/Library/Logs/augur/log.log

**Windows** : %USERPROFILE%\AppData\Roaming\augur\log.log

**Linux** : ~/.config/augur/log.log

## License

[MIT](LICENSE.md)

# FAQ & Disclaimer

It is **highly encouraged and recommended** that users read the [FAQ](https://augur.net/faq) and [disclaimer](https://augur.net/disclaimer) prior to interacting with the Augur protocol on the main Ethereum network.
