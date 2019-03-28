export const ADD_MARKET_BANNER = "ADD_MARKET_BANNER";
export const ADD_ALL_MARKET_BANNERS = "ADD_ALL_MARKET_BANNERS";

export const addMarketBanner = marketId => ({
  type: ADD_MARKET_BANNER,
  data: { marketId }
});

export const addAllMarketBanners = collection => ({
  type: ADD_ALL_MARKET_BANNERS,
  data: collection
});
