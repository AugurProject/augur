import asyncComponent from "modules/common/components/async-component";

// NOTE -- Webpack code splits at each of these imports to reduce the initial load time.

export const Markets = asyncComponent({
  moduleName: "Markets",
  loader: () =>
    import(/* webpackChunkName: 'markets' */ "modules/markets-list/containers/markets-view-container").then(
      module => module.default
    )
});

export const Account = asyncComponent({
  moduleName: "Account",
  loader: () =>
    import(/* webpackChunkName: 'account' */ "modules/account/components/account-view/account-view").then(
      module => module.default
    )
});

export const Market = asyncComponent({
  moduleName: "Market",
  loader: () =>
    import(/* webpackChunkName: 'market' */ "modules/market/containers/market-view").then(
      module => module.default
    )
});

export const Portfolio = asyncComponent({
  moduleName: "Portfolio",
  loader: () =>
    import(/* webpackChunkName: 'portfolio' */ "modules/portfolio/components/portfolio-view/portfolio-view").then(
      module => module.default
    )
});

export const CreateMarket = asyncComponent({
  moduleName: "CreateMarket",
  loader: () =>
    import(/* webpackChunkName: 'create-market' */ "modules/create-market/containers/create-market").then(
      module => module.default
    )
});

export const Reporting = asyncComponent({
  moduleName: "Reporting",
  loader: () =>
    import(/* webpackChunkName: 'reporting' */ "modules/reporting/components/reporting-view/reporting-view").then(
      module => module.default
    )
});

export const Report = asyncComponent({
  moduleName: "Report",
  loader: () =>
    import(/* webpackChunkName: 'report' */ "modules/reporting/containers/reporting-report").then(
      module => module.default
    )
});

export const Dispute = asyncComponent({
  moduleName: "Dispute",
  loader: () =>
    import(/* webpackChunkName: 'report' */ "modules/reporting/containers/reporting-dispute").then(
      module => module.default
    )
});

export const MigrateRep = asyncComponent({
  moduleName: "MigrateRep",
  loader: () =>
    import(/* webpackChunkName: 'report' */ "modules/forking/containers/migrate-rep").then(
      module => module.default
    )
});
