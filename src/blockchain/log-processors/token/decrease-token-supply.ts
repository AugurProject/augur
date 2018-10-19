import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address} from "../../../types";

interface SupplyResult {
  supply: BigNumber;
}

export async function decreaseTokenSupply(db: Knex, augur: Augur, token: Address, amount: BigNumber) {
  const oldSupply: SupplyResult|null = await db.first("supply").from("token_supply").where({ token });
  if (amount.isZero()) return;
  if (oldSupply == null) throw new Error(`Could not find supply for token decrease (token: ${token})`);
  const supply = oldSupply.supply.minus(amount);
  return db.update({ supply: supply.toString() }).into("token_supply").where({ token });
}
