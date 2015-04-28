var React = require('react');

var NO = 1;
var YES = 2;

var priceToPercentage = function (price) {
  return Math.floor(price * 100).toString()
};

var Overview = React.createClass({
  getOutcomeName: function () {
    if (this.props.outcomeCount != 2) {
      return this.props.id;
    }

    if (this.props.id === NO) {
      return 'No';
    } else {
      return 'Yes';
    }
  },

  render: function () {
    return (
      <div className="outcome outcome-{ this.props.id } col-md-6">
        <h3>{ this.getOutcomeName() }</h3>
        <div className="price">{ priceToPercentage(this.props.price) }%</div>
        <p className="shares-held">Shares held: 0</p>
        <button className="btn btn-success" type="button">Buy</button>
        <button className="btn btn-warning" type="button">Sell</button>
      </div>
    );
  }
});

var Buy = React.createClass({
  render: function () {
    return (
      <div>
        <h3>Purchase Shares</h3>
      </div>
    );
  }
});

var Sell = React.createClass({
  render: function () {
    return '';
  }
});

module.exports = {
  Buy: Buy,
  Sell: Sell,
  Overview: Overview
};
