import { LIST_VALUES } from './template-list-values';
import {
  POLITICS,
  US_POLITICS,
  TemplateInputType,
  WORLD,
  FINANCE,
  ValidationType,
  ENTERTAINMENT,
  CRYPTO,
  BITCOIN,
  USD,
  USDT,
  EUR,
  ETHEREUM,
  LITECOIN,
  SPORTS,
  GOLF,
  HOCKEY,
  HORSE_RACING,
  TENNIS,
  SOCCER,
  BASKETBALL,
  NBA,
  NCAA,
  BASEBALL,
  AMERICAN_FOOTBALL,
  NFL,
  REQUIRED,
  STOCKS,
  INDEXES,
} from 'modules/create-market/constants';
import { YES_NO, CATEGORICAL, SCALAR } from 'modules/common/constants';

export const TEMPLATES = {
  [SPORTS]: {
    children: {
      [GOLF]: {
        templates: [
          {
            hash: `0xb11764bcd6054968fa75a3b0fd55aa7031101315321edcbfb200f869cf66b6ee`,
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
                values: LIST_VALUES.GOLF_EVENT,
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
            hash: `0xc9d0483f3d82cf535c9e58fc9e190bc4c507950dc28609df31c27ee58b42694f`,
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
                values: LIST_VALUES.GOLF_EVENT,
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
            hash: `0x084b594dc549099e066b9733e9bb1c4ef5067851b8bb08d7733614e484e09369`,
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
                values: LIST_VALUES.GOLF_EVENT,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
            ],
            resolutionRules: {},
          },
        ],
      },
      [HOCKEY]: {
        templates: [
          {
            hash: `0xea0b6b5eb2e16392fd2b17bb7f0c761b13e7b40a35d87e7702109dc7a0a6bbbd`,
            marketType: YES_NO,
            question: `Will the [0] win vs the [1], Estimated schedule start time: [2]?`,
            example: `Will the St Louis Blues win vs the Dallas Stars, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
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
            resolutionRules: {},
          },
          {
            hash: `0x6e8b9ded9bc2706356452eba9682ae7c0eae61f067a6311e015bcdc739b674a7`,
            marketType: YES_NO,
            question: `Will the [0] & [1] score [2] or more combined goals, Estimated schedule start time: [3]?`,
            example: `Will the NY Rangers & Dallas Stars score 5 or more combined goals, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
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
            hash: `0x2240793e8bc7080ec1f2489b82fe33cb3c3e5d06defd9752681996498a7a2620`,
            marketType: YES_NO,
            question: `Will the [0] win the [1] Stanley Cup?`,
            example: `Will the Montreal Canadiens win the 2019-2020 Stanley Cup?`,
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
            hash: `0xc828397abfe32a946d82e4a605f465a979dcb698f8846ba4d759b8aad1427ed5`,
            marketType: CATEGORICAL,
            question: `Which team will win: [0] vs [1], Estimated schedule start time: [2]?`,
            example: `Which Team will win: NY Rangers vs NJ Devils, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
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
            hash: `0x8046e1128dc30571a3c8680c40927b4cde8e3d0af9ae05e678d1b722f2099fbe`,
            marketType: CATEGORICAL,
            question: `[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
            example: `St Louis Blues vs. NY Rangers: Total goals scored Over/Under 4.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
            hash: `0xf0cae533cd96f75ef69a4a184faa958d043e3c992eb7538bca7649cf6911ecb0`,
            marketType: CATEGORICAL,
            question: `Which NHL team will win the [0] Stanley Cup?`,
            example: `Which NHL team will win the 2019-2020 Stanley Cup?`,
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
            resolutionRules: {},
          },
          {
            hash: `0x5725d708831ed60c02f8444e17dc9ef3942ee173e0f8b2ac6b5b6897eb33aaf7`,
            marketType: CATEGORICAL,
            question: `Which NHL player will win the [0] [1]?`,
            example: `Which NHL player will win the 2019-2020 Calder Trophy?`,
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
            hash: `0xa1dfe1a7dcc8af56aed57c3dc0be4520854c4d6c94946f0a6d5a4a512b293536`,
            marketType: SCALAR,
            question: `Total number of wins the [0] will finish [1] regular season with?`,
            example: `Total number of wins the LA Kings will finish 2019-2020 regular season with?`,
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
                  text: `If the horse named in the market is scratched and does NOT run or is disqualified for any reason, the market should resolve as "No"`,
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
            ],
            resolutionRules: {},
          },
        ],
      },
      [TENNIS]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will [0] win the [1] [2]?`,
            example: `Will Roger Federer win the 2020 Wimbledon?`,
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
            question: `Which tennis player will win the [0] [1]?`,
            example: `Which tennis player will win the 2020 Australian Open?`,
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
                values: LIST_VALUES.TENNIS_EVENT,
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
                  text: `If a player is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `[0] [1] Match play winner: [2] vs [3]?`,
            example: `2020 Wimbledon Match play winner between Roger Federer vs Rafael Nadal?`,
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
                values: LIST_VALUES.TENNIS_EVENT,
              },
              {
                id: 2,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                placeholder: `Player A`,
              },
              {
                id: 3,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                placeholder: `Player B`,
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
      [SOCCER]: {
        templates: [
          {
            marketType: CATEGORICAL,
            question: `Which team will win: [0] vs [1], Estimated schedule start time: [2]?`,
            example: `Which team will win: Real Madrid vs Manchester United, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
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
            question: `[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
            example: `Real Madrid vs Manchester United: Total goals scored Over/Under 4.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
      [BASKETBALL]: {
        children: {
          [NBA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will the [0] win vs the [1], Estimated schedule start time: [2]?`,
                example: `Will the Los Angeles Lakers win vs the Golden State Warriors, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                question: `Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?`,
                example: `Will the Los Angeles Lakers win vs the Golden State Warriors by 5 or more points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                question: `Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?`,
                example: `Will the Los Angeles Lakers & the Golden State Warriors score 172 or more combined points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                question: `Will the [0] win the [1] NBA Championship?`,
                example: `Will the Golden State Warriors win the 2019-20 NBA Championship?`,
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
                question: `Will [0] win the [1] [2] award?`,
                example: `Will Steph Curry win the 2019-2020 NBA Most Valuable Player award?`,
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
                resolutionRules: {},
              },
              {
                marketType: CATEGORICAL,
                question: `Which team will win: [0] vs [1], Estimated schedule start time: [2]?`,
                example: `Which Team will win: Brooklyn Nets vs NY Knicks, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
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
                question: `[0] vs [1]: Total Points scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
                example: `Brooklyn Nets vs NY Knicks: Total Points scored: Over/Under 164.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                example: `Which NBA team will win the 2019-2020 Western Conference Finals?`,
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
                ],
                resolutionRules: {
                  [REQUIRED]: [{ text: `Include Regulation and Overtime` }],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NBA player will win the [0] [1] award?`,
                example: `Which NBA player will win the 2019-2020 Most Valuable Player award?`,
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
                  [REQUIRED]: [{ text: `Include Regulation and Overtime` }],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which Player will have the most [0] at the end of the the [1] regular season?`,
                example: `Which Player will have the most Points scored at the end of the the 2019-2020 regular season?`,
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
                  [REQUIRED]: [{ text: `Include Regulation and Overtime` }],
                },
              },
              {
                marketType: SCALAR,
                question: `Total number of wins [0] will finish [1] regular season with?`,
                example: `Total number of wins NY Knicks will finish 2019-20 regular season with?`,
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
                resolutionRules: {},
              },
            ],
          },
          [NCAA]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will [0] win vs [1]; [2] basketball, Estimated schedule start time: [3]?`,
                example: `Will Duke win vs Kentucky; Men's baskeball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                question: `Will [0] win vs [1] by [2] or more points, [3] basketball, Estimated schedule start time: [4]?`,
                example: `Will Duke Blue Devils win vs Kentucky Wildcats by 3 or more points; Men's basketball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                question: `Will [0] & [1] score [2] or more combined points; [3] basketball, Estimated schedule start time: [4]?`,
                example: `Will UNC & Arizona score 142 or more combined points; Men's basketball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?`,
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
                question: `Will [0] win the [1] NCAA [2] National Championship?`,
                example: `Will Villanova win the 2020 NCAA Men's National Championship?`,
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
                question: `Will [0] make the [1] [2] [3]?`,
                example: `Will USC make the 2020 Men's Final Four?`,
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
                question: `Which team will win: [0] vs [1], [2] basketball, Estimated schedule start time: [3]?`,
                example: `Which Team will win: Duke vs Kentucky, Men's basketball, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
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
                question: `[0] basketball; [1] vs [2]: Total Points scored; Over/Under [3].5, Estimated schedule start time: [4]?`,
                example: `Men's basketball; Duke Blue Devils vs Arizona Wildcats: Total Points scored: Over/Under 164.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                question: `Which college basketball team will win the [0] [1] [2] tournament?`,
                example: `Which college basketball team will win the men's 2020 ACC tournament?`,
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
            question: `Will the [0] win the [1] [2]?`,
            example: `Will the NY Yankees win the 2020 World Series?`,
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
            question: `Which team will win: [0] vs [1], Estimated schedule start time: [2]?`,
            example: `Which Team will win: Yankees vs Red Sox, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?`,
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
            question: `[0] vs [1]: Total Runs scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
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
            question: `Which player will win the [0] [1]?`,
            example: `Which Player will win the 2019 American League Cy Young award?`,
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
            question: `Total number of wins the [0] will finish the [1] regular season with?`,
            example: `Total number of wins the LA Dodgers will finish the 2019 regular season with?`,
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
            resolutionRules: {},
          },
        ],
      },
      [AMERICAN_FOOTBALL]: {
        children: {
          [NFL]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Will the [0] win vs the [1], Estimated schedule start time: [2]?`,
                example: `Will the NY Giants win vs. the New England Patriots, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                question: `Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?`,
                example: `Will the NY Giants win vs. the New England Patriots by 3 or more points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                question: `Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?`,
                example: `Will the NY Giants & the New England Patriots score 44 or more combined points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                question: `Will the [0] have [1] or more regular season wins in [2]?`,
                example: `Will the Dallas Cowboys have 9 or more regular season wins in 2019?`,
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
                question: `Will the [0] win SuperBowl [1]?`,
                example: `Will the NY Giants win Superbowl LIV?`,
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
                question: `[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
                example: `NY Giants vs Dallas Cowboys: Total points scored: Over/Under 56.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                    id: 0,
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
                question: `Will the [0] win vs the [1], Estimated schedule start time: [2]?`,
                example: `Will Alabama Crimson Tide win vs. Florida Gators, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                question: `Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?`,
                example: `Will Alabama Crimson Tide win vs. Florida Gators by 7 or more points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                question: `Will [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?`,
                example: `Will USC & UCLA score 51 or more combined points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                question: `[0] vs [1]: Total points scored; Over/Under [2].5, Estimated schedule start time: [3]?`,
                example: `Alabama vs Michigan: Total points scored: Over/Under 56.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?`,
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
                question: `Which team will win the [0] [1]: [2] vs [3]?`,
                example: `Which team will win the 2020 Cotton Bowl: Tennessee Volunteers vs Miami Hurricanes?`,
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
                    placeholder: `Game`,
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
                question: `Total number of wins [0] will finish [1] regular season with?`,
                example: `Total number of wins Michigan Wolverines will finish 2019 regular season with?`,
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
            ],
            resolutionRules: {},
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
