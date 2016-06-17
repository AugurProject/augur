import { React, PropTypes } from 'react';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import CreateMarketForm from '../../create-market/components/create-market-form';

const CreateMarketPage = (props) => {
	const p = this.props;
	return (
		<main className="page create-market">
			<SiteHeader {...p.siteHeader} />

			<header className="page-header">
				<div className="l-container">
					<span className="big-line">Be the market maker</span>.
					Earn fees by making markets for people to trade.
					The more people <b><i>trade</i></b> your markets, the more fees you will <b><i>make</i></b>.
				</div>
			</header>

			<div className="page-content">
				<div className="l-container">
					<CreateMarketForm
						className="create-market-content"
						{...p.createMarketForm}
					/>
				</div>
			</div>

			<SiteFooter />
		</main>
	);
};

CreateMarketPage.propTypes = {
	className: PropTypes.string,
	siteHeader: PropTypes.object,
	createMarketForm: PropTypes.object
};

export default CreateMarketPage;
