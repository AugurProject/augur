import * as Knex from "knex";

exports.seed = async function (knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("profit_loss_timeseries").del()
        .then(async function (): Promise<any> {
            // Inserts seed entries
          return knex("profit_loss_timeseries").insert([
            {
              "moneySpent": "0.04",
              "numOwned": "0.0005",
              "numEscrowed": "0",
              "profit": "0"
            },
            {
              "moneySpent": "0.04",
              "numOwned": "0.0004",
              "numEscrowed": "0.0001",
              "profit": "0"
            },
            {
              "moneySpent": "0.024",
              "numOwned": "0.0003",
              "numEscrowed": "0.0001",
              "profit": "-0.020998"
            },
            {
              "moneySpent": "0.024",
              "numOwned": "0",
              "numEscrowed": "0.0004",
              "profit": "-0.020998"
            },
            {
              "moneySpent": "0.1212",
              "numOwned": "0.0003",
              "numEscrowed": "0.0004",
              "profit": "-0.088192"
            },
            {
              "moneySpent": "0.2412",
              "numOwned": "0.0013",
              "numEscrowed": "0.0004",
              "profit": "-0.088192"
            },
            {
              "moneySpent": "0.166002352941176470587384",
              "numOwned": "0.00117",
              "numEscrowed": "0.0004",
              "profit": "-0.1261341058823529411764712"
            },
            {
              "moneySpent": "0.16600235294117647059",
              "numOwned": "0.00127",
              "numEscrowed": "0.0003",
              "profit": "-0.12613410588235294118"
            },
            {
              "moneySpent": "0.0000000000000002565483363529411764733155",
              "numOwned": "0.00017",
              "numEscrowed": "0.0003",
              "profit": "54999999999.70786354111764705882"
            },
            {
              "moneySpent": "0.09600000000000025655",
              "numOwned": "0.00097",
              "numEscrowed": "0.0003",
              "profit": "54999999999.70786354111764705882"
            },
            {
              "moneySpent": "0.0377952755905512821063370078740157481325",
              "numOwned": "0.0005",
              "numEscrowed": "0.0003",
              "profit": "54999999999.601845382062528853640078"
            },
            {
              "moneySpent": "0.03779527559055128211",
              "numOwned": "0.0004",
              "numEscrowed": "0.0004",
              "profit": "54999999999.60184538206252885364"
            },
            {
              "moneySpent": "0.03779527559055128211",
              "numOwned": "0.0005",
              "numEscrowed": "0.0003",
              "profit": "54999999999.60184538206252885364"
            },
            {
              "moneySpent": "0.018897637795275641055",
              "numOwned": "0.0004",
              "numEscrowed": "0.0003",
              "profit": "54999999999.58212297261370994337625"
            },
            {
              "moneySpent": "0.0080989876265467033071698537682789652015",
              "numOwned": "0.0003",
              "numEscrowed": "0.0003",
              "profit": "54999999999.564425310071527708944286"
            }
          ]);
        });
};
