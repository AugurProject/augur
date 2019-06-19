import { FlashSession } from "./flash";
import Vorpal from "vorpal";
import { addScripts } from "./scripts";

const _100_ETH = 100000000000000000000;

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
      v = v.option(`--${option.name}${option.flag ? "" : ` <arg>`}`, option.description);
    }

    v = v.action(async function(this: Vorpal.CommandInstance, args: Vorpal.Args) {
      return flash.call(script.name, args.options);
    });
  }

  vorpal.delimiter("augur$");

  return vorpal;
}

if (require.main === module) {
  const flash = new FlashSession([
      {
        secretKey: "0xa429eeb001c683cf3d8faf4b26d82dbf973fb45b04daad26e1363efd2fd43913",
        publicKey: "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
        balance: _100_ETH,
      },
      {
        secretKey: "0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a",
        publicKey: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb",
        balance: _100_ETH,
      }],
    `${__dirname}/seed.json`);
  addScripts(flash);

  const vorpal = makeVorpalCLI(flash);
  flash.log = vorpal.log.bind(vorpal);
  vorpal.show();
}
