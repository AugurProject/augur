import { assert } from 'chai';

describe('modules/trade/actions/update-trades-in-progress.js', () => {
	describe('should update a trade in progress for a binary market', () => {
		it('should pass shape tests for buying 10 shares of YES at the default limitPrice');
		it('should pass calculation tests for buying 10 shares of YES at the default limitPrice');
		it('should pass shape tests for Selling 10 shares of YES at the default limitPrice');
		it('should pass calculation tests for selling 10 shares of YES at the default limitPrice');
		it('should reset the tradeDetails object if 0 shares are passed in as a buy');
		it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.');
		it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.');
		it('should handle clearing out a trade in progress if limitPrice is set to 0 on a trade ready to be placed');
		it('should handle the tradeDetails object if limitPrice is unchanged but share number changes');
		it('should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)');
	});
	describe('should update a trade in progress for a categorical market', () => {
		it('should pass shape tests for buying 10 shares of YES at the default limitPrice');
		it('should pass calculation tests for buying 10 shares of YES at the default limitPrice');
		it('should pass shape tests for Selling 10 shares of YES at the default limitPrice');
		it('should pass calculation tests for selling 10 shares of YES at the default limitPrice');
		it('should reset the tradeDetails object if 0 shares are passed in as a buy');
		it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.');
		it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.');
		it('should handle clearing out a trade in progress if limitPrice is set to 0 on a trade ready to be placed');
		it('should handle the tradeDetails object if limitPrice is unchanged but share number changes');
		it('should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)');
	});
	describe('should update a trade in progress for a scalar market', () => {
		it('should pass shape tests for buying 10 shares of YES at the default limitPrice');
		it('should pass calculation tests for buying 10 shares of YES at the default limitPrice');
		it('should pass shape tests for Selling 10 shares of YES at the default limitPrice');
		it('should pass calculation tests for selling 10 shares of YES at the default limitPrice');
		it('should reset the tradeDetails object if 0 shares are passed in as a buy');
		it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.');
		it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.');
		it('should handle clearing out a trade in progress if limitPrice is set to 0 on a trade ready to be placed');
		it('should handle the tradeDetails object if limitPrice is unchanged but share number changes');
		it('should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)');
	});
});
