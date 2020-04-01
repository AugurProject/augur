import { Odds } from 'oddslib';
import { ODDS_TYPE, THEMES } from 'modules/common/constants';

export const getOdds = (price, theme = THEMES.TRADING) =>
  theme === THEMES.TRADING
    ? price
    : {
        [ODDS_TYPE.DECIMAL]: Odds.from('impliedProbability', price).to(
          'decimal'
        ),
        [ODDS_TYPE.FRACTIONAL]: Odds.from('impliedProbability', price).to(
          'fractional'
        ),
        [ODDS_TYPE.AMERICAN]: Odds.from('impliedProbability', price).to(
          'moneyline'
        ),
        [ODDS_TYPE.PERCENT]: Odds.from('impliedProbability', price).to(
          'impliedProbability',
          { percent: true }
        ),
      };
