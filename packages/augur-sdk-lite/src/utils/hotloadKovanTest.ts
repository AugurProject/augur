import { NetworkId } from '@augurproject/utils';
import { ethers } from 'ethers';
import { AugurLite } from '../AugurLite';
import { NULL_ADDRESS } from '../constants';

async function doWork(): Promise<void> {
    const provider = new ethers.providers.JsonRpcProvider("https://kovan.augur.net/ethereum-http");
    const addresses = {
        "Universe": NULL_ADDRESS,
        "WarpSync": NULL_ADDRESS,
        "HotLoading": "0x208993149C873a2fCCD1c822E1300Fbb7189ede8",
        "Augur": "0x4045A51631181A63d4136b56e2C85552A2c87783",
        "FillOrder": "0x431A0376274dCb5612bBD96491946d55cA0215f1",
        "Orders": "0x245f942add87Ba2f2b524b8D27eA1c891E514960",
    }
    const augurLite = new AugurLite(provider, addresses, NetworkId.Kovan);
    const hotloadData = await augurLite.hotloadMarket("0x04CE01200a0A47f1198A0134330369ADEf44a92d");
    console.log(`HOT LOAD DATA: ${JSON.stringify(hotloadData)}`);
}

doWork().then(() => {
    process.exit();
}).catch(error => {
    console.log(error);
    process.exit();
});
