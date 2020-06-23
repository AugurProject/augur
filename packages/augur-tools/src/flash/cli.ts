import { FlashSession } from './flash';
import program from 'commander';
import { addScripts } from './scripts';
import { addGanacheScripts } from './ganache-scripts';
import { Account, ACCOUNTS } from '../constants';
import { computeAddress } from 'ethers/utils';
import * as fs from 'fs';
import {
  buildConfig,
} from '@augurproject/artifacts';

import {
  validConfigOrDie,
  SDKConfiguration,
  mergeConfig,
  RecursivePartial,
} from '@augurproject/utils';

import { addWarpSyncScripts } from './warp-sync';

async function processAccounts(flash: FlashSession, args: any) {
    // Figure out which private key to use.
    if (args.key && args.keyfile) {
      console.error('ERROR: Cannot specify both --key and --keyfile');
      process.exit(1);
    } else if (args.key) {
      flash.accounts = [ accountFromPrivateKey(args.key) ];
    } else if (args.keyfile) {
      const key = await fs.readFileSync(args.keyfile).toString();
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
    .option('--network <network>', `Name of network to run on. Use "none" for commands that don't use a network.`, 'local')
    .option('--use-gsn <useGsn>', 'Use GSN instead of making contract calls directly', 'false')
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
        ? subcommand.requiredOption(args.join(', '))
        : subcommand.option(args.join(', ')).description(opt.description || '')
    }
    subcommand.action(async (args) => {
      try {
        const opts = {...program.opts(), ...args};
        await processAccounts(flash, opts);
        flash.network = opts.network;

        let specified: RecursivePartial<SDKConfiguration> = {
          flash: {
            useGSN: Boolean(opts.useGsn?.toLowerCase() === 'true'),
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
