declare namespace PaginationStylesLessNamespace {
  export interface IPaginationStylesLess {
    Active: string;
    Pagination: string;
    PaginationContainer: string;
    active: string;
    pagination: string;
    paginationContainer: string;
  }
}

declare const PaginationStylesLessModule: PaginationStylesLessNamespace.IPaginationStylesLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PaginationStylesLessNamespace.IPaginationStylesLess;
};

export = PaginationStylesLessModule;
