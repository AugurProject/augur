import { MarketsRow, OutcomesRow } from "../types";

export function contentSearchBuilder(marketsDataToInsert: MarketsRow<string|number>): string {
  if (marketsDataToInsert === null) throw new Error("market insert row object can't be null");

  const content = [
    marketsDataToInsert.marketId,
    marketsDataToInsert.category,
    marketsDataToInsert.shortDescription !== null ? marketsDataToInsert.shortDescription : "",
    marketsDataToInsert.tag1 !== null ? marketsDataToInsert.tag1 : "",
    marketsDataToInsert.tag2 !== null ? marketsDataToInsert.tag2 : "",
    marketsDataToInsert.resolutionSource !== null ? marketsDataToInsert.resolutionSource : "",
    marketsDataToInsert.scalarDenomination != null ? marketsDataToInsert.scalarDenomination : "",
  ];

  return content.join(" ").trim();
}
