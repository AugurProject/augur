import { MARKET_DATA_LOADING } from 'modules/app/actions/update-market-data-loading';

// For tracking (AJAX) requests, whether they are running so UI can display loading indicator
export default (requests = {}, data) => {
  switch (data.type) {
    case MARKET_DATA_LOADING:
      return {
        ...requests,
        [MARKET_DATA_LOADING]: {
          ...requests[MARKET_DATA_LOADING],
          [data.marketID]: data.status
        }
      };
    default:
      return requests;
  }
};
