import { connect } from "react-redux";

import AccountDeposit from "modules/account/components/account-deposit/account-deposit";
import { augur } from "services/augurjs";
import { assetDataUtils } from "@0xproject/order-utils";
import { BigNumber } from "@0xproject/utils";

const mapStateToProps = state => ({
  address: state.loginAccount.displayAddress
});

// This is an outstanding order
const mapDispatchToProps = () => ({
  openZeroExInstant: () => {
    augur.api.Universe.getReputationToken((err, repTokenAddress) => {
      if (err) return;

      const assetData = assetDataUtils.encodeERC20AssetData(repTokenAddress);
      const networkSettings = [
        {
          orderSource: [
            {
              senderAddress: "0x0000000000000000000000000000000000000000",
              makerAddress: "0x14e2f1f157e7dd4057d02817436d628a37120fd1",
              takerAddress: "0x0000000000000000000000000000000000000000",
              makerFee: new BigNumber("0"),
              takerFee: new BigNumber("0"),
              makerAssetAmount: new BigNumber("94000000000000000000"),
              takerAssetAmount: new BigNumber("1000000000000000000"),
              makerAssetData:
                "0xf47261b00000000000000000000000004c7493b70f16bec1e087bf74a31d095f9b8f9c40",
              takerAssetData:
                "0xf47261b0000000000000000000000000d0a1e359811322d97991e03f863a0c30c2cf029c",
              expirationTimeSeconds: new BigNumber("1549008000"),
              feeRecipientAddress: "0x0000000000000000000000000000000000000000",
              salt: new BigNumber(
                "15865382935540085750341462125291637590635483813634352296303261539769641236771"
              ),
              signature:
                "0x1b5fb567ee206a35bc2973885216338e019a672302fdae2faa8ee6d208da9c478671901e963befb93cd87e55f09d19b9caf8a84eaaf2c3d431b8ce59447934f35503",
              exchangeAddress: "0x35dd2932454449b14cee11a94d3674a936d5d7b2"
            }
          ],
          additionalAssetMetaDataMap: {
            "0xf47261b00000000000000000000000004c7493b70f16bec1e087bf74a31d095f9b8f9c40": {
              assetProxyId: "0xf47261b0",
              decimals: 18,
              primaryColor: "#512D80",
              symbol: "rep",
              name: "Augur"
            }
          },
          networkId: 42
        },
        {
          availableAssetDatas: [],
          defaultSelectedAssetData: assetData,
          orderSource: "https://api.radarrelay.com/0x/v2",
          networkId: 1
        }
      ];

      const currentNetworkId = parseInt(augur.rpc.getNetworkID(), 10);
      const currentNetworkParams = networkSettings.find(
        net => net.networkId === currentNetworkId
      );

      // eslint-disable-next-line
      zeroExInstant.render(currentNetworkParams, "#app");
    });
  }
});

const AccountDepositContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountDeposit);

export default AccountDepositContainer;
