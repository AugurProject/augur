import { FlashSession } from "./flash";
import Vorpal from "vorpal";
import { addScripts } from "./scripts";
import { Account, ACCOUNTS } from "../constants";
import { ArgumentParser } from "argparse";
import { NetworkConfiguration, NETWORKS } from "@augurproject/core";
import { Addresses } from "@augurproject/artifacts";
import { providers } from "ethers";
import { computeAddress } from "ethers/utils";
import { EthersProvider } from "@augurproject/ethersjs-provider";

interface Args {
  mode: "interactive"|"run";
  command?: string;
  network?: NETWORKS | "none";
  [commandArgument: string]: string;
}

function parse(flash: FlashSession): Args {
  const parser = new ArgumentParser({
    version: "1.0.0",
    description: "Interact with Augur contracts.",
  });

  const mode = parser.addSubparsers({
    dest: "mode",
  });

  mode.addParser("interactive");

  const commandMeta = mode.addParser("run");
  commandMeta.addArgument(
    [ '-n', '--network' ],
    {
      help: `Name of network to run on. Use "none" for commands that don't use a network.`,
      defaultValue: "environment", // local node
    }
  );

  const commands = commandMeta.addSubparsers({ dest: "command" });

  for (const name of Object.keys(flash.scripts) || []) {
    const script = flash.scripts[name];
    const command = commands.addParser(script.name, { description: script.description });
    for (const opt of script.options || []) {
      command.addArgument(
        [ `--${opt.name}`],
        {
          help: opt.description || "",
          required: opt.required || false,
          action: opt.flag ? "storeTrue" : "store",
        });
    }

  }

  return parser.parseArgs();
}

function makeVorpalCLI(flash: FlashSession): Vorpal {
  const vorpal = new Vorpal();

  for (const script of Object.values(flash.scripts)) {
    let v: Vorpal|Vorpal.Command = vorpal;
    v = v.command(script.name, script.description || "");

    for (const option of script.options || []) {
      // Vorpal interprets options as boolean (flag) or string,
      // depending on the structure of its first argument.
      //   boolean: --foo
      //   string: --foo <bar>
      const flag = option.flag || false;
      v = v.option(`--${option.name}${flag ? "" : ` <arg>`}`, option.description);
    }

    v = v.action(async function(this: Vorpal.CommandInstance, args: Vorpal.Args): Promise<void> {
      await flash.call(script.name, args.options).catch(console.error);
    });
  }

  vorpal.delimiter("augur$");

  return vorpal;
}

function makeProvider(config: NetworkConfiguration): EthersProvider {
  const provider = new providers.JsonRpcProvider(config.http);
  return new EthersProvider(provider, 5, 0, 40);
}

async function getNetworkId(provider: EthersProvider): Promise<string> {
  return (await provider.getNetwork()).chainId.toString();
}

if (require.main === module) {
  let accounts: Account[];
  if (process.env.ETHEREUM_PRIVATE_KEY) {
    let key = process.env.ETHEREUM_PRIVATE_KEY;
    if (key.slice(0, 2) !== "0x") {
      key = `0x${key}`;
    }

    accounts = [
      {
        secretKey: key,
        publicKey: computeAddress(key),
        balance: 0,
      },
    ];
  } else {
    accounts = ACCOUNTS;
  }

  const flash = new FlashSession(accounts);

  addScripts(flash);

  const args = parse(flash);

  if (args.mode === "interactive") {
    const vorpal = makeVorpalCLI(flash);
    flash.setLogger(vorpal.log.bind(vorpal));
    vorpal.show();
  } else {
    if (args.network === "none") {
      flash.call(args.command, args).catch(console.error);
    } else {
      const networkConfiguration = NetworkConfiguration.create(args.network);
      flash.provider = makeProvider(networkConfiguration);
      getNetworkId(flash.provider).then((networkId) => {
        flash.contractAddresses = Addresses[networkId];
        return flash.call(args.command, args);
      }).catch(console.error);
    }
  }
}
