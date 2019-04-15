import { DB } from "../db/DB";
import { Getter } from "./Router";
import { SortLimit } from "./types";

import * as t from "io-ts";

const GetMarketsParamsSpecific = t.intersection([t.type({
  universe: t.string,
}), t.partial({
  creator: t.string,
  category: t.string,
  search: t.string,
  reportingState: t.string,
  disputeWindow: t.string,
  designatedReporter: t.string,
  maxFee: t.number,
  hasOrders: t.boolean,
})]);

export class Markets {
  public static GetMarketsParams = t.intersection([GetMarketsParamsSpecific, SortLimit]);
  public static MarketsInfoParams = t.type({ marketIds: t.array(t.string) });

  @Getter("GetMarketsParams")
  public static async getMarkets<TBigNumber>(db: DB<TBigNumber>, params: t.TypeOf<typeof Markets.GetMarketsParams>): Promise<void> {
    // TODO
  }

  @Getter("MarketsInfoParams")
  public static async getMarketsInfo<TBigNumber>(db: DB<TBigNumber>, params: t.TypeOf<typeof Markets.MarketsInfoParams>): Promise<void> {
    // TODO
  }
}
