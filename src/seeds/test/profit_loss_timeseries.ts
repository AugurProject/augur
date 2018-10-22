import * as Knex from "knex";

exports.seed = async function (knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("profit_loss_timeseries").del()
        .then(async function (): Promise<any> {
            // Inserts seed entries
            return knex("profit_loss_timeseries").insert([
                { id: 1, colName: "rowValue1" },
                { id: 2, colName: "rowValue2" },
                { id: 3, colName: "rowValue3" }
            ]);
        });
};
