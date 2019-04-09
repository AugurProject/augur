import fs from "fs";
import chalk from "chalk";
import keythereum from "keythereum";
import speedomatic from "speedomatic";
import readlineSync from "readline-sync";
import debugOptions from "../../debug-options";

interface Account {
  accountType: string;
  signer: string;
  address: string;
}

export function getPrivateKeyFromEnv() {
  return getPrivateKeyFromString(process.env.ETHEREUM_PRIVATE_KEY);
}

export async function getPrivateKeyFromString(privateKey:string):Promise<Account> {
  const signer = Buffer.from(speedomatic.strip0xPrefix(privateKey), "hex").toString();
  const address = keythereum.privateKeyToAddress(privateKey);
  if (debugOptions.cannedMarkets) console.log(chalk.green.dim("sender:"), chalk.green(address));
  return { accountType: "privateKey", signer, address };
}



export async function getPrivateKeyFromKeystoreFile(keystoreFilePath: string): Promise<Account> {
  return new Promise<Account>((resolve, reject) => {
    fs.readFile(keystoreFilePath, function(err, keystoreJson:Buffer) {
      if (err) reject(err);
      let keystore = keystoreJson.toJSON();
      let address = speedomatic.formatEthereumAddress(keystore.address);
      if (debugOptions.cannedMarkets) console.log(chalk.green.dim("sender:"), chalk.green(address));
      keythereum.recover(process.env.ETHEREUM_PASSWORD || readlineSync.question("Password: ", { hideEchoBack: true }), keystore, function(privateKey:string) {
        if (privateKey == null || privateKey.error) {
          reject(new Error("private key decryption failed"));
        }
        resolve({ accountType: "privateKey", signer: privateKey, address: address });
      });
    });
  });
}

export async function getPrivateKey(keystoreFilePath: string, callback) {
  if (process.env.ETHEREUM_PRIVATE_KEY != null) {
    try {
      callback(null, getPrivateKeyFromEnv());
    } catch (exc) {
      callback(exc);
    }
  } else {
    getPrivateKeyFromKeystoreFile(keystoreFilePath, callback);
  }
}

