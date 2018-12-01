export const DEFAULT_DERIVATION_PATH = "m/44'/60'/0'/0/0";
export const NUM_DERIVATION_PATHS_TO_DISPLAY = 5;
export const DERIVATION_PATHS = ["m/44'/60'/0'/0/0", "m/44'/60'/0'/0"];
export default class DerivationPath {
  static validate(derivationPath) {
    return /^m\/(44)'\/(60)'\/(\d+)'(?:\/|\/(\d+))?(?:\/|\/(\d+))?$/.test(
      derivationPath
    );
  }

  static parse(derivationPath) {
    const result = /^m\/(44)'\/(60)'\/(\d+)'(?:\/|\/(\d+))?(?:\/|\/(\d+))?$/.exec(
      derivationPath
    );
    if (result) {
      return {
        purpose: parseInt(result[1], 10),
        coinType: parseInt(result[2], 10),
        account: parseInt(result[3], 10),
        change: result[4] ? parseInt(result[4], 10) : null,
        index: result[5] ? parseInt(result[5], 10) : null
      };
    }
    return null;
  }

  static buildString(components) {
    const { purpose, coinType, account, change, index } = components;
    let path = `m/${purpose}'/${coinType}'/${account}'`;
    if (change !== null) {
      path += `/${change}`;
    }
    if (index !== null) {
      path += `/${index}`;
    }
    return path;
  }

  static increment(components, n = 1) {
    const newComponents = { ...components };
    // add n to the last provided component
    if (newComponents.index !== null) {
      newComponents.index += n;
      return newComponents;
    }
    if (newComponents.change !== null) {
      newComponents.change += n;
      return newComponents;
    }
    newComponents.account += n;
    return newComponents;
  }
}
