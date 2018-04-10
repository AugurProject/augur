import { augur } from 'services/augurjs'

export default function isAugurJSVersionsEqual() {
  return new Promise((resolve) => {
    augur.augurNode.getContractAddresses((err, res) => {
      if (err || (res.version !== augur.version)) {
        resolve({
          isEqual: false,
          augurNode: res && res.version,
          augurjs: augur && augur.version,
        })
      }
      resolve({
        isEqual: true,
        augurNode: res && res.version,
        augurjs: augur && augur.version,
      })
    })
  })
}
