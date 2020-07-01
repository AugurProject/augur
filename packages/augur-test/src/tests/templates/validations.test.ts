import { ACCOUNTS, addScripts, FlashSession } from '@augurproject/tools';

let flash: FlashSession;

beforeAll(async () => {
  flash = new FlashSession(ACCOUNTS);
  addScripts(flash);
});

const templateValidations = [
  {
    skip: false,
    title: 'Will bob be federally charged by June 23, 2020 11:59PM ET?',
    templateInfo: '{"hash":"0xad72cd4fb3a7811b65974abf5090088b4b5607075548d013645ac6857897c954","question":"Will [0] be federally charged by [1] 11:59PM ET?","inputs":[{"id":0,"value":"bob","type":"TEXT","timestamp":null},{"id":1,"value":"June 23, 2020","type":"DATEYEAR","timestamp":1592888400}]}',
    endTime: '1593061200',
    creationTime: '1592844948',
    resolutionRules: 'Person named shall be indicted or otherwise formally charged with a U.S. federal crime, as publicly confirmed on or before date by 11:59PM eastern time (ET) in market question by an authorized representative of the charging agency(ies) or judicial venue(s).',
    categories: 'Sports,Golf',
    result: 'templated market does not have correct categories'
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
