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
