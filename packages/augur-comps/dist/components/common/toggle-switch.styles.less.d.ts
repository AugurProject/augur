declare namespace ToggleSwitchStylesLessNamespace {
  export interface IToggleSwitchStylesLess {
    On: string;
    ToggleSwitch: string;
    on: string;
    toggleSwitch: string;
  }
}

declare const ToggleSwitchStylesLessModule: ToggleSwitchStylesLessNamespace.IToggleSwitchStylesLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ToggleSwitchStylesLessNamespace.IToggleSwitchStylesLess;
};

export = ToggleSwitchStylesLessModule;
