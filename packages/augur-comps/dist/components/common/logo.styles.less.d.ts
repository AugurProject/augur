declare namespace LogoStylesLessNamespace {
  export interface ILogoStylesLess {
    v2Logo: string;
  }
}

declare const LogoStylesLessModule: LogoStylesLessNamespace.ILogoStylesLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LogoStylesLessNamespace.ILogoStylesLess;
};

export = LogoStylesLessModule;
