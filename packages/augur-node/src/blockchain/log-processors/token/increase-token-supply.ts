import { Address, Augur, BigNumber } from "../../../types";
import Knex from "knex";


interface SupplyResult {
  supply: BigNumber;
}

export async function increaseTokenSupply(db: Knex, augur: Augur, token: Address, amount: BigNumber) {
  const oldSupply: SupplyResult = await db.first("supply").from("token_supply").where({ token });
  if (oldSupply == null) {
    await db.insert({ token, supply: amount.toString() }).into("token_supply");
  } else {
    const supply = oldSupply.supply.plus(amount);
    await db.update({ supply: supply.toString() }).into("token_supply").where({ token });
  }
}
