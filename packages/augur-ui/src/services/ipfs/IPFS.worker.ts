import IPFS from 'ipfs';

declare var self: Worker;

const CHANNEL_FEED_EVENTS = [
  'write',
  'load.progress',
  'replicate.progress',
  'ready',
  'replicated',
];

const ctx = self;
let ipfs: IPFS = null;
let currentChannelName = '';
let currentChannel = null;
let ethereumNetwork = '';

ctx.addEventListener(
  'message',
  async (message: { data: { method: string; params: any[] } }) => {
    const messageData = message.data;

    try {
      console.log('IPFS.worker', messageData);

      switch (messageData.method) {
        case 'IPFS:start': {
          ethereumNetwork = messageData.params[0] || 'dev';
          const senderAccount = messageData.params[1] || 'augur-ipfs';

          const ipfsOptions = {
            repo: `augur-orbit-chat-ipfs-${ethereumNetwork}`,
            EXPERIMENTAL: {
              pubsub: true,
            },
            preload: { enabled: false },
            config: {
              Addresses: {
                Swarm: [
                  '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
                ],
              },
            },
          };
          ipfs = await IPFS.create(ipfsOptions);

          trackNumberOfPeers();
          ctx.postMessage({ method: 'IPFS:started' });
          break;
        }
        case 'IPFS:sendMessage': {
          const [data, channel] = messageData.params;
          if (!data || !channel) break;

          if (currentChannelName !== channel) {
            currentChannelName = 'augur-analytics-network-kovan';
          }

          // remove http:// or https://, so message can show fully on orbit chat
          const message = JSON.stringify({ data }).replace(
            /http(s)?:\/\//gi,
            ''
          );

          await ipfs.pubsub.publish(
            currentChannelName,
            message
          );

          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error('IPFS.worker', error);
    }
  }
);

function trackNumberOfPeers() {
  setInterval(async () => {
    try {
      const peers = await ipfs.swarm.peers();

      console.log(`The node now has ${peers.length} peers.`);
    } catch (err) {
      console.log('An error occurred trying to check our peers:', err);
    }
  }, 30000);
}
