const { promisify } = require("util");
const Augur = require("../../src");
const debugOptions = require("../debug-options");
const { ContractDeployer, DeployerConfiguration, NetworkConfiguration } = require("augur-core")
const { getPrivateKeyFromString } = require("./lib/get-private-key");

const repFaucet = promisify(require("../rep-faucet"));
const createMarkets = promisify(require("./create-markets"));
const createOrders = promisify(require("./create-orders"));

async function runCannedData(command, networks) {
  const deployerConfiguration = (command === "deploy" ? DeployerConfiguration.create() : null);
  const networkConfigurations = networks.map(NetworkConfiguration.create);
  for(const network of networkConfigurations) {
    const augur = new Augur();
    augur.rpc.setDebugOptions(debugOptions);

    const connect = promisify(augur.connect);
    await connect({ ethereumNode: { http: network.http } });

    const auth = getPrivateKeyFromString(network.privateKey)
    switch (command) {
      case "deploy": {
        await ContractDeployer.deployToNetwork(network, deployerConfiguration);
        break;
      }

      case "rep-faucet": {
        await repFaucet(augur, auth);
        break;
      }

      case "create-markets": {
        await repFaucet(augur, auth);
        await createMarkets(augur, auth);
        break;
      }

      case "create-orders": {
        await createOrders(augur, auth);
        break;
      }

      case "deploy-with-data": {
        await ContractDeploter.deployNetwork(network, deployerConfiguration);
        await repFaucet(augur, auth);
        await createMarkets(augur, auth);
        //await createOrders(augur, auth);
        break;
      }

    }
  }
}

if (require.main === module) {
  const command = process.argv[2];
  const networks = process.argv.slice(3);

  if (["deploy", "rep-faucet", "create-markets", "create-orders"].indexOf(command) == -1 ) {
    console.log("Invalid Command "+ command + ", first argument must be create-markets or create-orders")
    process.exit(1);
  }

  runCannedData(command, networks).then(() => {
    console.log("Success!");
    process.exit();
  }).catch((error) => {
    console.log("Failure!\n", error.message);
    if (error.stack && debugOptions.cannedMarkets) {
      console.log("-------- BACKTRACE ------");
      console.log(error.stack);
    }
    process.exit(1);
  });
}

