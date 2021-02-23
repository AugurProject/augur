declare namespace SpinnerStylesLessNamespace {
  export interface ISpinnerStylesLess {
    Spinner: string;
    rotate: string;
    spinner: string;
  }
}

declare const SpinnerStylesLessModule: SpinnerStylesLessNamespace.ISpinnerStylesLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SpinnerStylesLessNamespace.ISpinnerStylesLess;
};

export = SpinnerStylesLessModule;
