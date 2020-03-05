import { FlashSession } from './flash';
import Vorpal from 'vorpal';
import program from 'commander';
import { addScripts } from './scripts';
import { addGanacheScripts } from './ganache-scripts';
import { Account, ACCOUNTS } from '../constants';
import { computeAddress } from 'ethers/utils';
import * as fs from 'fs';
import { buildConfig, validConfigOrDie, SDKConfiguration } from '@augurproject/artifacts';

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

  program
    .name('flash')
    .storeOptionsAsProperties(false)
    .passCommandToAction(false)
    .option('-k, --key <key>', 'Private key to use, Overrides ETHEREUM_PRIVATE_KEY environment variable, if set.')
    .option('--keyfile <keyfile>', 'File containing private key to use. Overrides ETHEREUM_PRIVATE_KEY environment variable, if set.')
    .option('-n, --network <network>', `Name of network to run on. Use "none" for commands that don't use a network.`, 'local')
    .option('-c, --config <config>', 'JSON of configuration')
    .option('-f, --configFile <configFile>', 'Path configuration file');

  program
    .command('interactive')
    .description('Run flash interactively, where you can connect once and run multiple flash scripts in the same session.')
    .action(async (args) => {
      const opts = Object.assign({}, program.opts(), args);
      await processAccounts(flash, opts);
      const vorpal = makeVorpalCLI(flash);
      flash.log = vorpal.log.bind(vorpal);
      vorpal.show();
    });

  for (const name of Object.keys(flash.scripts) || []) {
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

        let specified: Partial<SDKConfiguration> = {};
        if (opts.configFile) {
          specified = JSON.parse(fs.readFileSync(opts.configFile).toString());
        }
        if (opts.config) {
          specified = JSON.parse(opts.config);
        }
        flash.config = validConfigOrDie(buildConfig(flash.network, specified));

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

  if (process.argv.length === 2) {
    program.help();
  } else {
    await program.parseAsync(process.argv);
  }
}

function makeVorpalCLI(flash: FlashSession): Vorpal {
  const vorpal = new Vorpal();

  for (const script of Object.values(flash.scripts)) {
    let v: Vorpal|Vorpal.Command = vorpal;
    v = v.command(script.name, script.description || '');

    const types = { string: [], boolean: [] };
    for (const option of script.options || []) {
      // Vorpal interprets options as boolean (flag) or string,
      // depending on the structure of its first argument.
      //   boolean: --foo
      //   string: --foo <bar>
      const flag = option.flag || false;
      const abbr = option.abbr ? `-${option.abbr},` : '';
      const optionValue = `${abbr}--${option.name}${flag ? '' : ' <arg>'}`;
      v = v.option(optionValue, option.description);
      if (flag) {
        types.boolean.push(option.name);
        if (option.abbr) types.boolean.push(option.abbr);
      } else {
        types.string.push(option.name);
        if (option.abbr) types.string.push(option.abbr);
      }
    }
    v.types(types);
    v = v.action(async function(this: Vorpal.CommandInstance, args: Vorpal.Args): Promise<void> {
      await flash.call(script.name, args.options).catch(console.error);
    });
  }

  vorpal.delimiter('augur$');

  return vorpal;
}

function accountFromPrivateKey(key: string): Account {
  key = cleanKey(key);
  return {
    secretKey: key,
    publicKey: computeAddress(key),
    balance: 0, // not used here; only for ganache premining
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

if (require.main === module) {
  run().catch(console.log);
}
