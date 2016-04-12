import SiteHeader from '../../app/components/site-header';

module.exports = function(p) {
    return (
		<main className="page market-expired">
			<SiteHeader { ...p.siteHeader } />

			<section className="page-content">
				expired market
			</section>
		</main>
    );
};


