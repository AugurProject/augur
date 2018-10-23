import { selectBucketedPriceTimeSeries } from "modules/markets/selectors/select-bucketed-price-time-series";

describe(`modules/markets/selectors/select-market-outcome-trading-indicator.js`, () => {
  const market1Outcomes = [
    {
      id: 0,
      priceTimeSeries: []
    },
    {
      id: 1,
      priceTimeSeries: []
    }
  ];
  const market2Outcomes = [
    {
      id: 0,
      priceTimeSeries: [
        {
          price: 0.1,
          timestamp: 1533312111000
        }
      ]
    },
    {
      id: 1,
      priceTimeSeries: [
        {
          price: 0.1,
          timestamp: 1533312111000
        }
      ]
    }
  ];

  const market3Outcomes = [
    {
      id: 0,
      priceTimeSeries: [
        {
          price: 0.1,
          timestamp: 1533312111000
        },
        {
          price: 0.2,
          timestamp: 1533315711000
        },
        {
          price: 0.3,
          timestamp: 1533319310000
        },
        {
          price: 0.6,
          timestamp: 1533319310002
        },
        {
          price: 0.5,
          timestamp: 1533319310003
        },
        {
          price: 0.4,
          timestamp: 1533319310004
        }
      ]
    },
    {
      id: 2,
      priceTimeSeries: [
        {
          price: 0.1,
          timestamp: 1533312111000
        },
        {
          price: 0.2,
          timestamp: 1533315711000
        },
        {
          price: 0.3,
          timestamp: 1533319310000
        },
        {
          price: 0.6,
          timestamp: 1533319310002
        },
        {
          price: 0.5,
          timestamp: 1533319310003
        },
        {
          price: 0.4,
          timestamp: 1533319310004
        }
      ]
    }
  ];

  test(`no trades in categorical market`, () => {
    const creationTimestamp = 1533312112000;
    const currentTimestamp = 1533312312000;
    const actual = selectBucketedPriceTimeSeries(
      creationTimestamp,
      currentTimestamp,
      market1Outcomes
    );
    const expected = {
      priceTimeSeries: { 0: [], 1: [] },
      timeBuckets: [1533312112000, 1533312312000]
    };
    expect(actual).toEqual(expected);
  });

  test(`bucketed trades in categorical market`, () => {
    const creationTimestamp = 1533312111000;
    const currentTimestamp = 1533322111000;
    const actual = selectBucketedPriceTimeSeries(
      creationTimestamp,
      currentTimestamp,
      market2Outcomes
    );
    const expected = {
      timeBuckets: [1533312111000, 1533315711000, 1533319311000, 1533322111000],
      priceTimeSeries: {
        0: [
          {
            price: 0.1,
            timestamp: 1533312111000
          }
        ],
        1: [
          {
            price: 0.1,
            timestamp: 1533312111000
          }
        ]
      }
    };
    expect(actual).toEqual(expected);
  });

  test(`bucketed trades in categorical market`, () => {
    const creationTimestamp = 1533312111000;
    const currentTimestamp = 1533322111000;
    const actual = selectBucketedPriceTimeSeries(
      creationTimestamp,
      currentTimestamp,
      market3Outcomes
    );
    const expected = {
      timeBuckets: [1533312111000, 1533315711000, 1533319311000, 1533322111000],
      priceTimeSeries: {
        0: [
          {
            price: 0.2,
            timestamp: 1533315711000
          },
          {
            price: 0.4,
            timestamp: 1533319310004
          }
        ],
        2: [
          {
            price: 0.2,
            timestamp: 1533315711000
          },
          {
            price: 0.4,
            timestamp: 1533319310004
          }
        ]
      }
    };
    expect(actual).toEqual(expected);
  });
});
