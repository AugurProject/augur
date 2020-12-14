import { COVID, MEDICAL } from 'modules/constants';
import { createBigNumber } from 'utils/create-big-number';
import { formatDai } from 'utils/format-number';

export const DEFAULT_APP_STATUS_STATE = {
  marketInfos: {},
};

export const STUBBED_APP_STATUS_ACTIONS = {};

export const APP_STATUS_ACTIONS = {};

export const MOCK_APP_STATUS_STATE = {
  marketInfos: {
    '0xdeadbeef': {
      id: '0xdeadbeef',
      description:
        "Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?",
      minPrice: 0,
      maxPrice: 1,
      minPriceBigNumber: createBigNumber(0),
      maxPriceBigNumber: createBigNumber(1),
      expirationDate: 'July 31, 2021',
      categories: [MEDICAL, COVID, 'vaccine'],
      totalLiquidity: formatDai(createBigNumber(83375)),
      twentyFourHourVolume: formatDai(createBigNumber(12027)),
      totalVolume: formatDai(createBigNumber(350019)),
      details: [
        'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      ],
      outcomes: [
        { id: 0, label: 'Invalid', value: 'invalid', lastPrice: '0' },
        { id: 1, label: 'Yes', value: 'yes', lastPrice: '0.75' },
        { id: 2, label: 'No', value: 'no', lastPrice: '0.25' },
      ],
      settlementFee: '0.1',
      marketCurrency: 'USDC',
    },
  },
};
