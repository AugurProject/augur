import {
  SUB_CATEGORIES,
  BACK,
  NEXT,
  MARKET_TYPE,
  TEMPLATE_PICKER,
  TEMPLATE_FORM_DETAILS,
  LiquidityContent,
  ReviewContent,
  EventDetailsContent,
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
  EventDetailsContent,
  LiquidityContent,
  ReviewContent,
];

export const NO_CAT_TEMPLATE_CONTENT_PAGES = TEMPLATE_CONTENT_PAGES.filter(
  page => page.title !== 'Sub-Category'
);
