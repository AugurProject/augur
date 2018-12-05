import * as Knex from "knex";

exports.seed = async function(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("outcome_value_timeseries")
  .del()
  .then(async function(): Promise<any> {
    // Inserts seed entries
    return knex("outcome_value_timeseries").insert([
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x5b47237f635602818451f1744ef1cca1c13555fac33e60033442add2fe20e79a",
        "value": "0",
        "timestamp": 1533874013
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x190322ff0f72dda85b3e6b37f1b473e92559a16b45a16d426a63877d91be8042",
        "value": "0",
        "timestamp": 1533874013
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x6178a34150300efffc79c58519d00251035d884a81d961c260987a5548961202",
        "value": "0",
        "timestamp": 1533874658
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xd4027813b760375f0068a451395343ffc4754f53d2e0c7bed7bc67d02d1ce40f",
        "value": "0",
        "timestamp": 1533886478
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xa0a0d044e3532c9698b1d985049e43bbb045a9c9f10c6db6e1a395dce5aa278e",
        "value": "0",
        "timestamp": 1533886568
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xa90e7e284a4815b23e65bece358b5b4f7530484ae5e9445868a73a3f633ed03a",
        "value": "0",
        "timestamp": 1533886853
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xd966188eecd942240320a5693a23d34f20bc774f927d182b021a9910f68742bc",
        "value": "0",
        "timestamp": 1533887798
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x2cbd60d07c605b00152148dd1ab04bd9bca2cc4cf88b89735a30a7539b8039bd",
        "value": "0",
        "timestamp": 1533888023
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xece8b1412cfb6c80e73aa4781d109752a54736f7d51b8764d38d3adc38828055",
        "value": "0",
        "timestamp": 1533888218
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xf62744d883b24cf1ce7c81ec4a299c96f7b7019bf397106e4312499c97c9f779",
        "value": "375",
        "timestamp": 1533888413
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x51665b117ced8f2d1a6d72bf01f98cadd036b5b0d87845379f2a79fe147391d4",
        "value": "375",
        "timestamp": 1533888518
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x15fa0726fa4c8949205068653d863608d35de9c376806d2cc3f0a47870d920c6",
        "value": "375",
        "timestamp": 1533964268
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x97a37c57a151bf588992eaf657e9856dc20ec4aebf93872835867b6ddd94aa04",
        "value": "375",
        "timestamp": 1533964358
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x5e816d1e6f641b91c3a847434ed70b1178e669c9378f11256746b84e138e9407",
        "value": "375",
        "timestamp": 1534105613
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xfec6150b01f3a3d1c86d4403f1b734b052e145bc1504bbb6a11e678a2d4da591",
        "value": "375",
        "timestamp": 1534298948
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x8be8d45ffdf25d18e9fc1e2faa16620965e89eab72979cde256b3ab697544d49",
        "value": "375",
        "timestamp": 1534299143
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x9514b1ec9ac2642806299e52fee4aef3ead4a1448553dda6f331474cc2a18ae5",
        "value": "327.5",
        "timestamp": 1534305908
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xd0e854061545763ea2103142eaa4a8a9bf5a70cf00e5e23736d03a8ba004eeb6",
        "value": "327.5",
        "timestamp": 1534320908
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x90453fb3207701147c1a56085feab511bc0f41495862e9c164c858a93829700f",
        "value": "327.5",
        "timestamp": 1534321163
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x682abc1d0ae6772d8cc6daeec95852f1e1d9f349f797f28c5a010eafc88e4fdc",
        "value": "327.5",
        "timestamp": 1534348268
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xbe8ca627075631780d71681b0844005fa79cb027a1f64cabb4f9457f9e2b2ce9",
        "value": "327.5",
        "timestamp": 1534351673
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x9c53729611e32639c7c5f2324b463c5726912fce2239c71aea83dd6244b317bd",
        "value": "327.5",
        "timestamp": 1534353788
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x65964ef9d542782bf00c6ca9556f80c2f7b049c308dfef785654c586d574f368",
        "value": "327.5",
        "timestamp": 1534355513
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x12c02d0e70bc5a0bafa7a24bf9c84ebda7a6c19f0283220bd2abf25bd26b70a6",
        "value": "327.5",
        "timestamp": 1534415303
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x2d4b899cb980c7ac3c01a1d2605627a90f44bb42b0dd4f689a830e7f6e3abe12",
        "value": "327.5",
        "timestamp": 1534415453
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x61b9beb7e73ae6cdd2e7971250693dc17caf3c7fd3999e65d5fc242bdb646fb6",
        "value": "327.5",
        "timestamp": 1534415678
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x4c9047ea422c0755e4a11aaf2943fcc5fbf7d317d51483be20c27477846f1a83",
        "value": "327.5",
        "timestamp": 1534416248
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x13d6ffa2f7363a7692042acadf31e20899703d2ae49c80d3b23f7567c7a96be4",
        "value": "327.5",
        "timestamp": 1534416368
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x13d6ffa2f7363a7692042acadf31e20899703d2ae49c80d3b23f7567c7a96be4",
        "value": "327.5",
        "timestamp": 1534416368
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xf1b6384d0f9875b2eaa95b9480419cf52170d5289cd4de2b6c2a3576f09b8afa",
        "value": "327.5",
        "timestamp": 1534416458
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xa57f01cf65655c13ba3244e593398b8aacd292d4c9e1eb10444108c89a242d34",
        "value": "327.5",
        "timestamp": 1534416773
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x0a4b82b1abe2b8e427275c232c7949bcbfef0419ac1ded5dbd4e75d2851ae63a",
        "value": "327.5",
        "timestamp": 1534417328
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xdfe63f0bd846e0d61bd1e623e8419f98e4125c1a4a7298011aa895ebaaac90ff",
        "value": "327.5",
        "timestamp": 1534417613
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x86991a83d71c35e348ad4c97c358f02d38c35190072a79e4318ec23fe3f65e92",
        "value": "327.5",
        "timestamp": 1534417733
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x1c418f88059d5da4a2f6089f0b0f86fa8b1cdf7016776197cfd31c18721aa2d6",
        "value": "327.5",
        "timestamp": 1534417733
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xc3d868d9bcfe09b290f7c47fa7a3128d777b55934deb51a3f35ff9f4b2ba2518",
        "value": "327.5",
        "timestamp": 1534417748
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x49a32e46619d9c1435ed4ba8503e6b40edbd600f1167ca1f89d66db16cb108cd",
        "value": "327.5",
        "timestamp": 1534417748
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x9bb44f01361fa06967b0a243d50c1fffada5d4fec9a23642b78f85da19e4c781",
        "value": "327.5",
        "timestamp": 1534417928
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x5a3c6e70d19ca884aec36f58d2fb1ce9f33d9b768557eda8b8c507a4e0c87f16",
        "value": "327.5",
        "timestamp": 1534419383
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xc43e2d4df8aa6ac27015123aedf4fc4d535e8adf2ef823374f5334a3808744ec",
        "value": "327.5",
        "timestamp": 1534420373
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x7029d206bcb39a983e1a95945ea3bf5d0574fa531b52b5f76e6be44a36689899",
        "value": "327.5",
        "timestamp": 1534423508
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x77051b1dd4f387a36a6d5966884fe82e6bd40f05ede46011a3cf03d427b7e080",
        "value": "327.5",
        "timestamp": 1534434503
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x3a3790426788f5ca1ea2fc7b6dc576ffacc3a032f30e04455e1e0d55b645bf40",
        "value": "327.5",
        "timestamp": 1534434608
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x3a88d0f96afd7d30f91d5465d228d27ec111c6a932e376872438e2b056984342",
        "value": "327.5",
        "timestamp": 1534434683
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xc4c3db73bed5cb4ce6100a7da6b99bce43cdd5e8872c5eb9cad1b22ef450d10e",
        "value": "327.5",
        "timestamp": 1534434818
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x23973e19a905feed4c0720eba957b4e0c24eb28a7e283822cc039d07eacbea71",
        "value": "327.5",
        "timestamp": 1534435013
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0xff6436dafd99f47364ee1069723d119c09cef2d54552afdcb8e40e33d360f692",
        "value": "327.5",
        "timestamp": 1534486763
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x3b67b7baf526cf43645c2835c43ac01ed0eeaa3e5d6491602187ac6b4bcb7b0b",
        "value": "315",
        "timestamp": 1534531869
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 0,
        "transactionHash": "0x34d8e3823dd5c97f20c186f8483d3d62a614ec0fc0f98b1547d319ea4a645c8c",
        "value": "300",
        "timestamp": 1536267674
      },
      {
        "marketId": "0x0000000000000000000000000000000000000ff1",
        "outcome": 1,
        "transactionHash": "0x34d8e3823dd5c97f20c186f8483d3d62a614ec0fc0f98b1547d319ea4a645c8c",
        "value": "300",
        "timestamp": 1536267674
      },
    ]);
  });
};
