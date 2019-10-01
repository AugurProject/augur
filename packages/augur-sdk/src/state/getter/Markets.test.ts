import { parseExtraInfo } from './Markets';

test('parseExtraInfo', () => {
  let extraInfo: any = {
    description: 'fooington',
    resolutionSource: 'common sense',
    backupSource: 'uncommon sense',
  };
  expect(parseExtraInfo(JSON.stringify(extraInfo))).toEqual(extraInfo);

  extraInfo = {
    description: 'just description',
  };
  expect(parseExtraInfo(JSON.stringify(extraInfo))).toEqual(
    extraInfo
  );

  extraInfo = {
    longDescription: 'no description! therefore, fail',
  };
  expect(parseExtraInfo(JSON.stringify(extraInfo))).toBeNull();

  extraInfo = {
    description: 'bad type! therefore, fail',
    longDescription: 14,
  };
  expect(parseExtraInfo(JSON.stringify(extraInfo))).toBeNull();

  // Users shouldn't add unexpected fields to extraInfo
  // but there's no reason to treat it as an error.
  extraInfo = {
    description: 'something extra',
    extraOrdinary: 'supers',
  };
  expect(parseExtraInfo(JSON.stringify(extraInfo))).toEqual(extraInfo);

  extraInfo = 'invalid json';
  expect(parseExtraInfo(extraInfo)).toBeNull();
});
