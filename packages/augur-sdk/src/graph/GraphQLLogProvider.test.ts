import GraphQLLogProvider from './GraphQLLogProvider';

describe('GraphQLLogProvider', () => {
  test('should pull logs', async () => {
    const graphQLLogProvider = new GraphQLLogProvider("https://api.thegraph.com/subgraphs/name/protofire/augur-v2-kovan");
    const result = await graphQLLogProvider.getLogs({
        fromBlock: 18109647,
        toBlock: 18129919, 
    });

    console.log(JSON.stringify(result));
  });
});
