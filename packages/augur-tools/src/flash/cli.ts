import { FlashSession } from "./flash";
import Vorpal from "vorpal";
import { addScripts } from "./scripts";
import { ACCOUNTS } from "./constants";


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

if (require.main === module) {
  const flash = new FlashSession(
    ACCOUNTS,
    `${__dirname}/seed.json`)
  ;
  addScripts(flash);

  const vorpal = makeVorpalCLI(flash);
  flash.log = vorpal.log.bind(vorpal);
  vorpal.show();
}
