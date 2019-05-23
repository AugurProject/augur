import { Address, Augur, BigNumber } from "../../../types";
import Knex from "knex";

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
