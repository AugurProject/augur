import axios from 'axios';
import { Filter, Log } from '@augurproject/types';
import * as _ from 'lodash';

const eventFields = require('./EventFields.json');

const GENERIC_LOG_FIELDS = ["name", "blockNumber", "logIndex"];

export default class GraphQLLogProvider {
  subgraphUrl: string;

  constructor(
    subgraphUrl: string,
  ) {
    this.subgraphUrl = subgraphUrl;
  }

  async getLogs(filter: Filter): Promise<Log[]> {
    const query = this.buildQuery(filter.fromBlock, filter.toBlock);
    const result = await axios.post(this.subgraphUrl, { query });
    return _.flatten(_.values(result.data.data));
  }

  buildQuery(fromBlock: string | number, toBlock: string | number): string {
    let eventQueries = "";
    for (const eventName in eventFields) {
      const fields = GENERIC_LOG_FIELDS.concat(eventFields[eventName]);
      eventQueries += `${eventName}(where: { block_gte: ${fromBlock}, block_lte: ${toBlock} }) {${fields.join(",")}}`;
    }
    return `
    {
      ${eventQueries}
    }
    `;
  }
}