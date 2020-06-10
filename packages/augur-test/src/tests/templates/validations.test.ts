import { ACCOUNTS, addScripts, FlashSession } from '@augurproject/tools';

let flash: FlashSession;

beforeAll(async () => {
  flash = new FlashSession(ACCOUNTS);
  addScripts(flash);
});

const templateValidations = [
  {
    skip: true,
    title:
      'PGA: Which team will win the 2020 Presidents Cup?',
    templateInfo:
      '{"hash":"0x32005caba2639c59cba6d6b661c2623eefb32b4457d47188709b52570e61e25b","question":"PGA: Which team will win the [0] Presidents Cup?","inputs":[{"id":0,"value":"2020","type":"DROPDOWN","timestamp":null}]}',
    endTime: '1582588800',
    creationTime: '1582578800',
    outcomes: 'No winner/Event cancelled,United States Team,International Team',
    resolutionRules:
      "If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No winner/Event Cancelled'.\nOnly one team can be listed per outcome, if not then the market should resolve as 'Invalid'\nThis market is intended to have two teams, United States verse International, if not the case this market should resolve as 'Invalid'\nIncludes regulation, any play-offs and sudden death",
    result:
      'success',
  },
  {
    skip: true,
    title:
      'PGA: Which team will win the 2020 Presidents Cup?',
    templateInfo:
      '{"hash":"0x32005caba2639c59cba6d6b661c2623eefb32b4457d47188709b52570e61e25b","question":"PGA: Which team will win the [0] Presidents Cup?","inputs":[{"id":0,"value":"2020","type":"DROPDOWN","timestamp":null}]}',
    endTime: '1582588800',
    creationTime: '1582578800',
    outcomes: 'No winner/Event cancelled,United States Team,International Team,Bad Outcome',
    resolutionRules:
      "If a tournament or match is cancelled or postponed and will not be completed before the market's Event Expiration time, the market should resolve as 'No winner/Event Cancelled'.\nOnly one team can be listed per outcome, if not then the market should resolve as 'Invalid'\nThis market is intended to have two teams, United States verse International, if not the case this market should resolve as 'Invalid'\nIncludes regulation, any play-offs and sudden death",
    result:
      'error: no additioanl outcomes is a requirement, only required outcomes are allowed',
  },
  {
    skip: true,
    title:
      'NFL Week 1: Will the Atlanta Falcons & Arizona Cardinals score 1 or more combined points?',
    templateInfo:
      '{"hash":"0xd328c899c810c14a8d17e093d4bc2bdc1612fbe6f9bc456398cadd491ae3474a","question":"NFL [0]: Will the [1] & [2] score [3] or more combined points?","inputs":[{"id":0,"value":"Week 1","type":"DROPDOWN","timestamp":null},{"id":1,"value":"Atlanta Falcons","type":"DROPDOWN","timestamp":null},{"id":2,"value":"Arizona Cardinals","type":"DROPDOWN","timestamp":null},{"id":3,"value":"1","type":"TEXT","timestamp":null},{"id":4,"value":"1584377400","type":"ESTDATETIME","timestamp":1584377400}]}',
    endTime: '1584406200',
    creationTime: '1584306200',
    resolutionRules:
      "Include Regulation and Overtime\nAt least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'\nIf the game is not played market should resolve as 'No'",
    result:
      'error: estimated schedule date time is after market event expiration endTime',
  },
  {
    skip: true,
    title:
      'Will there be 1000 or more total confirmed deaths from Coronavirus (Covid-19) in Canada by April 1, 2020 according to https://www.worldometers.info/coronavirus/country?',
    templateInfo:
    '{"hash":"0xf72300773efecec0a82a30d8a9d316c815bea46c9c14fd95c079a11366c1721f","question":"Will there be [0] or more total confirmed [1] Coronavirus (Covid-19) in [2] by [3] according to https://www.worldometers.info/coronavirus/country?","inputs":[{"id":0,"value":"1000","type":"TEXT","timestamp":null},{"id":1,"value":"deaths from","type":"DROPDOWN","timestamp":null},{"id":2,"value":"Canada","type":"DROPDOWN","timestamp":null},{"id":3,"value":"April 1, 2020","type":"DATESTART","timestamp":1585717200}]}',
    endTime: '1585918800',
    creationTime: '1585908800',
    resolutionRules: null,
    result:
    'start date in question is not the required number of days before market event expiration endTime',
  },
  {
    skip: true,
    title: 'Twitter: Will @realDonaldTrump have 1999.9 Thousand or more twitter followers on June 18, 2020, according to www.socialblade.com?',
    templateInfo: '{"hash":"0x528d5c82bef2c4cc9808751b8c86c4e474a7df4cdd5cd3af23752181610d9b9c","question":"Twitter: Will @[0] have [1] [2] or more twitter followers on [3], according to www.socialblade.com?","inputs":[{"id":0,"type":"TEXT","value":"realDonaldTrump","timestamp":null},{"id":1,"type":"TEXT","value":"1999.9","timestamp":"1999.9"},{"id":2,"type":"DROPDOWN","value":"Thousand","timestamp":null},{"id":3,"type":"DATESTART","value":"June 18, 2020","timestamp":1592496396}]}',
    endTime: '1592582796',
    resolutionRules: 'To find the results: In the header of the page. Select \"Twitter\" from the drop down menu. Then enter the twitter handle in the search bar. Scroll down the page until you reach the section that says \"Twitter Stats Summary/ User Statistics for (account named). Find the date named in the market question and get the larger number under the \"Followers\" section (number will not have a +/-). Settlement should be based off of this number.\nIf the twitter handle named in the market does not exist, the market should resolve as \"Invalid\".',
    result: 'numeric input is outside of valid numeric range'
  },
  {
    skip: false,
    title: 'Will the Dow Jones Industrial Average close on or above 25000 on June 09, 2020?',
    templateInfo: '{"hash":"0x581ce39fbc678b07c215f78e90e3c11124185cddbf39974720a1090a698ad8f1","question":"Will the [0] close on or above [1] on [2]?","inputs":[{"id":0,"type":"DROPDOWN","value":"Dow Jones Industrial Average","timestamp":null},{"id":1,"type":"TEXT","value":"25000","timestamp":"25000"},{"id":2,"type":"DATEYEAR","value":"June 09, 2020","timestamp":null}]}',
    endTime: '1591821234',
    creationTime: '1591796053',
    resolutionRules: `Closing date is determined by the location of the exchange, where the underlying stocks for the index are traded\nIf trading day in market question is a weekend or holiday when exchange is not open this market should resolve as 'Invalid'`,
    result: 'event expiration can not be before exchange close time, or market creation after exchange close time',
  }
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
