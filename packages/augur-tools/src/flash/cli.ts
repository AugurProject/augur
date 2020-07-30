import { buildConfig } from '@augurproject/artifacts';

import {
  mergeConfig,
  RecursivePartial,
  SDKConfiguration,
  validConfigOrDie,
} from '@augurproject/utils';
import program from 'commander';

import ethereumKeyfileRecognizer from 'ethereum-keyfile-recognizer';
import { ethers } from 'ethers';
import { computeAddress } from 'ethers/utils';
import * as fs from 'fs';
import * as readlineSync from 'readline-sync';
import { Account, ACCOUNTS } from '../constants';
import { FlashSession } from './flash';
import { addGanacheScripts } from './ganache-scripts';
import { addScripts } from './scripts';

import { addWarpSyncScripts } from './warp-sync';

async function processAccounts(flash: FlashSession, args: any) {
    // Figure out which private key to use.
    if (args.key && args.keyfile) {
      console.error('ERROR: Cannot specify both --key and --keyfile');
      process.exit(1);
    } else if (args.key) {
      flash.accounts = [ accountFromPrivateKey(args.key) ];
    } else if (args.keyfile) {
      let key = await fs.readFileSync(args.keyfile).toString();

      try {
        if (ethereumKeyfileRecognizer(JSON.parse(key))) {
          const password = readlineSync.question(
            'Keystore file found! Please enter passphrase: ', {
              hideEchoBack: true // The typed text on screen is hidden by `*` (default).
            });

          const wallet = await ethers.Wallet.fromEncryptedJson(key, password);
          key = wallet.privateKey;
        }
      } catch(e) {
        // If we have a JSON parse error, we continue.
        if(!(e instanceof  SyntaxError)) {
          console.error(e);
          process.exit(1);
        }
      }

      flash.accounts = [ accountFromPrivateKey(key) ];
    } else if (process.env.ETHEREUM_PRIVATE_KEY) {
      flash.accounts = [ accountFromPrivateKey(process.env.ETHEREUM_PRIVATE_KEY) ];
    } else {
      flash.accounts = ACCOUNTS;
    }

}
async function run() {
  const flash = new FlashSession([]);

  addScripts(flash);
  addGanacheScripts(flash);
  addWarpSyncScripts(flash);

  program
    .name('flash')
    .storeOptionsAsProperties(false)
    .passCommandToAction(false)
    .option('--key <key>', 'Private key to use, Overrides ETHEREUM_PRIVATE_KEY environment variable, if set.')
    .option('--keyfile <keyfile>', 'File containing private key to use. Overrides ETHEREUM_PRIVATE_KEY environment variable, if set.')
    .option('--network <network>', `Name of network to run on. Use "none" for commands that don't use a network. Environmental variable "ETHEREUM_PRIVATE_KEY" will take precedence if set.`, 'local')
    .option('--skip-approval <skipApproval>', 'Do not approve', 'false')
    .option('--config <config>', 'JSON of configuration')
    .option('--configFile <configFile>', 'Path to configuration file');

  const scriptNames = Object.keys(flash.scripts) || [];
  for (const name of scriptNames) {
    const script = flash.scripts[name];
    const subcommand = program.command(script.name).description(script.description);

    for (const opt of script.options || []) {
      const args = [ `--${opt.name} ${opt.flag ? '' : `<${opt.name}>`}`];
      if (opt.abbr) args.unshift(`-${opt.abbr}`);
      opt.required
        ? subcommand.requiredOption(args.join(', '), opt.description)
        : subcommand.option(args.join(', '), opt.description)
    }
    subcommand.action(async (args) => {
      try {
        const opts = {...program.opts(), ...args};
        await processAccounts(flash, opts);

        if(process.env.ETHEREUM_NETWORK) {
          flash.network = process.env.ETHEREUM_NETWORK;
        } else {
          flash.network = opts.network;
        }

        let specified: RecursivePartial<SDKConfiguration> = {
          flash: {
            skipApproval: Boolean(opts.skipApproval?.toLowerCase() === 'true'),
          }
        };
        if (opts.configFile) {
          specified = mergeConfig(specified, JSON.parse(fs.readFileSync(opts.configFile).toString()));
        }
        if (opts.config) {
          specified = mergeConfig(specified, JSON.parse(opts.config));
        }
        flash.config = validConfigOrDie(
          buildConfig(
            flash.network,
            specified,
          )
        );

        if (!script.ignoreNetwork && opts.network !== 'none') {
          flash.provider = flash.makeProvider(flash.config);
        }
        await flash.call(script.name, opts);
      } catch (e) {
        console.error(e);
        process.exit(1); // Needed to prevent hanging
      } finally {
        process.exit(0); // Needed to prevent hanging
      }
    });
  }

  if (process.argv.length < 3) { // no subcommand
    program.help();
  } else if (!intersects(scriptNames, process.argv)) { // no valid subcommand given
    program.help();
  } else {
    await program.parseAsync(process.argv);
  }
}

function accountFromPrivateKey(key: string): Account {
  key = cleanKey(key);
  return {
    privateKey: key,
    address: computeAddress(key),
    initialBalance: 0, // not used here; only for ganache premining
  }
}

function cleanKey(key: string): string {
  if (key.slice(0, 2) !== '0x') {
    key = `0x${key}`;
  }
  if (key[key.length - 1] === '\n') {
    key = key.slice(0, key.length - 1)
  }
  return key;
}

function intersects<T>(arrayA: T[], arrayB: T[]): boolean {
  for (const element of arrayA) {
    if (arrayB.indexOf(element) !== -1) return true;
  }
  return false;
}

if (require.main === module) {
  run().catch(console.log);
}
