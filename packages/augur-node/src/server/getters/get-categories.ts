import * as t from "io-ts";
import Knex from "knex";
import { Augur, BigNumber, CategoriesRow, ReportingState, TagAggregation, UICategory } from "../../types";

export const CategoriesParams = t.type({
  universe: t.string,
});

interface MarketsTagRow {
  category: string;
  openInterest: BigNumber;
  reportingState: ReportingState;
  tag1: string;
  tag2: string;
}

export async function getCategoriesRows(db: Knex, universe: string): Promise<Array<CategoriesRow<BigNumber>>> {
  return db.select(["category", "nonFinalizedOpenInterest", "openInterest", "universe"]).from("categories").where({ universe });
}

export async function getMarketsTagRows(db: Knex, universe: string): Promise<Array<MarketsTagRow>> {
  return db.select([
    "markets.category as category",
    "markets.openInterest as openInterest",
    "markets.tag1 as tag1",
    "markets.tag2 as tag2",
    "market_state.reportingState as reportingState",
  ]).from("markets")
    .leftJoin("market_state", "markets.marketStateId", "market_state.marketStateId")
    .where({ universe });
}

function buildUICategories(categoriesRows: Array<CategoriesRow<BigNumber>>, marketsTagRows: Array<MarketsTagRow>): Array<UICategory<string>> {
  function upsertTagAggregation(r: MarketsTagRow, tagAggregationByTagName: Map<string, TagAggregation<BigNumber>>, tagProp: "tag1" | "tag2"): void {
    if (!r[tagProp]) {
      return;
    }
    let tagAggregation: TagAggregation<BigNumber> | undefined = tagAggregationByTagName.get(r[tagProp]);
    if (tagAggregation === undefined) {
      tagAggregation = {
        nonFinalizedOpenInterest: new BigNumber("0"),
        openInterest: new BigNumber("0"),
        tagName: r[tagProp],
        numberOfMarketsWithThisTag: 0,
      };
      tagAggregationByTagName.set(r[tagProp], tagAggregation);
    }
    if (r.reportingState !== ReportingState.FINALIZED) {
      tagAggregation.nonFinalizedOpenInterest = tagAggregation.nonFinalizedOpenInterest.plus(r.openInterest);
    }
    tagAggregation.openInterest = tagAggregation.openInterest.plus(r.openInterest);
    tagAggregation.numberOfMarketsWithThisTag += 1;
  }

  const tagAggregationByTagNameByCategoryName: Map<string, Map<string, TagAggregation<BigNumber>>> = new Map(); // there'll be a parent-child relationship where TagAggregation is the child and category is the parent. Tags aren't aggregated across categories. If two markets share a tag, but have different categories, that tag will build into two different TagAggregations, one for each category.

  marketsTagRows.forEach((r: MarketsTagRow) => {
    let tagAggregationByTagName: Map<string, TagAggregation<BigNumber>> | undefined = tagAggregationByTagNameByCategoryName.get(r.category);
    if (tagAggregationByTagName === undefined) {
      tagAggregationByTagName = new Map();
      tagAggregationByTagNameByCategoryName.set(r.category, tagAggregationByTagName);
    }
    upsertTagAggregation(r, tagAggregationByTagName, "tag1");
    upsertTagAggregation(r, tagAggregationByTagName, "tag2");
  });

  return categoriesRows.map((r: CategoriesRow<BigNumber>) => {
    let tags: Array<TagAggregation<string>> = [];
    const tagAggregationByTagName = tagAggregationByTagNameByCategoryName.get(r.category);
    if (tagAggregationByTagName !== undefined) {
      tags = Array.from(tagAggregationByTagName.values()).map((taBigNumber: TagAggregation<BigNumber>) => {
        // convert from TagAggregation<BigNumber> to TagAggregation<string>, because
        // BigNumber is used for arithmetic when building the TagAggregation, but the
        // UI receives numbers as strings to avoid precision loss during serialization
        return {
          nonFinalizedOpenInterest: taBigNumber.nonFinalizedOpenInterest.toString(),
          openInterest: taBigNumber.openInterest.toString(),
          tagName: taBigNumber.tagName,
          numberOfMarketsWithThisTag: taBigNumber.numberOfMarketsWithThisTag,
        };
      });
    }
    return {
      nonFinalizedOpenInterest: r.nonFinalizedOpenInterest.toString(),
      openInterest: r.openInterest.toString(),
      categoryName: r.category,
      tags,
    };
  });
}

export async function getCategories(db: Knex, augur: Augur, params: t.TypeOf<typeof CategoriesParams>): Promise<Array<UICategory<string>>> {
  const universeInfo = await db.first(["universe"]).from("universes").where({ universe: params.universe });
  if (universeInfo === undefined) throw new Error(`Universe ${params.universe} does not exist`);

  const p1: Promise<Array<CategoriesRow<BigNumber>>> = getCategoriesRows(db, params.universe);
  const p2: Promise<Array<MarketsTagRow>> = getMarketsTagRows(db, params.universe);
  const cs: Array<CategoriesRow<BigNumber>> = await p1;
  const ts: Array<MarketsTagRow> = await p2;
  return buildUICategories(cs, ts);
}
