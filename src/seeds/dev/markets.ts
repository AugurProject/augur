import * as Knex from "knex";
import Promise = require("bluebird");

exports.seed = function (knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("markets").del()
        .then(function () {
          // Inserts seed entries
          return knex('markets').insert([{
            contract_address:        '0x0000000000000000000000000000000000000001',
            universe:                '0x000000000000000000000000000000000000000b',
            market_type:             'categorical',
            num_outcomes:            8,
            min_price:               0,
            max_price:               1000000000000000000,
            market_creator:          '0x0000000000000000000000000000000000000b0b',
            creation_time:           1506473474,
            creation_block_number:   1400000,
            creation_fee:            1000000000000000000,
            market_creator_fee_rate: 1,
            topic:                   'test topic',
            tag1:                    'test tag 1',
            tag2:                    'test tag 2',
            reporting_window:        '0x1000000000000000000000000000000000000000',
            end_time:                1506573474,
            short_description:       'This is a test market created by the augur-node.',
            designated_reporter:     '0x0000000000000000000000000000000000000b0b',
            resolution_source:       'http://www.trusted-third-party.com'
          }]);
        });
};
