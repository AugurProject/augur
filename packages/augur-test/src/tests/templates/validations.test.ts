import { ACCOUNTS, addScripts, FlashSession } from '@augurproject/tools';

let flash: FlashSession;

beforeAll(async () => {
  flash = new FlashSession(ACCOUNTS);
  addScripts(flash);
});

const templateValidations = [
  {
    skip: false,
    title:
      'PGA: Which team will win the 2020 Presidents Cup?',
    templateInfo:
      '{"hash":"0x32005caba2639c59cba6d6b661c2623eefb32b4457d47188709b52570e61e25b","question":"PGA: Which team will win the [0] Presidents Cup?","inputs":[{"id":0,"value":"2020","type":"DROPDOWN","timestamp":null}]}',
    endTime: '1582588800',
    outcomes: 'No winner/Event cancelled,United States Team,International Team',
    resolutionRules:
      "If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No winner/Event Cancelled'.\nOnly one team can be listed per outcome, if not then the market should resolve as 'Invalid'\nThis market is intended to have two teams, United States verse International, if not the case this market should resolve as 'Invalid'\nIncludes regulation, any play-offs and sudden death",
    result:
      'success',
  },
  {
    skip: false,
    title:
      'PGA: Which team will win the 2020 Presidents Cup?',
    templateInfo:
      '{"hash":"0x32005caba2639c59cba6d6b661c2623eefb32b4457d47188709b52570e61e25b","question":"PGA: Which team will win the [0] Presidents Cup?","inputs":[{"id":0,"value":"2020","type":"DROPDOWN","timestamp":null}]}',
    endTime: '1582588800',
    outcomes: 'No winner/Event cancelled,United States Team,International Team,Bad Outcome',
    resolutionRules:
      "If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No winner/Event Cancelled'.\nOnly one team can be listed per outcome, if not then the market should resolve as 'Invalid'\nThis market is intended to have two teams, United States verse International, if not the case this market should resolve as 'Invalid'\nIncludes regulation, any play-offs and sudden death",
    result:
      'error: no additioanl outcomes is a requirement, only required outcomes are allowed',
  },
  {
    skip: false,
    title:
      'NFL Week 1: Will the Atlanta Falcons & Arizona Cardinals score 1 or more combined points?',
    templateInfo:
      '{"hash":"0xd328c899c810c14a8d17e093d4bc2bdc1612fbe6f9bc456398cadd491ae3474a","question":"NFL [0]: Will the [1] & [2] score [3] or more combined points?","inputs":[{"id":0,"value":"Week 1","type":"DROPDOWN","timestamp":null},{"id":1,"value":"Atlanta Falcons","type":"DROPDOWN","timestamp":null},{"id":2,"value":"Arizona Cardinals","type":"DROPDOWN","timestamp":null},{"id":3,"value":"1","type":"TEXT","timestamp":null},{"id":4,"value":"1584377400","type":"ESTDATETIME","timestamp":1584377400}]}',
    endTime: '1584406200',
    resolutionRules:
      "Include Regulation and Overtime\nAt least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'\nIf the game is not played market should resolve as 'No'",
    result:
      'error: estimated schedule date time is after market event expiration endTime',
  },
];

test('flash :: tempalte validation tests', async () => {
  templateValidations.map(async (t, i) => {
    if (t.skip) {
      console.log('skipping', t.title);
      return;
    }
    const result = await flash.call('validate-template', t);
    console.log('index:', i, t.title);
    console.log('expected', t.result);
    console.log('validation result: ', result);
    await expect(result).toEqual(t.result);
  });
});
