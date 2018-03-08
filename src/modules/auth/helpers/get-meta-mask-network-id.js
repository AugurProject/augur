export const getMetaMaskNetworkId = () => ((((window.web3 || {}).currentProvider || {}).publicConfigStore || {})._state || {}).networkVersion
