import IPFS from 'ipfs';
import Orbit from 'orbit_';

declare var self: Worker;

const ORBIT_EVENTS = ['connected', 'disconnected', 'joined', 'left', 'peers'];
const CHANNEL_FEED_EVENTS = [
  'write',
  'load.progress',
  'replicate.progress',
  'ready',
  'replicated',
];

const ctx = self;
let ipfs: IPFS = null;
let orbit: Orbit = null;
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

          const orbitOptions = {
            directory: `augur-orbit-chat-orbitdb-${ethereumNetwork}`,
            id: senderAccount,
          };

          ipfs = await IPFS.create(ipfsOptions);
          orbit = await Orbit.create(ipfs, orbitOptions);

          orbit.events.emit('connected', (orbit as any).user);

          trackNumberOfPeers();

          ctx.postMessage({ method: 'IPFS:started' });

          break;
        }
        case 'IPFS:sendMessage': {
          const [data, channel] = messageData.params;

          if (!data || !channel) break;

          if (currentChannelName !== channel || currentChannel == null) {
            if (currentChannelName) {
              await orbit.leave(currentChannelName);
            }

            currentChannelName = `${channel}-network-${ethereumNetwork}`;

            currentChannel = await orbit.join(currentChannelName);
          }

          // remove http:// or https://, so message can show fully on orbit chat
          const message = JSON.stringify({ data }).replace(
            /http(s)?:\/\//gi,
            ''
          );

          const sendFunc = currentChannel.sendMessage.bind(
            currentChannel,
            message
          );

          await sendFunc();

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

function subscribeOrbitEvents() {
  ORBIT_EVENTS.forEach(eventName => {
    try {
      orbit.events.on(eventName, orbitEvent.bind(this, eventName));
    } catch (error) {
      console.error('[IPFS.worker] subscribeOrbitEvents', error);
    }
  });
}

function orbitEvent(eventName, ...args) {
  if (typeof eventName !== 'string') return;

  if (['joined', 'left'].indexOf(eventName) !== -1) {
    args = [args[0]];
  } else {
    args = [];
  }

  console.log({ action: 'orbit-event', name: eventName, args });
}

function subscribeOrbitChannelEvents(
  currentChannel,
  currentChannelName: string
) {
  CHANNEL_FEED_EVENTS.forEach(eventName => {
    try {
      currentChannel.feed.events.on(
        eventName,
        channelEvent.bind(this, eventName, currentChannelName)
      );
    } catch (error) {
      console.error('[IPFS.worker] subscribeOrbitChannelEvents', error);
    }
  });
}

async function channelEvent(eventName, channelName, ...args) {
  if (typeof eventName !== 'string') return;
  if (typeof channelName !== 'string') return;

  const channel = orbit.channels[channelName];

  const meta = {
    channelName,
    replicationStatus: channel.replicationStatus,
    peers: null,
  };

  if (eventName === 'peer.update') {
    meta.peers = await channel.peers;
  }

  console.log({
    action: 'channel-event',
    name: eventName,
    meta,
    args,
  });
}

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
