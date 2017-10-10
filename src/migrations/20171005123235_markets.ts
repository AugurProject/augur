import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("markets").then(() => {
    return knex.schema.raw(`CREATE TABLE markets (
							market_id varchar(66) PRIMARY KEY NOT NULL,
              universe varchar(66) NOT NULL,
              market_type varchar(11) NOT NULL CONSTRAINT enum_market_types CHECK (market_type = 'binary' OR market_type = 'categorical' OR market_type = 'scalar'),
              num_outcomes integer NOT NULL CONSTRAINT positive_num_outcomes CHECK (num_outcomes > 0),
              min_price numeric NOT NULL,
              max_price numeric NOT NULL CONSTRAINT max_price_gt_min_price CHECK (max_price > min_price),
              market_creator varchar(66) NOT NULL,
              creation_time integer NOT NULL CONSTRAINT positive_market_creation_time CHECK (creation_time > 0),
              creation_block_number integer NOT NULL CONSTRAINT positive_market_creation_block_number CHECK (creation_block_number > 0),
              creation_fee numeric NOT NULL CONSTRAINT nonnegative_creation_fee CHECK (creation_fee >= 0),
              market_creator_fee_rate numeric NOT NULL CONSTRAINT nonnegative_market_creator_fee_rate CHECK (market_creator_fee_rate >= 0),
              market_creator_fees_collected numeric DEFAULT 0 CONSTRAINT nonnegative_market_creator_fees_collected CHECK (market_creator_fees_collected >= 0),
              topic varchar(255) NOT NULL,
              tag1 varchar(255),
              tag2 varchar(255),
              volume numeric DEFAULT 0 CONSTRAINT nonnegative_volume CHECK (volume >= 0),
              shares_outstanding numeric DEFAULT 0 CONSTRAINT nonnegative_shares_outstanding CHECK (shares_outstanding >= 0),
              reporting_window varchar(66),
              end_time integer NOT NULL CONSTRAINT positive_end_time CHECK (end_time > 0),
              finalization_time integer,
              short_description varchar(1000) NOT NULL,
              long_description text,
              designated_reporter varchar(66) NOT NULL,
              resolution_source text
            )`)
  });
    
};

exports.down = async (knex: Knex): Promise<any> => {
   return knex.schema.dropTableIfExists("markets"); 
};
