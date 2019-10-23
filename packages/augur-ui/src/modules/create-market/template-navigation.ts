import { getTemplates } from 'modules/create-market/get-template';
import {
  SUB_CATEGORIES,
  BACK,
  NEXT,
  MARKET_TYPE,
  TEMPLATE_PICKER,
  TEMPLATE_FORM_DETAILS,
  LiquidityContent,
  ReviewContent,
} from 'modules/create-market/constants';

function checkValid(data) {
  return data === '' || !data;
}

export const TEMPLATE_CONTENT_PAGES = [
  { title: 'Category' },
  {
    title: 'Sub-Category',
    mainContent: SUB_CATEGORIES,
    firstButton: BACK,
    secondButton: NEXT,
    disabledFunction: newMarket => checkValid(newMarket.categories[1]),
  },
  {
    title: 'Market Type',
    mainContent: MARKET_TYPE,
    firstButton: BACK,
    secondButton: NEXT,
    disabledFunction: newMarket => checkValid(newMarket.marketType),
  },
  {
    title: 'Template',
    mainContent: TEMPLATE_PICKER,
    firstButton: BACK,
    secondButton: NEXT,
    disabledFunction: newMarket => checkValid(newMarket.template),
  },
  {
    title: 'Event Details',
    largeHeader: 'Enter the event details',
    explainerBlockTitle: 'A note on choosing a market',
    explainerBlockSubtexts: [
      "Create markets that will have an objective outcome by the events end time. Avoid creating markets that have subjective or ambiguous outcomes. If you're not sure that the market's outcome will be known beyond a reasonable doubt by the reporting start time, you should not create the market.Create markets that will have an objective outcome by the events end time. Avoid creating markets that have subjective or ambiguous outcomes. If you're not sure that the market's outcome will be known beyond a reasonable doubt by the reporting start time, you should not create the market.",
      'A market only covers events that occur after market creation time and on or before reporting start time. If the event occurs outside of these bounds it has a high probability of resolving as invalid.',
    ],
    mainContent: TEMPLATE_FORM_DETAILS,
    firstButton: BACK,
    secondButton: NEXT,
  },
  LiquidityContent,
  ReviewContent,
];

export const NO_CAT_TEMPLATE_CONTENT_PAGES = TEMPLATE_CONTENT_PAGES.filter(
  page => page.title !== 'Sub-Category'
);
