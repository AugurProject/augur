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
  BASKETBALL,
  NBA,
  NCAA,
  BASEBALL,
  AMERICAN_FOOTBALL,
  NFL,
  POLITICS,
  US_POLITICS,
  WORLD,
  FINANCE,
  STOCKS,
  INDEXES,
  ENTERTAINMENT,
  CRYPTO,
  BITCOIN,
  USD,
  USDT,
  EUR,
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
} from './templates-template';
import { LIST_VALUES, BASKETBALL_EVENT_DEP_TEAMS } from './templates-lists';

const YES_NO = 'YesNo';
const CATEGORICAL = 'Categorical'
const SCALAR = 'Scalar'

export const TEMPLATES = {
  [SPORTS]: {
    children: {
      [GOLF]: {
        children: {
          [PGA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will [0] win the [1] [2]?`,
                example: `Will Tiger Woods win the 2020 PGA Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player`,
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
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as "No"`,
                    },
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as No.`,
                    },
                    {
                      text: `For any Pro-Am markets both players names must be listed, If only one name is listed and that pair still wins, the market will should as Invalid.`,
                    }
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `Will [0] make the cut at the [1] [2]?`,
                example: `Will Tiger Woods make the cut at the 2020 PGA Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player`,
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
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as "No"`,
                    },
                    {
                      text: `If a tournament or match is cancelled the market should resolve as No. If the tournament is postponed and not be completed before the market's Event Expiration time, but the player named officially made the cut, noted by the tournament association, then the outcome should resolve as Yes.`,
                    },
                    {
                      text: `For any Pro-Am markets both players names must be listed, If only one name is listed and that pair still wins, the market will should as Invalid`,
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which golfer will win the [0] [1]?`,
                example: `Which golfer will win the 2020 PGA Championship?`,
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
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as No winner/Event Cancelled.`,
                    },
                    {
                      text: `For any Pro-Am markets both players names must be listed, If only one name is listed and that pair still wins, the market will should as invalid`,
                    }
                  ]
                },
              },
            ],
          },
          [EURO_TOUR]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will [0] win the [1] [2]?`,
                example: `Will Tiger Woods win the 2020 PGA Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player`,
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
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as "No"`,
                    },
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as No.`,
                    },
                    {
                      text: `For any Pro-Am markets both players names must be listed, If only one name is listed and that pair still wins, the market will should as Invalid.`,
                    }
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `Will [0] make the cut at the [1] [2]?`,
                example: `Will Tiger Woods make the cut at the 2020 PGA Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player`,
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
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as "No"`,
                    },
                    {
                      text: `If a tournament or match is cancelled the market should resolve as No. If the tournament is postponed and not be completed before the market's Event Expiration time, but the player named officially made the cut, noted by the tournament association, then the outcome should resolve as Yes.`,
                    },
                    {
                      text: `For any Pro-Am markets both players names must be listed, If only one name is listed and that pair still wins, the market will should as Invalid`,
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which golfer will win the [0] [1]?`,
                example: `Which golfer will win the 2020 PGA Championship?`,
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
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as No winner/Event Cancelled.`,
                    },
                    {
                      text: `For any Pro-Am markets both players names must be listed, If only one name is listed and that pair still wins, the market will should as invalid`,
                    }
                  ]
                },
              },
            ],
          },
          [LPGA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will [0] win the [1] [2]?`,
                example: `Will Tiger Woods win the 2020 PGA Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player`,
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
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as "No"`,
                    },
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as No.`,
                    },
                    {
                      text: `For any Pro-Am markets both players names must be listed, If only one name is listed and that pair still wins, the market will should as Invalid.`,
                    }
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `Will [0] make the cut at the [1] [2]?`,
                example: `Will Tiger Woods make the cut at the 2020 PGA Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player`,
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
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as "No"`,
                    },
                    {
                      text: `If a tournament or match is cancelled the market should resolve as No. If the tournament is postponed and not be completed before the market's Event Expiration time, but the player named officially made the cut, noted by the tournament association, then the outcome should resolve as Yes.`,
                    },
                    {
                      text: `For any Pro-Am markets both players names must be listed, If only one name is listed and that pair still wins, the market will should as Invalid`,
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which golfer will win the [0] [1]?`,
                example: `Which golfer will win the 2020 PGA Championship?`,
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
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as No winner/Event Cancelled.`,
                    },
                    {
                      text: `For any Pro-Am markets both players names must be listed, If only one name is listed and that pair still wins, the market will should as invalid`,
                    }
                  ]
                },
              },
            ],
          }
        }
      },
      [HOCKEY]: {
        templates: [
          {
            marketType: YES_NO,
            question: `NHL: Will the [0] win vs the [1], Estimated schedule start time: [2]?`,
            example: `NHL: Will the St Louis Blues win vs the Dallas Stars, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Team B`,
              },
              {
                id: 2,
                type: TemplateInputType.DATETIME,
                placeholder: `Date time`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Includes any Regulation, overtime and any shoot-outs. The game must go 55 minutes or more to be considered official. If it does not, the game will be considered unofficial and "No" should be deemed the winning outcome.`
                }
              ]
            },
          },
          {
            marketType: YES_NO,
            question: `NHL: Will the [0] & [1] score [2] or more combined goals, Estimated schedule start time: [3]?`,
            example: `NHL: Will the NY Rangers & Dallas Stars score 5 or more combined goals, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Team B`,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                validationType: ValidationType.WHOLE_NUMBER,
                placeholder: `Whole #`,
              },
              {
                id: 3,
                type: TemplateInputType.DATETIME,
                placeholder: `Date time`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text:
                    'Include Regulation, overtime and any shoot-outs. The game must go 55 minutes or more to be considered official. If it does not "No winner" should be deemed the winning outcome.',
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
                type: TemplateInputType.TEXT,
                placeholder: `Team`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                values: LIST_VALUES.YEAR_RANGE,
              },
            ],
            resolutionRules: {},
          },
          {
            marketType: CATEGORICAL,
            question: `NHL: Which team will win: [0] vs [1], Estimated schedule start time: [2]?`,
            example: `NHL: Which Team will win: NY Rangers vs NJ Devils, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                placeholder: `Team A`,
              },
              {
                id: 1,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                placeholder: `Team B`,
              },
              {
                id: 2,
                type: TemplateInputType.DATETIME,
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
                  text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, or ends in a tie, the market should resolve as "Draw/No Winner".`,
                },
                {
                  text: `Include Regulation, overtime and any shoot-outs. The game must go 55 minutes or more to be considered official. If it does not "No winner" should be deemed the winning outcome.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `NHL: [0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
            example: `NHL: St Louis Blues vs. NY Rangers: Total goals scored Over/Under 4.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Team B`,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                validationType: ValidationType.WHOLE_NUMBER,
                placeholder: `Whole #`,
              },
              {
                id: 3,
                type: TemplateInputType.DATETIME,
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
                  text: `If the game is not played or is NOT completed for any reason, the market should resolve as "No Winner".`,
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
              },              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
            ],
            resolutionRules: {},
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
            resolutionRules: {},
          },
          {
            marketType: SCALAR,
            question: `NHL: Total number of wins the [0] will finish [1] regular season with?`,
            example: `NHL: Total number of wins the LA Kings will finish 2019-20 regular season with?`,
            denomination: 'wins',
            tickSize: 1,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team`,
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
                placeholder: `Horse`,
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
                  text: `If the horse named in the market is scratched and does NOT run, including the cancellation of the race, or is disqualified for any reason, the market should resolve as "No".`,
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
                  text: `If the winning horse is not one of the possible outcomes listed, Other (Field) should resolve the winner.`
                },
                {
                  text: `If the Race is cancelled for any reason or is postponed and will not be completed before the event Resolution time for this market starts, "No Winner" should be the winning outcome.`
                },
                {
                  text: `If a horse is disqualified after being determined the winner: If the disqualification occurs before the market's Event Expiration time begins, and another horse is named the winner, the new horse should be reported the official winner.`
                },
                {
                  text: `If a horse is disqualified after being determined the winner: If the disqualification occurs after the market's Event Expiration, the disqualified horse will still be named the winner of the market.`
                }
              ]
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
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's/Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player`,
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
                    values: LIST_VALUES.TENNIS_EVENT,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as "No"`,
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
                    placeholder: `Event`,
                    values: LIST_VALUES.TENNIS_EVENT,
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
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Single Tennis: [1] [2] Match play winner: [3] vs [4]?`,
                example: `Men's Single Tennis: 2020 Wimbledon Match play winner between Roger Federer vs Rafael Nadal?`,
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
                    placeholder: `Event`,
                    values: LIST_VALUES.TENNIS_EVENT,
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
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner.`,
                    },
                    {
                      text: `If a player fails to start a tournament or a match, or the match was not able to start for any reason, the market should resolve as "No Winner".`,
                    },
                    {
                      text: `If the match is not played for any reason, or is terminated prematurely with both players willing and able to play, the market should resolve as "No Winner".`,
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
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's/Women's/Mixed`,
                    values: LIST_VALUES.TENNIS_MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player/Player`,
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
                    values: LIST_VALUES.TENNIS_EVENT,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as "No"`,
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
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's/Women's/Mixed`,
                    values: LIST_VALUES.TENNIS_MENS_WOMENS,
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
                    values: LIST_VALUES.TENNIS_EVENT,
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
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Doubles Tennis: [1] [2] Match play winner: [3] vs [4]?`,
                example: `Men's Doubles Tennis: 2020 Wimbledon Match play winner between Kevin Krawietz/Andreas Mies vs Bob Bryan/Mike Bryan?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's/Women's/Mixed`,
                    values: LIST_VALUES.TENNIS_MENS_WOMENS,
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
                    values: LIST_VALUES.TENNIS_EVENT,
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
                      text: `If a player is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner.`,
                    },
                    {
                      text: `If a player fails to start a tournament or a match, or the match was not able to start for any reason, the market should resolve as "No Winner".`,
                    },
                    {
                      text: `If the match is not played for any reason, or is terminated prematurely with both players willing and able to play, the market should resolve as "No Winner".`,
                    },
                  ],
                },
              },
            ],
          }
        }
      },
      [SOCCER]: {
        children: {
          [MENS]: {
            templates: [
              {
                marketType: CATEGORICAL,
                question: `Men's Soccer: Which team will win: [0] vs [1], Estimated schedule start time: [2]?`,
                example: `Men's Soccer: Which team will win: Real Madrid vs Manchester United, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team B`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Draw`,
                  },
                  {
                    id: 4,
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
                      text: `If the match concludes and is deemed an official game, meaning more than 90% of the scheduled match has been completed and the score ends in a tie, the market should resolve as "Draw".`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as "Unofficial game/Cancelled".`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Men's Soccer: [0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
                example: `Men's Soccer: Real Madrid vs Manchester United: Total goals scored Over/Under 4.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATETIME,
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
                  {
                    id: 7,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Unofficial game/Cancelled`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out. If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as "Unofficial game/Cancelled".`,
                    },
                  ],
                },
              },
            ],
          },
          [WOMENS]: {
            templates: [
              {
                marketType: CATEGORICAL,
                question: `Women's Soccer: Which team will win: [0] vs [1], Estimated schedule start time: [2]?`,
                example: `Women's Soccer: Which team will win: Real Madrid vs Manchester United, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team B`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Draw`,
                  },
                  {
                    id: 4,
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
                      text: `If the match concludes and is deemed an official game, meaning more than 90% of the scheduled match has been completed and the score ends in a tie, the market should resolve as "Draw".`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as "Unofficial game/Cancelled".`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Women's Soccer: [0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
                example: `Women's Soccer: Real Madrid vs Manchester United: Total goals scored Over/Under 4.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATETIME,
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
                  {
                    id: 7,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Unofficial game/Cancelled`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out. If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as "Unofficial game/Cancelled".`,
                    },
                  ],
                },
              },
            ],
          }
        }
      },
      [BASKETBALL]: {
        children: {
          [NBA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `NBA: Will the [0] win vs the [1], Estimated schedule start time: [2]?`,
                example: `NBA: Will the Los Angeles Lakers win vs the Golden State Warriors, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                    type: TemplateInputType.DATETIME,
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
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NBA: Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?`,
                example: `NBA: Will the Los Angeles Lakers win vs the Golden State Warriors by 5 or more points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                    type: TemplateInputType.DATETIME,
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
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NBA: Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?`,
                example: `NBA: Will the Los Angeles Lakers & the Golden State Warriors score 172 or more combined points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                    type: TemplateInputType.DATETIME,
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
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as "No"`,
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
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `NBA: Will [0] win the [1] [2] award?`,
                example: `NBA: Will Steph Curry win the 2019-20 NBA Most Valuable Player award?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Name`,
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
                      text: `In the event of an award given to more than 1 player. If the player mentioned in the market is one of the players who wins the award, the market should resolve as "Yes".`
                    }
                  ]
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NBA: Which team will win: [0] vs [1], Estimated schedule start time: [2]?`,
                example: `NBA: Which Team will win: Brooklyn Nets vs NY Knicks, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
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
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NBA: [0] vs [1]: Total Points scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
                example: `NBA: Brooklyn Nets vs NY Knicks: Total Points scored: Over/Under 164.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [2].5`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [2].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [{ text: `Include Regulation and Overtime` }],
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
                    placeholder: `Year`,
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
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP,
                    inputSourceId: 1,
                    placeholder: `Select Team`,
                    values: BASKETBALL_EVENT_DEP_TEAMS,
                  }
                ],
                resolutionRules: {
                  [REQUIRED]: [{ text: `Include Regulation and Overtime` }],
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
                      text: `In the event of an award is given to more than 1 player. The player who averaged the most points per game (determined to the first decimal place, meaning a player averaging 36.1 points per game would win over the player averaging 36 points per game) for the regular the season will be the tie breaker. In the event of an additional tie, The regular season Field Goal % will be the final tie breaker.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which Player will have the most [0] at the end of the the [1] regular season?`,
                example: `Which Player will have the most Points scored at the end of the the 2019-20 regular season?`,
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
                      text: `Results are determined to the first decimal place, meaning a player averaging 10.6 rebounds per game is higher than a player averaging 10.0.`
                    },
                    {
                      text: `In the event of a tie between two players these rules will be used to determine the winner: For points scored, field goal % should be used as the tie breaker.`
                    },
                    {
                      text: `For the most rebounds, the player with the total most offensive rebounds, should be used as a tie breaker.`
                    },
                    {
                      text: `For most total Assists, The player with the "Least" amount of turnovers should be used as the tie breaker.`
                    },
                    {
                      text: `For most made 3-pointers, the player with the highest 3 point %, should be used as the tie breaker.`
                    }
                  ],
                },
              },
              {
                marketType: SCALAR,
                question: `NBA: Total number of wins [0] will finish [1] regular season with?`,
                example: `NBA: Total number of wins NY Knicks will finish 2019-20 regular season with?`,
                denomination: 'wins',
                tickSize: 1,
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
                  [REQUIRED]: [{ text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games`}]
                },
              },
            ],
          },
          [WNBA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `WNBA: Will the [0] win vs the [1], Estimated schedule start time: [2]?`,
                example: `WNBA: Will the Los Angeles Lakers win vs the Golden State Warriors, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                    type: TemplateInputType.DATETIME,
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
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `WNBA: Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?`,
                example: `WNBA: Will the Los Angeles Lakers win vs the Golden State Warriors by 5 or more points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                    type: TemplateInputType.DATETIME,
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
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `WNBA: Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?`,
                example: `WNBA: Will the Los Angeles Lakers & the Golden State Warriors score 172 or more combined points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                    type: TemplateInputType.DATETIME,
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
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `WNBA: Will the [0] win the [1] NBA Championship?`,
                example: `WNBA: Will the Golden State Warriors win the 2019-20 NBA Championship?`,
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
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `WNBA: Will [0] win the [1] [2] award?`,
                example: `WNBA: Will Steph Curry win the 2019-20 NBA Most Valuable Player award?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Name`,
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
                      text: `In the event of an award given to more than 1 player. If the player mentioned in the market is one of the players who wins the award, the market should resolve as "Yes".`
                    }
                  ]
                },
              },
              {
                marketType: CATEGORICAL,
                question: `WNBA: Which team will win: [0] vs [1], Estimated schedule start time: [2]?`,
                example: `WNBA: Which Team will win: Brooklyn Nets vs NY Knicks, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
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
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `WNBA: [0] vs [1]: Total Points scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
                example: `WNBA: Brooklyn Nets vs NY Knicks: Total Points scored: Over/Under 164.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [2].5`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [2].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [{ text: `Include Regulation and Overtime` }],
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
                ],
                resolutionRules: {
                  [REQUIRED]: [{ text: `Include Regulation and Overtime` }],
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
                      text: `In the event of an award is given to more than 1 player. The player who averaged the most points per game (determined to the first decimal place, meaning a player averaging 36.1 points per game would win over the player averaging 36 points per game) for the regular the season will be the tie breaker. In the event of an additional tie, The regular season Field Goal % will be the final tie breaker.`
                    }
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
                      text: `Results are determined to the first decimal place, meaning a player averaging 10.6 rebounds per game is higher than a player averaging 10.0.`
                    },
                    {
                      text: `In the event of a tie between two players these rules will be used to determine the winner: For points scored, field goal % should be used as the tie breaker.`
                    },
                    {
                      text: `For the most rebounds, the player with the total most offensive rebounds, should be used as a tie breaker.`
                    },
                    {
                      text: `For most total Assists, The player with the "Least" amount of turnovers should be used as the tie breaker.`
                    },
                    {
                      text: `For most made 3-pointers, the player with the highest 3 point %, should be used as the tie breaker.`
                    }
                  ],
                },
              },
              {
                marketType: SCALAR,
                question: `WNBA: Total number of wins [0] will finish [1] regular season with?`,
                example: `WNBA: Total number of wins NY Knicks will finish 2019-20 regular season with?`,
                denomination: 'wins',
                tickSize: 1,
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
                  [REQUIRED]: [{ text: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games`}]
                },
              },
            ],
          },
          [NCAA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `NCAA BB: Will [0] win vs [1]; [2] basketball, Estimated schedule start time: [3]?`,
                example: `NCAA BB: Will Duke win vs Kentucky; Men's baskeball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO' `,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official.  If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NCAA BB: Will [0] win vs [1] by [2] or more points, [3] basketball, Estimated schedule start time: [4]?`,
                example: `NCAA BB: Will Duke Blue Devils win vs Kentucky Wildcats by 3 or more points; Men's basketball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
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
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO' `,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official.  If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NCAA BB: Will [0] & [1] score [2] or more combined points; [3] basketball, Estimated schedule start time: [4]?`,
                example: `NCAA BB: Will UNC & Arizona score 142 or more combined points; Men's basketball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
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
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NCAA BB: Will [0] win the [1] NCAA [2] National Championship?`,
                example: `NCAA BB: Will Villanova win the 2020 NCAA Men's National Championship?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team`,
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
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `NCAA BB: Will [0] make the [1] [2] [3]?`,
                example: `NCAA BB: Will USC make the 2020 Men's Final Four?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team`,
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
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    values: LIST_VALUES.NCAA_BASKETBALL_EVENTS,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA BB: Which team will win: [0] vs [1], [2] basketball, Estimated schedule start time: [3]?`,
                example: `NCAA BB: Which Team will win: Duke vs Kentucky, Men's basketball, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team B`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA BB: [0] basketball; [1] vs [2]: Total Points scored; Over/Under [3].5, Estimated schedule start time: [4]?`,
                example: `NCAA BB: Men's basketball; Duke Blue Devils vs Arizona Wildcats: Total Points scored: Over/Under 164.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
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
                      text: `If the game is not played or is NOT completed for any reason, the market should resolve as "No Winner".`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA BB: Which college basketball team will win the [0] [1] [2] tournament?`,
                example: `NCAA BB: Which college basketball team will win the men's 2020 ACC tournament?`,
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
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `The winner is determined by the team who wins their conference tournament championship game`,
                    },
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
                type: TemplateInputType.TEXT,
                placeholder: `Team`,
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
                values: LIST_VALUES.BASEBALL_EVENT,
              },
            ],
            resolutionRules: {},
          },
          {
            marketType: CATEGORICAL,
            question: `MLB: Which team will win: [0] vs [1], Estimated schedule start time: [2]?`,
            example: `MLB: Which Team will win: Yankees vs Red Sox, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                placeholder: `Team A`,
              },
              {
                id: 1,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                placeholder: `Team B`,
              },
              {
                id: 2,
                type: TemplateInputType.DATETIME,
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
                  text:
                    'In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the "official time limit", or ends in a tie, the market should resolve as "No Winner", and Extra innings count towards settlement purposes',
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
            ],
            resolutionRules: {},
          },
          {
            marketType: CATEGORICAL,
            question: `MLB: [0] vs [1]: Total Runs scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
            example: `NY Yankees vs Boston Red Sox: Total Runs scored; Over/Under 9.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Team B`,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                validationType: ValidationType.WHOLE_NUMBER,
                placeholder: `Whole #`,
              },
              {
                id: 3,
                type: TemplateInputType.DATETIME,
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
                  text:
                    'In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the "official time limit", or ends in a tie, the market should resolve as "No Winner". Extra innings count towards settlement purposes',
                },
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
                placeholder: `Event`,
                values: LIST_VALUES.BASEBALL_EVENT,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
            ],
            resolutionRules: {},
          },
          {
            marketType: SCALAR,
            question: `MLB: Total number of wins the [0] will finish the [1] regular season with?`,
            example: `MLB: Total number of wins the LA Dodgers will finish the 2019 regular season with?`,
            denomination: 'wins',
            tickSize: 1,
            minPrice: 0,
            maxPrice: 162,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Team`,
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
                  test: `Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games.`
                }
              ]
            },
          },
        ],
      },
      [AMERICAN_FOOTBALL]: {
        children: {
          [NFL]: {
            templates: [
              {
                marketType: YES_NO,
                question: `NFL: Will the [0] win vs the [1], Estimated schedule start time: [2]?`,
                example: `NFL:Will the NY Giants win vs. the New England Patriots, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NFL: Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?`,
                example: `NFL: Will the NY Giants win vs. the New England Patriots by 3 or more points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
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
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NFL: Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?`,
                example: `NFL: Will the NY Giants & the New England Patriots score 44 or more combined points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
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
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
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
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NFL: Will the [0] win SuperBowl [1]?`,
                example: `NFL: Will the NY Giants win Superbowl LIV?`,
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
                    placeholder: `numeral`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `Will [0] win the [1] [2] award?`,
                example: `Will Patrick Mahomes win the 2019-20 MVP award?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player`,
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
                resolutionRules: {},
              },
              {
                marketType: CATEGORICAL,
                question: `Which NFL Team will win: [0] vs [1], Estimated schedule start time [2]?`,
                example: `Which NFL Team will win: NY GIants vs New England Patriots Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Tie/No Winner`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NFL Team will win: [0] vs [1], Estimated schedule start time [2]?`,
                example: `Which NFL Team will win: Seattle Seahawks vs Dallas Cowboys Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Tie/No Winner`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NFL: [0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
                example: `NFL: NY Giants vs Dallas Cowboys: Total points scored: Over/Under 56.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
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
                    type: TemplateInputType.DATETIME,
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
                      text: `If the game ends in a tie, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
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
                ],
                resolutionRules: {},
              },
              {
                marketType: CATEGORICAL,
                question: `Which NFL player will win the [0] [1] award?`,
                example: `Which NFL player will win the 2020 Most Valuable Player award?`,
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
                    values: LIST_VALUES.FOOTBALL_AWARDS,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: SCALAR,
                question: `Total number of wins [0] will finish [1] regular season with?`,
                example: `Total number of wins NY Giants will finish 2019 regular season with?`,
                denomination: 'wins',
                tickSize: 1,
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
                  ],
                },
              },
            ],
          },
          [NCAA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `NCAA FB: Will the [0] win vs the [1], Estimated schedule start time: [2]?`,
                example: `NCAA FB: Will Alabama Crimson Tide win vs. Florida Gators, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NCAA FB: Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?`,
                example: `NCAA FB: Will Alabama Crimson Tide win vs. Florida Gators by 7 or more points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NCAA FB: Will [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?`,
                example: `NCAA FB: Will USC & UCLA score 51 or more combined points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which College Football Team will win: [0] vs [1], Estimated schedule start time [2]?`,
                example: `Which College Football Team will win:  Alabama vs Michigan, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team B`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATETIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Draw/No Winner`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA FB: [0] vs [1]: Total points scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
                example: `NCAA FB: Alabama vs Michigan: Total points scored: Over/Under 56.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATETIME,
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
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA FB: Which team will win the [0] [1]: [2] vs [3]?`,
                example: `NCAA FB: Which team will win the 2020 Cotton Bowl: Tennessee Volunteers vs Miami Hurricanes?`,
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
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team A`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team B`,
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
                      text: `If the game is not played, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
                    },
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
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                ],
                resolutionRules: {},
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
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "NO' as Team A did NOT win vs team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as "No"`,
                    },
                  ],
                },
              },
              {
                marketType: SCALAR,
                question: `NCAA FB: Total number of wins [0] will finish [1] regular season with?`,
                example: `NCAA FB: Total number of wins Michigan Wolverines will finish 2019 regular season with?`,
                denomination: 'wins',
                tickSize: 1,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team`,
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
            question: `Will [0] win the [1] presidential election?`,
            example: `Will Donald Trump win the 2020 Presidential election?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                values: LIST_VALUES.YEARS,
              },
            ],
            resolutionRules: {},
          },
          {
            marketType: YES_NO,
            question: `Will [0] win the [1] [2] presidential nomination?`,
            example: `Will Elizabeth Warren win the 2020 Democratic Presidential nomination?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
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
                placeholder: `Party`,
                values: LIST_VALUES.POL_PARTY,
              },
            ],
            resolutionRules: {},
          },
          {
            marketType: YES_NO,
            question: `Will [0] run for [1] by [2]?`,
            example: `Will Oprah Winfrey run for President by December 31, 2019 1 pm EST?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
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
            resolutionRules: {},
          },
          {
            marketType: YES_NO,
            question: `Will [0] be impeached by [1]?`,
            example: `Will Donald Trump be impeached by December 31, 2019 11:59 pm EST?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
              },
              {
                id: 1,
                type: TemplateInputType.DATETIME,
                placeholder: `Specific Datetime`,
                label: `Specific Datetime`,
                sublabel: `Specify date time for event`,
              },
            ],
            resolutionRules: {},
          },
          {
            marketType: CATEGORICAL,
            question: `Who will win the [0] US presidential election?`,
            example: `Who will win the 2020 US presidential election?`,
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
                placeholder: `Other`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If any party, other than ones listed in the outcomes, wins the state, the market should resolve as "Other".`
                }
              ]
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Who will be the [0] [1] [2] nominee?`,
            example: `Who will be the 2020 Republican Vice President nominee?`,
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
                placeholder: `Party`,
                values: LIST_VALUES.POL_PARTY,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Office`,
                values: LIST_VALUES.PRES_OFFICES,
              },
            ],
            resolutionRules: {},
          },
          {
            marketType: CATEGORICAL,
            question: `Which party will win [0] in the [1] Presidential election?`,
            example: `Which party will win Michigan in the 2020 Presidential election?`,
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
                values: LIST_VALUES.YEARS,
              },
            ],
            resolutionRules: {},
          },
        ],
      },
      [WORLD]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will [0] be [1] of [2] on [3]?`,
            example: `Will Kim Jong Un be Supreme Leader of North Korea on December 31, 2019 11:59 pm EST?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
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
            resolutionRules: {},
          },
          {
            marketType: YES_NO,
            question: `Will [0] be impeached by [1]?`,
            example: `Will Benjamin Netanyahu be impeached be December 31, 2019 11:59 pm EST?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Person`,
              },
              {
                id: 1,
                type: TemplateInputType.DATETIME,
                placeholder: `Specific Datetime`,
                label: `Specific Datetime`,
                sublabel: `Specify date time for event`,
              },
            ],
            resolutionRules: {},
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
            question: `Will the price of [0] close on or above [1] [2] on the [3] on [4]?`,
            example: `Will the price of AAPL close on or above $200 USD on the Nasdaq on September 1, 2020?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Stock`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Currency`,
                values: LIST_VALUES.CURRENCY,
              },
              {
                id: 3,
                type: TemplateInputType.TEXT,
                placeholder: `Exchange`,
              },
              {
                id: 4,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {},
          },
          {
            marketType: YES_NO,
            question: `Will the price of [0], exceed [1] [2] on the [3], anytime between the opening on [4] and the close on [5]?`,
            example: `Will the price of AAPL exceed $250 USD on the Nasdaq anytime between the opening on June 1, 2020 and the close on September 1, 2020?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Stock`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Currency`,
                values: LIST_VALUES.CURRENCY,
              },
              {
                id: 3,
                type: TemplateInputType.TEXT,
                placeholder: `Exchange`,
              },
              {
                id: 4,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Start Day of Year`,
              },
              {
                id: 5,
                type: TemplateInputType.DATEYEAR,
                placeholder: `End Day of Year`,
              },
            ],
            resolutionRules: {},
          },
          {
            marketType: SCALAR,
            question: `What price will [0] close at in [1] on the [2] on [3]?`,
            example: `What price will AAPL close at in USD on the Nasdaq on December 31, 2019?`,
            denomination: '[Denomination]',
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Stock`,
              },
              {
                id: 1,
                type: TemplateInputType.DENOMINATION_DROPDOWN,
                placeholder: `Currency`,
                values: LIST_VALUES.CURRENCY,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                placeholder: `Exchange`,
              },
              {
                id: 3,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {},
          },
        ],
      },
      [INDEXES]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the [0] close on or above [1] [2] on [3]?`,
            example: `Will the Dow Jones Industrial Average close on or above $27,100.00 USD on September 20, 2019?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Index`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Currency`,
                values: LIST_VALUES.CURRENCY,
              },
              {
                id: 3,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {},
          },
          {
            marketType: SCALAR,
            question: `What price will the [0] close at in [1] on [2]?`,
            example: `What Price will the S&P 500 close at in USD on December 31, 2019?`,
            denomination: '[Denomination]',
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Index`,
              },
              {
                id: 1,
                type: TemplateInputType.DENOMINATION_DROPDOWN,
                placeholder: `Currency`,
                values: LIST_VALUES.CURRENCY,
              },
              {
                id: 2,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {},
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
            placeholder: `Person Name`,
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
                'If more than one person hosts the event, and the person named in the market is one of the multiple hosts, the market should resolve as "Yes"',
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
            placeholder: `Person Name`,
          },
          {
            id: 1,
            type: TemplateInputType.TEXT,
            placeholder: `Award`,
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
            values: LIST_VALUES.ENTERTAINMENT_EVENT,
          },
        ],
        resolutionRules: {},
      },
      {
        marketType: YES_NO,
        question: `Will [0] win an award for [1] at the [2] [3]?`,
        example: `Will Spotlight win an award for Best Picture at the 2016 Academy Awards?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Movie Name`,
          },
          {
            id: 1,
            type: TemplateInputType.TEXT,
            placeholder: `Award`,
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
            values: LIST_VALUES.ENTERTAINMENT_EVENT,
          },
        ],
        resolutionRules: {},
      },
      {
        marketType: YES_NO,
        question: `Will [0] gross [1] [2] or more, in it's opening weekend [3]?`,
        example: `Will Avangers: Endgame gross $350 million USD or more in it's opening weekend in the US?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Movie Name`,
          },
          {
            id: 1,
            type: TemplateInputType.TEXT,
            placeholder: `Amount`,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Currency`,
            values: LIST_VALUES.CURRENCY,
          },
          {
            id: 3,
            type: TemplateInputType.DROPDOWN,
            placeholder: `US / Worldwide`,
            values: LIST_VALUES.REGION,
          },
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text:
                'Gross total should include 4-day weekend in if it is a holiday weekend',
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
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text:
                'The market should resolve as "multiple hosts" if more than one of the possible outcomes hosts the event. If only one of the potential outcomes hosts with multiple people, then the individual outcome would be the winner.',
            },
          ],
        },
      },
      {
        marketType: CATEGORICAL,
        question: `Who will win for [0] in the [1] [2]?`,
        example: `Who will win for Best Pop Vocal Album in the 2020 Grammy Awards?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            placeholder: `Award`,
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
        resolutionRules: {},
      },
    ],
  },
  [CRYPTO]: {
    children: {
      [BITCOIN]: {
        children: {
          [USD]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will the price of BTC close on or above [0] USD on [1] on [2]?`,
                example: `Will the price of BTC close on or above $200 USD on Coinbase Pro (pro.coinbase.com) on December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.BTC_USD_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `Will the price of BTC, exceed [0] USD, on [1] anytime between the open of [2] and close of [3]?`,
                example: `Will the price of BTC exceed $40 USD on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.BTC_USD_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Open, Day of Year`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Close, Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: SCALAR,
                question: `What price will BTC close at in USD on [0] on [1]?`,
                example: `What price will BTC close at in USD on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?`,
                denomination: 'USD',
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.BTC_USD_EXCHANGES,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
            ],
          },
          [USDT]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will the price of BTC close on or above [0] USDT on [1] on [2]?`,
                example: `Will the price of BTC close on or above $200 USDT on Binance (binance.com) on December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.USDT_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `Will the price of BTC, exceed [0] USDT, on [1] anytime between the open of [2] and close of [3]?`,
                example: `Will the price of BTC exceed $40 USDT on Binance (binance.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.USDT_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Open, Day of Year`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Close, Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: SCALAR,
                question: `What price will BTC close at in USDT on [0] on [1]?`,
                example: `What price will BTC close at in USDT on December 31, 2019 on Binance (binance.com)?`,
                denomination: 'USD',
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.USDT_EXCHANGES,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
            ],
          },
          [EUR]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will the price of BTC close on or above [0] EUR on [1] on [2]?`,
                example: `Will the price of BTC close on or above $200 EUR on Coinbase Pro (pro.coinbase.com) on December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.EUR_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `Will the price of BTC, exceed [0] EUR, on [1] anytime between the open of [2] and close of [3]?`,
                example: `Will the price of BTC exceed $40 EUR on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.EUR_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Open, Day of Year`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Close, Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: SCALAR,
                question: `What price will BTC close at in EUR on [0] on [1]?`,
                example: `What price will BTC close at in EUR on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?`,
                denomination: 'USD',
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.EUR_EXCHANGES,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
            ],
          },
        },
      },
      [ETHEREUM]: {
        children: {
          [USD]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will the price of ETH close on or above [0] USD on [1] on [2]?`,
                example: `Will the price of ETH close on or above $200 USD on Coinbase Pro (pro.coinbase.com) on December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.NON_BTC_USD_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `Will the price of ETH, exceed [0] USD, on [1] anytime between the open of [2] and close of [3]?`,
                example: `Will the price of ETH exceed $40 USD on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.NON_BTC_USD_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Open, Day of Year`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Close, Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: SCALAR,
                question: `What price will ETH close at in USD on [0] on [1]?`,
                example: `What price will ETH close at in USD on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?`,
                denomination: 'USD',
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.NON_BTC_USD_EXCHANGES,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
            ],
          },
          [USDT]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will the price of ETH close on or above [0] USDT on [1] on [2]?`,
                example: `Will the price of ETH close on or above $200 USDT on Binance (binance.com) on December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.USDT_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `Will the price of ETH, exceed [0] USDT, on [1] anytime between the open of [2] and close of [3]?`,
                example: `Will the price of ETH exceed $40 USDT on Binance (binance.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.USDT_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Open, Day of Year`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Close, Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: SCALAR,
                question: `What price will ETH close at in USDT on [0] on [1]?`,
                example: `What price will ETH close at in USDT on December 31, 2019 on Binance (binance.com)?`,
                denomination: 'USD',
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.USDT_EXCHANGES,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
            ],
          },
          [EUR]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will the price of ETH close on or above [0] EUR on [1] on [2]?`,
                example: `Will the price of ETH close on or above $200 EUR on Coinbase Pro (pro.coinbase.com) on December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.EUR_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `Will the price of ETH, exceed [0] EUR, on [1] anytime between the open of [2] and close of [3]?`,
                example: `Will the price of ETH exceed $40 EUR on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.EUR_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Open, Day of Year`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Close, Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: SCALAR,
                question: `What price will ETH close at in EUR on [0] on [1]?`,
                example: `What price will ETH close at in EUR on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?`,
                denomination: 'USD',
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.EUR_EXCHANGES,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
            ],
          },
        },
      },
      [LITECOIN]: {
        children: {
          [USD]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will the price of LTC close on or above [0] USD on [1] on [2]?`,
                example: `Will the price of LTC close on or above $200 USD on Coinbase Pro (pro.coinbase.com) on December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.NON_BTC_USD_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `Will the price of LTC, exceed [0] USD, on [1] anytime between the open of [2] and close of [3]?`,
                example: `Will the price of LTC exceed $40 USD on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.NON_BTC_USD_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Open, Day of Year`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Close, Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: SCALAR,
                question: `What price will LTC close at in USD on [0] on [1]?`,
                example: `What price will LTC close at in USD on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?`,
                denomination: 'USD',
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.NON_BTC_USD_EXCHANGES,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
            ],
          },
          [USDT]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will the price of LTC close on or above [0] USDT on [1] on [2]?`,
                example: `Will the price of LTC close on or above $200 USDT on Binance (binance.com) on December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.USDT_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `Will the price of LTC, exceed [0] USDT, on [1] anytime between the open of [2] and close of [3]?`,
                example: `Will the price of LTC exceed $40 USDT on Binance (binance.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.USDT_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Open, Day of Year`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Close, Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: SCALAR,
                question: `What price will LTC close at in USDT on [0] on [1]?`,
                example: `What price will LTC close at in USDT on December 31, 2019 on Binance (binance.com)?`,
                denomination: 'USD',
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.USDT_EXCHANGES,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
            ],
          },
          [EUR]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will the price of LTC close on or above [0] EUR on [1] on [2]?`,
                example: `Will the price of LTC close on or above $200 EUR on Coinbase Pro (pro.coinbase.com) on December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.EUR_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: YES_NO,
                question: `Will the price of LTC, exceed [0] EUR, on [1] anytime between the open of [2] and close of [3]?`,
                example: `Will the price of LTC exceed $40 EUR on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Value #`,
                    validationType: ValidationType.NUMBER,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.EUR_EXCHANGES,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Open, Day of Year`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Close, Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
              {
                marketType: SCALAR,
                question: `What price will LTC close at in EUR on [0] on [1]?`,
                example: `What price will LTC close at in EUR on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?`,
                denomination: 'USD',
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Exchange`,
                    values: LIST_VALUES.EUR_EXCHANGES,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DATEYEAR,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {},
              },
            ],
          },
        },
      },
    },
  },
};
