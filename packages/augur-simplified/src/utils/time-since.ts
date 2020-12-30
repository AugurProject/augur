const DURATION_IN_SECONDS = {
  epochs: ['year', 'month', 'day', 'hour', 'minute', 'second'],
  year: 31536000,
  month: 2592000,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

const getDuration = (seconds: number) => {
  let epoch = null;
  let interval = null;

  for (let i = 0; i < DURATION_IN_SECONDS.epochs.length; i++) {
    epoch = DURATION_IN_SECONDS.epochs[i];
    interval = Math.floor(seconds / DURATION_IN_SECONDS[epoch]);
    if (interval >= 1) {
      return {
        interval,
        epoch,
      };
    }
  }

  return {
    interval,
    epoch
  };
};

export const timeSinceTimestamp = (timestamp: number) => timeSince(timestamp * 1000);

export const timeSince = (timestamp: number) => {
  const now = new Date().getTime();
  const ts = new Date(timestamp).getTime();
  const seconds = Math.floor((now - ts) / 1000);
  const { interval, epoch } = getDuration(seconds);
  const suffix = interval >= 0 ? 's' : '';
  return `${interval} ${epoch}${suffix} ago`;
};

export default timeSince;
