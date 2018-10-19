import sinon from "sinon";
import marketDisputeOutcomes, {
  __RewireAPI__,
  selectMarketDisputeOutcomes
} from "modules/reports/selectors/select-market-dispute-outcomes";

describe(`modules/reports/selectors/select-market-dispute-outcomes.js`, () => {
  const test = t => test(t.description, done => t.assertions(done));

  describe("default method", () => {
    test({
      description:
        "should call `selectMarketDisputeOutcomes` from the default function",
      assertions: done => {
        const stubbedSelectmarketDisputeOutcomes = sinon.stub();
        __RewireAPI__.__Rewire__(
          "selectMarketDisputeOutcomes",
          stubbedSelectmarketDisputeOutcomes
        );

        marketDisputeOutcomes();

        expect(stubbedSelectmarketDisputeOutcomes.calledOnce).toBe(true);

        __RewireAPI__.__ResetDependency__("selectMarketDisputeOutcomes");

        done();
      }
    });
  });

  describe("selectMarketDisputeOutcomes", () => {
    test({
      description: `selectMarketDisputeOutcomes, should return an empty object`,
      assertions: done => {
        const actual = selectMarketDisputeOutcomes.resultFunc([]);

        const expected = {};

        expect(actual).toEqual(expected);

        done();
      }
    });

    describe("only disputing markets", () => {
      test({
        description: `When no dispute info, should return a mapping of market id to a list of outcomes`,
        assertions: done => {
          const marketData = [
            { id: "market1", reportingState: "PRE_REPORTING" },
            {
              id: "market2",
              reportingState: "AWAITING_NEXT_WINDOW",
              disputeInfo: {}
            },
            {
              id: "market3",
              reportingState: "CROWDSOURCING_DISPUTE",
              disputeInfo: {}
            }
          ];
          const universe = {
            forkThreshold: 1000000
          };
          const stubbedFillDisputeOutcomeProgress = sinon.stub().returns([]);
          const stubbedSelectDisputeOutcomes = sinon.stub().returns([]);

          __RewireAPI__.__Rewire__(
            "fillDisputeOutcomeProgress",
            stubbedFillDisputeOutcomeProgress
          );
          __RewireAPI__.__Rewire__(
            "selectDisputeOutcomes",
            stubbedSelectDisputeOutcomes
          );

          const actual = selectMarketDisputeOutcomes.resultFunc(
            marketData,
            universe
          );

          const expected = {
            market2: [],
            market3: []
          };
          expect(actual).toEqual(expected);

          __RewireAPI__.__ResetDependency__("selectDisputeOutcomes");
          __RewireAPI__.__ResetDependency__("fillDisputeOutcomeProgress");

          done();
        }
      });
    });
  });
});
