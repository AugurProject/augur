import * as Knex from "knex";

exports.seed = async function (knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("markets").del()
        .then(() => {
          return knex.raw(`INSERT INTO markets
            (market_id, universe, market_type, num_outcomes, min_price, max_price, market_creator, creation_time, creation_block_number, creation_fee, market_creator_fee_rate, topic, tag1, tag2, reporting_window, end_time, short_description, designated_reporter, resolution_source, num_ticks)
            VALUES (
              '0x0000000000000000000000000000000000000001',
              '0x000000000000000000000000000000000000000b',
              'categorical',
              8,
              0,
              1000000000000000000,
              '0x0000000000000000000000000000000000000b0b',
              1506473474,
              1400000,
              1000000000000000000,
              1,
              'test topic',
              'test tag 1',
              'test tag 2',
              '0x1000000000000000000000000000000000000000',
              1506573470,
              'This is a categorical test market created by b0b.',
              '0x0000000000000000000000000000000000000b0b',
              'http://www.trusted-third-party.com',
              24
            ), (
              '0x0000000000000000000000000000000000000002',
              '0x000000000000000000000000000000000000000b',
              'binary',
              2,
              0,
              1000000000000000000,
              '0x0000000000000000000000000000000000000b0b',
              1506480000,
              1400100,
              1000000000000000000,
              1,
              'test topic',
              'test tag 1',
              'test tag 2',
              '0x1000000000000000000000000000000000000000',
              1506573480,
              'This is a binary test market created by b0b.',
              '0x0000000000000000000000000000000000000b0b',
              'http://www.trusted-third-party.com',
              2
            ), (
              '0x0000000000000000000000000000000000000003',
              '0x000000000000000000000000000000000000000b',
              'binary',
              2,
              0,
              1000000000000000000,
              '0x000000000000000000000000000000000000d00d',
              1506480015,
              1400101,
              1000000000000000000,
              1,
              'test topic',
              'test tag 1',
              'test tag 2',
              '0x1000000000000000000000000000000000000000',
              1506573500,
              'This is another binary test market created by d00d.',
              '0x000000000000000000000000000000000000d00d',
              'http://www.ttp-inc.com/0000000000000000000000000000000000000003',
              16
            )`);
        });
};
