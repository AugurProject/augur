import { FlashSession } from './flash';
import Vorpal from 'vorpal';
import { addScripts } from './scripts';
import { addGanacheScripts } from './ganache-scripts';
import { Account, ACCOUNTS } from '../constants';
import { ArgumentParser } from 'argparse';
import { NetworkConfiguration, NETWORKS } from '@augurproject/core';
import { Addresses } from '@augurproject/artifacts';
import { computeAddress } from 'ethers/utils';
import * as fs from 'fs';

interface Args {
  command?: string;
  network?: NETWORKS | 'none';
  key?: string;
  keyfile?: string;
  [commandArgument: string]: string;
}

function parse(flash: FlashSession): Args {
  const parser = new ArgumentParser({
    version: '1.0.0',
    description: 'Interact with Augur contracts.',
  });

  parser.addArgument(
    [ '-n', '--network' ],
    {
      help: `Name of network to run on. Use "none" for commands that don't use a network.`,
      defaultValue: 'environment', // local node
    }
  );
  parser.addArgument(
    [ '-k', '--key' ],
    {
      help: 'Private key to use. Overrides envvar, if set.',
    }
  );
  parser.addArgument(
    [ '--keyfile' ],
    {
      help: 'File containing private key to use. Overrides envvar, if set.',
    }
  );

  const commands = parser.addSubparsers({ dest: 'command' });

  const interactive = commands.addParser(
    'interactive',
    {
      description: 'Run flash interactively',
    },
  );
  // interactive.addArgument(
  //   ['-c', '--connect'],
  //   {
  //     help: 'Auto-connect to the network specified with --network (defaults to local node)',
  //     action: 'storeTrue',
  //   }
  // );

  for (const name of Object.keys(flash.scripts) || []) {
    const script = flash.scripts[name];
    const command = commands.addParser(script.name, { description: script.description });
    for (const opt of script.options || []) {
      const args = [ `--${opt.name}`];
      if (opt.abbr) args.push(`-${opt.abbr}`);
      command.addArgument(
        args,
        {
          help: opt.description || '',
          required: opt.required || false,
          action: opt.flag ? 'storeTrue' : 'store',
        });
    }

  }

  return parser.parseArgs();
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
  (async () => {
    const flash = new FlashSession([]);

    addScripts(flash);
    addGanacheScripts(flash);

    const args = parse(flash);

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

    if (args.command === 'interactive') {
      const vorpal = makeVorpalCLI(flash);
      flash.log = vorpal.log.bind(vorpal);
      vorpal.show();
    } else if (args.network === 'none') {
      await flash.call(args.command, args).catch(console.error);
    } else {
      try {
        const network = args.network as NETWORKS;
        flash.network = NetworkConfiguration.create(network, true, flash.accounts[0].secretKey);
        flash.provider = flash.makeProvider(flash.network);
        const networkId = await flash.getNetworkId(flash.provider);
        flash.contractAddresses = Addresses[networkId];
        await flash.call(args.command, args);
      } catch(e){
        console.error(e);
        process.exit(1); // Needed to prevent hanging
      } finally {
        process.exit(0); // Needed to prevent hanging

      }
    }
  })();
}
