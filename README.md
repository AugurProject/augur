# augur-app

Augur App is a small electron application that packages [Augur Node](https://github.com/AugurProject/augur-node) and the [Augur UI](https://github.com/AugurProject/augur) so you can use the Augur platform locally with an Ethereum node of your choosing.

## To Use

The easiest way to get started is to simply download one of the OS specific installers we provide [here](https://github.com/AugurProject/augur-app/releases).

### On Windows

After installing on Windows you'll need to create a shortcut to the executable manually to avoid slow startup times. The installed executable can be found at `%LocalAppData%\augur-app\augur-app.exe`

### On Ubuntu

Install the `.deb` package with `sudo dpkg -i augur-app_1.0.0_amd64.deb`. Once installed you can run the app from the command line with `sudo augur-app`

### From source

If you want to run Augur App from source follow these steps:

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

Once the application is running wait for the Sync progress to reach 100% and you can open the Augur UI. The Augur App must remain open while using the UI or it will stop functioning.

## Augur Node Network Configuration

Provided by default are the Augur Rinkeby node configuration and a "Local" configuration, specifying HTTP and WS endpoints for a full Ethereum node. To connect to mainnet you must either run your own full node and use the "Local" configuration, or provide the connection details for a hosted node that you trust. The "Custom" configuration is intended for this purpose but will by default also just point to localhost.

## Gotchas

- If you are doing active development on other Augur repos make sure to close out any running Augur Node or Augur UI instances and any clients that may be connected to them before running. We use hardcoded ports and if they can't be used the App will not run properly.
- Make sure whatever you are using to connect to an Ethereum node on the UI is looking at the same network as your Augur Node configuration. If for example you are using metamask and running with a Rinkeby configuration you should be on the Rinkeby network in Metamask.

## License

[MIT](LICENSE.md)
