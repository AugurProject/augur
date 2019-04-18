import fs from "fs";
import {promisify} from 'util';

import chalk from "chalk";
import keythereum from "keythereum";
import speedomatic from "speedomatic";
import readlineSync from "readline-sync";
import { ethers } from "ethers";

const readFileAsync = promisify(fs.readFile);

interface Account {
  accountType: string;
  signer: string;
  address: string;
}

export async function getPrivateKeyFromString(privateKey:string):Promise<Account> {
  const signer = Buffer.from(speedomatic.strip0xPrefix(privateKey), "hex").toString();
  const address = keythereum.privateKeyToAddress(privateKey);
  console.log(chalk.green.dim("sender:"), chalk.green(address));
  return { accountType: "privateKey", signer, address };
}

export async function getPrivateKeyFromKeystoreFile(keystoreFilePath: string): Promise<Account> {
  return new Promise<Account>((resolve, reject) => {
    fs.readFile(keystoreFilePath, function(err:Error, keystoreJson:Buffer) {
      if (err) reject(err);
      let keystore = keystoreJson.toJSON();
      let address = speedomatic.formatEthereumAddress(keystore.address);
      console.log(chalk.green.dim("sender:"), chalk.green(address));
      keythereum.recover(process.env.ETHEREUM_PASSWORD || readlineSync.question("Password: ", { hideEchoBack: true }), keystore, function(privateKey:string) {
        if (privateKey == null || privateKey.error) {
          reject(new Error("private key decryption failed"));
        }
        resolve({ accountType: "privateKey", signer: privateKey, address: address });
      });
    });
  });
}

export async function getPrivateKey(keystoreFilePath: string) {
  const keyStore = await readFileAsync(keystoreFilePath);
  const address = ethers.utils.getJsonWalletAddress(keyStore.toString());

  if (process.env.ETHEREUM_PRIVATE_KEY != null) {
    return getPrivateKeyFromString(process.env.ETHEREUM_PRIVATE_KEY);
  } else {
    return getPrivateKeyFromKeystoreFile();
  }
}

