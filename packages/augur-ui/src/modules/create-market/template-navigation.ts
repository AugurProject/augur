import {
  SUB_CATEGORIES,
  BACK,
  NEXT,
  MARKET_TYPE,
  TEMPLATE_PICKER,
  LiquidityContent,
  ReviewContent,
  EventDetailsContent,
  EventDetailsContentTemplate,
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
    disabledFunction: newMarket => checkValid(newMarket.navCategories[1]),
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
  EventDetailsContent(EventDetailsContentTemplate),
  LiquidityContent,
  ReviewContent,
];

export const NO_CAT_TEMPLATE_CONTENT_PAGES = TEMPLATE_CONTENT_PAGES.filter(
  page => page.title !== 'Sub-Category'
);
