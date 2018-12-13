export default function(loginAccountMarkets) {
  describe(`loginAccountMarket's shape`, () => {
    expect(loginAccountMarkets).toBeDefined();
    expect(typeof loginAccountMarkets).toBe("object");
  });
}
