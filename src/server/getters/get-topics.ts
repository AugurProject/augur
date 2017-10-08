import * as Knex from "knex";
import { Address } from "../../types";

interface TopicsRow {
  topic: string,
  popularity: number
}

type TopicsInfo = TopicsRow[];

export function getTopics(db: Knex, universe: Address, callback: (err?: Error|null, result?: TopicsInfo) => void): void {
  db.raw(`SELECT topic, popularity FROM topics WHERE universe = ? ORDER BY popularity DESC`, [universe]).asCallback((err?: Error|null, topicsInfo?: TopicsInfo): void => {
    if (err) return callback(err);
    if (!topicsInfo || !topicsInfo.length) return callback(null);
    callback(null, topicsInfo);
  });
}
