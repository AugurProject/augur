declare namespace TablesStylesLessNamespace {
  export interface ITablesStylesLess {
    FooterSharedStyles: string;
    HeaderSharedStyles: string;
    LiquidityFooter: string;
    LiquidityHeader: string;
    LiquidityRow: string;
    LiquidityRowHeader: string;
    LiquidityTable: string;
    MarginTop: string;
    MarketTableHeader: string;
    PaginationFooter: string;
    PositionFooter: string;
    PositionHeader: string;
    PositionRow: string;
    PositionRowHeader: string;
    PositionTable: string;
    PositionsLiquidityViewSwitcher: string;
    RowHeaderSharedStyles: string;
    RowSharedStyles: string;
    Selected: string;
    SharedTable: string;
    SortUp: string;
    TransactionRow: string;
    TransactionsHeader: string;
    TransactionsSharedRowHeader: string;
    TransactionsTable: string;
    footerSharedStyles: string;
    headerSharedStyles: string;
    liquidityFooter: string;
    liquidityHeader: string;
    liquidityRow: string;
    liquidityRowHeader: string;
    liquidityTable: string;
    marginTop: string;
    marketTableHeader: string;
    paginationFooter: string;
    positionFooter: string;
    positionHeader: string;
    positionRow: string;
    positionRowHeader: string;
    positionTable: string;
    positionsLiquidityViewSwitcher: string;
    rowHeaderSharedStyles: string;
    rowSharedStyles: string;
    selected: string;
    sharedTable: string;
    sortUp: string;
    transactionRow: string;
    transactionsHeader: string;
    transactionsSharedRowHeader: string;
    transactionsTable: string;
  }
}

declare const TablesStylesLessModule: TablesStylesLessNamespace.ITablesStylesLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TablesStylesLessNamespace.ITablesStylesLess;
};

export = TablesStylesLessModule;
