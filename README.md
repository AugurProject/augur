# augur-app

Augur App is a small electron application that packages [Augur Node](https://github.com/AugurProject/augur-node) and the [Augur UI](https://github.com/AugurProject/augur) so you can use the Augur platform locally with an Ethereum node of your choosing.

## To Use

The easiest way to get started is to simply download one of the OS specific installers we provide [here](https://augur.net).

If you want to run Augur App from source follow these steps:

```bash
# Clone this repository
git clone https://github.com/AugurProject/augur-app
# Go into the repository
cd augur-app
# Install dependencies
npm install
# Run the app
npm start
```

Once the application is running wait for the Sync progress to reach 100% and you can open the Augur UI. The Augur App must remain open while using the UI or it will stop functioning.

## Augur Node Network Configuration

Provided by default are the Augur Rinkeby node configuration and a "Local" configuration, specifying HTTP and WS endpoints for a full Ethereum node. To connect to mainnet you must either run your own full node and use the "Local" configuration, or provide the connection details for a hosted node that you trust. The "Custom" configuration is intended for this purpose but will by default also just point to localhost.

## License

[MIT](LICENSE.md)
