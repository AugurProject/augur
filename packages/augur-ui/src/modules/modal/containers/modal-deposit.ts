import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Message } from 'modules/modal/message';
import { assetDataUtils } from '@0xproject/order-utils';
import { BigNumber } from '@0xproject/utils';
import { NETWORK_IDS } from 'modules/common/constants';
import { closeModal } from 'modules/modal/actions/close-modal';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  address: state.loginAccount.mixedCaseAddress,
  networkId: getNetworkId(),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  openZeroExInstant: async () => {
    const { contracts } = augurSdk.get();
    const repTokenAddress = contracts.getReputationToken();

    const assetData = assetDataUtils.encodeERC20AssetData(repTokenAddress.address);
    const networkSettings = [
      {
        orderSource: [
          {
            senderAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x14e2f1f157e7dd4057d02817436d628a37120fd1',
            takerAddress: '0x0000000000000000000000000000000000000000',
            makerFee: new BigNumber('0'),
            takerFee: new BigNumber('0'),
            makerAssetAmount: new BigNumber('94000000000000000000'),
            takerAssetAmount: new BigNumber('1000000000000000000'),
            makerAssetData:
              '0xf47261b00000000000000000000000004c7493b70f16bec1e087bf74a31d095f9b8f9c40',
            takerAssetData:
              '0xf47261b0000000000000000000000000d0a1e359811322d97991e03f863a0c30c2cf029c',
            expirationTimeSeconds: new BigNumber('1549008000'),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            salt: new BigNumber(
              '15865382935540085750341462125291637590635483813634352296303261539769641236771'
            ),
            signature:
              '0x1b5fb567ee206a35bc2973885216338e019a672302fdae2faa8ee6d208da9c478671901e963befb93cd87e55f09d19b9caf8a84eaaf2c3d431b8ce59447934f35503',
            exchangeAddress: '0x35dd2932454449b14cee11a94d3674a936d5d7b2',
          },
        ],
        additionalAssetMetaDataMap: {
          '0xf47261b00000000000000000000000004c7493b70f16bec1e087bf74a31d095f9b8f9c40': {
            assetProxyId: '0xf47261b0',
            decimals: 18,
            primaryColor: '#512D80',
            symbol: 'rep',
            name: 'Augur',
          },
        },
        networkId: 42,
      },
      {
        availableAssetDatas: [],
        defaultSelectedAssetData: assetData,
        orderSource: 'https://api.radarrelay.com/0x/v2',
        networkId: 1,
      },
    ];

    const currentNetworkId = getNetworkId();
    const currentNetworkParams = networkSettings.find(
      net => net.networkId === currentNetworkId
    );

    // eslint-disable-next-line
    // @ts-ignore
    zeroExInstant.render(currentNetworkParams, '#app');
  },
});

function airSwapOnClick(e) {
  const env = getNetworkId() === 1 ? 'production' : 'sandbox';
  e.preventDefault();
  // The widget will offer swaps for REP <-> ETH on mainnet
  // It can still be tested on rinkeby, but only AST <-> ETH is offered
  (window as any).AirSwap.Trader.render(
    {
      env,
      mode: 'buy',
      token:
        env === 'production'
          ? '0x1985365e9f78359a9b6ad760e32412f4a445e862'
          : '0xcc1cbd4f67cceb7c001bd4adf98451237a193ff8',
      onCancel() {
        console.info('AirSwap trade cancelled');
      },
      onComplete(txid: string) {
        console.info('AirSwap trade complete', txid);
      },
    },
    document.getElementById('app')
  );
}

const mergeProps = (sP: any, dP: any, oP: any) => {
  const show0xInstant = [NETWORK_IDS.Mainnet, NETWORK_IDS.Kovan].includes(
    sP.networkId
  );
  const showAirSwap = NETWORK_IDS.Mainnet === sP.networkId;
  return {
    title: 'Receive Funds',
    description: [
      'Send Ethereum (ETH) or Reputation (REP) to the wallet you have connected to trade on Augur.',
    ],
    closeAction: () => dP.closeModal(),
    depositInfo:
      show0xInstant || showAirSwap
        ? {
            openZeroExInstant: () => dP.openZeroExInstant(),
            airSwapOnClick: (e: any) => airSwapOnClick(e),
            show0xInstant,
            showAirSwap,
          }
        : undefined,
    readableAddress: {
      address: sP.address,
      showQR: true,
      copyable: true,
      title: 'Your connected wallet address',
    },
    buttons: [],
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Message)
);
