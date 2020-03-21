import {
  SPORTS,
  GOLF,
  TemplateInputType,
  REQUIRED,
  HOCKEY,
  ValidationType,
  HORSE_RACING,
  TENNIS,
  SOCCER,
  MENS_LEAGUES,
  CUSTOMIZED,
  BASKETBALL,
  NBA,
  NCAA,
  BASEBALL,
  AMERICAN_FOOTBALL,
  OLYMPICS,
  NFL,
  SUMMER,
  WINTER,
  POLITICS,
  US_POLITICS,
  WORLD,
  FINANCE,
  STOCKS,
  INDEXES,
  ENTERTAINMENT,
  CRYPTO,
  BITCOIN,
  ETHEREUM,
  LITECOIN,
  PGA,
  EURO_TOUR,
  LPGA,
  MENS,
  WOMENS,
  SINGLES,
  DOUBLES,
  WNBA,
  TEXT_PLACEHOLDERS,
} from './templates-template';
import {
  LIST_VALUES,
  BASKETBALL_EVENT_DEP_TEAMS,
  HOCKEY_EVENT_DEP_TEAMS,
  BASEBALL_EVENT_DEP_TEAMS,
  FOOTBALL_EVENT_DEP_TEAMS,
  NCAA_BASKETBALL_CONF_DEP_TEAMS,
  TENNIS_SINGLES_EVENTS,
  TENNIS_DOUBLES_EVENTS,
  ENTERTAINMENT_EVENT_DEP_TEAMS,
  CRYPTO_BTC_CURRENCY_MARKETS,
  CRYPTO_ETH_CURRENCY_MARKETS,
  CRYPTO_LTC_CURRENCY_MARKETS,
  OLYMPIC_SUMMER_SPORT_EVENTS,
  OLYMPIC_WINTER_SPORT_EVENTS,
  FIN_EXCHANGES_CLOSING_OFFSETS,
  FIN_INDEXES_CLOSING_OFFSETS,
  FIN_INDEXES_HOLIDAY_CLOSURES,
  FIN_EXCHANGES_HOLIDAY_CLOSURES,
  SOCCER_LEAGUE_DEP_TEAMS,
} from './templates-lists';

const YES_NO = 'YesNo';
const CATEGORICAL = 'Categorical';
const SCALAR = 'Scalar';

/*
  Add new templates or update templates here keeping the same strcuture as TEMPLATES.
  The template objects will be merge together to for one template object that is used by the UI.
  Update generate-templates.ts to include new template structures so that can be added.
  After new template structure is released create a TEMPLATE(X) where X is next number 3, 4, 5, ...
*/
export const TEMPLATES2 = {};

export const TEMPLATES = {
  [SPORTS]: {
    children: {
      [GOLF]: {
        children: {
          [PGA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `PGA: Will [0] win the [1] [2]?`,
                example: `PGA: Will Tiger Woods win the 2020 PGA Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: TEXT_PLACEHOLDERS.SINGLE_PLAYER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.GOLF_PGA_EVENT,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as 'No'`,
                    },
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No'.`,
                    },
                    {
                      text:
                        'Includes regulation, any play-offs and sudden death',
                    },
                    {
                      text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `PGA: Will [0] make the cut at the [1] [2]?`,
                example: `PGA: Will Tiger Woods make the cut at the 2020 PGA Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: TEXT_PLACEHOLDERS.SINGLE_PLAYER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.GOLF_PGA_EVENT,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as 'No'`,
                    },
                    {
                      text: `If a tournament or match is cancelled the market should resolve as 'No'. If the tournament is postponed and not be completed before the market's Event Expiration time, but the player named officially made the cut, noted by the tournament association, then the outcome should resolve as Yes.`,
                    },
                    {
                      text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `PGA: Will the United States Team win the [0] Presidents Cup?`,
                example: `PGA: Will the United States Team win the 2020 Presidents Cup?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If team fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as 'No'`,
                    },
                    {
                      text: `If a tournament or match is cancelled the market should resolve as 'No'. If the tournament is postponed and not be completed before the market's Event Expiration time, but the player named officially made the cut, noted by the tournament association, then the outcome should resolve as Yes.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `PGA: Which golfer will win the [0] [1]?`,
                example: `PGA: Which golfer will win the 2020 PGA Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.GOLF_PGA_EVENT,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No winner/Event cancelled`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No winner/Event Cancelled'.`,
                    },
                    {
                      text:
                        'Includes regulation, any play-offs and sudden death',
                    },
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `PGA: Which team will win the [0] Presidents Cup?`,
                example: `PGA: Which team will win the 2020 Presidents Cup?`,
                noAdditionalUserOutcomes: true,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No winner/Event cancelled`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `United States Team`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `International Team`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No winner/Event Cancelled'.`,
                    },
                    {
                      text: `Only one team can be listed per outcome, if not then the market should resolve as 'Invalid'`,
                    },
                    {
                      text: `This market is intended to have two teams, United States verse International, if not the case this market should resolve as 'Invalid'`,
                    },
                    {
                      text:
                        'Includes regulation, any play-offs and sudden death',
                    },
                  ],
                },
              },
            ],
          },
          [EURO_TOUR]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Euro Tour: Will [0] win the [1] [2]?`,
                example: `Euro Tour: Will Rory Mcllroy win the 2020 Omega Dubai Dessert Classic?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: TEXT_PLACEHOLDERS.SINGLE_PLAYER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.GOLF_EURO_EVENT,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as 'No'`,
                    },
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No'.`,
                    },
                    {
                      text:
                        'Includes regulation, any play-offs and sudden death',
                    },
                    {
                      text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `Euro Tour: Will [0] make the cut at the [1] [2]?`,
                example: `Euro Tour: Will Rory Mcllroy make the cut at the 2020 Omega Dubai Dessert Classic?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: TEXT_PLACEHOLDERS.SINGLE_PLAYER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.GOLF_EURO_EVENT,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as 'No'`,
                    },
                    {
                      text: `If a tournament or match is cancelled the market should resolve as 'No'. If the tournament is postponed and not be completed before the market's Event Expiration time, but the player named officially made the cut, noted by the tournament association, then the outcome should resolve as Yes.`,
                    },
                    {
                      text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `Euro Tour: Will the United States Team win the [0] Ryders Cup?`,
                example: `Euro Tour: Will the United States Team win the 2020 Ryders Cup?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If team fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as 'No'`,
                    },
                    {
                      text: `If a tournament or match is cancelled the market should resolve as 'No'. If the tournament is postponed and not be completed before the market's Event Expiration time, but the player named officially made the cut, noted by the tournament association, then the outcome should resolve as Yes.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Euro Tour: Which golfer will win the [0] [1]?`,
                example: `Euro Tour: Which golfer will win the 2020 Omega Dubai Dessert Classic?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.GOLF_EURO_EVENT,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No winner/Event cancelled`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No winner/Event Cancelled'.`,
                    },
                    {
                      text:
                        'Includes regulation, any play-offs and sudden death',
                    },
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Euro Tour: Which golf team will win the [0] Ryders Cup?`,
                example: `Euro Tour: Which golf team will win the 2020 Ryders Cup?`,
                noAdditionalUserOutcomes: true,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `United States Team`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `European Team`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No winner/Event cancelled`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No winner/Event Cancelled'.`,
                    },
                    {
                      text: `Only one team can be listed per outcome, if not then the market should resolve as 'Invalid'`,
                    },
                    {
                      text: `This market is intended to have two teams, United States verse European, if not the case this market should resolve as 'Invalid'`,
                    },
                    {
                      text:
                        'Includes regulation, any play-offs and sudden death',
                    },
                  ],
                },
              },
            ],
          },
          [LPGA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `LPGA: Will [0] win the [1] [2]?`,
                example: `LPGA: Will Lexi Thompson win the 2020 U.S. Women's Open?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: TEXT_PLACEHOLDERS.SINGLE_PLAYER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.GOLF_LPGA_EVENT,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as 'No'`,
                    },
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No'.`,
                    },
                    {
                      text:
                        'Includes regulation, any play-offs and sudden death',
                    },
                    {
                      text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `LPGA: Will [0] make the cut at the [1] [2]?`,
                example: `LPGA: Will Lexi Thompson make the cut at the 2020 U.S. Women's Open?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: TEXT_PLACEHOLDERS.SINGLE_PLAYER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.GOLF_LPGA_EVENT,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as 'No'`,
                    },
                    {
                      text: `If a tournament or match is cancelled the market should resolve as 'No'. If the tournament is postponed and not be completed before the market's Event Expiration time, but the player named officially made the cut, noted by the tournament association, then the outcome should resolve as Yes.`,
                    },
                    {
                      text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `LPGA: Which golfer will win the [0] [1]?`,
                example: `LPGA: Which golfer will win the 2020 U.S. Women's Open?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.GOLF_LPGA_EVENT,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No winner/Event cancelled`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No winner/Event Cancelled'.`,
                    },
                    {
                      text:
                        'Includes regulation, any play-offs and sudden death',
                    },
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      [HOCKEY]: {
        templates: [
          {
            marketType: YES_NO,
            question: `NHL: Will the [0] win vs. the [1]?`,
            example: `NHL: Will the St Louis Blues win vs. the Dallas Stars?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team A`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team B`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 6,
                placeholder: `Date time`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Includes any Regulation, overtime and any shoot-outs. `,
                },
                {
                  text: `The game must go 55 minutes or more to be considered official. If it does not, the game will be considered unofficial and 'No' should be deemed the winning outcome.`,
                },
                {
                  text: `If game is not played market should resolve as 'No'`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `NHL: Will the [0] & [1] score [2] or more combined goals?`,
            example: `NHL: Will the NY Rangers & Dallas Stars score 5 or more combined goals?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team A`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team B`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                validationType: ValidationType.WHOLE_NUMBER,
                placeholder: `Whole #`,
              },
              {
                id: 3,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 6,
                placeholder: `Date time`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Includes any Regulation, overtime and any shoot-outs.`,
                },
                {
                  text: `The game must go 55 minutes or more to be considered official. If it does not, the game will be considered unofficial and 'No' should be deemed the winning outcome.`,
                },
                {
                  text: `If game is not played market should resolve as 'No'`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `NHL: Will the [0] win the [1] Stanley Cup?`,
            example: `NHL: Will the Montreal Canadiens win the 2019-20 Stanley Cup?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the season is officially cancelled and no Stanley Cup is played, this market should resolve as 'No'`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the Stanley Cup is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the Stanley Cup is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                }
              ]
            },
          },
          {
            marketType: CATEGORICAL,
            question: `NHL: Which team will win: [0] vs. [1]?`,
            example: `NHL: Which Team will win: NY Rangers vs. NJ Devils?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                placeholder: `Team A`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                placeholder: `Team B`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 6,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Winner`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Include Regulation, overtime and any shoot-outs.`,
                },
                {
                  text: `The game must go 55 minutes or more to be considered official, if not market should resolve as 'No Winner'`,
                },
                {
                  text: `If game is not played market should resolve as 'No Winner'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `NHL (Goal Spread): [0] to win by more than [1].5 goals over the [2]?`,
            example: `NHL (Goal Spread): St Louis Blues to win by more than 2.5 goals over the NY Rangers?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team A`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                validationType: ValidationType.WHOLE_NUMBER,
                placeholder: `Whole #`,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team B`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 3,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 6,
                placeholder: `Date time`,
              },
              {
                id: 4,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[0] -[1].5`,
              },
              {
                id: 5,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[2] +[1].5`,
              },
              {
                id: 6,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Winner`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the game is not played market should resolve as 'No Winner'`,
                },
                {
                  text: `Include Regulation, overtime and any shoot-outs`,
                },
                {
                  text: `The game must go 55 minutes or more to be considered official if not, market should resolve as 'No winner'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `NHL (O/U): [0] vs. [1]: Total goals scored; Over/Under [2].5?`,
            example: `NHL (O/U): St Louis Blues vs. NY Rangers: Total goals scored Over/Under 4.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team A`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team B`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                validationType: ValidationType.WHOLE_NUMBER,
                placeholder: `Whole #`,
              },
              {
                id: 3,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 6,
                placeholder: `Date time`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Winner`,
              },
              {
                id: 5,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Over [2].5`,
              },
              {
                id: 6,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Under [2].5`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the game is not played market should resolve as 'No Winner'`,
                },
                {
                  text: `Include Regulation, overtime and any shoot-outs`,
                },
                {
                  text: `The game must go 55 minutes or more to be considered official if not, market should resolve as 'No winner'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which NHL team will win the [0] [1]?`,
            example: `Which NHL team will win the 2019-20 Stanley Cup?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEAR_RANGE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.HOCKEY_EVENT,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 3,
                type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP,
                inputSourceId: 1,
                placeholder: `Select Team`,
                values: HOCKEY_EVENT_DEP_TEAMS,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
                {
                  text: `If the season is officially cancelled and the event named in market is not played, this market should resolve as 'Invalid'`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event named in market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event named in market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                }
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which NHL player will win the [0] [1]?`,
            example: `Which NHL player will win the 2019-20 Calder Trophy?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Award`,
                values: LIST_VALUES.HOCKEY_AWARD,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
                {
                  text: `If the award in the market question is not awarded for any reason by event expiration, this market should resolve as 'Invalid'`,
                },
              ],
            },
          },
          {
            marketType: SCALAR,
            question: `NHL: Total number of wins the [0] will finish [1] regular season with?`,
            example: `NHL: Total number of wins the LA Kings will finish 2019-20 regular season with?`,
            denomination: 'wins',
            tickSize: 0.1,
            minPrice: 0,
            maxPrice: 82,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team`,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games`,
                },
                {
                  text: `Market should resolve as whole number value of wins`,
                },
                {
                  text: `If the season is officially cancelled, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                },
                {
                  text: `If the league's regular season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`
                }
              ],
            },
          },
        ],
      },
      [HORSE_RACING]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will [0] win the [1] [2]?`,
            example: `Will American Pharoah win the 2020 Triple Crown?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.SINGLE_HORSE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.HORSE_RACING_EVENT,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the horse named in the market is scratched and does NOT run, including the cancellation of the race, or is disqualified for any reason, the market should resolve as 'No'.`,
                },
                {
                  text: `This market is intended to be about a Single Horse, if this is not the case, this market should settle as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which horse will win the [0] [1]?`,
            example: `Which horse will win the 2020 Kentucky Derby?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.HORSE_RACING_EVENT,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Winner`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the winning horse is not one of the outcomes listed, market should resolve as "Other (Field)"`,
                },
                {
                  text: `If the Race is cancelled for any reason or is postponed and will not be completed before the event expiration time for this market starts, market should resolve as 'No Winner'`,
                },
                {
                  text: `If a horse is disqualified after being determined the winner: If the disqualification occurs before the market's event expiration time begins, and another horse is named the winner, the new horse should be reported the official winner.`,
                },
                {
                  text: `If a horse is disqualified after being determined the winner: If the disqualification occurs after the market's event expiration, the disqualified horse will still be named the winner of the market.`,
                },
              ],
            },
          },
        ],
      },
      [TENNIS]: {
        children: {
          [SINGLES]: {
            templates: [
              {
                marketType: YES_NO,
                question: `[0] Singles Tennis: Will [1] win the [2] [3]?`,
                example: `Men's Singles Tennis: Will Roger Federer win the 2020 Wimbledon?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    inputDestIds: [3],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: TENNIS_SINGLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: TEXT_PLACEHOLDERS.SINGLE_PLAYER,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    values: [],
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as 'No'`,
                    },
                    {
                      text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Singles Tennis: Which player will win the [1] [2]?`,
                example: `Men's Singles Tennis: Which player will win the 2020 Australian Open?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    inputDestIds: [2],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: TENNIS_SINGLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner`,
                    },
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Singles Tennis [1] [2]: Who will win Set number [3], [4] vs. [5]?`,
                example: `Men's Singles Tennis 2020 French Open: Who will win Set number 3, Novak Djokovic vs. Rafael Nadal?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    inputDestIds: [2],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: TENNIS_SINGLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Set Number`,
                    values: LIST_VALUES.TENNIS_MATCH_SETS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player A`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player B`,
                    values: LIST_VALUES.YEARS,
                  },

                  {
                    id: 6,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner/Not Played`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 9,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the set named in the market question is not played for any reason, the market should resolve as 'No Winner/Not Played'`,
                    },
                    {
                      text: `If a match is started and is postponed for any reason and will not be completed before the Event Expiration begins the market should resolve as 'No Winner/Not Played'`,
                    },
                    {
                      text: `If a player is disqualified or withdraws during the set named in the market question, the player moving forward to the next round should be declared the winner`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Singles Tennis [1] [2] (O/U), [3] vs. [4]: Total [5] played in a match; Over/Under [6].5?`,
                example: `Men's Singles Tennis 2020 French Open (O/U), Novak Djokovic vs. Rafael Nadal: Total games played in a match; Over/Under 15.5?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    inputDestIds: [2],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: TENNIS_SINGLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player A`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player B`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `games/sets`,
                    values: LIST_VALUES.TENNIS_GAMES_SETS,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner/Not Played`,
                  },
                  {
                    id: 8,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [6].5`,
                  },
                  {
                    id: 9,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [6].5`,
                  },
                  {
                    id: 10,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 9,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the match is not played for any reason the market should resolve as 'No Winner/Not Played"`,
                    },
                    {
                      text: `If a match is started and is postponed for any reason and will not be completed before the Event Expiration begins the market should resolve as 'No Winner/Not Played'`,
                    },
                    {
                      text: `If the match is started and a player is disqualified or withdraws for any reason, and a player/team moves forward or is declared the winner, the final results should be based off of when the match was stopped.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Single Tennis: [1] [2] Match play winner: [3] vs. [4]?`,
                example: `Men's Single Tennis: 2020 Wimbledon Match play winner between Roger Federer vs. Rafael Nadal?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    inputDestIds: [2],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: TENNIS_SINGLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player A`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player B`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 9,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner.`,
                    },
                    {
                      text: `If a player fails to start a tournament or a match, or the match was not able to start for any reason, the market should resolve as 'No Winner'.`,
                    },
                    {
                      text: `If the match is not played for any reason, or is terminated prematurely with both players willing and able to play, the market should resolve as 'No Winner'.`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
            ],
          },
          [DOUBLES]: {
            templates: [
              {
                marketType: YES_NO,
                question: `[0] Doubles Tennis: Will [1] win the [2] [3]?`,
                example: `Men's Double Tennis: Will Juan Sebastin/Robert Farah win the 2020 Wimbledon?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's/Mixed`,
                    inputDestIds: [3],
                    values: LIST_VALUES.TENNIS_MENS_WOMENS,
                    inputDestValues: TENNIS_DOUBLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: TEXT_PLACEHOLDERS.MULTIPLE_PLAYER,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's/Mixed First`,
                    placeholder: `Event`,
                    values: [],
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If either pairing fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as 'No'`,
                    },
                    {
                      text: `This market is intended to be about a two player team (pairing), if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Doubles Tennis: Which player/player will win the [1] [2]?`,
                example: `Men's Doubles Tennis: Which player/player will win the 2020 Australian Open?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's/Mixed`,
                    inputDestIds: [2],
                    values: LIST_VALUES.TENNIS_MENS_WOMENS,
                    inputDestValues: TENNIS_DOUBLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's/Mixed First`,
                    placeholder: `Event`,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If either pairing is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner`,
                    },
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `This market each outcome is a two player team (pairing), if this is not the case, this market should settle as 'Invalid.'`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Doubles Tennis [1] [2]: Who will win Set number [3], [4] vs. [5]?`,
                example: `Men's Doubles Tennis 2020 French Open: Who will win Set number 3, Kevin Krawietz/Andreas Mies vs. Bob Bryan/Mike Bryan?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's/Mixed`,
                    inputDestIds: [2],
                    values: LIST_VALUES.TENNIS_MENS_WOMENS,
                    inputDestValues: TENNIS_DOUBLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Set Number`,
                    values: LIST_VALUES.TENNIS_MATCH_SETS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player/Player A`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player/Player B`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner/Not Played`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 9,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the set named in the market question is not played for any reason, the market should resolve as 'No Winner/Not Played'`,
                    },
                    {
                      text: `If a match is started and is postponed for any reason and will not be completed before the Event Expiration begins the market should resolve as 'No Winner/Not Played'`,
                    },
                    {
                      text: `If a team is disqualified or withdraws during the set named in the market question, the team moving forward to the next round should be declared the winner`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No Winner/Not Played'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Doubles Tennis [1] [2] (O/U), [3] vs. [4]: Total [5] played in a match; Over/Under [6].5?`,
                example: `Men's Doubles Tennis 2020 French Open (O/U), Kevin Krawietz/Andreas Mies vs. Bob Bryan/Mike Bryan: Total games played in a match; Over/Under 15.5?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    inputDestIds: [2],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: TENNIS_DOUBLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player/Player A`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player/Player B`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `games/sets`,
                    values: LIST_VALUES.TENNIS_GAMES_SETS,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner/Not Played`,
                  },
                  {
                    id: 8,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [6].5`,
                  },
                  {
                    id: 9,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [6].5`,
                  },
                  {
                    id: 10,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 9,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the match is not played for any reason the market should resolve as 'No Winner/Not Played"`,
                    },
                    {
                      text: `If a match is started and is postponed for any reason and will not be completed before the Event Expiration begins the market should resolve as 'No Winner/Not Played'`,
                    },
                    {
                      text: `If the match is started and a player is disqualified or withdraws for any reason, and a player/team moves forward or is declared the winner, the final results should be based off of when the match was stopped.`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No Winner/Not Played'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Doubles Tennis: [1] [2] Match play winner: [3] vs. [4]?`,
                example: `Men's Doubles Tennis: 2020 Wimbledon Match play winner between Kevin Krawietz/Andreas Mies vs. Bob Bryan/Mike Bryan?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's/Mixed`,
                    inputDestIds: [2],
                    values: LIST_VALUES.TENNIS_MENS_WOMENS,
                    inputDestValues: TENNIS_DOUBLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's/Mixed First`,
                    placeholder: `Event`,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player/Player A`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player/Player B`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If either pairing is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner.`,
                    },
                    {
                      text: `If either pairing fails to start a tournament or a match, or the match was not able to start for any reason, the market should resolve as 'No Winner'.`,
                    },
                    {
                      text: `If the match is not played for any reason, or is terminated prematurely with both players willing and able to play, the market should resolve as 'No Winner'.`,
                    },
                    {
                      text: `This market each outcome is a two player team (pairing), if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      [SOCCER]: {
        children: {
          [MENS_LEAGUES]: {
            templates: [
              {
                marketType: CATEGORICAL,
                question: `Men's [0]: Which team will win: [1] vs. [2]?`,
                example: `Men's English Premier League: Which team will win: Manchester City vs. Manchester United?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `League`,
                    inputDestIds: [1, 2],
                    values: LIST_VALUES.SOCCER_LEAGUES,
                    inputDestValues: SOCCER_LEAGUE_DEP_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    defaultLabel: `Select League First`,
                    inputSourceId: 0,
                    values: [],
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    defaultLabel: `Select League First`,
                    inputSourceId: 0,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Draw`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Unofficial game/Cancelled`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[1]`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[2]`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out.`,
                    },
                    {
                      text: `If the match concludes and is deemed an official game, meaning more than 90% of the scheduled match has been completed and the score ends in a tie, the market should resolve as 'Draw'.`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'Unofficial game/Cancelled'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'Unofficial game/Cancelled'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Men's [0] (Point Spread): [1] to win by more than [2].5 goals over [3]?`,
                example: `Men's Ligue 1 (France): Marseille to win by more than 1.5 goals over Lyon?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `League`,
                    inputDestIds: [1, 3],
                    values: LIST_VALUES.SOCCER_LEAGUES,
                    inputDestValues: SOCCER_LEAGUE_DEP_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    defaultLabel: `Select League First`,
                    inputSourceId: 0,
                    values: [],
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    defaultLabel: `Select League First`,
                    inputSourceId: 0,
                    values: [],
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[1] -[2].5`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[3] +[2].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Unofficial game/Cancelled`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out.`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'Unofficial game/Cancelled'.`,
                    },
                    {
                      text: `This market is intended to be about a Single Team verse Single Team, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'Unofficial game/Cancelled'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Men's [0] (O/U): [1] vs. [2]: Total goals scored; Over/Under [3].5?`,
                example: `Men's MLS (USA) (O/U): Real Madrid vs. Manchester United: Total goals scored Over/Under 4.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `League`,
                    inputDestIds: [1, 2],
                    values: LIST_VALUES.SOCCER_LEAGUES,
                    inputDestValues: SOCCER_LEAGUE_DEP_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    defaultLabel: `Select League First`,
                    inputSourceId: 0,
                    values: [],
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    defaultLabel: `Select League First`,
                    inputSourceId: 0,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [3].5`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [3].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Unofficial game/Cancelled`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'Unofficial game/Cancelled'`,
                    },
                    {
                      text: `This market is intended to be about a Single Team verse Single Team, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'Unofficial game/Cancelled'`,
                    },
                  ],
                },
              },
            ],
          },
          [CUSTOMIZED]: {
            templates: [
              {
                marketType: CATEGORICAL,
                question: `[0] Football (Soccer): Which team will win: [1] vs. [2]?`,
                example: `Men's Football (Soccer): Which team will win: Real Madrid vs. Manchester United?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team A`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team B`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Draw`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Unofficial game/Cancelled`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out.`,
                    },
                    {
                      text: `If the match concludes and is deemed an official game, meaning more than 90% of the scheduled match has been completed and the score ends in a tie, the market should resolve as 'Draw'.`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'Unofficial game/Cancelled'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'Unofficial game/Cancelled'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Football (Soccer) (Point Spread): [1] to win by more than [2].5 goals over [3]?`,
                example: `Men's Football (Soccer) (Point Spread): Real Madrid to win by more than 1.5 goals over Manchester United?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[1] -[2].5`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[3] +[2].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Unofficial game/Cancelled`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out.`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'Unofficial game/Cancelled'.`,
                    },
                    {
                      text: `This market is intended to be about a Single Team verse Single Team, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'Unofficial game/Cancelled'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Football (Soccer) (O/U): [1] vs. [2]: Total goals scored; Over/Under [3].5?`,
                example: `Men's Football (Soccer) (O/U): Real Madrid vs. Manchester United: Total goals scored Over/Under 4.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [3].5`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [3].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Unofficial game/Cancelled`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'Unofficial game/Cancelled'`,
                    },
                    {
                      text: `This market is intended to be about a Single Team verse Single Team, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'Unofficial game/Cancelled'`,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      [BASKETBALL]: {
        children: {
          [NBA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `NBA: Will the [0] win vs. the [1]?`,
                example: `NBA: Will the Los Angeles Lakers win vs. the Golden State Warriors?\nEstimated schedule start time: Sept 19, 2019 9:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO"'`,
                    },
                    {
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NBA: Will the [0] win vs. the [1] by [2] or more points?`,
                example: `NBA: Will the Los Angeles Lakers win vs. the Golden State Warriors by 5 or more points?\nEstimated schedule start time: Sept 19, 2019 9:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO"'`,
                    },
                    {
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NBA: Will the [0] & the [1] score [2] or more combined points?`,
                example: `NBA: Will the Los Angeles Lakers & the Golden State Warriors score 172 or more combined points?\nEstimated schedule start time: Sept 19, 2019 9:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO"'`,
                    },
                    {
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NBA: Will the [0] win the [1] NBA Championship?`,
                example: `NBA: Will the Golden State Warriors win the 2019-20 NBA Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'No'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NBA: Will [0] win the [1] [2] award?`,
                example: `NBA: Will Steph Curry win the 2019-20 NBA Most Valuable Player award?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: TEXT_PLACEHOLDERS.SINGLE_PLAYER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Award`,
                    values: LIST_VALUES.NBA_BASKETBALL_AWARD,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `In the event of an award given to more than 1 player. If the player mentioned in the market is one of the players who wins the award, the market should resolve as "Yes".`,
                    },
                    {
                      text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the award in the market question is not awarded for any reason by event expiration, this market should resolve as 'No'.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NBA: Which team will win: [0] vs. [1]?`,
                example: `NBA: Which Team will win: Brooklyn Nets vs. NY Knicks?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                    {
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official. If the game is not played or if less than 43 minutes of play have been completed, the game is not considered an official game and the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NBA (Point Spread): [0] to win by more than [1].5 points over the [2]?`,
                example: `NBA (Point Spread): Brooklyn Nets to win by more than 10.5 points over the NY Knicks?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[0] -[1].5`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[2] +[1].5`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                    {
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official. If the game is not played or if less than 43 minutes of play have been completed, the game is not considered an official game and the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NBA (O/U): [0] vs. [1]: Total Points scored; Over/Under [2].5?`,
                example: `NBA (O/U): Brooklyn Nets vs. NY Knicks: Total Points scored: Over/Under 164.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [2].5`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [2].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Include Regulation and Overtime`,
                    },
                    {
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official. If the game is not played or if less than 43 minutes of play have been completed, the game is not considered an official game and the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NBA team will win the [0] [1]?`,
                example: `Which NBA team will win the 2019-20 Western Conference Finals?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.BASKETBALL_EVENT,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 3,
                    type:
                      TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP,
                    inputSourceId: 1,
                    placeholder: `Select Team`,
                    values: BASKETBALL_EVENT_DEP_TEAMS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the season is officially cancelled and event named in the market is not played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event named in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event named in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NBA player will win the [0] [1] award?`,
                example: `Which NBA player will win the 2019-20 Most Valuable Player award?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Award`,
                    values: LIST_VALUES.NBA_BASKETBALL_AWARD,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `In the event of an award is given to more than 1 player. The player who averaged the most points per game (determined to the first decimal place, meaning a player averaging 36.1 points per game would win over the player averaging 36 points per game) for the regular the season will be the tie breaker. In the event of an additional tie, The regular season Field Goal % will be the final tie breaker.`,
                    },
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the award in the market question is not awarded for any reason, by the start of event expiration, this market should resolve as 'Invalid'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NBA: Which Player will have the most [0] at the end of the the [1] regular season?`,
                example: `NBA: Which Player will have the most Points scored at the end of the the 2019-20 regular season?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Action`,
                    values: LIST_VALUES.BASKETBALL_ACTION,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Results are determined to the first decimal place, meaning a player averaging 10.6 rebounds per game is higher than a player averaging 10.0.`,
                    },
                    {
                      text: `In the event of a tie between two players these rules will be used to determine the winner: For points scored, field goal % should be used as the tie breaker.`,
                    },
                    {
                      text: `For the most rebounds, the player with the total most offensive rebounds, should be used as a tie breaker.`,
                    },
                    {
                      text: `For most total Assists, The player with the "Least" amount of turnovers should be used as the tie breaker.`,
                    },
                    {
                      text: `For most made 3-pointers, the player with the highest 3 point %, should be used as the tie breaker.`,
                    },
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the season is officially cancelled, the statistic at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, statistic at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league suspends play and play is not concluded before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: SCALAR,
                question: `NBA: Total number of wins the [0] will finish the [1] regular season with?`,
                example: `NBA: Total number of wins the NY Knicks will finish the 2019-20 regular season with?`,
                denomination: 'wins',
                tickSize: 0.1,
                minPrice: 0,
                maxPrice: 82,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games`,
                    },
                    {
                      text: `Market should resolve as whole number value of wins`,
                    },
                    {
                      text: `If the season is officially cancelled, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league's regular season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
            ],
          },
          [WNBA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `WNBA: Will the [0] win vs. the [1]?`,
                example: `WNBA: Will the Los Angeles Sparks win vs. the New York Liberty?\nEstimated schedule start time: Sept 19, 2019 9:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO"'`,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official.  If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `WNBA: Will the [0] win vs. the [1] by [2] or more points?`,
                example: `WNBA: Will the Los Angeles Sparks win vs. the New York Liberty by 5 or more points?\nEstimated schedule start time: Sept 19, 2019 9:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO"'`,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official.  If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `WNBA: Will the [0] & [1] score [2] or more combined points?`,
                example: `WNBA: Will the Los Angeles Sparks & the New York Liberty score 172 or more combined points?\nEstimated schedule start time: Sept 19, 2019 9:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO"'`,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official.  If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `WNBA: Will the [0] win the [1] WNBA Championship?`,
                example: `WNBA: Will the Los Angeles Sparks win the 2019-20 WNBA Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'No'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `WNBA: Will [0] win the [1] [2] award?`,
                example: `WNBA: Will Maya Moore win the 2019-20 WNBA Most Valuable Player award?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: TEXT_PLACEHOLDERS.SINGLE_PLAYER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Award`,
                    values: LIST_VALUES.NBA_BASKETBALL_AWARD,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `In the event of an award given to more than 1 player. If the player mentioned in the market is one of the players who wins the award, the market should resolve as "Yes".`,
                    },
                    {
                      text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the award in the market question is not awarded for any reason by event expiration, this market should resolve as 'No'.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `WNBA: Which team will win: [0] vs. [1]?`,
                example: `WNBA: Which Team will win: Phoenix Mercury vs. Seattle Storm?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team A`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If game is not played or if less than 35 minutes of play have been completed, the game is not considered an official game the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `WNBA (Point Spread): [0] to win by more than [1].5 points over the [2]?`,
                example: `WNBA (Point Spread): Phoenix Mercury to win by more than 10.5 points over the Seattle Storm?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[0] -[1].5`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[2] +[1].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If game is not played or if less than 35 minutes of play have been completed, the game is not considered an official game the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `WNBA (O/U): [0] vs. [1]: Total Points scored; Over/Under [2].5?`,
                example: `WNBA (O/U): Phoenix Mercury vs. Seattle Storm: Total Points scored: Over/Under 164.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [2].5`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [2].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If game is not played or if less than 35 minutes of play have been completed, the game is not considered an official game the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which WNBA team will win the [0] Championship?`,
                example: `Which WNBA team will win the 2019-20 Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.USER_DROPDOWN_OUTCOME,
                    placeholder: `Select Team`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which WNBA player will win the [0] [1] award?`,
                example: `Which WNBA player will win the 2019-20 Most Valuable Player award?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Award`,
                    values: LIST_VALUES.WNBA_BASKETBALL_AWARD,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `In the event of an award is given to more than 1 player. The player who averaged the most points per game (determined to the first decimal place, meaning a player averaging 36.1 points per game would win over the player averaging 36 points per game) for the regular the season will be the tie breaker. In the event of an additional tie, The regular season Field Goal % will be the final tie breaker.`,
                    },
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the award in the market question is not awarded for any reason by event expiration, this market should resolve as 'Invalid'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `WNBA: Which Player will have the most [0] at the end of the the [1] regular season?`,
                example: `WNBA: Which Player will have the most Points scored at the end of the the 2019-20 regular season?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Action`,
                    values: LIST_VALUES.BASKETBALL_ACTION,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Results are determined to the first decimal place, meaning a player averaging 10.6 rebounds per game is higher than a player averaging 10.0.`,
                    },
                    {
                      text: `In the event of a tie between two players these rules will be used to determine the winner: For points scored, field goal % should be used as the tie breaker.`,
                    },
                    {
                      text: `For the most rebounds, the player with the total most offensive rebounds, should be used as a tie breaker.`,
                    },
                    {
                      text: `For most total Assists, The player with the "Least" amount of turnovers should be used as the tie breaker.`,
                    },
                    {
                      text: `For most made 3-pointers, the player with the highest 3 point %, should be used as the tie breaker.`,
                    },
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the season is officially cancelled, the statistic at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, statistic at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league suspends play and play is not concluded before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: SCALAR,
                question: `WNBA: Total number of wins [0] will finish [1] regular season with?`,
                example: `WNBA: Total number of wins New York Liberty will finish 2019-20 regular season with?`,
                denomination: 'wins',
                tickSize: 0.1,
                minPrice: 0,
                maxPrice: 36,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games`,
                    },
                    {
                      text: `Market should resolve as whole number value of wins`,
                    },
                    {
                      text: `If the season is officially cancelled, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league's regular season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
            ],
          },
          [NCAA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `NCAA [0] BB: Will [1] win vs. [2] basketball?`,
                example: `NCAA Men's BB: Will Duke win vs. Kentucky?\nEstimated schedule start time: Sept 19, 2019 9:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as 'No' `,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official.  If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NCAA [0] BB: Will [1] win vs. [2] by [3] or more points?`,
                example: `NCAA Men's BB: Will Duke Blue Devils win vs. Kentucky Wildcats by 3 or more points?\nEstimated schedule start time: Sept 19, 2019 9:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as 'No' `,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official.  If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NCAA [0] BB: Will [1] & [2] score [3] or more combined points?`,
                example: `NCAA Men'sBB: Will UNC & Arizona score 142 or more combined points?\nEstimated schedule start time: Sept 19, 2019 9:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No'`,
                    },
                    {
                      text: `If game is not played market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NCAA [0] BB: Will [0] win the [1] NCAA National Championship?`,
                example: `NCAA Men's BB: Will Villanova win the 2020 NCAA National Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'No'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NCAA [0] BB: Will [1] make the [2] [3]?`,
                example: `NCAA Men's BB: Will USC make the 2020 Final Four?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.NCAA_BASKETBALL_EVENTS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the season is officially cancelled and the event named in the market is not played, this market should resolve as 'No'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event named in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event named in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA [0] BB: Which team will win: [1] vs. [2]?`,
                example: `NCAA Men's BB: Which Team will win: Duke vs. Kentucky?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No Winner'`,
                    },
                    {
                      text: `If game is not played market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA [0] BB (Point Spread): [1] to win by more than [2].5 points over [3]?`,
                example: `NCAA Men's BB (Point Spread): Duke to win by more than 10.5 points over Kentucky?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[1] -[2].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[3] +[2].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No Winner'`,
                    },
                    {
                      text: `If game is not played market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA [0] BB (O/U): [1] vs. [2]: Total Points scored; Over/Under [3].5?`,
                example: `NCAA Men's BB (O/U): Duke vs. Arizona: Total Points scored: Over/Under 164.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [2].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [2].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA [0] BB: Which college basketball team will win the [1] [2] tournament?`,
                example: `NCAA Men's BB: Which college basketball team will win the 2020 ACC tournament?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's/Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Conference`,
                    values: LIST_VALUES.NCAA_BASKETBALL_CONF,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 4,
                    type:
                      TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP,
                    inputSourceId: 2,
                    placeholder: `Select Team`,
                    values: NCAA_BASKETBALL_CONF_DEP_TEAMS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `The winner is determined by the team who wins their conference tournament championship game`,
                    },
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the season is officially cancelled and the event in the market not is played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA [0] BB: Which college basketball team will win the [1] D1 National Championship?`,
                example: `NCAA Men's BB: Which college basketball team will win the 2020 National Championship?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.USER_DROPDOWN_OUTCOME,
                    placeholder: `Select Team`,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
            ],
          },
        },
      },
      [BASEBALL]: {
        templates: [
          {
            marketType: YES_NO,
            question: `MLB: Will the [0] win the [1] [2]?`,
            example: `MLB: Will the NY Yankees win the 2020 World Series?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team`,
                defaultLabel: `Select Event First`,
                values: [],
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Event`,
                inputDestIds: [0],
                values: LIST_VALUES.BASEBALL_EVENT,
                inputDestValues: BASEBALL_EVENT_DEP_TEAMS,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the season is officially cancelled and event in market is not played, this market should resolve as 'No'`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event in market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event in market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                }
              ]
            },
          },
          {
            marketType: CATEGORICAL,
            question: `MLB: Which team will win: [0] vs. [1]?`,
            example: `MLB: Which Team will win: Yankees vs. Red Sox?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                placeholder: `Team A`,
                values: LIST_VALUES.MLB_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                placeholder: `Team B`,
                values: LIST_VALUES.MLB_TEAMS,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Winner`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the "official time limit", or ends in a tie, the market should resolve as 'No Winner'`,
                },
                {
                  text: `If event is postponed and concludes after markets event expiration the market should resolve as 'No Winner'`,
                },
                {
                  text: `If the game is not played market should resolve as 'No Winner'`,
                },
                {
                  text: `Extra innings count towards settlement purposes`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `MLB (Run Spread): [0] to win by more than [1].5 runs over the [2]?`,
            example: `MLB (Run Spread): NY Yankees to win by more than 2.5 runs over the Boston Red Sox?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team A`,
                values: LIST_VALUES.MLB_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                validationType: ValidationType.WHOLE_NUMBER,
                placeholder: `Whole #`,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team B`,
                values: LIST_VALUES.MLB_TEAMS,
              },
              {
                id: 3,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                placeholder: `Date time`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Winner`,
              },
              {
                id: 5,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[0] -[1].5`,
              },
              {
                id: 6,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[2] +[1].5`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the "official time limit", or ends in a tie, the market should resolve as 'No Winner'`,
                },
                {
                  text: `If event is postponed and concludes after markets event expiration the market should resolve as 'No Winner'`,
                },
                {
                  text: `If the game is not played market should resolve as 'No Winner'`,
                },
                {
                  text: `Extra innings count towards settlement purposes`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `MLB (O/U): [0] vs. [1]: Total Runs scored; Over/Under [2].5?`,
            example: `MLB (O/U): NY Yankees vs. Boston Red Sox: Total Runs scored; Over/Under 9.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team A`,
                values: LIST_VALUES.MLB_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team B`,
                values: LIST_VALUES.MLB_TEAMS,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                validationType: ValidationType.WHOLE_NUMBER,
                placeholder: `Whole #`,
              },
              {
                id: 3,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                placeholder: `Date time`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Winner`,
              },
              {
                id: 5,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Over [2].5`,
              },
              {
                id: 6,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Under [2].5`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the "official time limit", or ends in a tie, the market should resolve as 'No Winner'`,
                },
                {
                  text: `If event is postponed and concludes after markets event expiration the market should resolve as 'No Winner'`,
                },
                {
                  text: `If the game is not played market should resolve as 'No Winner'`,
                },
                {
                  text: `Extra innings count towards settlement purposes`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which MLB team will win the [0] [1]?`,
            example: `Which MLB team will win the 2020 World Series?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.BASEBALL_EVENT,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 3,
                type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP,
                inputSourceId: 1,
                placeholder: `Select Team`,
                values: BASEBALL_EVENT_DEP_TEAMS,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
                {
                  text: `If the season is officially cancelled and the event in the market not is played, this market should resolve as 'Invalid'`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                }
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `MLB: Which player will win the [0] [1]?`,
            example: `MLB: Which Player will win the 2019 American League Cy Young award?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Award`,
                values: LIST_VALUES.BASEBALL_AWARDS,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
                {
                  text: `If the award in the market question is not awarded for any reason by event expiration, this market should resolve as 'Invalid'`,
                },
              ],
            },
          },
          {
            marketType: SCALAR,
            question: `MLB: Total number of wins the [0] will finish the [1] regular season with?`,
            example: `MLB: Total number of wins the LA Dodgers will finish the 2019 regular season with?`,
            denomination: 'wins',
            tickSize: 0.1,
            minPrice: 0,
            maxPrice: 162,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team`,
                values: LIST_VALUES.MLB_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games.`,
                },
                {
                  text: `Market should resolve as whole number value of wins`,
                },
                {
                  text: `If the season is officially cancelled, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                },
                {
                  text: `If the league's regular season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`
                }
              ],
            },
          },
        ],
      },
      [OLYMPICS]: {
        children: {
          [SUMMER]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Olympics [0]: Will [1] win a gold medal in [2] at the [3] Summer Olympics?`,
                example: `Olympics Swimming: Will Norway win a gold medal in 50m Freestyle (Men/Women) at the 2020 Summer Olympics?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Sport`,
                    inputDestIds: [2],
                    values: LIST_VALUES.OLYMPIC_SUMMER_SPORTS,
                    inputDestValues: OLYMPIC_SUMMER_SPORT_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Sport First`,
                    values: [],
                    placeholder: `Event`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.SUMMER_OLYMPIC_YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event is not played market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `Olympics [0]: Will [1] win more [2] medals than [3] at the [4] Summer Olympics?`,
                example: `Olympics Swimming: Will Norway win more gold medals than Belgium at the 2020 Summer Olympics`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Sport`,
                    values: LIST_VALUES.OLYMPIC_SUMMER_SPORTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_MEDALS,
                    placeholder: `Medal type`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.SUMMER_OLYMPIC_YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event is not played market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `Olympics [0]: Will [1] break the [2] Record in [3] at the [4] Summer Olympics?`,
                example: `Olympics Swimming: Will Michael Phelps break the world Record in 100m Freestyle (Men/Women)	at the 2020 Summer Olympics`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Sport`,
                    inputDestIds: [3],
                    values: LIST_VALUES.OLYMPIC_SUMMER_SPORTS,
                    inputDestValues: OLYMPIC_SUMMER_SPORT_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Single person's name`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_LIST,
                    placeholder: `World/Olympic`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Sport First`,
                    values: [],
                    placeholder: `Event`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.SUMMER_OLYMPIC_YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event is not played market should resolve as 'No'`,
                    },
                    {
                      text: `If the person does not compete the market should resolve as 'No'`,
                    },
                    {
                      text: `If the person breaks the record and is disqualified before event expiration the market should resolve as 'No'`,
                    },
                    {
                      text: `If the person breaks the record and is disqualified after event expiration the market should resolve as 'Yes'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `Olympics [0]: Will [1] win [2] medal in [3] at the [4] Summer Olympics?`,
                example: `Olympics Swimming: Will Michael Phelps win a gold medial in 100m Freestyle (Men/Women) at the 2020 Summer Olympics`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Sport`,
                    inputDestIds: [3],
                    values: LIST_VALUES.OLYMPIC_SUMMER_SPORTS,
                    inputDestValues: OLYMPIC_SUMMER_SPORT_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Single person's name`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_LIST_MEDAL,
                    placeholder: `Any/a Gold`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Sport First`,
                    values: [],
                    placeholder: `Event`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.SUMMER_OLYMPIC_YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event is not played market should resolve as 'No'`,
                    },
                    {
                      text: `If the person does not compete the market should resolve as 'No'`,
                    },
                    {
                      text: `If the person wins and is disqualified before event expiration the market should resolve as 'No'`,
                    },
                    {
                      text: `If the person wins and is disqualified after event expiration the market should resolve as 'Yes'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Olympics: Which country will win the most [0] medals at the [1] Summer Olympics?`,
                example: `Olympics: Which country will win the most Gold medals at the 2020 Summer Olympics`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_MEDALS,
                    placeholder: `Medal type`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.SUMMER_OLYMPIC_YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Field (Any other team)`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.USER_DROPDOWN_OUTCOME,
                    placeholder: `Select Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event does not take place this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `Metal count is determined at event expiration, if event expiration is before the completion of the games this market should resolve as 'Invalid'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Olympics [0]: Which country will win the Gold medal in [1] at the [2] Summer Olympics?`,
                example: `Olympics Tennis: Which country will win the Gold medal in Singles (Men/Women) at the 2020 Summer Olympics`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Sport`,
                    inputDestIds: [1],
                    values: LIST_VALUES.OLYMPIC_SUMMER_SPORTS,
                    inputDestValues: OLYMPIC_SUMMER_SPORT_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Sport First`,
                    values: [],
                    placeholder: `Event`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.SUMMER_OLYMPIC_YEARS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Field (Any other team)`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.USER_DROPDOWN_OUTCOME,
                    placeholder: `Select Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event does not take place this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the country wins and is disqualified after event expiration the original result should stand`,
                    },
                  ],
                },
              },
              {
                marketType: SCALAR,
                question: `How many [0] medals will [1] finish with in the [2] Summer Olympics?`,
                example: `How many Gold medals will Norway finish with in the 2020 Summer Olympics?`,
                denomination: 'medals',
                tickSize: 0.1,
                minPrice: 0,
                maxPrice: 250,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_MEDALS,
                    placeholder: `Medal type`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.SUMMER_OLYMPIC_YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event does not take place this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `Metal count is determined at event expiration, if event expiration is before the completion of the games this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `Market should resolve as whole number value of metals`,
                    },
                  ],
                },
              },
            ],
          },
          [WINTER]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Olympics [0]: Will [1] win a gold medal in [2] at the [3] Winter Olympics?`,
                example: `Olympics Snowboarding: Will Norway win a gold medal in 50m Freestyle (Men/Women) at the 2020 Winter Olympics?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Sport`,
                    inputDestIds: [2],
                    values: LIST_VALUES.OLYMPIC_WINTER_SPORTS,
                    inputDestValues: OLYMPIC_WINTER_SPORT_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Sport First`,
                    values: [],
                    placeholder: `Event`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.WINTER_OLYMPIC_YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event is not played market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `Olympics [0]: Will [1] win more [2] medals than [3] at the [4] Summer Olympics?`,
                example: `Olympics Snowboarding: Will Netherlands win more gold medals than Belgium at the 2020 Summer Olympics`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Sport`,
                    values: LIST_VALUES.OLYMPIC_WINTER_SPORTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_MEDALS,
                    placeholder: `Medal type`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.WINTER_OLYMPIC_YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event is not played market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `Olympics [0]: Will [1] break the [2] Record in [3] at the [4] Winter Olympics?`,
                example: `Olympics Snowboarding: Will Shaun White break the world Record in 100m Freestyle (Men/Women)	at the 2020 Winter Olympics`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Sport`,
                    inputDestIds: [3],
                    values: LIST_VALUES.OLYMPIC_WINTER_SPORTS,
                    inputDestValues: OLYMPIC_WINTER_SPORT_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Single person's name`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_LIST,
                    placeholder: `World/Olympic`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Sport First`,
                    values: [],
                    placeholder: `Event`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.WINTER_OLYMPIC_YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event is not played market should resolve as 'No'`,
                    },
                    {
                      text: `If the person does not compete the market should resolve as 'No'`,
                    },
                    {
                      text: `If the person breaks the record and is disqualified before event expiration the market should resolve as 'No'`,
                    },
                    {
                      text: `If the person breaks the record and is disqualified after event expiration the market should resolve as 'Yes'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `Olympics [0]: Will [1] win [2] medal in [3] at the [4] Winter Olympics?`,
                example: `Olympics Snowboarding: Will Shaun Whitee win a gold medial in Big Air (Mens/Womens) at the 2020 Winter Olympics`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Sport`,
                    inputDestIds: [3],
                    values: LIST_VALUES.OLYMPIC_WINTER_SPORTS,
                    inputDestValues: OLYMPIC_WINTER_SPORT_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Single person's name`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_LIST_MEDAL,
                    placeholder: `Any/a Gold`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Sport First`,
                    values: [],
                    placeholder: `Event`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.WINTER_OLYMPIC_YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event is not played market should resolve as 'No'`,
                    },
                    {
                      text: `If the person does not compete the market should resolve as 'No'`,
                    },
                    {
                      text: `If the person wins and is disqualified before event expiration the market should resolve as 'No'`,
                    },
                    {
                      text: `If the person wins and is disqualified after event expiration the market should resolve as 'Yes'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Olympics: Which country will win the most [0] medals at the [1] Winter Olympics?`,
                example: `Olympics: Which country will win the most Gold medals at the 2020 Winter Olympics`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_MEDALS,
                    placeholder: `Medal type`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.WINTER_OLYMPIC_YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Field (Any other team)`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.USER_DROPDOWN_OUTCOME,
                    placeholder: `Select Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event does not take place this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `Metal count is determined at event expiration, if event expiration is before the completion of the games this market should resolve as 'Invalid'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Olympics [0]: Which country will win the Gold medal in [1] at the [2] Winter Olympics?`,
                example: `Olympics Curling: Which country will win the Gold medal in mens at the 2020 Winter Olympics`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Sport`,
                    inputDestIds: [1],
                    values: LIST_VALUES.OLYMPIC_WINTER_SPORTS,
                    inputDestValues: OLYMPIC_WINTER_SPORT_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Sport First`,
                    values: [],
                    placeholder: `Event`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.WINTER_OLYMPIC_YEARS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Field (Any other team)`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.USER_DROPDOWN_OUTCOME,
                    placeholder: `Select Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event does not take place this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the country wins and is disqualified after event expiration the original result should stand`,
                    },
                  ],
                },
              },
              {
                marketType: SCALAR,
                question: `How many [0] medals will [1] finish with in the [2] Winter Olympics?`,
                example: `How many Gold medals will Norway finish with in the 2020 Winter Olympics?`,
                denomination: 'medals',
                tickSize: 0.1,
                minPrice: 0,
                maxPrice: 250,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_MEDALS,
                    placeholder: `Medal type`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Country`,
                    values: LIST_VALUES.OLYMPIC_COUNTRIES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.WINTER_OLYMPIC_YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the event does not take place this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `Metal count is determined at event expiration, if event expiration is before the completion of the games this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `Market should resolve as whole number value of medals`,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      [AMERICAN_FOOTBALL]: {
        children: {
          [NFL]: {
            templates: [
              {
                marketType: YES_NO,
                question: `NFL [0]: Will the [1] win vs. the [2]?`,
                example: `NFL Week 1: Will the NY Giants win vs. the New England Patriots?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NFL_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 8,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `If the game ends in a tie, the market should resolve as 'No' as Team A did NOT win vs. team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'`,
                    },
                    {
                      text: `If the game is not played market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NFL [0]: Will the [1] win vs. the [2] by [3] or more points?`,
                example: `NFL Week 1: Will the NY Giants win vs. the New England Patriots by 3 or more points?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NFL_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 8,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If game is not played or if less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'`,
                    },
                    {
                      text: `If the game is not played market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NFL [0]: Will the [1] & [2] score [3] or more combined points?`,
                example: `NFL Week 1: Will the NY Giants & the New England Patriots score 44 or more combined points?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NFL_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 8,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'`,
                    },
                    {
                      text: `If the game is not played market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NFL: Will the [0] have [1] or more regular season wins in [2]?`,
                example: `NFL: Will the Dallas Cowboys have 9 or more regular season wins in 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games`,
                    },
                    {
                      text: `If the season is officially cancelled, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league's regular season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NFL: Will the [0] win SuperBowl [1]?`,
                example: `NFL: Will the NY Giants win Superbowl LIV (54th)?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Numeral`,
                    values: LIST_VALUES.NFL_SUPER_BOWL,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the season is officially cancelled and no SuperBowl is played, this market should resolve as 'No'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the SuperBowl is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the SuperBowl is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NFL: Will [0] win the [1] [2] award?`,
                example: `NFL: Will Patrick Mahomes win the 2019-20 MVP award?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: TEXT_PLACEHOLDERS.SINGLE_PLAYER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year/Year`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Select Award`,
                    values: LIST_VALUES.FOOTBALL_AWARDS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the award in the market question is not awarded for any reason by event expiration, this market should resolve as 'No'.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0]: Which NFL Team will win: [1] vs. [2]?`,
                example: ` Week 1: Which NFL Team will win: NY Giants vs. New England Patriots?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NFL_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 8,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Tie/No Winner`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "Tie/No Winner"`,
                    },
                    {
                      text: `If the game is not played market should resolve as "Tie/No Winner"`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NFL (Point Spread) [0]: [1] to win by more than [2].5 points over [3]?`,
                example: `NFL (Point Spread) Week 1: Seattle Seahawks to win by more than 10.5 points over Dallas Cowboys?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NFL_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 8,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[1] -[2].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[3] +[2].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Winner'`,
                    },
                    {
                      text: `If the game is not played market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NFL (O/U) [0]: [1] vs. [2]: Total points scored; Over/Under [3].5?`,
                example: `NFL (O/U) Week 1: NY Giants vs. Dallas Cowboys: Total points scored: Over/Under 56.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NFL_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 8,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [2].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [2].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Winner'`,
                    },
                    {
                      text: `If the game is not played market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NFL team will win the [0] [1]?`,
                example: `Which NFL team will win the 2020 AFC Championship game?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.FOOTBALL_EVENT,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 3,
                    type:
                      TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP,
                    inputSourceId: 1,
                    placeholder: `Select Team`,
                    values: FOOTBALL_EVENT_DEP_TEAMS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the season is officially cancelled and the event in the market not is played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NFL player will win the [0] season [1] award?`,
                example: `Which NFL player will win the 2019-20 season Most Valuable Player award?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Award`,
                    values: LIST_VALUES.FOOTBALL_AWARDS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the award in the market question is not awarded for any reason by event expiration, this market should resolve as 'Invalid'`,
                    },
                  ],
                },
              },
              {
                marketType: SCALAR,
                question: `NFL: Total number of wins [0] will finish [1] regular season with?`,
                example: `NFL: Total number of wins NY Giants will finish 2019 regular season with?`,
                denomination: 'wins',
                tickSize: 0.1,
                minPrice: 0,
                maxPrice: 17,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games`,
                    },
                    {
                      text: `Market should resolve as whole number value of wins`,
                    },
                    {
                      text: `If the season is officially cancelled, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league's regular season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
            ],
          },
          [NCAA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `NCAA FB [0]: Will [1] win vs. [2]?`,
                example: `NCAA FB Week 1: Will Alabama Crimson Tide win vs. Florida Gators?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NCAA_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as 'NO' as Team A did NOT win vs. team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NCAA FB [0]: Will [1] win vs. [2] by [3] or more points?`,
                example: `NCAA FB Week 1: Will Alabama Crimson Tide win vs. Florida Gators by 7 or more points?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NCAA_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as 'No'`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NCAA FB [0]: Will [1] & [2] score [3] or more combined points?`,
                example: `NCAA FB Week 1: Will USC & UCLA score 51 or more combined points?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NCAA_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as 'No'`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA FB [0]: Which College Football Team will win: [1] vs. [2]?`,
                example: `NCAA FB Week 1: Which College Football Team will win: Alabama vs. Michigan?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NCAA_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO Winner' as Team A did NOT win vs. team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA FB (Point Spread) [0]: [1] to win by more than [2].5 points over [3]?`,
                example: `NCAA FB (Point Spread) Week 1: Alabama to win by more than 10.5 points over Michigan?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NCAA_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[1] -[2].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[3] +[2].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as 'No Winner'`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA FB (O/U) [0]: [1] vs. [2]: Total points scored; Over/Under [3].5?`,
                example: `NCAA FB (O/U) Week 1: Alabama vs. Michigan: Total points scored: Over/Under 56.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Week #`,
                    noSort: true,
                    values: LIST_VALUES.NCAA_WEEK_NUM,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [3].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [3].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as 'NO Winner'`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Winner'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA FB: Which team will win the [0] [1]: [2] vs. [3]?`,
                example: `NCAA FB: Which team will win the 2020 Cotton Bowl: Tennessee Volunteers vs. Miami Hurricanes?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Bowl Game`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Winner`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as 'NO Winner'`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Winner'`,
                    },
                    {
                      text: `If either of the teams listed are incorrect, market should resolve as Invalid`,
                    },
                    {
                      text: `This market is intended to be about a Bowl Game, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the season is officially cancelled and no Bowl Game is played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Bowl Game is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Bowl Game is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which college football team will win [0] National Championship?`,
                example: `Which college football team will win 2020 National Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.NCAA_FOOTBALL_EVENT,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.USER_DROPDOWN_OUTCOME,
                    placeholder: `Select Team`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                    },
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which college football player will win the [0] Heisman Trophy?`,
                example: `Which college football player will win the 2020 Heisman Trophy?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If winner is not listed as a market outcome, market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the award in the market question is not awarded for any reason by event expiration, this market should resolve as 'Invalid'`,
                    },
                  ],
                },
              },
              {
                marketType: SCALAR,
                question: `NCAA FB: Total number of wins [0] will finish the [1] regular season with?`,
                example: `NCAA FB: Total number of wins Michigan Wolverines will finish the 2019 regular season with?`,
                denomination: 'wins',
                tickSize: 0.1,
                minPrice: 0,
                maxPrice: 12,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    values: LIST_VALUES.YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games`,
                    },
                    {
                      text: `Market should resolve as whole number value of wins`,
                    },
                    {
                      text: `If the season is officially cancelled, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league's regular season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`
                    }
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
  [POLITICS]: {
    children: {
      [US_POLITICS]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will [0] win the [1] U.S. Presidential election?`,
            example: `Will Donald Trump win the 2020 U.S. Presidential election?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.SINGLE_CANDIDATE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.PRES_YEARS,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `The winning candidate will have at least 270 electoral votes to win the presidential election.`,
                },
                {
                  text: `This market is intended to be about a Single Candidate, if this is not the case, this market should settle as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `Will [0] win the [1] [2] U.S. Presidential nomination?`,
            example: `Will Elizabeth Warren win the 2020 Democratic U.S. Presidential nomination?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.SINGLE_CANDIDATE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.PRES_YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Party`,
                values: LIST_VALUES.POL_PARTY,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `The candidate who receives a majority of the party's delegates wins their party's nomination.`,
                },
                {
                  text: `This market is intended to be about a Single Candidate, if this is not the case, this market should settle as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `Will [0] run for [1] by [2]?`,
            example: `Will Oprah Winfrey run for U.S. President by December 31, 2019 1 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.SINGLE_CANDIDATE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Office`,
                values: LIST_VALUES.OFFICES,
              },
              {
                id: 2,
                type: TemplateInputType.DATETIME,
                placeholder: `Specific Datetime`,
                label: `Specific Datetime`,
                sublabel: `Specify date time for event`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `House, Senate and presidential candidates must register a Statement of Candidacy for the specific office and electioin cycle with the Federal Election Commission`,
                },
                {
                  text: `Vice-President nomination is selected by the political party, replacement of nomination will not change market results, because person had been nominated. Declining nomination is not considered nominated`,
                },
                {
                  text: `This market is intended to be about a Single Candidate, if this is not the case, this market should settle as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `Will a woman be elected U.S. President in the [0] Presidential election?`,
            example: `Will a woman be elected U.S. President in the 2020 Presidential election?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.PRES_YEARS,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `The winning candidate will have at least 270 electoral votes to win the presidential election.`,
                },
                {
                  text:
                    'The candidate elected president shall be biologically female.',
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `Will [0] be impeached by [1]?`,
            example: `Will Donald Trump be impeached by December 31, 2019 11:59 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.SINGLE_PERSON_NAME,
              },
              {
                id: 1,
                type: TemplateInputType.DATETIME,
                placeholder: `Specific Datetime`,
                label: `Specific Datetime`,
                sublabel: `Specify date time for event`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `The U.S. House of Representatives shall, by simple majority vote, approve or pass one or more articles of impeachment.`,
                },
                {
                  text: `The Senate's judgment or decision, whether to be convicted, acquitted or removed from office does not change market results.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which party will win the [0] U.S. Presidential election?`,
            example: `Which party will win the 2020 U.S. Presidential election?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.PRES_YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 2,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Democratic Party`,
              },
              {
                id: 3,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Republican Party`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `The winning party will win the majority of 270 electoral votes.`,
                },
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Who will win the [0] U.S. Presidential election?`,
            example: `Who will win the 2020 U.S. Presidential election?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.PRES_YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `The winning candidate will have at least 270 electoral votes to win the presidential election.`,
                },
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Who will be the [0] nominee for [1] [2]?`,
            example: `Who will be the Republican nominee for 2020 U.S. Vice-President?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Party`,
                values: LIST_VALUES.POL_PARTY,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Office`,
                values: LIST_VALUES.PRES_OFFICES,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `The candidate who receives a majority of the party's delegates wins their party's nomination.`,
                },
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which party will win [0] in the [1] U.S. Presidential election?`,
            example: `Which party will win Michigan in the 2020 U.S. Presidential election?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `State`,
                values: LIST_VALUES.US_STATES,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.PRES_YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `The winning outcome is the party which controls the majority of seats, according to the results of the election, not determined by the current controlling party at event expiration.`,
                },
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which party will control the [0] after the [1] election?`,
            example: `Which party will control the U.S House of Representatives after the 2020 election?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Office`,
                values: LIST_VALUES.POL_HOUSE_SENATE_OFFICE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 3,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Democratic Party`,
              },
              {
                id: 4,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Republican Party`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `The winning outcome is the party which controls the majority of seats, following the results of the election, not determined by the current controlling party at event expiration`,
                },
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Who will win the [0] [1] [2] primary for U.S. Presidential election?`,
            example: `Who will win the 2020 South Carolina Democratic primary for U.S Presidential election?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.PRES_YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `State`,
                values: LIST_VALUES.US_STATES,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Party`,
                values: LIST_VALUES.POL_PARTY,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No winner/Event cancelled`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the primary does not take place the market should resolve as "No winner/Event cancelled"`,
                },
                {
                  text: `The winner of the primary is the candidate recognized and/or announced by the state`,
                },
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Who will win the [0] [1] [2] caucus for U.S. Presidential election?`,
            example: `Who will win the 2020 South Carolina Democratic caucus for U.S Presidential election?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.PRES_YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `State`,
                values: LIST_VALUES.US_STATES,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Party`,
                values: LIST_VALUES.POL_PARTY,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No winner/Event cancelled`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the caucus does not take place the market should resolve as "No winner/Event cancelled"`,
                },
                {
                  text: `The winner of the caucus is the candidate recognized and/or announced by the political party`,
                },
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
              ],
            },
          },
        ],
      },
      [WORLD]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will [0] be [1] of [2] on [3]?`,
            example: `Will Kim Jong Un be Supreme Leader of North Korea on December 31, 2019 11:59 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.SINGLE_PERSON_NAME,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Position`,
                values: LIST_VALUES.POL_POSITION,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                placeholder: `Location`,
              },
              {
                id: 3,
                type: TemplateInputType.DATETIME,
                placeholder: `Specific Datetime`,
                label: `Specific Datetime`,
                sublabel: `Specify date time for event`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If location/country does not have the stated position in market, market should resolve as 'No'`,
                },
                {
                  text: `This market is intended to be about a Single Person and a Single Location, if this is not the case, this market should settle as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `Will [0] be impeached by [1]?`,
            example: `Will Benjamin Netanyahu be impeached be December 31, 2019 11:59 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.SINGLE_PERSON_NAME,
              },
              {
                id: 1,
                type: TemplateInputType.DATETIME,
                placeholder: `Specific Datetime`,
                label: `Specific Datetime`,
                sublabel: `Specify date time for event`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text:
                    "Rules of impeachment is dictated by the person's location/country government",
                },
                {
                  text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `Will Pope [0] vacate papacy by [1]?`,
            example: `Will Pope Francis vacate papacy by be December 31, 2019 11:59 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.SINGLE_PERSON_NAME,
              },
              {
                id: 1,
                type: TemplateInputType.DATETIME,
                placeholder: `Specific Datetime`,
                label: `Specific Datetime`,
                sublabel: `Specify date time for event`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text:
                    'If person mentioned in question shall cease to hold the office of papacy for any reason',
                },
                {
                  text:
                    'Announcement of future resignation does not count as leaving the office, until actual resignation takes effect',
                },
                {
                  text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Who will be [0] of [1] by [2]?`,
            example: `Who be Supreme Leader of North Korea on December 31, 2019 11:59 pm EST`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Position`,
                values: LIST_VALUES.POL_POSITION,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Location`,
              },
              {
                id: 2,
                type: TemplateInputType.DATETIME,
                placeholder: `Specific Datetime`,
                label: `Specific Datetime`,
                sublabel: `Specify date time for event`,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If location/country does not have the stated position in market, market should resolve as "Invalid"`,
                },
                {
                  text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
                },
                {
                  text: `If the country named in the market question has multiple people with the same title, the market should resolve as 'Invalid'`,
                },
                {
                  text: `This market is intended to be about a Single Location, if this is not the case, this market should settle as 'Invalid'.`,
                },
              ],
            },
          },
        ],
      },
    },
  },
  [FINANCE]: {
    children: {
      [STOCKS]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will [0] ([1]) close on or above [2] on the [3] on [4]?`,
            example: `Will Apple (AAPL) close on or above 200 on then Nasdaq (traded in USD) on September 1, 2020?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.INDIVIDUAL_STOCK_OR_ETF_NAME,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.INDIVIDUAL_STOCK_OR_ETF_SYMBOL,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 3,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Exchange`,
                values: LIST_VALUES.FIN_STOCK_EXCHANGES,
              },
              {
                id: 4,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
                validationType: ValidationType.NOWEEKEND_HOLIDAYS,
              },
              {
                id: 5,
                type: TemplateInputType.DATEYEAR_CLOSING,
                placeholder: ``,
                inputDateYearId: 3,
                inputSourceId: 2,
                inputTimeOffset: FIN_EXCHANGES_CLOSING_OFFSETS,
                holidayClosures: FIN_EXCHANGES_HOLIDAY_CLOSURES,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Closing date is determined by the location of the exchange, where the stock is traded`,
                },
                {
                  text: `Trading denomination is determined by the exchange the stock is traded on`,
                },
                {
                  text: `If trading day in market question is a weekend or holiday when exchange is not open this market should resolve as 'Invalid'`,
                },
                {
                  text: `If stock trading name and ticker symbol is not used in the market question, the market should resolve as 'Invalid'`,
                },
                {
                  text: `This market is intended to be about a Individual Stock or ETF Ticker Symbol, if this is not the case, this market should settle as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `Will [0] ([1]) exceed [2] on the [3], anytime between the opening on [4] and the close on [5]?`,
            example: `Will Apple (AAPL) exceed 250 on the Nasdaq (traded in USD) anytime between the opening on June 1, 2020 and the close on September 1, 2020?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.INDIVIDUAL_STOCK_OR_ETF_NAME,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.INDIVIDUAL_STOCK_OR_ETF_SYMBOL,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 3,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Exchange`,
                values: LIST_VALUES.FIN_STOCK_EXCHANGES,
              },
              {
                id: 4,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Start Day of Year`,
                validationType: ValidationType.NOWEEKEND_HOLIDAYS,
              },
              {
                id: 5,
                dateAfterId: 3,
                type: TemplateInputType.DATEYEAR,
                placeholder: `End Day of Year`,
                validationType: ValidationType.NOWEEKEND_HOLIDAYS,
              },
              {
                id: 6,
                type: TemplateInputType.DATEYEAR_CLOSING,
                placeholder: ``,
                inputDateYearId: 3,
                inputSourceId: 2,
                inputTimeOffset: FIN_EXCHANGES_CLOSING_OFFSETS,
                holidayClosures: FIN_EXCHANGES_HOLIDAY_CLOSURES,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Trading dates are determined by the location of the exchange, where the stock is traded`,
                },
                {
                  text: `Trading denomination is determined by the exchange the stock is traded on`,
                },
                {
                  text: `If trading day in market question is a weekend or holiday when exchange is not open this market should resolve as 'Invalid'`,
                },
                {
                  text: `If stock trading name and ticker symbol is not used in the market question, the market should resolve as 'Invalid'`,
                },
                {
                  text: `This market is intended to be about a Individual Stock or ETF Name, if this is not the case, this market should settle as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: SCALAR,
            question: `What will [0] ([1]) close at on the [2] on [3]?`,
            example: `What will Apple (AAPL) close at on the Nasdaq (traded in USD) on December 31, 2019?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.INDIVIDUAL_STOCK_OR_ETF_NAME,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.INDIVIDUAL_STOCK_OR_ETF_SYMBOL,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Exchange`,
                values: LIST_VALUES.FIN_STOCK_EXCHANGES,
              },
              {
                id: 3,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
                validationType: ValidationType.NOWEEKEND_HOLIDAYS,
              },
              {
                id: 4,
                type: TemplateInputType.DATEYEAR_CLOSING,
                placeholder: ``,
                inputDateYearId: 2,
                inputSourceId: 1,
                inputTimeOffset: FIN_EXCHANGES_CLOSING_OFFSETS,
                holidayClosures: FIN_EXCHANGES_HOLIDAY_CLOSURES,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Closing date is determined by the location of the exchange, where the stock is traded`,
                },
                {
                  text: `Trading denomination is determined by the exchange the stock is traded on`,
                },
                {
                  text: `If trading day in market question is a weekend or holiday when exchange is not open this market should resolve as 'Invalid'`,
                },
                {
                  text: `If stock trading name and ticker symbol is not used in the market question, the market should resolve as 'Invalid'`,
                },
                {
                  text: `This market is intended to be about a Individual Stock or ETF Ticker Symbol, if this is not the case, this market should settle as 'Invalid'.`,
                },
              ],
            },
          },
        ],
      },
      [INDEXES]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the [0] close on or above [1] on [2]?`,
            example: `Will the Dow Jones Industrial Average close on or above 28,000.00 on September 20, 2019?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Index`,
                values: LIST_VALUES.FIN_INDEXES,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 2,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
                validationType: ValidationType.NOWEEKEND_HOLIDAYS,
              },
              {
                id: 3,
                type: TemplateInputType.DATEYEAR_CLOSING,
                placeholder: ``,
                inputDateYearId: 2,
                inputSourceId: 0,
                inputTimeOffset: FIN_INDEXES_CLOSING_OFFSETS,
                holidayClosures: FIN_INDEXES_HOLIDAY_CLOSURES,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Closing date is determined by the location of the exchange, where the underlying stocks for the index are traded`,
                },
                {
                  text: `If trading day in market question is a weekend or holiday when exchange is not open this market should resolve as 'Invalid'`,
                },
              ],
            },
          },
          {
            marketType: SCALAR,
            question: `What will the [0] close at on [2]?`,
            example: `What will the S&P 500 close at on December 31, 2019?`,
            denomination: 'value',
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Index`,
                values: LIST_VALUES.FIN_INDEXES,
              },
              {
                id: 2,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
                validationType: ValidationType.NOWEEKEND_HOLIDAYS,
              },
              {
                id: 3,
                type: TemplateInputType.DATEYEAR_CLOSING,
                placeholder: ``,
                inputDateYearId: 2,
                inputSourceId: 0,
                inputTimeOffset: FIN_INDEXES_CLOSING_OFFSETS,
                holidayClosures: FIN_INDEXES_HOLIDAY_CLOSURES,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Closing date is determined by the location of the exchange, where the underlying stocks for the index are traded`,
                },
                {
                  text: `If trading day in market question is a weekend or holiday when exchange is not open this market should resolve as 'Invalid'`,
                },
              ],
            },
          },
        ],
      },
    },
  },
  [ENTERTAINMENT]: {
    templates: [
      {
        marketType: YES_NO,
        question: `Will [0] host the [1] [2]?`,
        example: `Will Billy Crystal host the 2019 Academy Awards?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: TEXT_PLACEHOLDERS.SINGLE_PERSON_NAME,
          },
          {
            id: 1,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Year`,
            values: LIST_VALUES.YEARS,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Event`,
            values: LIST_VALUES.ENTERTAINMENT_EVENT,
          },
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text:
                'If more than one person hosts the event and the person named in the market is one of the multiple hosts, the market should resolve as "Yes"',
            },
            {
              text: `Person has to officially host the event in order for the market to resolve as "Yes", not just named as host`,
            },
            {
              text: `If event does not occur the market should resolve as 'No'`,
            },
            {
              text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
            },
          ],
        },
      },
      {
        marketType: YES_NO,
        question: `Will [0] win an award for [1] at the [2] [3]?`,
        example: `Will Leonardo DiCaprio win an award for Best Actor at the 2016 Academy Awards?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder:
              TEXT_PLACEHOLDERS.SINGLE_PERSON_OR_GROUP_OR_MOVIE_TITLE,
          },
          {
            id: 1,
            type: TemplateInputType.DROPDOWN,
            defaultLabel: `Select Event First`,
            placeholder: `Award`,
            values: [],
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Year`,
            values: LIST_VALUES.YEARS,
          },
          {
            id: 3,
            type: TemplateInputType.DROPDOWN_QUESTION_DEP,
            placeholder: `Event`,
            inputDestIds: [1],
            values: LIST_VALUES.ENTERTAINMENT_EVENT,
            inputDestValues: ENTERTAINMENT_EVENT_DEP_TEAMS,
          },
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text:
                'If more than one person wins the award and the person named in the market is one of the named, the market should resolve as "Yes"',
            },
            {
              text: `If event does not occur the market should resolve as 'No'`,
            },
            {
              text: `This market is intended to be about a Single Person, if this is not the case, this market should settle as 'Invalid'.`,
            },
          ],
        },
      },
      {
        marketType: YES_NO,
        question: `Will the total gross for [0] be $[1] USD or more on domestic opening weekend of [2] in the US, according to www.boxofficemojo.com?`,
        example: `Will the total gross for Avengers: Endgame gross 350 million USD or more on domestic opening weekend of April 22, 2019 in the US, according to www.boxofficemojo.com?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: TEXT_PLACEHOLDERS.INDIVIDUAL_MOVIE_TITLE,
          },
          {
            id: 1,
            type: TemplateInputType.TEXT,
            placeholder: `Total Gross sales`,
          },
          {
            id: 2,
            type: TemplateInputType.DATEYEAR,
            validationType:
              ValidationType.EXP_DATE_TUESDAY_AFTER_MOVIE_NO_FRIDAY,
            placeholder: `Opening day`,
          },
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text: `Gross total should include the first Friday through Sunday of the movie release and does not include extra days due to holidays`,
            },
            {
              text: `This market is intended to be about a Single Movie, if this is not the case, this market should settle as 'Invalid'.`,
            },
            {
              text:
                'If www.boxofficemojo.com is down or not available use www.the-numbers.com to determine domestic US total gross of movie.',
            },
          ],
        },
      },
      {
        marketType: YES_NO,
        question: `Head-to-Head: Will [0] on domestic opening weekend of [1] in the US gross more than [2] on its opening weekend in US, according to www.boxofficemojo.com?`,
        example: `Head-to-Head: Will Avengers: Endgame on domestic opening weekend of April 22, 2019 gross more than Avengers: Age of Ultron on its opening weekend in the US, according to www.boxofficemojo.com?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: TEXT_PLACEHOLDERS.INDIVIDUAL_MOVIE_TITLE,
          },
          {
            id: 1,
            type: TemplateInputType.DATEYEAR,
            validationType:
              ValidationType.EXP_DATE_TUESDAY_AFTER_MOVIE_NO_FRIDAY,
            placeholder: `Opening day`,
          },
          {
            id: 2,
            type: TemplateInputType.TEXT,
            placeholder: TEXT_PLACEHOLDERS.INDIVIDUAL_MOVIE_TITLE,
          },
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text:
                'Gross total should include the first Friday through Sunday of the movie release and does not include extra days due to holidays',
            },
            {
              text: `This market is intended to be about a Single Movie compared to another uniquely identifiable Single Movie, if this is not the case, this market should settle as 'Invalid'.`,
            },
            {
              text:
                'If www.boxofficemojo.com is down or not available use www.the-numbers.com to determine domestic US total gross of movies.',
            },
          ],
        },
      },
      {
        marketType: YES_NO,
        question: `Twitter: Will @[0] have [1] [2] or more twitter followers on [3], according to www.trackalytics.com?`,
        example: `Twitter: Will @elonmusk have 50 million or more twitter followers on September 12, 2020, according to www.trackalytics.com?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            validationType: ValidationType.SOCIAL,
            placeholder: TEXT_PLACEHOLDERS.INDIVIDUAL_SOCIAL_MEDIA_HANDLE,
          },
          {
            id: 1,
            type: TemplateInputType.TEXT,
            validationType: ValidationType.NUMBER,
            placeholder: `Number`,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            values: LIST_VALUES.AMOUNT_UNITS,
            placeholder: `Amount Unit`,
          },
          {
            id: 3,
            type: TemplateInputType.DATESTART,
            placeholder: `Day of Year`,
          },
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text:
                'If www.trackalytics.com is down or not available use inspectsocial.com/ to determine total twitter followers for the social media account stated in market question.',
            },
          ],
        },
      },
      {
        marketType: CATEGORICAL,
        question: `Who will host the [0] [1]?`,
        example: `Who wll host the 2020 Emmy Awards?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Year`,
            values: LIST_VALUES.YEARS,
          },
          {
            id: 1,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Event`,
            values: LIST_VALUES.ENTERTAINMENT_EVENT,
          },
          {
            id: 2,
            type: TemplateInputType.ADDED_OUTCOME,
            placeholder: `Multiple Hosts`,
          },
          {
            id: 3,
            type: TemplateInputType.ADDED_OUTCOME,
            placeholder: `Other (Field)`,
          },
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text:
                'The market should resolve as "multiple hosts" if more than one of the possible outcomes hosts the event. If only one of the potential outcomes hosts with multiple people, then the individual outcome would be the winner.',
            },
            {
              text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
            },
          ],
        },
      },
      {
        marketType: CATEGORICAL,
        question: `Who will win [0] in the [1] [2]?`,
        example: `Who will win Best Pop Vocal Album in the 2020 Grammy Awards?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.DROPDOWN,
            defaultLabel: `Select Event First`,
            placeholder: `Award`,
            values: [],
          },
          {
            id: 1,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Year`,
            values: LIST_VALUES.YEARS,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN_QUESTION_DEP,
            placeholder: `Event`,
            inputDestIds: [0],
            values: LIST_VALUES.ENTERTAINMENT_EVENT,
            inputDestValues: ENTERTAINMENT_EVENT_DEP_TEAMS,
          },
          {
            id: 3,
            type: TemplateInputType.ADDED_OUTCOME,
            placeholder: `Other (Field)`,
          },
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text: `If winner is not listed as a market outcome, market should resolve as "Other (Field)"`,
            },
          ],
        },
      },
    ],
  },
  [CRYPTO]: {
    children: {
      [BITCOIN]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the price of [0] open at or above [1] on [2], according to TradingView.com "[3]"?`,
            example: `Will the price of BTC/USD open at or above 8000 on December 31, 2019, according to TradingView.com "BTCUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [3],
                values: LIST_VALUES.BTC_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_BTC_CURRENCY_MARKETS,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 2,
                type: TemplateInputType.DATESTART,
                placeholder: `Day of Year`,
              },
              {
                id: 3,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie BTCUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if Coinbase's tradingview.com data feed is unavailable, find the opening price on Coinbase's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `Will the price of [0], exceed [1] anytime between the open of [2] and close of [3], according to TradingView.com "[4]"?`,
            example: `Will the price of BTC/USD exceed 8000 anytime between the open of September 1, 2019 and close of December 31, 2019, according to TradingView.com "BTCUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [4],
                values: LIST_VALUES.BTC_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_BTC_CURRENCY_MARKETS,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 2,
                type: TemplateInputType.DATESTART,
                placeholder: `Day of Year`,
              },
              {
                id: 3,
                dateAfterId: 2,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 4,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie BTCUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if Coinbase's tradingview.com data feed is unavailable, find the opening price on Coinbase's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
          {
            marketType: SCALAR,
            question: `What price will [0] open at on [1], according to TradingView.com "[2]"?`,
            example: `What price will BTC/USD open at on December 31, 2019, according to TradingView.com for "BTCUSD (crypto - Coinbase)"?`,
            denomination: 'Price',
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [2],
                values: LIST_VALUES.BTC_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_BTC_CURRENCY_MARKETS,
              },
              {
                id: 1,
                type: TemplateInputType.DATESTART,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie BTCUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if Coinbase's tradingview.com data feed is unavailable, find the opening price on Coinbase's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
        ],
      },
      [ETHEREUM]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the price of [0] open at or above [1] on [2], according to TradingView.com "[3]"?`,
            example: `Will the price of ETH/USD open at or above 800 on December 31, 2020, according to TradingView.com "ETHUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [3],
                values: LIST_VALUES.ETH_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_ETH_CURRENCY_MARKETS,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 2,
                type: TemplateInputType.DATESTART,
                placeholder: `Day of Year`,
              },
              {
                id: 3,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie ETHUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if Coinbase's tradingview.com data feed is unavailable, find the opening price on Coinbase's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `Will the price of [0], exceed [1] anytime between the open of [2] and close of [3], according to TradingView.com "[4]"?`,
            example: `Will the price of ETH/USD exceed 800 anytime between the open of September 1, 2020 and close of December 31, 2020, according to TradingView.com "ETHUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [4],
                values: LIST_VALUES.ETH_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_ETH_CURRENCY_MARKETS,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 2,
                type: TemplateInputType.DATESTART,
                placeholder: `Day of Year`,
              },
              {
                id: 3,
                dateAfterId: 2,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 4,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie ETHUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if Coinbase's tradingview.com data feed is unavailable, find the opening price on Coinbase's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
          {
            marketType: SCALAR,
            question: `What price will [0] open at on [1], according to TradingView.com "[2]"?`,
            example: `What price will ETH/USD open at on December 31, 2020, according to TradingView.com for "ETHUSD (crypto - Coinbase)"?`,
            denomination: 'Price',
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [2],
                values: LIST_VALUES.ETH_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_ETH_CURRENCY_MARKETS,
              },
              {
                id: 1,
                type: TemplateInputType.DATESTART,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie ETHUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if Coinbase's tradingview.com data feed is unavailable, find the opening price on Coinbase's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
        ],
      },
      [LITECOIN]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the price of [0] open at or above [1] on [2], according to TradingView.com "[3]"?`,
            example: `Will the price of LTC/USD open at or above 8000 on December 31, 2020, according to TradingView.com "LTCUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [3],
                values: LIST_VALUES.LTC_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_LTC_CURRENCY_MARKETS,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 2,
                type: TemplateInputType.DATESTART,
                placeholder: `Day of Year`,
              },
              {
                id: 3,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie LTCUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if Coinbase's tradingview.com data feed is unavailable, find the opening price on Coinbase's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `Will the price of [0], exceed [1] anytime between the open of [2] and close of [3], according to TradingView.com "[4]"?`,
            example: `Will the price of LTC/USD exceed 8000 anytime between the open of September 1, 2020 and close of December 31, 2020, according to TradingView.com "LTCUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [4],
                values: LIST_VALUES.LTC_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_LTC_CURRENCY_MARKETS,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 2,
                type: TemplateInputType.DATESTART,
                placeholder: `Day of Year`,
              },
              {
                id: 3,
                dateAfterId: 2,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 4,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie LTCUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if Coinbase's tradingview.com data feed is unavailable, find the opening price on Coinbase's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
          {
            marketType: SCALAR,
            question: `What price will [0] open at on [1], according to TradingView.com "[2]"?`,
            example: `What price will LTC/USD open at on December 31, 2020, according to TradingView.com for "LTCUSD (crypto - Coinbase)"?`,
            denomination: 'Price',
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [2],
                values: LIST_VALUES.LTC_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_LTC_CURRENCY_MARKETS,
              },
              {
                id: 1,
                type: TemplateInputType.DATESTART,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie LTCUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if Coinbase's tradingview.com data feed is unavailable, find the opening price on Coinbase's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
        ],
      },
    },
  },
};
