import Knex from "knex";

const KNOWN_ORPHANED_ORDERS = [
"0xcb0d0001f04e8008a12f64be5f11d5c2dcc607899039a190cb7908416b9965c5",
"0xf0bb2d286bf2cb11d7f01f1a617db8c2417c2592886da58f3dcef01d0038fbaf",
"0x1d88dfa6be45e4a930da37923bd3a99d8945f95ed4fc626295e1be71963ee6d8",
"0x6d682504c1076693cedd04e744b666b97b5eabd0f23285a13a70fdd1c72fe7b5",
"0xe7a34537dd48f9ce22dc23dcbe3b10fa4d124872436c183220e16b9d45518023",
"0xcd64639e86e875e98eaeeb234e265ddb597f4c8d49ad623120d9d4aa7c666e63",
"0x5f9901cf32093f6952863487e42f3c78073c923cec5bd4b4354b30f07fb5ec91",
"0x2d1f3fe1ffaabc458a0e1dd4904f5711a86f847e0c0bb7faab75faba46bb2372",
"0xc555c971077b2e02861633d633a7b1bd3ca044a76298ce0c6db2bdde0ce2875c",
"0xd1ccb1ec6640ec934403b9d5edd1751290be9d93833ca2482b05acd60179ec56",
"0x1f7179fe98c8796396de2a72977529afe15b38321339611cacea8989e15343f8",
"0x28eb7540e821ae2371c3aa2a4c0bb8b509b9b765280756918e584e2824301a45",
"0xf6a57c8e3aba308749ba5930194fbb4fa6f70911422f91ca941a6f12265ef904",
"0x1a7d566e4f2ac0500c0791634d82c01a20dd81df374cac45627729da9769ddbe",
"0xfc49405a2e380f36300b60e1db14a509b05cb182c80fea2d0c8cb0d2d3ef377b",
"0xd8193d9721919b7b7fb449a93ed3ff47a81932a6e0e6d3092e1610916a35cb93",
"0x8e9e40328f07ca3f8a12d5c859ee058ef5e96109c62f0f6002c03806ec302955",
"0xd81e95446a4bc08e096d6e3fcc4c8569fcb0a7bc8e47444e5fe2d06c2bebbac3",
"0xefb502f97e2b87e1bcfbd1d034101f559210e323384d8b8a5f157d9f8a109679",
"0x49d7979d973d00c945add5dee4d697a6523ca85d23f950e72ce7602f5e19a6eb",
"0x5911c10f539d6389e99a66af8430e4d181ab30762883bc210d727759b25865e9",
"0xac03e7ec2bf3579cdbc31d5a28e9293fa7fa097f814c3bf58cdf68821abf14ff",
"0x8eb4c356442fff8420bffc0523642e6b6c4f96eb5f1bc09e1d08aa5ffd0ec539",
"0x1e1c6ec0c9aa380b6f7f28a8bed002333cdbea2d29b0d66fb1f484b8bbbf26e1",
"0x425d55eff02fc96abba7d88cfb2e9316f421a219b7714516f27ed921adb9fc6c",
"0x7a5e3f2145c473a4c25a9c9a147722acfede60d54f574b19143f6a2c9ce9f9e7",
"0xa65661a8138447996cd7e4f622ffe773b3f5faf95d869119dd61bfb8d682fce1",
"0xded44154f5c4de605a826374344d051f038439e2b279eee9dd3be4112f266d5f",
"0x488139ec52b3efc41591bbb9b16b242da4c4746074295d27470cb62cc29ea79d",
"0x15ff2ac5e066158ecfd9d646d852a69f3c11e486c90393216b4778af8811bad3",
"0x02615546bbba216233466d83ea0582df6621d02a4095b413c0c3e65f5b47891b",
"0x39ffc6869ef1c667002746f3a462237e57b283e2c6df454f7b97b41b1c5b4c65",
"0xee1cb132b89751fbdc8e3e4651c9708ffd5288c45b90da43b133334f2b5e464c",
"0x7c437d9ec166f9848ed0d915c377be4c556dd70b6fc4392bacaff8177dd6af72",
"0x4bcd8d8953c87001fd312a74560ca5a09d0a092f31172d94561312544e176a04",
"0xc6f51fa97267dda389dadd8ad42c6336869736cc45fb6324a5f507840f8c142f",
"0xa835ffe373b980d7dce0b5feffa1f21d40e8e5d859c624cca9d3b7dfd6b589d4",
"0x28fa5d2fbd85949c84c077c724a78d20752c50aaf21795479398df3f20ce2dea",
];

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.hasColumn("orders", "orphaned").then((exists) => {
    if (!exists) knex.schema.table("orders", (t) => t.boolean("orphaned").defaultTo(0)).then(() => {
      return knex.from("orders").whereIn("orderId", KNOWN_ORPHANED_ORDERS).update({orphaned: true});
    }).catch((e) => { throw e; });
    return;
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.table("orders", (table: Knex.CreateTableBuilder): void => {
    table.dropColumn("orphaned");
  });
};
