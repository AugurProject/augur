# augur-tools

## blockstream-console

Blockstream console is a simple utility which spins up blockstream, configures it through either [ethers](https://github.com/ethers-io/ethers.js/) or [ethrpc](https://github.com/ethereumjs/ethrpc), and emits the received block and log notifications directly to the console
Event callbacks are emitted via stdout, debug logs via stderr.
### Usage:
```angular2
yarn blockstream-console 
Querying block: latest
[ethrpc] eth_subscribe request failed, fall back to polling for blocks: Method not found
Finished querying block: latest
Querying block: 0x6d44a0
Finished querying block: 0x6d44a0
Querying logs: {"blockHash":"0x476cb3978411be71f8b613c71921ae63163a4eae9a1e561163a330b35d149945","address":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}
Finished querying logs {"blockHash":"0x476cb3978411be71f8b613c71921ae63163a4eae9a1e561163a330b35d149945","address":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"} (0)
BLOCK Added 7160992 0x476cb3978411be71f8b613c71921ae63163a4eae9a1e561163a330b35d149945
Querying logs: {"blockHash":"0x98df0e5b5cfd14dbc55ecae6e14217357beb98dabaf5285229a52c35484e0157","address":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}
Finished querying logs {"blockHash":"0x98df0e5b5cfd14dbc55ecae6e14217357beb98dabaf5285229a52c35484e0157","address":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"} (0)
Querying logs: {"blockHash":"0x0b445bea8a03f73ac3266282a9df23945e0fb50603e1668c639165f0727aefc2","address":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}
Finished querying logs {"blockHash":"0x0b445bea8a03f73ac3266282a9df23945e0fb50603e1668c639165f0727aefc2","address":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"} (0)
Querying logs: {"blockHash":"0x9fd2165541af79ee3ed201aabbf3b8f552d84ac47c80803e527f38819913c42c","address":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}

```
or without debug info
```
yarn blockstream-console  2> /dev/null
[ethrpc] eth_subscribe request failed, fall back to polling for blocks: Method not found
BLOCK Added 7161001 0xb623dbadef00bdf42eb680498b3f8fd5be2ac01e5db3fee2127e5159b302625b
BLOCK Added 7161002 0xbaf1d0dfb5e87f1f3f15a79dbc3fa706ff305c3d13b6e6225272b786e1fda157
 ┗ Added LOGS (1) [14] to block 0xbaf1d0dfb5e87f1f3f15a79dbc3fa706ff305c3d13b6e6225272b786e1fda157

BLOCK Added 7161003 0x71b6995194f41aa2d62af227c5bb7113c3159a924755ba0fbb12890d27163630
BLOCK Added 7161004 0x539f771644f07b9ce89518bf07277be6fdc62b7c20fc054f6405ba83a37854b8
 ┗ Added LOGS (1) [46] to block 0x539f771644f07b9ce89518bf07277be6fdc62b7c20fc054f6405ba83a37854b8
```

or against ethers instead of ethrpc (default):
```
$ ADAPTER_TYPE=ethers yarn blockstream-console  2> /dev/null
BLOCK Added 7161001 0xb623dbadef00bdf42eb680498b3f8fd5be2ac01e5db3fee2127e5159b302625b
BLOCK Added 7161002 0xbaf1d0dfb5e87f1f3f15a79dbc3fa706ff305c3d13b6e6225272b786e1fda157
BLOCK Added 7161003 0x71b6995194f41aa2d62af227c5bb7113c3159a924755ba0fbb12890d27163630
BLOCK Added 7161004 0x539f771644f07b9ce89518bf07277be6fdc62b7c20fc054f6405ba83a37854b8
BLOCK Added 7161005 0x57d5e9e08bced4d5bff3dc3f83a428bb8480320d805544804d25739b71124306
BLOCK Added 7161006 0x0ae9453a8299d3a55048e94d89eefe5374236ebb9c24763e7b6fb1f817052a19
BLOCK Added 7161007 0xf07a998636b607d653798859b93d46a679968405650c6019a8baa00e60f80968
 ┗ Added LOGS (3) [88,128,131] to block 0xf07a998636b607d653798859b93d46a679968405650c6019a8baa00e60f80968

BLOCK Added 7161008 0x4a4cb87bad063b428ef0853bda7dee7dc9b00f21e82daa97ef40e30f6f414a6c

```
