import {
  clearCategories,
  updateCategories,
} from 'modules/categories/actions/update-categories';
import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';

const loadCategories = (callback: NodeStyleCallback = logError) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe } = getState();
  if (!universe.id) return callback(null);
  const categories = [
    {
      categoryName: 'space',
      nonFinalizedOpenInterest: '3.68192261009997',
      openInterest: '307.68192261009997',
      tags: ['SpaceX', 'spaceflight'],
    },
    {
      categoryName: 'politics',
      nonFinalizedOpenInterest: '37.68192261009997',
      openInterest: '307.68192261009997',
      tags: ['elections', 'Brazil', 'California', 'Calexit', 'US politics'],
    },
    {
      categoryName: 'finance',
      nonFinalizedOpenInterest: '7.68192261009997',
      openInterest: '307.68192261009997',
      tags: ['stocks', 'Dow Jones'],
    },
    {
      categoryName: 'Augur',
      nonFinalizedOpenInterest: '70.68192261009997',
      openInterest: '307.68192261009997',
      tags: ['release date', 'Ethereum'],
    },
    {
      categoryName: 'crypto',
      nonFinalizedOpenInterest: '1.68192261009997',
      openInterest: '307.68192261009997',
      tags: ['Ethereum', 'trading', 'Tether', 'trading'],
    },
    {
      categoryName: 'climate',
      nonFinalizedOpenInterest: '2.68192261009997',
      openInterest: '307.68192261009997',
      tags: ['Antarctica', 'warming'],
    },
    {
      categoryName: 'sports',
      nonFinalizedOpenInterest: '4.68192261009997',
      openInterest: '307.68192261009997',
      tags: ['basketball', 'Warriors', 'college football', 'football'],
    },
    {
      categoryName: 'temperature',
      nonFinalizedOpenInterest: '4.61009997',
      openInterest: '307.68192261009997',
      tags: ['weather', 'SFO'],
    },
    {
      categoryName: 'science',
      nonFinalizedOpenInterest: '7.9997',
      openInterest: '307.68192261009997',
      tags: ['climate', 'atmosphere', 'mortality', 'United States'],
    },
    {
      categoryName: 'medicine',
      nonFinalizedOpenInterest: '0.68192261009997',
      openInterest: '307.68192261009997',
      tags: ['science', 'antibiotics'],
    },
    {
      categoryName: 'housing',
      nonFinalizedOpenInterest: '3.1009997',
      openInterest: '307.68192261009997',
      tags: ['economy', 'bubble'],
    },
  ];
  // TODO: replace mock data with real data when middleware getCategories is ready

  dispatch(clearCategories());

  // Categories currently don't allow the user to specify how they should be
  // sorted; to enable users to discover interesting markets, sort categories
  // and their nested tags by non-finalized open interest. Do this here
  // because this sort is expensive and we only want to do it once, upstream
  // of redux store. Possibly this could be done in middleware instead,
  // such that the UI would just rely on categories already being sorted.
  categories.sort(sortByNonFinalizedOpenInterestDescending);
  categories.forEach((c: any) =>
    c.tags.sort(sortByNonFinalizedOpenInterestDescending)
  );

  dispatch(updateCategories(categories));
  callback(null, categories);
};

export default loadCategories;

function sortByNonFinalizedOpenInterestDescending(a: any, b: any) {
  // If optimization needed, parseFloat for each object up
  // front instead of redundantly doing it each comparison.
  const oiA = parseFloat(a.nonFinalizedOpenInterest);
  const oiB = parseFloat(b.nonFinalizedOpenInterest);
  if (isNaN(oiA)) {
    return -1;
  }
  if (isNaN(oiB)) {
    return 1;
  }
  return oiB - oiA;
}
