import { Augur, Contract } from "../../../generated/schema";

export function getOrCreateAugur(): Augur {
  let augur = Augur.load("AUGUR");

  if (augur == null) {
    augur = new Augur("AUGUR");

    augur.save();
  }

  return augur as Augur;
}

export function getOrCreateContract(id: String): Contract {
  let contract = Contract.load(id);

  if (contract == null) {
    contract = new Contract(id);
  }

  return contract as Contract;
}
