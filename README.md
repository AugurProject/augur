# Augur App

[![Build Status](https://travis-ci.com/AugurProject/augur-app.svg?branch=master)](https://travis-ci.com/AugurProject/augur-app)
[![npm version](https://badge.fury.io/js/augur-app.svg)](https://badge.fury.io/js/augur-app)

Augur App is a small electron application that packages [Augur Node](https://github.com/AugurProject/augur-node) and the [Augur UI](https://github.com/AugurProject/augur), so you can use Augur locally with an Ethereum node of your choosing.

## To Use

The easiest way to get started is to simply download one of the OS specific installers [here](https://github.com/AugurProject/augur-app/releases).

### On Windows

After installing on Windows, you will need to manually create a shortcut to the executable to avoid slow startup times. The installed executable can be found at `%LocalAppData%\augur-app\augur-app.exe`

### On Ubuntu

First, install dependencies:

```bash
$ apt-get install libgconf2-4
```

Then, install the `.deb` package with `sudo dpkg -i augur-app_1.0.0_amd64.deb`.  Once installed, run the app from the command line:

```bash
augur-app
```

### From source

If you want to run Augur App from source, you will need git and npm installed on your machine.  Follow these steps:

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

## Augur Node Network Configuration

The Augur Rinkeby node configuration and a "Local" configuration are provided by default, specifying HTTP and WebSocket endpoints for a full Ethereum node. To connect to mainnet, you must either run your own full node and use the "Local" configuration, or provide the connection details for a hosted node that you trust. The "Custom" configuration is intended for this purpose, but will, by default, also just point to localhost.

## Gotchas

- If you are doing active development on other Augur repos, make sure to close out any running Augur Node or Augur UI instances and any clients that may be connected to them before running. We use hardcoded ports, and if they can't be used, the App will not run properly.
- Make sure whatever you are using to connect to an Ethereum node on the UI is looking at the same network as your Augur Node configuration. For example, if you are using MetaMask, and you are running Augur App with a Rinkeby configuration, make sure that MetaMask is also connected to Rinkeby!

## License

[MIT](LICENSE.md)
