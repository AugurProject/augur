import {
  BASEBALL_EVENT_DEP_TEAMS,
  BASKETBALL_EVENT_DEP_TEAMS,
  CRYPTO_BTC_CURRENCY_MARKETS,
  CRYPTO_ETH_CURRENCY_MARKETS,
  ENTERTAINMENT_EVENT_DEP_TEAMS,
  FOOTBALL_EVENT_DEP_TEAMS,
  HOCKEY_EVENT_DEP_TEAMS,
  LIST_VALUES,
  NCAA_BASKETBALL_CONF_DEP_TEAMS,
  OLYMPIC_SUMMER_SPORT_EVENTS,
  OLYMPIC_WINTER_SPORT_EVENTS,
  SOCCER_LEAGUE_DEP_TEAMS,
  TENNIS_DOUBLES_EVENTS,
  TENNIS_SINGLES_EVENTS,
  SOCCER_LEAGUE_DEP_YEARS,
  SOCCER_GENDER_EVENTS,
  SOCCER_CUSTOM_GENDER_EVENTS,
  SOCCER_CUSTOM_DEP_YEARS,
  CRYPTO_TOKEN_CURRENCY_MARKETS,
} from './templates-lists';
import {
  AMERICAN_FOOTBALL,
  AWARDS,
  BASEBALL,
  BASKETBALL,
  BITCOIN,
  BOXING,
  CAR_RACING,
  CRYPTO,
  CUSTOMIZED,
  DOUBLES,
  ENTERTAINMENT,
  ETHEREUM,
  EURO_TOUR,
  EVENT,
  ECONOMICS,
  GENDER,
  GOLF,
  groupTypes,
  HOCKEY,
  HORSE_RACING,
  LEAGUE_NAME,
  AUGUR,
  LPGA,
  MEDICAL,
  MENS_LEAGUES,
  MMA,
  NBA,
  NBA_DRAFT,
  NCAA,
  NFL,
  NFL_DRAFT,
  OLYMPICS,
  PGA,
  POLITICS,
  REQUIRED,
  SINGLES,
  SOCCER,
  SPORTS,
  START_TIME,
  STATISTICS,
  SUB_EVENT,
  SUMMER,
  TEAM_A,
  TEAM_B,
  TENNIS,
  TV_MOVIES,
  US_POLITICS,
  WINTER,
  WNBA,
  WORLD,
  YEAR,
  SOCIAL_MEDIA,
  TWITTER,
  INSTAGRAM,
  ENTITY,
  MAKER,
  COMPOUND,
  BALANCER,
  ZEROX,
  CHAINLINK,
  ADDITIONAL_TOKENS,
  AMPLE,
} from '@augurproject/sdk-lite';

import { TemplateInputType, TEXT_PLACEHOLDERS, ValidationType } from './templates-template';
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
      [MMA]: {
        templates: [
          {
            marketType: CATEGORICAL,
            question: `MMA: [0] vs. [1]; Who will win?`,
            example: `MMA: Donald Cerrone vs. Conor McGregor; Who will win?\nEstimated schedule start time: Jan 18, 2020 8:20 pm EST`,
            header: `[0] vs. [1]`,
            title: `Money Line`,
            groupName: groupTypes.MONEY_LINE,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                groupKey: TEAM_A,
                placeholder: `Fighter A`,
              },
              {
                id: 1,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                groupKey: TEAM_B,
                placeholder: `Fighter B`,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Draw/No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market resolves based on the official result immediately following the fight. Later announcements, enquirers, or changes to the official result will not affect market settlement.`,
                },
                {
                  text: `If a fighter is substituted before the fight begins the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `If a fighter is disqualified during the fight, the opposing fighter should be declared the winner by KO/TKO. If both fighters are disqualified the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `If the fight is cancelled or will not be complete by the Event Expiration Time for any reason, the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `A draw can occur when the fight is either stopped before completion or after all rounds are completed and goes to the judges scorecards for decision. If the judges can not determine a winner, "Draw/No Contest" should be the winning outcome.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `MMA (O/U): [0] vs. [1]; Over/Under [2].5 Rounds?`,
            example: `MMA (O/U): Donald Cerrone vs. Conor McGregor; Over/Under 1.5 Rounds?\nEstimated schedule start time: Jan 18, 2020 8:20 pm EST`,
            title: `Over/Under [2].5 Rounds`,
            header: `[0] vs. [1]`,
            groupName: groupTypes.OVER_UNDER,
            groupLineId: 2,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_A,
                placeholder: `Fighter A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_B,
                placeholder: `Fighter B`,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Round #`,
                values: LIST_VALUES.MMA_ROUNDS,
              },
              {
                id: 3,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
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
              {
                id: 6,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market resolves based on the official result immediately following the fight. Later announcements, enquirers, or changes to the official result will not affect market settlement.`,
                },
                {
                  text: `If a fighter is substituted before the fight begins the market should resolve as 'No Contest'.`,
                },
                {
                  text: `If the fight is cancelled or will not be complete by the Event Expiration Time for any reason, the market should resolve as 'No Contest'.`,
                },
                {
                  text: `For settlement purposes where a half round is stated, 2 minutes 30 seconds of the respective round will define the half to determine over or under. Example: If Total Rounds 2.5 (O/U) is in market question, the midway point in Round 3 is the under/over line. If the fight is stopped at exactly 2 minutes 30 seconds of the round named in the market "over" should be the winning outcome.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `MMA: [0] vs. [1]; Method of victory?`,
            example: `MMA: Donald Cerrone vs. Conor McGregor; Method of victory?\nEstimated schedule start time: Jan 18, 2020 8:20 pm EST`,
            title: `Method of victory`,
            header: `[0] vs. [1]`,
            groupName: groupTypes.ADDITIONAL,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_A,
                placeholder: `Fighter A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_B,
                placeholder: `Fighter B`,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[0] by KO/TKO`,
              },
              {
                id: 4,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[0] by Submission`,
              },
              {
                id: 5,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[0] by Points`,
              },
              {
                id: 6,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[1] by KO/TKO`,
              },
              {
                id: 7,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[1] by Submission`,
              },
              {
                id: 8,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[1] by Points`,
              },
              {
                id: 9,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Draw/No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market resolves based on the official result immediately following the fight. Later announcements, enquirers, or changes to the official result will not affect market settlement.`,
                },
                {
                  text: `If a fighter is substituted before the fight begins the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `If a fighter is disqualified during the fight, the opposing fighter should be declared the winner by KO/TKO. If both fighters are disqualified the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `If the fight is cancelled or will not be complete by the Event Expiration Time for any reason, the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `A draw can occur when the fight is either stopped before completion or after all rounds are completed and goes to the judges scorecards for decision. If the judges can not determine a winner, "Draw/No Contest" should be the winning outcome.`,
                },
                {
                  text: `If the fight goes to the judges scorecard before the scheduled number of rounds is completed then it should resolve as a "Points" victory to the winner.`,
                },
                {
                  text: `KO/TKO: 1. Referee stoppage while either/both fighters are standing or on the canvas, due to one fighter not intelligently defending themselves from strikes, or in a defenseless position. 2. Stoppage by doctor or a fighter’s corner/team. 3. A fighter retires due to injury.`,
                },
                {
                  text: `Submission: A Submission should be used when a fighter taps out, either verbally or physically.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `MMA: [0] vs. [1]; How will the fight end?`,
            example: `MMA UFC: Donald Cerrone vs. Conor McGregor; How will the fight end?\nEstimated schedule start time: Jan 18, 2020 8:20 pm EST`,
            title: `How will the fight end`,
            header: `[0] vs. [1]`,
            groupName: groupTypes.ADDITIONAL,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_A,
                placeholder: `Fighter A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_B,
                placeholder: `Fighter B`,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `KO/TKO`,
              },
              {
                id: 4,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Submission`,
              },
              {
                id: 5,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Points`,
              },
              {
                id: 6,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Draw/No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market resolves based on the official result immediately following the fight. Later announcements, enquirers, or changes to the official result will not affect market settlement.`,
                },
                {
                  text: `If a fighter is substituted before the fight begins the market should resolve as 'No Contest'.`,
                },
                {
                  text: `If a fighter is disqualified during the fight, the opposing fighter should be declared the winner by KO/TKO. If both fighters are disqualified the market should resolve as 'No Contest'.`,
                },
                {
                  text: `A draw can occur when the fight is either stopped before completion or after all rounds are completed and goes to the judges scorecards for decision. If the judges can not determine a winner, 'No Contest' should be the winning outcome.`,
                },
                {
                  text: `If the fight is cancelled or will not be complete by the Event Expiration Time for any reason, the market should resolve as 'No Contest'.`,
                },
                {
                  text: `If the fight goes to the judges scorecard before the scheduled number of rounds is completed then it should resolve as a "Points" victory to the winner.`,
                },
                {
                  text: `KO/TKO: 1. Referee stoppage while either/both fighters are standing or on the canvas, due to one fighter not intelligently defending themselves from strikes, or in a defenseless position. 2. Stoppage by doctor or a fighter’s corner/team. 3. A fighter retires due to injury.`,
                },
                {
                  text: `Submission: A Submission should be used when a fighter taps out, either verbally or physically.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `MMA: [0] vs. [1]; What round will the fight end?`,
            example: `MMA: Donald Cerrone vs. Conor McGregor; What round will the fight end?\nEstimated schedule start time: Jan 18, 2020 8:20 pm EST`,
            title: `What round will the fight end`,
            header: `[0] vs. [1]`,
            groupName: groupTypes.ADDITIONAL,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_A,
                placeholder: `Fighter A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_B,
                placeholder: `Fighter B`,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Round 1`,
              },
              {
                id: 4,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Round 2`,
              },
              {
                id: 5,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Round 3`,
              },
              {
                id: 6,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Round 4`,
              },
              {
                id: 7,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Round 5`,
              },
              {
                id: 8,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Goes the distance`,
              },
              {
                id: 9,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market resolves based on the official result immediately following the fight. Later announcements, enquirers, or changes to the official result will not affect market settlement.`,
                },
                {
                  text: `If a fighter is substituted before the fight begins the market should resolve as 'No Contest'.`,
                },
                {
                  text: `If the fight is cancelled or will not be complete by the Event Expiration Time for any reason, the market should resolve as 'No Contest'.`,
                },
                {
                  text: `A draw can occur when the fight is either stopped before completion or after all rounds are completed and goes to the judges scorecards for decision. If the judges can not determine a winner, 'No Contest' should be the winning outcome.`,
                },
                {
                  text: `This is determined by any method when the fight ends. (e.g. KO, TKO, withdrawal, disqualification). If a fighter withdraws during the period between rounds, the fight is deemed to have ended in the previous round. If the fight completes all rounds and goes the the judges scorecards for decision, the market should resolve as "Goes the distance".`,
                },
              ],
            },
          },
        ],
      },
      [BOXING]: {
        templates: [
          {
            marketType: CATEGORICAL,
            question: `Boxing: [0] vs. [1]; Who will win?`,
            example: `Boxing: Robert Helenius vs. Adam Kownacki; Who will win?\nEstimated schedule start time: Feb 10, 2020 8:20 pm EST`,
            header: `[0] vs. [1]`,
            title: `Money Line`,
            groupName: groupTypes.MONEY_LINE,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                groupKey: TEAM_A,
                placeholder: `Fighter A`,
              },
              {
                id: 1,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                groupKey: TEAM_B,
                placeholder: `Fighter B`,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Draw/No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market resolves based on the official result immediately following the fight. Later announcements, enquirers, or changes to the official result will not affect market settlement.`,
                },
                {
                  text: `If a fighter is substituted before the fight begins the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `If a fighter is disqualified during the fight, the opposing fighter should be declared the winner by TKO. If both fighters are Disqualified the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `If the Fight is cancelled or will not be completed by the Event Expiration Time for any reason, the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `A Draw can occur when the fight is either stopped before completion or after all rounds are completed and goes to the judges scorecards for decision. If the judges can not determine a winner, "Draw/No Contest" should be the winning outcome.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Boxing (O/U): [0] vs. [1]; Over/Under [3].5 Rounds?`,
            example: `Boxing (O/U): Robert Helenius vs. Adam Kownacki; Over/Under 5.5 Rounds?\nEstimated schedule start time: Jan 18, 2020 8:20 pm EST`,
            title: `Over/Under [3].5 Rounds`,
            header: `[0] vs. [1]`,
            groupName: groupTypes.OVER_UNDER,
            groupLineId: 3,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_A,
                placeholder: `Fighter A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_B,
                placeholder: `Fighter B`,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Round #`,
                noSort: true,
                values: LIST_VALUES.BOXING_ROUNDS,
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
              {
                id: 6,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market resolves based on the official result immediately following the fight. Later announcements, enquirers, or changes to the official result will not affect market settlement.`,
                },
                {
                  text: `If a fighter is substituted before the fight begins the market should resolve as 'No Contest'.`,
                },
                {
                  text: `If the Fight is cancelled or will not be completed by the Event Expiration Time for any reason, the market should resolve as 'No Contest'.`,
                },
                {
                  text: `For settlement purposes where a half round is stated a new round must be started to determine over or under. For Example: If Total Rounds 8.5 (O/U) is quoted, then Round 9 must start for Over to win. If a fighter withdraws during the period between rounds, the fight is deemed to have ended in the previous round.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Boxing: [0] vs. [1]; Method of victory?`,
            example: `Boxing: Robert Helenius vs. Adam Kownacki; Method of victory?\nEstimated schedule start time: Jan 18, 2020 8:20 pm EST`,
            title: `Method of victory`,
            header: `[0] vs. [1]`,
            groupName: groupTypes.ADDITIONAL,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_A,
                placeholder: `Fighter A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_B,
                placeholder: `Fighter B`,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[0] by KO`,
              },
              {
                id: 4,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[0] by TKO`,
              },
              {
                id: 5,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[0] by Points`,
              },
              {
                id: 6,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[1] by KO`,
              },
              {
                id: 7,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[1] by TKO`,
              },
              {
                id: 8,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[1] by Points`,
              },
              {
                id: 9,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Draw/No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market resolves based on the official result immediately following the fight. Later announcements, enquirers, or changes to the official result will not affect market settlement.`,
                },
                {
                  text: `If a fighter is substituted before the fight begins the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `If a fighter is disqualified during the fight, the opposing fighter should be declared the winner by TKO. If both fighters are Disqualified the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `If the Fight is cancelled or will not be completed by the Event Expiration Time for any reason, the market should resolve as "Draw/No Contest".`,
                },
                {
                  text: `A Draw can occur when the fight is either stopped before completion or after all rounds are completed and goes to the judges scorecards for decision. If the judges can not determine a winner, "Draw/No Contest" should be the winning outcome.`,
                },
                {
                  text: `If the fight goes to the judges scorecard before the scheduled number of rounds is completed then the market should resolve as "Points" victory to the winner.`,
                },
                {
                  text: `KO Stoppage: KO is used when a boxer does NOT stand up after a 10 count.`,
                },
                {
                  text: `TKO Stoppage: TKO is used when a fighter is knocked down 3 times in a round, if the referee steps in to stop the fight, official attending physicians or the boxers corner stop the fight.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Boxing: [0] vs. [1]; How will the fight end?`,
            example: `Boxing: Robert Helenius vs. Adam Kownacki; How will the fight end?\nEstimated schedule start time: Jan 18, 2020 8:20 pm EST`,
            title: `How will the fight end`,
            header: `[0] vs. [1]`,
            groupName: groupTypes.ADDITIONAL,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_A,
                placeholder: `Fighter A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_B,
                placeholder: `Fighter B`,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `KO`,
              },
              {
                id: 4,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `TKO`,
              },
              {
                id: 5,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Points`,
              },
              {
                id: 6,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Draw/No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market resolves based on the official result immediately following the fight. Later announcements, enquirers, or changes to the official result will not affect market settlement.`,
                },
                {
                  text: `If a fighter is substituted before the fight begins the market should resolve as 'No Contest'.`,
                },
                {
                  text: `If a fighter is disqualified during the fight, the opposing fighter should be declared the winner by TKO. If both fighters are Disqualified the market should resolve as 'No Contest'.`,
                },
                {
                  text: `If the Fight is cancelled or will not be completed by the Event Expiration Time for any reason, the market should resolve as 'No Contest'.`,
                },
                {
                  text: `If the fight is determined to be a draw, market should resolve as "Points".`,
                },
                {
                  text: `If the fight goes to the judges scorecard before the scheduled number of rounds is completed then the market should resolve as "Points".`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Boxing: [0] vs. [1]; What round will the fight end?`,
            example: `Boxing: Robert Helenius vs. Adam Kownacki; What round will the fight end?\nEstimated schedule start time: Jan 18, 2020 8:20 pm EST`,
            title: `What round will the fight end`,
            header: `[0] vs. [1]`,
            groupName: groupTypes.ADDITIONAL,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_A,
                placeholder: `Fighter A`,
              },
              {
                id: 1,
                type: TemplateInputType.TEXT,
                groupKey: TEAM_B,
                placeholder: `Fighter B`,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Round 1-3`,
              },
              {
                id: 4,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Round 4-6`,
              },
              {
                id: 5,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Round 7-9`,
              },
              {
                id: 6,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Round 10-12`,
              },
              {
                id: 7,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Goes the Distance`,
              },
              {
                id: 8,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market resolves based on the official result immediately following the fight. Later announcements, enquirers, or changes to the official result will not affect market settlement.`,
                },
                {
                  text: `If a fighter is substituted before the fight begins the market should resolve as 'No Contest'.`,
                },
                {
                  text: `If the Fight is cancelled or will not be completed by the Event Expiration Time for any reason, the market should resolve as 'No Contest'.`,
                },
                {
                  text: `This is determined by any method when the fight ends. (e.g. KO, TKO, withdrawal, disqualification). If a fighter withdraws during the period between rounds, the fight is deemed to have ended in the previous round. If the fight completes all rounds and goes the the judges scorecards for decision, the market should resolve as "Goes the distance".`,
                },
              ],
            },
          },
        ],
      },
      [CAR_RACING]: {
        templates: [
          {
            marketType: CATEGORICAL,
            question: `NASCAR [0] [1]: Winner?`,
            example: `NASCAR 2020 Daytona 500: Winner?\nEstimated schedule start time: Sept 19, 2020 1:00 pm EST`,
            header: `NASCAR [0] [1] winner`,
            title: `Money Line`,
            groupName: groupTypes.MONEY_LINE,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                groupKey: YEAR,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.NASCAR_EVENTS,
                groupKey: EVENT,
                categoryDestId: 2,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 24,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market should resolve after the race conclusion once the winner is verified by officials and standing on the podium. Official results reflecting any changes, disqualifications or position penalties after the podium presentation will not be recognized for the market resolution purposes.`,
                },
                {
                  text: `Market settlement can be effected by event being shortened due to weather conditions or other situations if deemed by official governing association.`,
                },
                {
                  text: `If the Race is cancelled or is postponed for any reason and will not be completed before the event expiration time for this market, market should resolve as 'No Contest'.`,
                },
                {
                  text: `If an alternate driver replaces a driver during the race, then the new driver will replace the old driver in all finishing positions.`,
                },
                {
                  text: `Should an event/race/session/lap/heat be restarted from the beginning, markets will stand and should be settled according to the result issued after the restart.`,
                },
                {
                  text: `If the winning Racer is not one of the outcomes listed, market should resolve as 'Other (Field)'.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `NASCAR [0] [1]: [2] vs. [3]: Who will finish better?`,
            example: `NASCAR 2020 Daytona 500: Who will finish better?\nEstimated schedule start time: Sept 19, 2020 1:00 pm EST`,
            title: `Who will finish better`,
            header: `[2] vs. [3]`,
            groupName: groupTypes.ADDITIONAL,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                groupKey: YEAR,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.NASCAR_EVENTS,
                groupKey: EVENT,
                categoryDestId: 2,
              },
              {
                id: 2,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                groupKey: TEAM_A,
                placeholder: `Racer A`,
              },
              {
                id: 3,
                type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                groupKey: TEAM_B,
                placeholder: `Racer B`,
              },
              {
                id: 4,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 24,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 5,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Market should resolve after the race conclusion once the winner is verified by officials and standing on the podium. Official results reflecting any changes, disqualifications or position penalties after the podium presentation will not be recognized for the market resolution purposes.`,
                },
                {
                  text: `Market settlement can be effected by event being shortened due to weather conditions or other situations if deemed by official governing association.`,
                },
                {
                  text: `If the Race is cancelled or is postponed for any reason and will not be completed before the event expiration time for this market, market should resolve as 'No Contest'.`,
                },
                {
                  text: `If an alternate driver replaces a driver during the race, then the new driver will replace the old driver in all Head to head match-ups and finishing positions.`,
                },
                {
                  text: `Should an event/race/session/lap/heat be restarted from the beginning, markets will stand and should be settled according to the result issued after the restart.`,
                },
                {
                  text: `Both drivers must start the race for head to head match-ups to be considered action. If one or both drivers do not start the race the market should resolve as 'No Contest'.`,
                },
                {
                  text: `If a driver does not finish the race for any reason (including disqualifications), the opposing driver should be declared the winner.`,
                },
                {
                  text: `If both Drivers do not finish the race for any reason (including disqualifications), the driver who completed more laps should be declared the winner. If both racers were disqualified at the same time or come in at same place (tie), the market should resolve as 'No Contest'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `NASCAR [0] CUP Series Championship Winner?`,
            example: `NASCAR 2020 CUP Series Championship Winner?\nEstimated schedule start time: Sept 19, 2020 1:00 pm EST`,
            header: `NASCAR [0] CUP Series Championship winner`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                groupKey: YEAR,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
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
                  text: `If the winning Racer is not one of the outcomes listed, market should resolve as 'Other (Field)'.`,
                },
                {
                  text: `The NASCAR Cup Series Drivers' Championship is awarded to the most successful NASCAR Cup Series racing car driver over a season, as determined by a points system based on race results. The winner can only be determined after the completion of the final race of the year and points for the season have been calculated.`,
                },
                {
                  text: `If the season is officially cancelled and event named in the market is not played, this market should resolve as "Invalid".`,
                },
                {
                  text: `If Nascar suspends play and starts up again at a later date, and the winner of the event named in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                },
                {
                  text: `If Nascar suspends play and starts up again at a later date, and the winner of the event named in the market is determined after the Market’s Event Expiration begins, this market should resolve as "Invalid".`,
                },
              ],
            },
          },
        ],
      },
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: ['2022', '2024', '2026'],
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
                header: `[0] [1] winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    groupKey: EVENT,
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
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No Contest'.`,
                    },
                    {
                      text:
                        'Includes regulation, any play-offs and sudden death',
                    },
                    {
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `PGA: Which team will win the [0] Presidents Cup?`,
                example: `PGA: Which team will win the 2020 Presidents Cup?`,
                header: `[0] Presidents Cup winner`,
                groupName: groupTypes.FUTURES,
                noAdditionalUserOutcomes: true,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: ['2022', '2024', '2026'],
                  },
                  {
                    id: 1,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No Contest'.`,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: ['2021', '2023', '2025'],
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
                header: `[0] [1] winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    groupKey: EVENT,
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
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No Contest'.`,
                    },
                    {
                      text:
                        'Includes regulation, any play-offs and sudden death',
                    },
                    {
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Euro Tour: Which golf team will win the [0] Ryders Cup?`,
                example: `Euro Tour: Which golf team will win the 2020 Ryders Cup?`,
                header: `[0] Ryders Cup winner`,
                groupName: groupTypes.FUTURES,
                noAdditionalUserOutcomes: true,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: ['2021', '2023', '2025'],
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
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No Contest'.`,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                header: `[0] [1] winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    groupKey: EVENT,
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
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No Contest'.`,
                    },
                    {
                      text:
                        'Includes regulation, any play-offs and sudden death',
                    },
                    {
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
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
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEAR_RANGE,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the season is officially cancelled and no Stanley Cup is played, this market should resolve as 'No'`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the Stanley Cup is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the Stanley Cup is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `NHL: Which team will win: [0] vs. [1]?`,
            example: `NHL: Which Team will win: NY Rangers vs. NJ Devils?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            header: `[0] vs. [1]`,
            outcomes: ['[0]','[1]','No Contest'],
            groupName: groupTypes.COMBO_MONEY_LINE,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                placeholder: `Team A`,
                groupKey: TEAM_A,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                placeholder: `Team B`,
                groupKey: TEAM_B,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 6,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Include Regulation, overtime and any shoot-outs.`,
                },
                {
                  text: `The game must go 55 minutes or more to be considered official, if not market should resolve as 'No Contest'`,
                },
                {
                  text: `If game is not played market should resolve as 'No Contest'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `NHL (Goal Spread): [0] to win by more than [1].5 goals over the [2]?`,
            example: `NHL (Goal Spread): St Louis Blues to win by more than 2.5 goals over the NY Rangers?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            title: `Spread [1].5`,
            header: `[0] vs. [2]`,
            outcomes: ['[0]','[2]','No Contest'],
            groupLineId: 1,
            groupName: groupTypes.COMBO_SPREAD,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team A`,
                groupKey: TEAM_A,
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
                groupKey: TEAM_B,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 3,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 6,
                groupKey: START_TIME,
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
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the game is not played market should resolve as 'No Contest'`,
                },
                {
                  text: `Include Regulation, overtime and any shoot-outs`,
                },
                {
                  text: `The game must go 55 minutes or more to be considered official if not, market should resolve as 'No Contest'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `NHL (O/U): [0] vs. [1]: Total goals scored; Over/Under [2].5?`,
            example: `NHL (O/U): St Louis Blues vs. NY Rangers: Total goals scored Over/Under 4.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
            title: `Over/Under [2].5`,
            header: `[0] vs. [1]`,
            outcomes: ['[0]','[1]','No Contest'],
            groupName: groupTypes.COMBO_OVER_UNDER,
            groupLineId: 2,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team A`,
                groupKey: TEAM_A,
                values: LIST_VALUES.NHL_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team B`,
                groupKey: TEAM_B,
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
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
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
                  text: `If the game is not played market should resolve as 'No Contest'`,
                },
                {
                  text: `Include Regulation, overtime and any shoot-outs`,
                },
                {
                  text: `The game must go 55 minutes or more to be considered official if not, market should resolve as 'No Contest'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which NHL team will win the [0] [1]?`,
            example: `Which NHL team will win the 2019-20 Stanley Cup?`,
            header: `[0] [1] winner`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                groupKey: YEAR,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEAR_RANGE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                groupKey: EVENT,
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
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                },
                {
                  text: `If the season is officially cancelled and the event named in market is not played, this market should resolve as 'Invalid'`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event named in market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event named in market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which NHL team will [0] sign with?`,
            example: `Which NHL team will Mike Hoffman sign with?`,
            header: `[0] will sign with`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Player`,
                groupKey: TEAM_A,
              },
              {
                id: 1,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Unsigned`,
              },
              {
                id: 3,
                type: TemplateInputType.USER_DROPDOWN_OUTCOME,
                placeholder: `Select Team`,
                values: LIST_VALUES.NHL_TEAMS,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Player named must have signed a contract on or before the markets Event Expiration`,
                },
                {
                  text: `If the player signs with a team not named in the outcomes, 'Other (Field)' should be determined the winning outcome`,
                },
                {
                  text: `If the player is not officially signed by the markets Event Expiration 'Unsigned' should be determined the winning outcome`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which NHL player will win the [0] [1]?`,
            example: `Which NHL player will win the 2019-20 Calder Trophy?`,
            header: `[0] [1] winner`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year Range`,
                groupKey: YEAR,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEAR_RANGE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Award`,
                groupKey: EVENT,
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
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
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
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEAR_RANGE_ABBR,
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
                  text: `If the season is officially cancelled prior to any official games being played, this market should resolve as 'Invalid'`,
                },
                {
                  text: `If the season is officially cancelled, after an official game has been played, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                },
                {
                  text: `If the league suspends play for the regular season  (but not officially cancelled) and the season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`,
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
                placeholder: TEXT_PLACEHOLDERS.SINGLE_HORSE,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.HORSE_RACING_EVENT,
                categoryDestId: 2,
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
            header: `[0] [1] winner`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                groupKey: YEAR,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                groupKey: EVENT,
                values: LIST_VALUES.HORSE_RACING_EVENT,
                categoryDestId: 2,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the winning horse is not one of the outcomes listed, market should resolve as 'Other (Field)'`,
                },
                {
                  text: `If the Race is cancelled for any reason or is postponed and will not be completed before the event expiration time for this market starts, market should resolve as 'No Contest'`,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    categoryDestId: 2,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                header: `[0] Singles [1] [2] winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    groupKey: GENDER,
                    inputDestIds: [2],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: TENNIS_SINGLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    groupKey: EVENT,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If a player is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner`,
                    },
                    {
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If a Tournament or Event is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Single Tennis: [1] [2] Match play winner: [3] vs. [4]?`,
                example: `Men's Single Tennis: 2020 Wimbledon Match play winner between Roger Federer vs. Rafael Nadal?`,
                header: `[3] vs. [4]`,
                title: `Money Line`,
                groupName: groupTypes.MONEY_LINE,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    groupKey: GENDER,
                    inputDestIds: [2],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: TENNIS_SINGLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    groupKey: EVENT,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player A`,
                    groupKey: TEAM_A,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player B`,
                    groupKey: TEAM_B,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                      text: `If a player fails to start a tournament or a match, or the match was not able to start for any reason, the market should resolve as 'No Contest'.`,
                    },
                    {
                      text: `If the match is not played for any reason, or is terminated prematurely with both players willing and able to play, the market should resolve as 'No Contest'.`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Singles Tennis [1] [2] (O/U), [3] vs. [4]: Total [5] played in a match; Over/Under [6].5?`,
                example: `Men's Singles Tennis 2020 French Open (O/U), Novak Djokovic vs. Rafael Nadal: Total games played in a match; Over/Under 15.5?`,
                header: `[3] vs. [4]`,
                title: `Over/Under [6].5`,
                groupName: groupTypes.OVER_UNDER,
                groupLineId: 6,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    groupKey: GENDER,
                    inputDestIds: [2],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: TENNIS_SINGLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    groupKey: EVENT,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player A`,
                    groupKey: TEAM_A,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player B`,
                    groupKey: TEAM_B,
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
                    placeholder: `No Contest`,
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
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the match is not played for any reason the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If a match is started and is postponed for any reason and will not be completed before the Event Expiration begins the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If the match is started and a player is disqualified or withdraws for any reason, and a player/team moves forward or is declared the winner, the final results should be based off of when the match was stopped.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Singles Tennis [1] [2]: Who will win Set number [3], [4] vs. [5]?`,
                example: `Men's Singles Tennis 2020 French Open: Who will win Set number 3, Novak Djokovic vs. Rafael Nadal?`,
                title: `Set number [3] winner`,
                header: `[4] vs. [5]`,
                groupName: groupTypes.ADDITIONAL,
                groupLineId: 3,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    groupKey: GENDER,
                    inputDestIds: [2],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: TENNIS_SINGLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    groupKey: EVENT,
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
                    groupKey: TEAM_A,
                    placeholder: `Player A`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    groupKey: TEAM_B,
                    placeholder: `Player B`,
                  },

                  {
                    id: 6,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 9,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the set named in the market question is not played for any reason, the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If a match is started and is postponed for any reason and will not be completed before the Event Expiration begins the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If a player is disqualified or withdraws during the set named in the market question, the player moving forward to the next round should be declared the winner`,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                header: `[0] Doubles [1] [2] winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's/Mixed`,
                    groupKey: GENDER,
                    inputDestIds: [2],
                    values: LIST_VALUES.TENNIS_MENS_WOMENS,
                    inputDestValues: TENNIS_DOUBLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's/Mixed First`,
                    placeholder: `Event`,
                    groupKey: EVENT,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If either pairing is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner`,
                    },
                    {
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `This market each outcome is a two player team (pairing), if this is not the case, this market should settle as 'Invalid.'`,
                    },
                    {
                      text: `If a Tournament or Event is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Doubles Tennis: [1] [2] Match play winner: [3] vs. [4]?`,
                example: `Men's Doubles Tennis: 2020 Wimbledon Match play winner between Kevin Krawietz/Andreas Mies vs. Bob Bryan/Mike Bryan?`,
                header: `[3] vs. [4]`,
                title: `Money Line`,
                groupName: groupTypes.MONEY_LINE,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's/Mixed`,
                    groupKey: GENDER,
                    inputDestIds: [2],
                    values: LIST_VALUES.TENNIS_MENS_WOMENS,
                    inputDestValues: TENNIS_DOUBLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's/Mixed First`,
                    placeholder: `Event`,
                    groupKey: EVENT,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player/Player A`,
                    groupKey: TEAM_A,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player/Player B`,
                    groupKey: TEAM_B,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 9,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If either pairing is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner.`,
                    },
                    {
                      text: `If either pairing fails to start a tournament or a match, or the match was not able to start for any reason, the market should resolve as 'No Contest'.`,
                    },
                    {
                      text: `If the match is not played for any reason, or is terminated prematurely with both players willing and able to play, the market should resolve as 'No Contest'.`,
                    },
                    {
                      text: `This market each outcome is a two player team (pairing), if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No Contest/Not Played'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Doubles Tennis [1] [2] (O/U), [3] vs. [4]: Total [5] played in a match; Over/Under [6].5?`,
                example: `Men's Doubles Tennis 2020 French Open (O/U), Kevin Krawietz/Andreas Mies vs. Bob Bryan/Mike Bryan: Total games played in a match; Over/Under 15.5?`,
                header: `[3] vs. [4]`,
                title: `Over/Under [6].5`,
                groupName: groupTypes.OVER_UNDER,
                groupLineId: 6,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's/Mixed`,
                    groupKey: GENDER,
                    inputDestIds: [2],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: TENNIS_DOUBLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    groupKey: EVENT,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player/Player A`,
                    groupKey: TEAM_A,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player/Player B`,
                    groupKey: TEAM_B,
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
                    placeholder: `No Contest`,
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
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the match is not played for any reason the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If a match is started and is postponed for any reason and will not be completed before the Event Expiration begins the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If the match is started and a player is disqualified or withdraws for any reason, and a player/team moves forward or is declared the winner, the final results should be based off of when the match was stopped.`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No Contest/Not Played'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] Doubles Tennis [1] [2]: Who will win Set number [3], [4] vs. [5]?`,
                example: `Men's Doubles Tennis 2020 French Open: Who will win Set number 3, Kevin Krawietz/Andreas Mies vs. Bob Bryan/Mike Bryan?`,
                title: `Set number [3] winner`,
                header: `[4] vs. [5]`,
                groupName: groupTypes.ADDITIONAL,
                groupLineId: 3,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's/Mixed`,
                    groupKey: GENDER,
                    inputDestIds: [2],
                    values: LIST_VALUES.TENNIS_MENS_WOMENS,
                    inputDestValues: TENNIS_DOUBLES_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    groupKey: EVENT,
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
                    groupKey: TEAM_A,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Player/Player B`,
                    groupKey: TEAM_B,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 9,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the set named in the market question is not played for any reason, the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If a match is started and is postponed for any reason and will not be completed before the Event Expiration begins the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If a team is disqualified or withdraws during the set named in the market question, the team moving forward to the next round should be declared the winner`,
                    },
                    {
                      text: `If the match is postponed and concludes after markets event expiration the market should resolve as 'No Contest/Not Played'`,
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
                header: `(Men's) [0] [1] vs. [2]`,
                title: `Money Line`,
                groupName: groupTypes.MONEY_LINE,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `League`,
                    groupKey: LEAGUE_NAME,
                    inputDestIds: [1, 2],
                    values: LIST_VALUES.SOCCER_LEAGUES,
                    inputDestValues: SOCCER_LEAGUE_DEP_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
                    defaultLabel: `Select League First`,
                    inputSourceId: 0,
                    values: [],
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
                    defaultLabel: `Select League First`,
                    inputSourceId: 0,
                    values: [],
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
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
                    placeholder: `No Contest`,
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
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'No Contest'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Men's [0] (Point Spread): [1] to win by more than [2].5 goals over [3]?`,
                example: `Men's Ligue 1 (France): Marseille to win by more than 1.5 goals over Lyon?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `(Men's) [0] [1] vs. [3]`,
                title: `Spread [2].5`,
                groupName: groupTypes.SPREAD,
                groupLineId: 2,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `League`,
                    groupKey: LEAGUE_NAME,
                    inputDestIds: [1, 3],
                    values: LIST_VALUES.SOCCER_LEAGUES,
                    inputDestValues: SOCCER_LEAGUE_DEP_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
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
                    groupKey: TEAM_B,
                    defaultLabel: `Select League First`,
                    inputSourceId: 0,
                    values: [],
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
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
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time and does include any Overtime or Penalty shoot-out.`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'No Contest'.`,
                    },
                    {
                      text: `This market is intended to be about a Single Team verse Single Team, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Men's [0] (O/U): [1] vs. [2]: Total goals scored; Over/Under [3].5?`,
                example: `Men's MLS (USA) (O/U): Real Madrid vs. Manchester United: Total goals scored Over/Under 4.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `(Men's) [0] [1] vs. [2]`,
                title: `Over/Under [3].5`,
                groupName: groupTypes.OVER_UNDER,
                groupLineId: 3,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `League`,
                    groupKey: LEAGUE_NAME,
                    inputDestIds: [1, 2],
                    values: LIST_VALUES.SOCCER_LEAGUES,
                    inputDestValues: SOCCER_LEAGUE_DEP_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
                    defaultLabel: `Select League First`,
                    inputSourceId: 0,
                    values: [],
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
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
                    groupKey: START_TIME,
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
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `This market is intended to be about a Single Team verse Single Team, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Men's [0] [1] Champion?`,
                example: `Men's English Premier League Champion?`,
                header: `(Men's) [0] [1] Champion`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `League`,
                    groupKey: LEAGUE_NAME,
                    inputDestIds: [1],
                    values: LIST_VALUES.SOCCER_LEAGUES,
                    inputDestValues: SOCCER_LEAGUE_DEP_YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    defaultLabel: `Select League First`,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    inputSourceId: 0,
                    values: [],
                  },
                  {
                    id: 2,
                    type:
                      TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP,
                    inputSourceId: 0,
                    placeholder: `Select Team`,
                    values: SOCCER_LEAGUE_DEP_TEAMS,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'.`,
                    },
                    {
                      text: `If the season is officially cancelled and the league/event in the market question is not played, this market should resolve as 'Invalid'.`,
                    },
                    {
                      text: `If the league or Governing Organization suspends play and starts up again at a later date, and the winner of the event in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league or Governing Organization suspends play and starts up again at a later date, and the winner of the event in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
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
                question: `[0] [1]: Which team will win: [2] vs. [3]?`,
                example: `Men's World Cup: Which team will win: Real Madrid vs. Manchester United?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                header: `([0]) [2] vs. [3]`,
                title: `Money Line`,
                groupName: groupTypes.MONEY_LINE,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    groupKey: GENDER,
                    inputDestIds: [1],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: SOCCER_GENDER_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    groupKey: EVENT,
                    values: [],
                  },
                  {
                    id: 2,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.USER_DESCRIPTION_OUTCOME,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Draw`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'No Contest'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] [1] (Point Spread): [2] to win by more than [3].5 goals over [4]?`,
                example: `Men's World Cup (Point Spread): Real Madrid to win by more than 1.5 goals over Manchester United?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `([0]) [2] vs. [4]`,
                title: `Spread [3].5`,
                groupName: groupTypes.SPREAD,
                groupLineId: 3,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    groupKey: GENDER,
                    inputDestIds: [1],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: SOCCER_GENDER_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    groupKey: EVENT,
                    values: [],
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[2] -[3].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[4] +[3].5`,
                  },
                  {
                    id: 8,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out.`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'No Contest'.`,
                    },
                    {
                      text: `This market is intended to be about a Single Team verse Single Team, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] [1] (O/U): [2] vs. [3]: Total goals scored; Over/Under [4].5?`,
                example: `Men's World Cup (O/U): Real Madrid vs. Manchester United: Total goals scored Over/Under 4.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `([0]) [2] vs. [3]`,
                title: `Over/Under [4].5`,
                groupName: groupTypes.OVER_UNDER,
                groupLineId: 4,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    groupKey: GENDER,
                    inputDestIds: [1],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: SOCCER_GENDER_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    defaultLabel: `Select Men's/Women's First`,
                    placeholder: `Event`,
                    groupKey: EVENT,
                    values: [],
                  },
                  {
                    id: 2,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team A`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.TEXT,
                    placeholder: `Team B`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Whole #`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 6,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [4].5`,
                  },
                  {
                    id: 7,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [4].5`,
                  },
                  {
                    id: 8,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out`,
                    },
                    {
                      text: `If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `This market is intended to be about a Single Team verse Single Team, if this is not the case, this market should settle as 'Invalid'.`,
                    },
                    {
                      text: `If the game is postponed and concludes after markets event expiration the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] [1] [2] Winner?`,
                example: `Men's UEFA Europa League 2020/2021 Winner?`,
                header: `([0]) [1] [2] Winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Men's/Women's`,
                    groupKey: GENDER,
                    inputDestIds: [1],
                    values: LIST_VALUES.MENS_WOMENS,
                    inputDestValues: SOCCER_CUSTOM_GENDER_EVENTS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Event`,
                    defaultLabel: `Select Men's/Women's First`,
                    groupKey: LEAGUE_NAME,
                    inputDestIds: [2],
                    values: [],
                    inputDestValues: SOCCER_CUSTOM_DEP_YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    defaultLabel: `Select Event First`,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    inputSourceId: 0,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'.`,
                    },
                    {
                      text: `If the season is officially cancelled and the league/event in the market question is not played, this market should resolve as 'Invalid'.`,
                    },
                    {
                      text: `If the league or Governing Organization suspends play and starts up again at a later date, and the winner of the event in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league or Governing Organization suspends play and starts up again at a later date, and the winner of the event in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'No'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                    },
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the award in the market question is not awarded for any reason by event expiration, this market should resolve as 'No'.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NBA: Which team will win: [0] vs. [1]?`,
                example: `NBA: Which Team will win: Brooklyn Nets vs. NY Knicks?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                header: `[0] vs. [1]`,
                outcomes: ['[0]','[1]','No Contest'],
                groupName: groupTypes.COMBO_MONEY_LINE,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                    {
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official. If the game is not played or if less than 43 minutes of play have been completed, the game is not considered an official game and the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NBA (Point Spread): [0] to win by more than [1].5 points over the [2]?`,
                example: `NBA (Point Spread): Brooklyn Nets to win by more than 10.5 points over the NY Knicks?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                header: `[0] vs. [2]`,
                title: `Spread [1].5`,
                outcomes: ['[0]','[2]','No Contest'],
                groupLineId: 1,
                groupName: groupTypes.COMBO_SPREAD,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
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
                    groupKey: TEAM_B,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                    {
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official. If the game is not played or if less than 43 minutes of play have been completed, the game is not considered an official game and the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NBA (O/U): [0] vs. [1]: Total Points scored; Over/Under [2].5?`,
                example: `NBA (O/U): Brooklyn Nets vs. NY Knicks: Total Points scored: Over/Under 164.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `[0] vs. [1]`,
                title: `Over/Under [2].5`,
                outcomes: ['[0]','[1]','No Contest'],
                groupName: groupTypes.COMBO_OVER_UNDER,
                groupLineId: 2,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
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
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                      text: `At least 43 minutes of play must have elapsed for the game to be deemed official. If the game is not played or if less than 43 minutes of play have been completed, the game is not considered an official game and the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NBA team will win the [0] [1]?`,
                example: `Which NBA team will win the 2019-20 Western Conference Finals?`,
                header: `NBA: [0] [1] winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    groupKey: EVENT,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the season is officially cancelled and event named in the market is not played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event named in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event named in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NBA team will [0] sign with?`,
                example: `Which NBA team will Anthony Davis sign with?`,
                header: `[0] will sign with`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player`,
                    groupKey: TEAM_A,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Unsigned`,
                  },
                  {
                    id: 3,
                    type:
                      TemplateInputType.USER_DROPDOWN_OUTCOME,
                    placeholder: `Select Team`,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Player named must have signed a contract on or before the markets Event Expiration`,
                    },
                    {
                      text: `If the player signs with a team not named in the outcomes, 'Other (Field)' should be determined the winning outcome`,
                    },
                    {
                      text: `If the player is not officially signed by the markets Event Expiration 'Unsigned' should be determined the winning outcome`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NBA player will win the [0] [1] award?`,
                example: `Which NBA player will win the 2019-20 Most Valuable Player award?`,
                header: `NBA: [0] [1] winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Award`,
                    groupKey: EVENT,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
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
                header: `NBA: [1] regular season most [0]`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Action`,
                    groupKey: EVENT,
                    values: LIST_VALUES.BASKETBALL_ACTION,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the season is officially cancelled, the statistic at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, statistic at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league suspends play and play is not concluded before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`,
                    },
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the season is officially cancelled prior to any official games being played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the season is officially cancelled, after an official game has been played, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league suspends play for the regular season  (but not officially cancelled) and the season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`,
                    },
                  ],
                },
              },
            ],
          },
          [NBA_DRAFT]: {
            templates: [
              {
                marketType: CATEGORICAL,
                question: `[0] NBA Draft: Who will be the [1] overall pick?`,
                example: `2020 NBA Draft: Who will be the 1st overall pick?\nEstimated schedule start time: Sept 19, 2020 1:00 pm EST`,
                header: `[0] NBA Draft: [1] overall pick`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `pick number`,
                    groupKey: EVENT,
                    values: LIST_VALUES.DRAFT_PICK_NUMBER,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
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
                      text: `Outcomes are determined by the player selected at the time of the "Pick". Trades which occur after a player is selected do not impact the results. For example, to determine the winner of the first pick in the draft...If a player was selected with the first pick in the draft and was then traded to the team with the 3rd pick. The original player selected first would be the winning outcome.`,
                    },
                    {
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the event in the market question is not determined for any reason, by event expiration, this market should resolve as "Invalid".`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] NBA Draft: The First draft pick by the [1]?`,
                example: `2020 NBA Draft: The First draft pick by the LA Lakers?\nEstimated schedule start time: Sept 19, 2020 1:00 pm EST`,
                header: `[0] NBA Draft: [1] first pick`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    groupKey: TEAM_A,
                    values: LIST_VALUES.NBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 8,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
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
                      text: `Outcomes are determined by the player selected at the time of the "Pick". Trades which occur after a player is selected do not impact the results. For example, to determine the winner of the first pick in the draft...If a player was selected with the first pick in the draft and was then traded to the team with the 3rd pick. The original player selected first would be the winning outcome.`,
                    },
                    {
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the event in the market question is not determined for any reason, by event expiration, this market should resolve as "Invalid".`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] NBA Draft(O/U): When will [1] be selected? Over/Under, Pick [2].5?`,
                example: `2020 NBA Draft(O/U): When will Tua Tagovailoa be selected? Over/Under, Pick 2.5?\nEstimated schedule start time: Sept 19, 2020 1:00 pm EST`,
                header: `[0] NBA Draft: When will [1] be selected`,
                title: `Over/Under [2].5`,
                groupName: groupTypes.OVER_UNDER,
                groupLineId: 2,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    noSort: true,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Person's Name`,
                    groupKey: TEAM_A,
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
                    hoursAfterEst: 8,
                    groupKey: START_TIME,
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
                  [REQUIRED]: [
                    {
                      text: `Outcomes are determined by the player selected at the time of the "Pick". Trades which occur after a player is selected do not impact the results.`,
                    },
                    {
                      text: `If the event in the market question is not determined for any reason, by event expiration, this market should resolve as "Invalid".`,
                    },
                    {
                      text: `If player is not selected "Over #.5" should be the winning outcome`,
                    },
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'No'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                    },
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the award in the market question is not awarded for any reason by event expiration, this market should resolve as 'No'.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `WNBA: Which team will win: [0] vs. [1]?`,
                example: `WNBA: Which Team will win: Phoenix Mercury vs. Seattle Storm?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                header: `[0] vs. [1]`,
                outcomes: ['[0]','[1]','No Contest'],
                groupName: groupTypes.COMBO_MONEY_LINE,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If game is not played or if less than 35 minutes of play have been completed, the game is not considered an official game the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `WNBA (Point Spread): [0] to win by more than [1].5 points over the [2]?`,
                example: `WNBA (Point Spread): Phoenix Mercury to win by more than 10.5 points over the Seattle Storm?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                header: `[0] vs. [2]`,
                title: `Spread [1].5`,
                outcomes: ['[0]','[2]','No Contest'],
                groupLineId: 1,
                groupName: groupTypes.COMBO_SPREAD,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
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
                    groupKey: TEAM_B,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
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
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If game is not played or if less than 35 minutes of play have been completed, the game is not considered an official game the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `WNBA (O/U): [0] vs. [1]: Total Points scored; Over/Under [2].5?`,
                example: `WNBA (O/U): Phoenix Mercury vs. Seattle Storm: Total Points scored: Over/Under 164.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `[0] vs. [1]`,
                title: `Over/Under [2].5`,
                outcomes: ['[0]','[1]','No Contest'],
                groupName: groupTypes.COMBO_OVER_UNDER,
                groupLineId: 2,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
                    values: LIST_VALUES.WNBA_TEAMS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
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
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If game is not played or if less than 35 minutes of play have been completed, the game is not considered an official game the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which WNBA team will win the [0] Championship?`,
                example: `Which WNBA team will win the 2019-20 Championship?`,
                header: `[0] Championship winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which WNBA player will win the [0] [1] award?`,
                example: `Which WNBA player will win the 2019-20 Most Valuable Player award?`,
                header: `[0] [1] award winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEAR_RANGE,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Award`,
                    groupKey: EVENT,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
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
                header: `[1] regular season [0] winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Action`,
                    groupKey: EVENT,
                    values: LIST_VALUES.BASKETBALL_ACTION,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year Range`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the season is officially cancelled, the statistic at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, statistic at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league suspends play and play is not concluded before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`,
                    },
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the season is officially cancelled prior to any official games being played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the season is officially cancelled, after an official game has been played, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league suspends play for the regular season  (but not officially cancelled) and the season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'No'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                    },
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event named in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event named in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA [0] BB: Which team will win: [1] vs. [2]?`,
                example: `NCAA Men's BB: Which Team will win: Duke vs. Kentucky?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                header: `[1] vs. [2]`,
                outcomes: ['[1]','[2]','No Contest'],
                groupName: groupTypes.COMBO_MONEY_LINE,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    groupKey: GENDER,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Includes Regulation and Overtime`,
                    },
                    {
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If game is not played market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA [0] BB (Point Spread): [1] to win by more than [2].5 points over [3]?`,
                example: `NCAA Men's BB (Point Spread): Duke to win by more than 10.5 points over Kentucky?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                header: `[1] vs. [3]`,
                title: `Spread [2].5`,
                outcomes: ['[1]','[3]','No Contest'],
                groupLineId: 2,
                groupName: groupTypes.COMBO_SPREAD,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    groupKey: GENDER,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
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
                    groupKey: TEAM_B,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If game is not played market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA [0] BB (O/U): [1] vs. [2]: Total Points scored; Over/Under [3].5?`,
                example: `NCAA Men's BB (O/U): Duke vs. Arizona: Total Points scored: Over/Under 164.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `[1] vs. [2]`,
                title: `Over/Under [3].5`,
                outcomes: ['[1]','[2]','No Contest'],
                groupName: groupTypes.COMBO_OVER_UNDER,
                groupLineId: 3,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    groupKey: GENDER,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team A`,
                    groupKey: TEAM_A,
                    values: LIST_VALUES.NCAA_BASKETBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
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
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                      text: `At least 35 minutes of play must have elapsed for the game to be deemed official. If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA [0] BB: Which college basketball team will win the [1] [2] tournament?`,
                example: `NCAA Men's BB: Which college basketball team will win the 2020 ACC tournament?`,
                header: `[1] [2] tournament winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's/Women's`,
                    groupKey: GENDER,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Conference`,
                    groupKey: EVENT,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the season is officially cancelled and the event in the market is not played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA [0] BB: Which college basketball team will win the [1] D1 National Championship?`,
                example: `NCAA Men's BB: Which college basketball team will win the 2020 D1 National Championship?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
                header: `[0] [1] D1 National Championship winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Men's / Women's`,
                    groupKey: GENDER,
                    values: LIST_VALUES.MENS_WOMENS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
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
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team`,
                defaultLabel: `Select Event First`,
                values: [],
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Event`,
                inputDestIds: [0],
                values: LIST_VALUES.BASEBALL_EVENT,
                inputDestValues: BASEBALL_EVENT_DEP_TEAMS,
                categoryDestId: 2,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the season is officially cancelled and event in market is not played, this market should resolve as 'No'`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event in market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event in market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `MLB: Which team will win: [0] vs. [1]?`,
            example: `MLB: Which Team will win: Yankees vs. Red Sox?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST`,
            header: `[0] vs. [1]`,
            outcomes: ['[0]','[1]','No Contest'],
            groupName: groupTypes.COMBO_MONEY_LINE,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                placeholder: `Team A`,
                groupKey: TEAM_A,
                values: LIST_VALUES.MLB_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                placeholder: `Team B`,
                groupKey: TEAM_B,
                values: LIST_VALUES.MLB_TEAMS,
              },
              {
                id: 2,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the "official time limit", or ends in a tie, the market should resolve as 'No Contest'`,
                },
                {
                  text: `If event is postponed and concludes after markets event expiration the market should resolve as 'No Contest'`,
                },
                {
                  text: `If the game is not played market should resolve as 'No Contest'`,
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
            header: `[0] vs. [2]`,
            title: `Spread [1].5`,
            outcomes: ['[0]','[2]','No Contest'],
            groupLineId: 1,
            groupName: groupTypes.COMBO_SPREAD,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team A`,
                groupKey: TEAM_A,
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
                groupKey: TEAM_B,
                values: LIST_VALUES.MLB_TEAMS,
              },
              {
                id: 3,
                type: TemplateInputType.ESTDATETIME,
                hoursAfterEst: 9,
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
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
                  text: `In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the "official time limit", or ends in a tie, the market should resolve as 'No Contest'`,
                },
                {
                  text: `If event is postponed and concludes after markets event expiration the market should resolve as 'No Contest'`,
                },
                {
                  text: `If the game is not played market should resolve as 'No Contest'`,
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
            header: `[0] vs. [1]`,
            title: `Over/Under [2].5`,
            outcomes: ['[0]','[1]','No Contest'],
            groupName: groupTypes.COMBO_OVER_UNDER,
            groupLineId: 2,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team A`,
                groupKey: TEAM_A,
                values: LIST_VALUES.MLB_TEAMS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Team B`,
                groupKey: TEAM_B,
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
                groupKey: START_TIME,
                placeholder: `Date time`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
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
                  text: `In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the "official time limit", or ends in a tie, the market should resolve as 'No Contest'`,
                },
                {
                  text: `If event is postponed and concludes after markets event expiration the market should resolve as 'No Contest'`,
                },
                {
                  text: `If the game is not played market should resolve as 'No Contest'`,
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
            header: `[0] [1] winner`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                groupKey: YEAR,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                groupKey: EVENT,
                values: LIST_VALUES.BASEBALL_EVENT,
                categoryDestId: 2,
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
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                },
                {
                  text: `If the season is officially cancelled and the event in the market is not played, this market should resolve as 'Invalid'`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which MLB team will [0] sign with?`,
            example: `Which MLB team will Gerrit Cole sign with?`,
            header: `[0] will sign with`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Player`,
                groupKey: TEAM_A,
              },
              {
                id: 1,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 2,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Unsigned`,
              },
              {
                id: 3,
                type: TemplateInputType.USER_DROPDOWN_OUTCOME,
                placeholder: `Select Team`,
                values: LIST_VALUES.MLB_TEAMS,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Player named must have signed a contract on or before the markets Event Expiration`,
                },
                {
                  text: `If the player signs with a team not named in the outcomes, 'Other (Field)' should be determined the winning outcome`,
                },
                {
                  text: `If the player is not officially signed by the markets Event Expiration 'Unsigned' should be determined the winning outcome`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `MLB: Which player will win the [0] [1]?`,
            example: `MLB: Which Player will win the 2019 American League Cy Young award?`,
            header: `[0] [1] winner`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                groupKey: YEAR,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Award`,
                groupKey: EVENT,
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
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
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
                validationType: ValidationType.YEAR_YEAR_RANGE,
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
                  text: `If the season is officially cancelled prior to any official games being played, this market should resolve as 'Invalid'`,
                },
                {
                  text: `If the season is officially cancelled, after an official game has been played, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                },
                {
                  text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                },
                {
                  text: `If the league suspends play for the regular season  (but not officially cancelled) and the season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`,
                },
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                header: `[1] Summer Olympics most [0] metals`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_MEDALS,
                    groupKey: EVENT,
                    placeholder: `Medal type`,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                header: `[2] Summer Olympics [0] [1] gold metal`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Sport`,
                    groupKey: EVENT,
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
                    groupKey: SUB_EVENT,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                header: `[1] Winter Olympics most [0] metals`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    values: LIST_VALUES.OLYMPIC_MEDALS,
                    placeholder: `Medal type`,
                    groupKey: EVENT,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                header: `[2] Winter Olympics [0] [1] gold metal`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                    placeholder: `Sport`,
                    groupKey: EVENT,
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
                    groupKey: SUB_EVENT,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the league's regular season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`,
                    },
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
                      text: `If the league suspends play and starts up again at a later date, and the winner of the SuperBowl is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the SuperBowl is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: YES_NO,
                question: `NFL: Will [0] win the [1] [2] award?`,
                example: `NFL: Will Patrick Mahomes win the 2020 MVP award?`,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
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
                      text: `If the award in the market question is not awarded for any reason by event expiration, this market should resolve as 'No'.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0]: Which NFL Team will win: [1] vs. [2]?`,
                example: ` Week 1: Which NFL Team will win: NY Giants vs. New England Patriots?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `[1] vs. [2]`,
                outcomes: ['[1]','[2]','No Contest'],
                groupName: groupTypes.COMBO_MONEY_LINE,
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
                    groupKey: TEAM_A,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 8,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If the game is not played market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If the game ends in a tie, the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NFL (Point Spread) [0]: [1] to win by more than [2].5 points over [3]?`,
                example: `NFL (Point Spread) Week 1: Seattle Seahawks to win by more than 10.5 points over Dallas Cowboys?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `[1] vs. [3]`,
                title: `Spread [2].5`,
                outcomes: ['[1]','[3]','No Contest'],
                groupLineId: 2,
                groupName: groupTypes.COMBO_SPREAD,
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
                    groupKey: TEAM_A,
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
                    groupKey: TEAM_B,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 8,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If the game is not played market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NFL (O/U) [0]: [1] vs. [2]: Total points scored; Over/Under [3].5?`,
                example: `NFL (O/U) Week 1: NY Giants vs. Dallas Cowboys: Total points scored: Over/Under 56.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `[1] vs. [2]`,
                title: `Over/Under [3].5`,
                outcomes: ['[1]','[2]','No Contest'],
                groupName: groupTypes.COMBO_OVER_UNDER,
                groupLineId: 3,
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
                    groupKey: TEAM_A,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
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
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                    { text: `Include Regulation and Overtime` },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `If the game is not played market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NFL team will win the [0] [1]?`,
                example: `Which NFL team will win the 2020 AFC Championship game?`,
                header: `[0] [1] winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    groupKey: EVENT,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the season is officially cancelled and the event in the market is not played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the event in the market is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NFL team will [0] sign with?`,
                example: `Which NFL team will Jadeveon Clowney sign with?`,
                header: `[0] will sign with`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    placeholder: `Player`,
                    groupKey: TEAM_A,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Other (Field)`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `Unsigned`,
                  },
                  {
                    id: 3,
                    type:
                      TemplateInputType.USER_DROPDOWN_OUTCOME,
                    placeholder: `Select Team`,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Player named must have signed a contract on or before the markets Event Expiration`,
                    },
                    {
                      text: `If the player signs with a team not named in the outcomes, 'Other (Field)' should be determined the winning outcome`,
                    },
                    {
                      text: `If the player is not officially signed by the markets Event Expiration 'Unsigned' should be determined the winning outcome`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which NFL player will win the [0] season [1] award?`,
                example: `Which NFL player will win the 2020 season Most Valuable Player award?`,
                header: `[0] season [1] award winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Award`,
                    groupKey: EVENT,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the season is officially cancelled prior to any official games being played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the season is officially cancelled, after an official game has been played, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league suspends play for the regular season  (but not officially cancelled) and the season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`,
                    },
                  ],
                },
              },
            ],
          },
          [NFL_DRAFT]: {
            templates: [
              {
                marketType: CATEGORICAL,
                question: `[0] NFL Draft: Who will be the [1] overall pick?`,
                example: `2020 NFL Draft: Who will be the 1st overall pick?\nEstimated schedule start time: Sept 19, 2020 1:00 pm EST`,
                header: `[0] NFL Draft [1] overall pick`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `pick number`,
                    groupKey: EVENT,
                    values: LIST_VALUES.DRAFT_PICK_NUMBER,
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
                    placeholder: `Other (Field)`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Outcomes are determined by the player selected at the time of the "Pick". Trades which occur after a player is selected do not impact the results. For example, to determine the winner of the first pick in the draft...If a player was selected with the first pick in the draft and was then traded to the team with the 3rd pick. The original player selected first would be the winning outcome.`,
                    },
                    {
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the event in the market question is not determined for any reason, by event expiration, this market should resolve as "Invalid".`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] NFL Draft: Who will be the first [1] selected?`,
                example: `2020 NFL Draft: Who will be the first Quarterback selected?\nEstimated schedule start time: Sept 19, 2020 1:00 pm EST`,
                header: `[0] NFL Draft first [1] selected`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `position`,
                    groupKey: EVENT,
                    values: LIST_VALUES.NFL_DRAFT_POSITIONS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 48,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
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
                      text: `Outcomes are determined by the player selected at the time of the "Pick". Trades which occur after a player is selected do not impact the results. For example, to determine the winner of the first pick in the draft...If a player was selected with the first pick in the draft and was then traded to the team with the 3rd pick. The original player selected first would be the winning outcome.`,
                    },
                    {
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the event in the market question is not determined for any reason, by event expiration, this market should resolve as "Invalid".`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] NFL Draft: The First draft pick by the [1]?`,
                example: `2020 NFL Draft: The First draft pick by the NY Giants?\nEstimated schedule start time: Sept 19, 2020 1:00 pm EST`,
                header: `[0] NFL Draft [1] first draft pick`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team`,
                    groupKey: TEAM_A,
                    values: LIST_VALUES.NFL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 48,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
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
                      text: `Outcomes are determined by the player selected at the time of the "Pick". Trades which occur after a player is selected do not impact the results. For example, to determine the winner of the first pick in the draft...If a player was selected with the first pick in the draft and was then traded to the team with the 3rd pick. The original player selected first would be the winning outcome.`,
                    },
                    {
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the event in the market question is not determined for any reason, by event expiration, this market should resolve as "Invalid".`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] NFL Draft(O/U): [1].5 Total [2] drafted in Round 1?`,
                example: `2020 NFL Draft(O/U): 5.5 Total Quarterbacks drafted in Round 1?\nEstimated schedule start time: Sept 19, 2020 1:00 pm EST`,
                header: `[0] NFL Draft [2] drafted in Round 1`,
                title: `Over/Under [1].5`,
                groupName: groupTypes.OVER_UNDER,
                groupLineId: 1,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    noSort: true,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
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
                    placeholder: `Positions`,
                    groupKey: EVENT,
                    values: LIST_VALUES.NFL_DRAFT_TOTAL_POSITIONS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Over [1].5`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `Under [1].5`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `Outcomes are determined by the player selected at the time of the "Pick". Trades which occur after a player is selected do not impact the results. For example, If a QB was selected in the first round and was later traded for another player in the 2nd round. The QB would count towards the first round total.`,
                    },
                    {
                      text: `If the event in the market question is not determined for any reason, by event expiration, this market should resolve as "Invalid".`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `[0] NFL Draft(O/U): When will [1] be selected? Over/Under, Pick [2].5?`,
                example: `2020 NFL Draft(O/U): When will Tua Tagovailoa be selected? Over/Under, Pick 2.5?\nEstimated schedule start time: Sept 19, 2020 1:00 pm EST`,
                header: `[0] NFL Draft [1] pick selection`,
                title: `Over/Under [2].5`,
                groupName: groupTypes.OVER_UNDER,
                groupLineId: 2,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    noSort: true,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    placeholder: `Person's Name`,
                    groupKey: TEAM_A,
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
                    hoursAfterEst: 48,
                    groupKey: START_TIME,
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
                  [REQUIRED]: [
                    {
                      text: `Outcomes are determined by the player selected at the time of the "Pick". Trades which occur after a player is selected do not impact the results. For example, If a QB was selected in the first round and was later traded for another player in the 2nd round. The QB would count towards the first round total.`,
                    },
                    {
                      text: `If the event in the market question is not determined for any reason, by event expiration, this market should resolve as "Invalid".`,
                    },
                    {
                      text: `If player is not selected "Over #.5" should be the winning outcome`,
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
                header: `[1] vs. [2]`,
                outcomes: ['[1]','[2]','No Contest'],
                groupName: groupTypes.COMBO_MONEY_LINE,
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
                    groupKey: TEAM_A,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.USER_DESCRIPTION_DROPDOWN_OUTCOME,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    { text: `Includes Regulation and Overtime` },
                    {
                      text: `If the game is not played, the market should resolve as "No Contest' as Team A did NOT win vs. team B`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA FB (Point Spread) [0]: [1] to win by more than [2].5 points over [3]?`,
                example: `NCAA FB (Point Spread) Week 1: Alabama to win by more than 10.5 points over Michigan?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `[1] vs. [3]`,
                title: `Spread [2].5`,
                outcomes: ['[1]','[3]','No Contest'],
                groupLineId: 2,
                groupName: groupTypes.COMBO_SPREAD,
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
                    groupKey: TEAM_A,
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
                    groupKey: TEAM_B,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.ESTDATETIME,
                    hoursAfterEst: 6,
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                      text: `If the game is not played, the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `NCAA FB (O/U) [0]: [1] vs. [2]: Total points scored; Over/Under [3].5?`,
                example: `NCAA FB (O/U) Week 1: Alabama vs. Michigan: Total points scored: Over/Under 56.5?\nEstimated schedule start time: Sept 19, 2019 1:00 pm EST`,
                header: `[1] vs. [2]`,
                title: `Over/Under [3].5`,
                outcomes: ['[1]','[2]','No Contest'],
                groupName: groupTypes.COMBO_OVER_UNDER,
                groupLineId: 3,
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
                    groupKey: TEAM_A,
                    values: LIST_VALUES.NCAA_FOOTBALL_TEAMS,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Team B`,
                    groupKey: TEAM_B,
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
                    groupKey: START_TIME,
                    placeholder: `Date time`,
                  },
                  {
                    id: 5,
                    type: TemplateInputType.ADDED_OUTCOME,
                    placeholder: `No Contest`,
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
                      text: `If the game is not played, the market should resolve as 'No Contest'`,
                    },
                    {
                      text: `At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Contest'`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which college football team will win [0] National Championship?`,
                example: `Which college football team will win 2020 National Championship?`,
                header: `[0] National Championship winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
                    values: LIST_VALUES.YEARS_21,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Event`,
                    groupKey: EVENT,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                    },
                    {
                      text: `If the season is officially cancelled and no Championship is played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined before the Market’s Event Expiration begins, this market is still valid and should be settled accordingly.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, and the winner of the Championship is determined after the Market’s Event Expiration begins, this market should resolve as 'Invalid'.`,
                    },
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Which college football player will win the [0] Heisman Trophy?`,
                example: `Which college football player will win the 2020 Heisman Trophy?`,
                header: `[0] Heisman Trophy winner`,
                groupName: groupTypes.FUTURES,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.DROPDOWN,
                    placeholder: `Year`,
                    groupKey: YEAR,
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
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
                    validationType: ValidationType.YEAR_YEAR_RANGE,
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
                      text: `If the season is officially cancelled prior to any official games being played, this market should resolve as 'Invalid'`,
                    },
                    {
                      text: `If the season is officially cancelled, after an official game has been played, the number of wins at the time the league officially stopped should be used to determine the resolution of the market.`,
                    },
                    {
                      text: `If the league suspends play and starts up again at a later date, the total amount of games won at the conclusion of the regular season should be used, as long as the regular season concludes before the Market’s Event Expiration begins.`,
                    },
                    {
                      text: `If the league suspends play for the regular season  (but not officially cancelled) and the season will not conclude before the Market’s Event Expiration time begins for any reason, this market should resolve as 'Invalid'.`,
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
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.PRES_YEARS,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `A candidate that receives at least 270 votes in the Electoral College shall be considered the winner. In the event that no candidate receives 270 votes, the House of Representatives will decide the winner. In the event of further indecision or tie, it will be the candidate determined to be the winner under the US Constitution.`,
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
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.PRES_YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Party`,
                values: LIST_VALUES.POL_PARTY,
                categoryDestId: 2,
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
                categoryDestId: 2,
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
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.PRES_YEARS,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `A candidate that receives at least 270 votes in the Electoral College shall be considered the winner. In the event that no candidate receives 270 votes, the House of Representatives will decide the winner. In the event of further indecision or tie, it will be the candidate determined to be the winner under the US Constitution.`,
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
            marketType: YES_NO,
            question: `Will [0] be federally charged by [1] 11:59PM ET?`,
            example: `Will Al Capone be federal charged by December 31, 2020 11:59PM ET`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: TEXT_PLACEHOLDERS.SINGLE_PERSON_NAME,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 2,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Person named shall be indicted or otherwise formally charged with a U.S. federal crime, as publicly confirmed on or before date by 11:59PM eastern time (ET) in market question by an authorized representative of the charging agency(ies) or judicial venue(s).`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which party will win the [0] U.S. Presidential election?`,
            example: `Which party will win the 2020 U.S. Presidential election?`,
            header: `[0] U.S. Presidential election party winner`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                groupKey: YEAR,
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
                  text: `A candidate that receives at least 270 votes in the Electoral College shall be considered the winner. In the event that no candidate receives 270 votes, the House of Representatives will decide the winner. In the event of further indecision or tie, it will be the candidate determined to be the winner under the US Constitution.`,
                },
                {
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Who will win the [0] U.S. Presidential election?`,
            example: `Who will win the 2020 U.S. Presidential election?`,
            header: `[0] U.S. Presidential election winner`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                groupKey: YEAR,
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
                  text: `A candidate that receives at least 270 votes in the Electoral College shall be considered the winner. In the event that no candidate receives 270 votes, the House of Representatives will decide the winner. In the event of further indecision or tie, it will be the candidate determined to be the winner under the US Constitution.`,
                },
                {
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Who will be the [0] nominee for [1] [2]?`,
            example: `Who will be the Republican nominee for 2020 U.S. Vice-President?`,
            header: `[1] [2] [0] nominee`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Party`,
                groupKey: ENTITY,
                values: LIST_VALUES.POL_PARTY,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                groupKey: YEAR,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Office`,
                groupKey: EVENT,
                values: LIST_VALUES.PRES_OFFICES,
                categoryDestId: 2,
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
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which party will win [0] in the [1] U.S. Presidential election?`,
            example: `Which party will win Michigan in the 2020 U.S. Presidential election?`,
            header: `[1] U.S. Presidential election [0] party winner`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `State`,
                groupKey: ENTITY,
                values: LIST_VALUES.US_STATES,
                categoryDestId: 2,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                groupKey: YEAR,
                values: LIST_VALUES.PRES_YEARS,
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
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Outcome is determined by the winning party of the popular vote of the state's election.`,
                },
                {
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Which party will control the [0] after the [1] election?`,
            example: `Which party will control the U.S House of Representatives after the 2020 election?`,
            header: `[0] control after [1] election`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Office`,
                groupKey: ENTITY,
                values: LIST_VALUES.POL_HOUSE_SENATE_OFFICE,
                categoryDestId: 2,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                groupKey: YEAR,
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
                  text: `The winning outcome is the party which is expected to control the majority of seats according to the results of the election, not determined by the current controlling party at event expiration if the new congress's session hasn't started yet.`,
                },
                {
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Who will win the [0] [1] [2] primary for U.S. Presidential election?`,
            example: `Who will win the 2020 South Carolina Democratic primary for U.S Presidential election?`,
            header: `[0] [1] [2] primary for U.S. Presidential election winner`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                groupKey: YEAR,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.PRES_YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `State`,
                groupKey: EVENT,
                values: LIST_VALUES.US_STATES,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Party`,
                groupKey: ENTITY,
                values: LIST_VALUES.POL_PARTY,
                categoryDestId: 2,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the primary does not take place the market should resolve as 'No Contest'`,
                },
                {
                  text: `The winner of the primary is the candidate recognized and/or announced by the state`,
                },
                {
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                },
              ],
            },
          },
          {
            marketType: CATEGORICAL,
            question: `Who will win the [0] [1] [2] caucus for U.S. Presidential election?`,
            example: `Who will win the 2020 South Carolina Democratic caucus for U.S Presidential election?`,
            header: `U.S. Presidential election [0] [1] [2] caucus winner?`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                groupKey: YEAR,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.PRES_YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `State`,
                groupKey: EVENT,
                values: LIST_VALUES.US_STATES,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Party`,
                groupKey: ENTITY,
                values: LIST_VALUES.POL_PARTY,
                categoryDestId: 2,
              },
              {
                id: 3,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `Other (Field)`,
              },
              {
                id: 4,
                type: TemplateInputType.ADDED_OUTCOME,
                placeholder: `No Contest`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `If the caucus does not take place the market should resolve as 'No Contest'`,
                },
                {
                  text: `The winner of the caucus is the candidate recognized and/or announced by the political party`,
                },
                {
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
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
                categoryDestId: 2,
                values: LIST_VALUES.POL_POSITION,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Country`,
                values: LIST_VALUES.OLYMPIC_COUNTRIES,
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
            header: `[0] of [1] by [2] winner`,
            groupName: groupTypes.FUTURES,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Position`,
                groupKey: ENTITY,
                values: LIST_VALUES.POL_POSITION,
                categoryDestId: 2,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Country`,
                groupKey: EVENT,
                values: LIST_VALUES.OLYMPIC_COUNTRIES,
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
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
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
  [ECONOMICS]: {
    children: {
      [STATISTICS]: {
        templates: [
          {
            marketType: CATEGORICAL,
            question: `Will the seasonally adjusted national Unemployment Rate for [0] [1] be [2]% or higher according to the US Bureau Labor of Statistics?`,
            example: `Will the seasonally adjusted national Unemployment Rate for September 2020 be 5% or higher according to the US Bureau Labor of Statistics?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Month`,
                eventExpEndNextMonth: true,
                yearDropdown: 1,
                values: LIST_VALUES.MONTHS,
                noSort: true,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                eventExpEndNextMonth: true,
                values: LIST_VALUES.YEARS,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                monthDropdown: 0,
              },
              {
                id: 2,
                type: TemplateInputType.TEXT,
                placeholder: `Number`,
                validationType: ValidationType.NUMBER_ONE_DECIMAL,
              },
              {
                id: 3,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `[2]% or Higher`,
              },
              {
                id: 4,
                type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                placeholder: `Below [2]%`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Settlement is found using the US Bureau Labor of Statistics website (https://www.bls.gov/). You can go directly to https://data.bls.gov/timeseries/LNS14000000 to find the market settlement number, go to the Year/Month stated in the market question in the chart.`,
                },
              ],
            },
          },
          {
            marketType: SCALAR,
            question: `What will the seasonally adjusted national Unemployment Rate be for [0] [1] according to the US Bureau Labor of Statistics?`,
            example: `What will the seasonally adjusted national Unemployment Rate be for September 2020 according to the US Bureau Labor of Statistics?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Month`,
                eventExpEndNextMonth: true,
                yearDropdown: 1,
                values: LIST_VALUES.MONTHS,
                noSort: true,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                eventExpEndNextMonth: true,
                values: LIST_VALUES.YEARS,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                monthDropdown: 0,
              },
            ],
            tickSize: 0.1,
            minPrice: 0,
            maxPrice: 30,
            denomination: '%',
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Settlement is found using the US Bureau Labor of Statistics website (https://www.bls.gov/). You can go directly to https://data.bls.gov/timeseries/LNS14000000 to find the market settlement number, go to the Year/Month stated in the market question in the chart.`,
                },
              ],
            },
          },
        ],
      },
    },
  },
  [ENTERTAINMENT]: {
    children: {
      [AWARDS]: {
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
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.ENTERTAINMENT_EVENT,
                categoryDestId: 2,
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
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 3,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Event`,
                inputDestIds: [1],
                values: LIST_VALUES.ENTERTAINMENT_EVENT,
                inputDestValues: ENTERTAINMENT_EVENT_DEP_TEAMS,
                categoryDestId: 2,
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
            marketType: CATEGORICAL,
            question: `Who will host the [0] [1]?`,
            example: `Who wll host the 2020 Emmy Awards?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Year`,
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 1,
                type: TemplateInputType.DROPDOWN,
                placeholder: `Event`,
                values: LIST_VALUES.ENTERTAINMENT_EVENT,
                categoryDestId: 2,
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
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                },
                {
                  text: ` If the event does not take place or if the results of the event do not occur by the Event Expiration time, this market should resolve as "Invalid"`,
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
                validationType: ValidationType.YEAR_YEAR_RANGE,
                values: LIST_VALUES.YEARS,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Event`,
                inputDestIds: [0],
                values: LIST_VALUES.ENTERTAINMENT_EVENT,
                inputDestValues: ENTERTAINMENT_EVENT_DEP_TEAMS,
                categoryDestId: 2,
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
                  text: `If the winner is not listed as a market outcome, the market should resolve as 'Other (Field)'`,
                },
                {
                  text: ` If the event does not take place or if the results of the event do not occur by the Event Expiration time, this market should resolve as "Invalid"`,
                },
              ],
            },
          },
        ],
      },
      [TV_MOVIES]: {
        templates: [
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
        ],
      },
      [SOCIAL_MEDIA]: {
        children: {
          [TWITTER]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Twitter: Will @[0] have [1] [2] or more twitter followers on [3], according to www.socialblade.com?`,
                example: `Twitter: Will @elonmusk have 50 million or more twitter followers on September 12, 2020, according to www.socialblade.com?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.SOCIAL,
                    placeholder:
                      TEXT_PLACEHOLDERS.TWITTER_HANDLE,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.NUMBER_ONE_DECIMAL,
                    numberRange: [0.1, 999.9],
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
                    type: TemplateInputType.DATEYEAR,
                    daysAfterDateStart: 2,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `To find the results: In the header of the page. Select "Twitter" from the drop down menu. Then enter the twitter handle in the search bar. Scroll down the page until you reach the section that says "Twitter Stats Summary/ User Statistics for (account named). Find the date named in the market question and get the larger number under the "Followers" section (number will not have a +/-). Settlement should be based off of this number.`,
                    },
                    {
                      text: 'If the twitter handle named in the market does not exist, the market should resolve as "Invalid".',
                    },
                    {
                      text: `If www.socialblade.com is down or not available use www.socialtracker.io to determine the results for the specified handle/account on the date named in the market question.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Twitter: Will @[0] have [1] or more new tweets on [2], according to www.socialblade.com?`,
                example: `Twitter: Will @elonmusk have 10 or more new tweets on September 12, 2020, according to www.socialblade.com?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.SOCIAL,
                    placeholder:
                      TEXT_PLACEHOLDERS.TWITTER_HANDLE,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Number`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    daysAfterDateStart: 2,
                    placeholder: `Day of Year`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[1] or more`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `less than [1]`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `To find the results: In the header of the page. Select "Twitter" from the drop down menu. Then enter the twitter handle in the search bar. Scroll down the page until you reach the section that says "Twitter Stats Summary/ User Statistics for (account named). Find the date named in the market question and get the number under the "Media" section, number will have a +/-, if no number value is 0. Settlement should be based off of this number.`,
                    },
                    {
                      text: 'If the twitter handle named in the market does not exist, the market should resolve as "Invalid".',
                    },
                    {
                      text: `If www.socialblade.com is down or not available use www.socialtracker.io to determine the results for the specified handle/account on the date named in the market question.`
                    }
                  ],
                },
              },
            ],
          },
          [INSTAGRAM]: {
            templates: [
              {
                marketType: YES_NO,
                question: `Instagram: Will [0] have [1] [2] or more followers on [3], according to www.socialblade.com?`,
                example: `Instagram: Will therock have 200 million or more followers on September 12, 2020, according to www.socialblade.com?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.SOCIAL,
                    placeholder:
                      TEXT_PLACEHOLDERS.INSTAGRAM_ACCOUNT,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.NUMBER_ONE_DECIMAL,
                    numberRange: [0.1, 999.9],
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
                    type: TemplateInputType.DATEYEAR,
                    daysAfterDateStart: 2,
                    placeholder: `Day of Year`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `To find the results: In the header of the page. Select "Instagram" from the drop down menu. Then enter the instagram account in the search bar. Scroll down the page until you reach the section that says "Instagram Stats Summary/ User Statistics for (account named). Find the date named in the market question and get the larger number under the "Followers" section (number will not have a +/-). Settlement should be based off of this number.`,
                    },
                    {
                      text: 'If the instagram account named in the market does not exist, the market should resolve as "Invalid".',
                    },
                    {
                      text: `If www.socialblade.com is down or not available use www.socialtracker.io to determine the results for the specified handle/account on the date named in the market question.`
                    }
                  ],
                },
              },
              {
                marketType: CATEGORICAL,
                question: `Instagram: Will [0] have [1] or more new posts on [2], according to www.socialblade.com?`,
                example: `Instagram: Will therock have 2 or more new posts on September 12, 2020, according to www.socialblade.com?`,
                inputs: [
                  {
                    id: 0,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.SOCIAL,
                    placeholder:
                      TEXT_PLACEHOLDERS.INSTAGRAM_ACCOUNT,
                  },
                  {
                    id: 1,
                    type: TemplateInputType.TEXT,
                    validationType: ValidationType.WHOLE_NUMBER,
                    placeholder: `Number`,
                  },
                  {
                    id: 2,
                    type: TemplateInputType.DATEYEAR,
                    daysAfterDateStart: 2,
                    placeholder: `Day of Year`,
                  },
                  {
                    id: 3,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `[1] or more`,
                  },
                  {
                    id: 4,
                    type: TemplateInputType.SUBSTITUTE_USER_OUTCOME,
                    placeholder: `less than [1]`,
                  },
                ],
                resolutionRules: {
                  [REQUIRED]: [
                    {
                      text: `To find the results: In the header of the page. Select "Instagram" from the drop down menu. Then enter the instagram account in the search bar. Scroll down the page until you reach the section that says "Instagram Stats Summary/ User Statistics for (account named). Find the date named in the market question and get the number under the "Media" section, number will have a +/-, if no number value is 0. Settlement should be based off of this number.`,
                    },
                    {
                      text: 'If the instagram account named in the market does not exist, the market should resolve as "Invalid".',
                    },
                    {
                      text: `If www.socialblade.com is down or not available use www.socialtracker.io to determine the results for the specified handle/account on the date named in the market question.`
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
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
              {
                id: 3,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
                categoryDestId: 2,
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
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 3,
                dateAfterId: 2,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
              {
                id: 4,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
                categoryDestId: 2,
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
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
                categoryDestId: 2,
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
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
              {
                id: 3,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
                categoryDestId: 2,
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
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 3,
                dateAfterId: 2,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
              {
                id: 4,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
                categoryDestId: 2,
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
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
                categoryDestId: 2,
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
      [AUGUR]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the price of REP/USD open at or above [0] on [1], according to TradingView.com "REPUSD (crypto - Coinbase)"?`,
            example: `Will the price of REP/USD open at or above 25 on December 31, 2020, according to TradingView.com "REPUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie REPUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `Will the price of REP/USD, exceed [0] anytime between the open of [1] and close of [2], according to TradingView.com "REPUSD (crypto - Coinbase)"?`,
            example: `Will the price of REP/USD exceed 25 anytime between the open of September 1, 2020 and close of December 31, 2020, according to TradingView.com "REPUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                dateAfterId: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie REPUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `What price will REP/USD open at on [0], according to TradingView.com "REPUSD (crypto - Coinbase)"?`,
            example: `What price will REP/USD open at on December 31, 2020, according to TradingView.com for "REPUSD (crypto - Coinbase)"?`,
            denomination: 'Price',
            inputs: [
             {
                id: 0,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie REPUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
      [AMPLE]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the price of AMPL/USDT open at or above [0] on [1], according to TradingView.com "AMPLUSDT (crypto - KuCoin)"?`,
            example: `Will the price of AMPL/USDT open at or above 1.00 on December 31, 2020, according to TradingView.com "AMPLUSDT (crypto - KuCoin)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie AMPLUSDT), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `Will the price of AMPL/USDT, exceed [0] anytime between the open of [1] and close of [2], according to TradingView.com "AMPLUSDT (crypto - KuCoin)"?`,
            example: `Will the price of AMPL/USDT exceed 1.00 anytime between the open of September 1, 2020 and close of December 31, 2020, according to TradingView.com "AMPLUSDT (crypto - KuCoin)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                dateAfterId: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie AMPLUSDT), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `What price will AMPL/USDT open at on [0], according to TradingView.com "AMPLUSDT (crypto - KuCoin)"?`,
            example: `What price will AMPL/USDT open at on December 31, 2020, according to TradingView.com for "AMPLUSDT (crypto - KuCoin)"?`,
            denomination: 'Price',
            inputs: [
             {
                id: 0,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie AMPLUSDT), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
      [MAKER]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the price of MKR/USD open at or above [0] on [1], according to TradingView.com "MKRUSD (crypto - Coinbase)"?`,
            example: `Will the price of MKR/USD open at or above 500 on December 31, 2020, according to TradingView.com "MKRUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie MKRUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `Will the price of MKR/USD, exceed [0] anytime between the open of [1] and close of [2], according to TradingView.com "MKRUSD (crypto - Coinbase)"?`,
            example: `Will the price of MKR/USD exceed 500 anytime between the open of September 1, 2020 and close of December 31, 2020, according to TradingView.com "MKRUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                dateAfterId: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie MKRUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `What price will MKR/USD open at on [0], according to TradingView.com "MKRUSD (crypto - Coinbase)"?`,
            example: `What price will MKR/USD open at on December 31, 2020, according to TradingView.com for "MKRUSD (crypto - Coinbase)"?`,
            denomination: 'Price',
            inputs: [
             {
                id: 0,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie MKRUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
      [COMPOUND]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the price of COMP/USD open at or above [0] on [1], according to TradingView.com "COMPUSD (crypto - Coinbase)"?`,
            example: `Will the price of COMP/USD open at or above 220 on December 31, 2020, according to TradingView.com "COMPUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie COMPUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `Will the price of COMP/USD, exceed [0] anytime between the open of [1] and close of [2], according to TradingView.com "COMPUSD (crypto - Coinbase)"?`,
            example: `Will the price of COMP/USD exceed 220 anytime between the open of September 1, 2020 and close of December 31, 2020, according to TradingView.com "COMPUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                dateAfterId: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie COMPUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `What price will COMP/USD open at on [0], according to TradingView.com "COMPUSD (crypto - Coinbase)"?`,
            example: `What price will COMP/USD open at on December 31, 2020, according to TradingView.com for "COMPUSD (crypto - Coinbase)"?`,
            denomination: 'Price',
            inputs: [
             {
                id: 0,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie COMPUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
      [BALANCER]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the price of BAL/USD open at or above [0] on [1], according to TradingView.com "BALUSD (crypto - FTX)"?`,
            example: `Will the price of BAL/USD open at or above 12 on December 31, 2020, according to TradingView.com "BALUSD (crypto - FTX)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie BALUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if FTX's tradingview.com data feed is unavailable, find the opening price on FTX's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
          {
            marketType: YES_NO,
            question: `Will the price of BAL/USD, exceed [0] anytime between the open of [1] and close of [2], according to TradingView.com "BALUSD (crypto - FTX)"?`,
            example: `Will the price of BAL/USD exceed 12 anytime between the open of September 1, 2020 and close of December 31, 2020, according to TradingView.com "BALUSD (crypto - FTX)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                dateAfterId: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie BALUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if FTX's tradingview.com data feed is unavailable, find the opening price on FTX's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
          {
            marketType: SCALAR,
            question: `What price will BAL/USD open at on [0], according to TradingView.com "BALUSD (crypto - FTX)"?`,
            example: `What price will BAL/USD open at on December 31, 2020, according to TradingView.com for "BALUSD (crypto - FTX)"?`,
            denomination: 'Price',
            inputs: [
             {
                id: 0,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie BALUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
                },
                {
                  text: `Opening price can also be found on tradingview using the hourly chart for the date in the market question at UTC (0) 00:00`,
                },
                {
                  text: `If the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if FTX's tradingview.com data feed is unavailable, find the opening price on FTX's exchange by using the hourly candlestick chart adjusting for local timezone offset. In order to find equivalent 00:00 UTC-0 hourly candlestick for December 16th, go to hourly candelstick for 00:00 December 16th, then count backwards or forwards the number of candlesticks depending on local time zone offset. If local timezone offset is UTC -5 move back 5 candlesticks to find the Open Price for 19:00 December 15th hourly candlestick.`,
                },
              ],
            },
          },
        ],
      },
      [ZEROX]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the price of ZRX/USD open at or above [0] on [1], according to TradingView.com "ZRXUSD (crypto - Coinbase)"?`,
            example: `Will the price of ZRX/USD open at or above 0.35 on December 31, 2020, according to TradingView.com "ZRXUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie ZRXUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `Will the price of ZRX/USD, exceed [0] anytime between the open of [1] and close of [2], according to TradingView.com "ZRXUSD (crypto - Coinbase)"?`,
            example: `Will the price of ZRX/USD exceed 0.35 anytime between the open of September 1, 2020 and close of December 31, 2020, according to TradingView.com "ZRXUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                dateAfterId: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie ZRXUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `What price will ZRX/USD open at on [0], according to TradingView.com "ZRXUSD (crypto - Coinbase)"?`,
            example: `What price will ZRX/USD open at on December 31, 2020, according to TradingView.com for "ZRXUSD (crypto - Coinbase)"?`,
            denomination: 'Price',
            inputs: [
             {
                id: 0,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie ZRXUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
      [CHAINLINK]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the price of LINK/USD open at or above [0] on [1], according to TradingView.com "LINKUSD (crypto - Coinbase)"?`,
            example: `Will the price of LINK/USD open at or above 4.50 on December 31, 2020, according to TradingView.com "LINKUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie LINKUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `Will the price of LINK/USD, exceed [0] anytime between the open of [1] and close of [2], according to TradingView.com "LINKUSD (crypto - Coinbase)"?`,
            example: `Will the price of LINK/USD exceed 4.50 anytime between the open of September 1, 2020 and close of December 31, 2020, according to TradingView.com "LINKUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.TEXT,
                placeholder: `Value #`,
                validationType: ValidationType.NUMBER,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                dateAfterId: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie LINKUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
            question: `What price will LINK/USD open at on [0], according to TradingView.com "LINKUSD (crypto - Coinbase)"?`,
            example: `What price will LINK/USD open at on December 31, 2020, according to TradingView.com for "LINKUSD (crypto - Coinbase)"?`,
            denomination: 'Price',
            inputs: [
             {
                id: 0,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
            ],
            resolutionRules: {
              [REQUIRED]: [
                {
                  text: `Use ticker symbol search for token pair (ie LINKUSD), find exchange that corresponds to market question. Navigate to Full-featured daily chart, Opening price is determined on the date in the market question on tradingview.com.`,
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
      [ADDITIONAL_TOKENS]: {
        templates: [
          {
            marketType: YES_NO,
            question: `Will the price of [0] open at or above [1] on [2], according to TradingView.com "[3]"?`,
            example: `Will the price of DASH/USD open at or above 80 on December 31, 2020, according to TradingView.com "DASHUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [3],
                values: LIST_VALUES.TOKEN_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_TOKEN_CURRENCY_MARKETS,
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
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
              {
                id: 3,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
                categoryDestId: 2,
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
            example: `Will the price of DASH/USD exceed 80 anytime between the open of September 1, 2020 and close of December 31, 2020, according to TradingView.com "DASHUSD (crypto - Coinbase)"?`,
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [4],
                values: LIST_VALUES.TOKEN_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_TOKEN_CURRENCY_MARKETS,
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
              },
              {
                id: 3,
                dateAfterId: 2,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
              {
                id: 4,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
                categoryDestId: 2,
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
            example: `What price will DASH/USD open at on December 31, 2020, according to TradingView.com for "DASHUSD (crypto - Coinbase)"?`,
            denomination: 'Price',
            inputs: [
              {
                id: 0,
                type: TemplateInputType.DROPDOWN_QUESTION_DEP,
                placeholder: `Token Pair`,
                inputDestIds: [2],
                values: LIST_VALUES.TOKEN_CURRENCY_PAIRS,
                inputDestValues: CRYPTO_TOKEN_CURRENCY_MARKETS,
              },
              {
                id: 1,
                type: TemplateInputType.DATEYEAR,
                daysAfterDateStart: 1,
                placeholder: `Day of Year`,
              },
              {
                id: 2,
                type: TemplateInputType.DROPDOWN,
                defaultLabel: `Select Pair First`,
                placeholder: `Market Source`,
                values: [],
                categoryDestId: 2,
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
        ]
      }
    },
  },
  [MEDICAL]: {
    templates: [
      {
        marketType: YES_NO,
        question: `Will there be [0] or more total confirmed [1] Coronavirus (Covid-19) in [2] by [3] according to https://www.worldometers.info/coronavirus/?`,
        example: `Will there be 3000000 or more total confirmed cases of Coronavirus (Covid-19) in the world by July 15, 2020 according to https://www.worldometers.info/coronavirus/?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            validationType: ValidationType.WHOLE_NUMBER,
            placeholder: 'Whole #',
          },
          {
            id: 1,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Case/Death`,
            values: LIST_VALUES.MEDICAL_CASE_DEATH,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Countries`,
            values: LIST_VALUES.MEDICAL_COUNTRIES,
            categoryDestId: 1,
          },
          {
            id: 3,
            type: TemplateInputType.DATEYEAR,
            daysAfterDateStart: 2,
            placeholder: `Day of Year`,
          },
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text: `World Cases: Settlement is based off of the https://www.worldometers.info/coronavirus/ website.  To find the Total number of confirmed World cases, go to the Total Case (linear scale) chart.  Move your mouse to the date named in the market question and that number is to be used for settlement purposes.  To find the Total number of  World deaths, go to the Total deaths (linear scale) chart.  Move your mouse to the date named in the market question and that number is to be used for settlement purposes.`,
            },
            {
              text: `Country Cases: To find the Total cases or deaths for a specific country named in the market question go to https://www.worldometers.info/coronavirus/ website and scroll down the page until you find the list of countries.  Select the country you want.  On that country’s information page, scroll down until you find the corresponding chart needed for the market question. For example, to find the total amount of confirmed cases in the United States, go to the Total Case (linear scale) chart.  Move your mouse to the date named in the market question and that number is to be used for settlement purposes.  To find the Total number of deaths for that country, go to the Total deaths (linear scale) chart.  Move your mouse to the date named in the market question and that number is to be used for settlement purposes.`,
            },
          ],
        },
      },
      {
        marketType: YES_NO,
        question: `Will the FDA approve a vaccine for Coronavirus (Covid-19) by [0]?`,
        example: `Will the FDA approve a vaccine for Coronavirus (Covid-19) by November 15, 2020?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.DATEYEAR,
            daysAfterDateStart: 2,
            placeholder: `Day of Year`,
          },
        ],
        resolutionRules: {},
      },
      {
        marketType: YES_NO,
        question: `Will there be [0] or more total [1] Coronavirus (Covid-19) in US State: [2] by [3] according to https://covidtracking.com/data/?`,
        example: `Will there be 1000 or more total Cases of Coronavirus (Covid-19) in US State: Georgia by May 3, 2020 according to https://covidtracking.com/data/?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.TEXT,
            validationType: ValidationType.WHOLE_NUMBER,
            placeholder: 'Whole #',
          },
          {
            id: 1,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Case/Death`,
            values: LIST_VALUES.MEDICAL_CASE_DEATH,
          },
          {
            id: 2,
            type: TemplateInputType.DROPDOWN,
            placeholder: `US States`,
            values: LIST_VALUES.US_STATES,
            categoryDestId: 1,
          },
          {
            id: 3,
            type: TemplateInputType.DATEYEAR,
            daysAfterDateStart: 2,
            placeholder: `Day of Year`,
          },
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text: `Cases: Settlement is based of the https://covidtracking.com/data/ website. To find the Total number of positive cases for a US State. You must find the State you are searching for and click on that State, to go to that State's details, Scroll down until you see history. Look for the specific date mentioned in the market question and scroll over until you find "Positive" column and use that number.`,
            },
            {
              text: `Deaths: Settlement is based of the https://covidtracking.com/data/ website. To find the Total number of deaths from Covid-19 for a US State. You must find the State you are searching for and click on that State, to go to that State's details, Scroll down until you see history. Look for the specific date mentioned in the market question and scroll over until you find "Deaths" column and use that number.`,
            },
          ],
        },
      },
      {
        marketType: CATEGORICAL,
        question: `Which of these countries will have the highest amount of total confirmed [0] Coronavirus (Covid-19) by [1] according to https://www.worldometers.info/coronavirus/#countries?`,
        example: `Which of these countries will have the highest amount of total confirmed cases of Coronavirus (Covid-19) by July 20, 2020 according to https://www.worldometers.info/coronavirus/#countries?`,
        inputs: [
          {
            id: 0,
            type: TemplateInputType.DROPDOWN,
            placeholder: `Case/Death`,
            values: LIST_VALUES.MEDICAL_CASE_DEATH,
          },
          {
            id: 1,
            type: TemplateInputType.DATEYEAR,
            daysAfterDateStart: 2,
            placeholder: `Day of Year`,
          },
          {
            id: 2,
            type: TemplateInputType.USER_DROPDOWN_OUTCOME,
            placeholder: `Select Country`,
            values: LIST_VALUES.MEDICAL_COUNTRIES_ONLY,
          },
        ],
        resolutionRules: {
          [REQUIRED]: [
            {
              text: `Country Cases: To find the Total cases or deaths for a specific country named in the market question go to https://www.worldometers.info/coronavirus/ website and scroll down the page until you find the list of countries.  Select the country you want.  On that country’s information page, scroll down until you find the corresponding chart needed for the market question. For example, to find the total amount of confirmed cases in the United States, go to the Total Case (linear scale) chart.  Move your mouse to the date named in the market question and that number is to be used for settlement purposes.  To find the Total number of deaths for that country, go to the Total deaths (linear scale) chart.  Move your mouse to the date named in the market question and that number is to be used for settlement purposes.`,
            },
          ],
        },
      },
    ],
  },
};
