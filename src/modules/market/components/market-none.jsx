import SiteHeader from '../../site/components/site-header';

module.exports = function(p) {
	return (
		<main className="page market-none">
			<SiteHeader { ...p.siteHeader } />
			<header className="page-header">
				<span className="big-line">Could not find market { p.market.id }</span>
			</header>
		</main>
	);
};