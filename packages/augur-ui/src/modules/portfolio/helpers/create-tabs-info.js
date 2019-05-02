import {
  ALL_MARKETS,
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED
} from "modules/common-elements/constants";

export const createTabsInfo = markets => {
  const tabsInfo = [
    {
      key: ALL_MARKETS,
      label: "All",
      num: markets[ALL_MARKETS].length
    },
    {
      key: MARKET_OPEN,
      label: "Open",
      num: markets[MARKET_OPEN].length
    },
    {
      key: MARKET_REPORTING,
      label: "In Reporting",
      num: markets[MARKET_REPORTING].length
    },
    {
      key: MARKET_CLOSED,
      label: "Resolved",
      num: markets[MARKET_CLOSED].length
    }
  ];

  return tabsInfo;
};
