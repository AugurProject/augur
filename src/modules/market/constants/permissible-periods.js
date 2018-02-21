// export const RANGE = {
//   MINUTE: {
//     value: 60000,
//     label: 'Past minute'
//   },
//   HOUR: {
//     value: 3600000,
//     label: 'Past hour'
//   },
//   DAY: {
//     value: 86400000,
//     label: 'Past day'
//   },
//   WEEK: {
//     value: 604800017,
//     label: 'Past week'
//   },
//   MONTH: {
//     value: 2629800000,
//     label: 'Past month'
//   },
//   YEAR: {
//     value: 31557600000,
//     label: 'Past year'
//   },
//   FULL: {
//     value: null,
//     label: 'Full range'
//   }
// }

export const RANGE_STEPS = [
  60000,
  3600000,
  86400000,
  604800017,
  2629800000,
  31557600000,
  null // denotes full range
]

export const PERIOD_STEPS = [
  null, // denotes every block
  60000,
  3600000,
  86400000,
  604800017,
  2629800000,
  31557600000
]
