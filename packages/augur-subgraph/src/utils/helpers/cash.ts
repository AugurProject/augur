import { Address } from '@graphprotocol/graph-ts/index';
import { Cash } from "../../../generated/schema";
import { ERC20 } from '../../../generated/templates/Cash/ERC20';

export function getOrCreateCash(
  id: string,
): Cash {
  let cash = Cash.load(id);

  if (cash == null) {
    let erc20 = ERC20.bind(Address.fromString(id));
    cash = new Cash(id);
    cash.symbol = erc20.symbol();

    cash.save();
  }

  return cash as Cash;
}
