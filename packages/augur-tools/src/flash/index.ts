import { seedFileIsOutOfDate, createSeedFile } from "./generate-ganache-seed";

import Vorpal from "vorpal";
const vorpal = new Vorpal();

vorpal
  .command("ganache", "Start a Ganache node.")
  .option("--internal", "Prevent node from being available to browsers.")
  .action(async function(this: Vorpal.CommandInstance, args: Vorpal.Args) {
    this.log("rabbit", args.options.internal);
  });

vorpal
  .command("create-seed-file", "Creates Ganache seed file from compiled Augur contracts.")
  .action(async function(this: Vorpal.CommandInstance, args: Vorpal.Args) {
    const seedFilepath = `${__dirname}/seed.json`;
    this.log(seedFilepath);
    if (await seedFileIsOutOfDate(seedFilepath)) {
      this.log("Seed file out of date. Creating/updating...");
      await createSeedFile(seedFilepath);
    } else {
      this.log("Seed file is up-to-date. No need to update.");
    }
  });

vorpal
  .delimiter("augur$")
  .show();
