import { GraphQLLogProvider } from './GraphQLLogProvider';

describe('GraphQLLogProvider', () => {
  test('should pull logs', async () => {
    const graphQLLogProvider = new GraphQLLogProvider("https://api.thegraph.com/subgraphs/name/augurproject/augur-v2-base-staging");
    const result = await graphQLLogProvider.getLogs({
        fromBlock: 21700000,
        toBlock: 21800000,
    });

    console.log(JSON.stringify(result));
  });
});