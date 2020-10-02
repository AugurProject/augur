import { Cash } from "../../../generated/schema";

export function getOrCreateCash(
  id: string,
): Cash {
  let cash = Cash.load(id);

  if (cash == null) {
    cash = new Cash(id);
    cash.save();
  }

  return cash as Cash;
}
