import { MarketsRow, SearchRow } from "../types";

export function contentSearchBuilder(marketsDataToInsert: MarketsRow<string|number>): SearchRow {
  if (marketsDataToInsert === null) throw new Error("market insert row object can't be null");

  const filteredTags = [
    marketsDataToInsert.tag1 !== null ? marketsDataToInsert.tag1 : "",
    marketsDataToInsert.tag2 !== null ? marketsDataToInsert.tag2 : "",
  ].join(" ").trim();

  const {
    marketId,
    category,
    shortDescription,
    longDescription,
    resolutionSource,
    scalarDenomination,
  } = marketsDataToInsert;

  return {
    marketId,
    category,
    tags: filteredTags.length > 0 ? filteredTags : "",
    shortDescription: shortDescription || "",
    longDescription: longDescription || "",
    resolutionSource: resolutionSource || "",
    scalarDenomination: scalarDenomination || "",
  };
}
