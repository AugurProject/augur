// geth --ws --wsapi eth,net,web3,admin,personal,miner,txpool --wsport 8546 --wsorigins '*' --cache 2048 --networkid 10101 --rpc --rpcapi eth,net,web3,admin,personal,miner,txpool --ipcapi admin,eth,debug,miner,net,txpool,personal,web3 --rpccorsdomain '*' --maxpeers 128 --etherbase 7fbe93bc104ac4bcae5d643fd3747e1866f1ece4 --unlock 7fbe93bc104ac4bcae5d643fd3747e1866f1ece4 --password ~/.ethereum/.password console

var options = {
  // http: "http://augur13.eastus.cloudapp.azure.com:8545",
  http: "http://127.0.0.1:8545",
  ws: null
};

options.contracts = {
  "Backstops": "0xf7a71c98e2fada3a853a77fd6fcf69ac6d20f0a6",
  "Branches": "0x2407d5ab8db2ad445f18c814ff027ece91943573",
  "BuyAndSellShares": "0x8ce2c368f3d89791e1c2715778ed3287022c752a",
  "Cash": "0xd4298e5e6a8811b0889dba23a33fc6226f706b82",
  "CloseMarket": "0xae973e8387bd684daee78f2cfe5d4c47e64053d8",
  "CloseMarketOne": "0x8a210d3b6696e684babaf1dbcb0495c69a0023eb",
  "CloseMarketTwo": "0x71b1afb93e5827b7989cf5dd060df37cbb3e537d",
  "CollectFees": "0x709ef6cff1a9034c17c1c7ac3acceeed704231d6",
  "CompleteSets": "0xad425789756d53bba879cc893bb1a6e28ff18c3d",
  "CompositeGetters": "0x45c90371282e9e46c58abc54ad1a93d210db23fb",
  "Consensus": "0xe5876c658820433902efe27c03d7220a1862178b",
  "ConsensusData": "0x1444fa8f5021c5fb8507fdee3c95833d1b866f81",
  "CreateBranch": "0xffdbe37908443952502fc502eed0cc4d55ab305d",
  "CreateMarket": "0x720b3208cae428fcda7466a4feb09caf1b5a606f",
  "EventResolution": "0x774ce847bdeeda2b43cc24f213fa43076f55e9dc",
  "Events": "0xb3eea8e25817eeb8c8cd6881e2180bef52547f5f",
  "ExpiringEvents": "0x66c0c91f5aa44ccd12b26dafc0b154faba2dfcb8",
  "Faucets": "0x892ef62b0704bf33dd5529bb23ec5c2568d1b256",
  "ForkPenalize": "0x637895b4fa64c5110f1a7906d830221fec27c1a1",
  "Forking": "0x4f7c34cadd54774aff0a59e4511112d6fb6af7b5",
  "FxpFunctions": "0xd915c293cf762b665bf5835712de244029ea3109",
  "Info": "0x547c5867e4435073c14d80b70cf01e436944b195",
  "MakeReports": "0xc7cc377e27bc7b5432635025fece42f4364cef87",
  "Markets": "0xe4571b25984c91d084427023e7b5bdb0d134eb49",
  "PenalizationCatchup": "0x3a88b9a686cc80effb6ec9b652558af4deff6c6c",
  "PenalizeNotEnoughReports": "0x929779562a1a03d98206ea94d29372a6efb8c28e",
  "ProportionCorrect": "0x5e4b2597982ef4f9418d0888598e46d933c0aea8",
  "Reporting": "0x60686ab40f7b119d46d48c84592e48d5ec0e1ae5",
  "ReportingThreshold": "0x2d08f65f6706698c0289b78e5a97ca5bdaefdc33",
  "RoundTwo": "0xa84c27d57ea7835f31aee20e3f8440f1915fabad",
  "RoundTwoPenalize": "0xf91f47ebb23fb936a14841ea8a0d50f6c5e40986",
  "SendReputation": "0x7a946a1d3f74221b5b6dece39c507e1cdcad29be",
  "SlashRep": "0xce7a01558a31e52acc00b2e93f986c4a8a300083",
  "Trade": "0x9cc5aa984843776f6932b0fbcca7a6ae6ca67a9e",
  "Trades": "0xb1f194a8f5c2d744a0c8e2b50c28fab281b6dd66"
};

var augur = require("./src");

augur.connect(options);

augur.createSingleEventMarket({
  branchId: augur.constants.DEFAULT_BRANCH_ID,
  description: "Will the temperature in SF be > 90F on July 1, 2031?",
  expDate: new Date("7/2/2031").getTime() / 1000,
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  makerFee: ".02",
  takerFee: ".05",
  tags: ["weather", "temperature", "climate change"],
  extraInfo: "Hello world!  Are you getting hotter?",
  resolution: "",
  onSent: function (sentResponse) {console.log("MarketSentResponse:", sentResponse);},
  onSuccess: function (successResponse) { console.log("MarketSuccessResponse:", successResponse); },
  onFailed: function (failedResponse) { console.log("MarketFailedResponse:", failedResponse);}
});
