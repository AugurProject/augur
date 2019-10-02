import React, { Component } from 'react';

import Styles from 'modules/modal/components/common/common.styles.less';

interface ModalMigrateMarketProps {
  marketId: string,
  marketDescription: string,
  migrateMarketThroughFork: Function,
  closeModal: Function,
  type:string,
};

export default class ModalMigrateMarket extends Component<ModalMigrateMarketProps> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // componentWillMount() {
  //   const { marketId, migrateMarketThroughFork } = this.props;
  //   migrateMarketThroughFork(marketId, true, (err, gasEstimate) => {
  //     if (!err && !!gasEstimate) this.setState({ gasEstimate });
  //   });
  // }

  // submitForm() {
  //   const { marketId, migrateMarketThroughFork } = this.props;
  //   migrateMarketThroughFork(marketId, false, (err, res) => {
  //     console.log('onSuccess for migrateMarketThroughFork', err, res);
  //   });
  // }

  render() {
// console.log(this.props)
// console.log(this.state)
    // const { closeModal, marketDescription, type } = this.props;
    // const { gasEstimate } = this.state;
    // const reviewDetails = {
    //   title: 'Migrate Market',
    //   // type,
    //   items: [
    //     {
    //       label: 'Market',
    //       value: 'description',//marketDescription,
    //       denomination: ''
    //     },
    //     {
    //       label: 'gas',
    //       value: '0.1', //formatEther(gasEstimate).fullPrecision,
    //       denomination: 'ETH'
    //     }
    //   ],
    //   buttons: [
    //     // {
    //     //   label: 'back',
    //     //   action: closeModal,
    //     //   type: 'gray'
    //     // },
    //     // {
    //     //   label: 'submit',
    //     //   action: this.submitForm,
    //     //   type: 'purple'
    //     // }
    //   ]
    // };
    return (
      <section className={Styles.ModalContainer}>
      </section>
    );
  }
}
