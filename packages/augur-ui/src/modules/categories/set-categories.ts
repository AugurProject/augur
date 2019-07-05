export interface SortedGroup {
  value: string;
  subGroup?: Array<SortedGroup>;
  autoCompleteList?: Array<string>;
}

export const categories: Array<SortedGroup> = [
  {
    value: 'Sports',
    subGroup: [
      {
        value: 'Soccer',
        subGroup: [
          { value: 'Copa America' },
          { value: 'Africa Cup of Nations' },
          { value: 'UEFA Nations League' },
          { value: 'UEFA Champions League' },
          { value: 'English Premier League' },
          { value: 'English FA Cup' },
          { value: 'Mexican Liga BBVA Bancomer' },
          { value: 'German Bundesliga' },
          { value: 'French Ligue 1' },
          { value: 'FIFA World Cup' },
          { value: 'CONCACAF Gold Cup' },
          { value: 'UEFA' },
          { value: 'English League Championship' },
          { value: 'Major League Soccer' },
        ],
      },
      {
        value: 'Baseball',
        subGroup: [
          { value: 'MLB' },
          { value: 'College Baseball' },
          { value: 'Minor League' },
          { value: 'World Baseball Classic' },
        ],
      },
      {
        value: 'American Football',
        subGroup: [
          { value: 'NFL' },
          { value: 'NCAA' },
          { value: 'CFL' },
          { value: 'AFL' },
        ],
      },
      {
        value: 'Basketball',
        subGroup: [
          { value: 'NBA' },
          { value: 'NCAA' },
          { value: 'WNBA' },
          { value: 'Olympics' },
          { value: 'World Cup' },
        ],
      },
      {
        value: 'Hockey',
        subGroup: [
          { value: 'NHL' },
          { value: 'Olympics' },
          { value: 'International Ice Hockey Federation (IIHF)' },
        ],
      },
      {
        value: 'Golf',
        subGroup: [
          { value: 'PGA Championship' },
          { value: 'Open Championship' },
          { value: 'US Open' },
          { value: 'The Masters' },
          { value: 'British Open' },
          { value: 'FedEx Cup' },
          { value: 'PGA' },
          { value: 'LPGA' },
        ],
      },
      {
        value: 'Tennis',
        subGroup: [
          { value: 'Australian Open' },
          { value: 'French Open' },
          { value: 'Wimbledon' },
          { value: 'US Open' },
          { value: 'Mens' },
          { value: 'Womens' },
          { value: 'Doubles' },
        ],
      },
      {
        value: 'Horse Racing',
        subGroup: [
          { value: 'Kentucky Derby' },
          { value: 'Preakness' },
          { value: 'Belmont' },
          { value: 'Triple Crown' },
        ],
      },
    ],
  },
  {
    value: 'Politics',
    subGroup: [
      {
        value: 'US Elections',
        subGroup: [
          { value: 'Presidential' },
          { value: 'Primary' },
          { value: 'Republican' },
          { value: 'Democratic' },
        ],
      },
      {
        value: 'US Politics',
        subGroup: [
          { value: 'Impeachment' },
          { value: 'Supreme Court' },
          { value: 'House' },
          { value: 'Senate' },
          { value: 'Congress' },
        ],
      },
      {
        value: 'World Politics',
        subGroup: [
          { value: 'European Leader' },
          { value: 'Prime Minister' },
          { value: 'Parliament' },
          { value: 'North Korea' },
          { value: 'Russia' },
          { value: 'China' },
          { value: 'Iran' },
        ],
      },
    ],
  },
  {
    value: 'Finance',
    subGroup: [
      {
        value: 'Stocks',
        subGroup: [
          {
            value: 'APPL',
          },
          {
            value: 'BA',
          },
          {
            value: 'TSLA',
          },
          {
            value: 'AXP',
          },
          {
            value: 'MA',
          },
          {
            value: 'JPM',
          },
          {
            value: 'GOOGL',
          },
          {
            value: 'FB',
          },
          {
            value: 'AMZN',
          },
          {
            value: 'MSFT',
          },
        ],
      },
      {
        value: 'Commodities',
        subGroup: [
          {
            value: 'Crude Oil',
          },
          {
            value: 'Natural Gas',
          },
          {
            value: 'Gold',
          },
          {
            value: 'Silver',
          },
        ],
      },
      {
        value: 'Indexes',
        subGroup: [
          {
            value: 'NASDAQ Composite',
          },
          {
            value: 'Dow Jones Industrial Average',
          },
          {
            value: 'S&P 500',
          },
          {
            value: 'FTSE 100',
          },
          {
            value: 'DAX 30',
          },
          {
            value: 'Nikkei 255 Index',
          },
        ],
      },
      {
        value: 'ETF',
      },
      {
        value: 'Bonds',
      },
    ],
  },
  {
    value: 'Entertainment',
    subGroup: [
      {
        value: 'Awards',
        subGroup: [
          {
            value: 'Academy Awards',
          },
          {
            value: 'Emmy Awards',
          },
          {
            value: 'Grammy Awards',
          },
          {
            value: 'Golden Globe Awards',
          },
        ],
      },
      {
        value: 'Movies',
      },
      {
        value: 'Music',
      },
      {
        value: 'TV Shows',
        subGroup: [
          {
            value: 'American Idol',
          },
          {
            value: 'Big Brother',
          },
          {
            value: 'The Bachelor',
          },
          {
            value: 'The Bachelorette',
          },
          {
            value: 'Dancing with the Stars',
          },
        ],
      },
    ],
  },
  {
    value: 'Crypto',
    subGroup: [
      {
        value: 'Bitcoin',
      },
      {
        value: 'Ethereum',
        subGroup: [{ value: 'ICO' }],
      },
      {
        value: 'Litecoin',
      },
      {
        value: 'Rep',
      },
    ],
  },
  {
    value: 'Weather',
    subGroup: [
      {
        value: 'Natural Disasters',
        subGroup: [
          {
            value: 'Hurricanes',
          },
          {
            value: 'Earthquakes',
          },
          {
            value: 'Tornadoes',
          },
        ],
      },
      {
        value: 'Precipitation Totals',
        subGroup: [{ value: 'Snow Fall' }, { value: 'Rain Fall' }],
      },
      {
        value: 'Tempature',
      },
    ],
  },
  {
    value: 'Space',
    subGroup: [
      {
        value: 'Mars',
      },
      {
        value: 'NASA',
      },
      {
        value: 'Moon',
      },
      {
        value: 'SpaceX',
      },
    ],
  },
];
