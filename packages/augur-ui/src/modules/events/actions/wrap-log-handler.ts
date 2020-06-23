export const wrapLogHandler = (logHandler: Function) => (
  log: any
) => {
  if (log) {
    if (Array.isArray(log)) {
      console.log('events', log.map(l => l.name));
    } else {
      console.log('event', log.eventName);
    }
    const isInCurrentUniverse = true;
    // TODO: need to filter based on current selected universe
    if (isInCurrentUniverse) return logHandler(log);
  }
};
