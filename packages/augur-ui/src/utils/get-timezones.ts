import moment from 'moment-timezone';

let timezones = [];

interface TimezoneOption {
  label: string;
  value: number;
}

export const getTimezones = (timestamp?: number): TimezoneOption[] => {
  if (timezones.length === 0) {
    timezones = loadTimezones(timestamp);
  }
  return timezones;
};

const loadTimezones = (timestamp?: number): TimezoneOption[] => {
  const zones = moment.tz._zones;
  console.log('zones', zones.length);
  if (!zones) return [];
  const timeZones = Object.keys(zones)
    .map(k => ({
      name: zones[k].split('|')[0],
      offset: zones[k].split('|')[1],
    }))
    .filter(z => z.name.indexOf('/') >= 0 && !z.name.startsWith('Etc/'))

  return timeZones.reduce((p, zone) => {
    const tz = moment(timestamp).tz.zone(zone.name);
    const index = tz.abbrs.findIndex((a: string) => a === 'LMT');
    if (index === -1) return p;

    const value: number = parseInt(tz.offsets[index], 10);

    return [
      ...p,
      {
        label: `(GMT${moment.tz(zone.name).format('Z')}) ${zone.name}`,
        value,
      },
    ];
  }, [])
  .sort((a, b) => a.value - b.value);
};
