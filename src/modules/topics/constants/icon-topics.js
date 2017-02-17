// NOTE --  Each topic must be uniquely mapped to an icon
//          Each icon can have multiple topics via an array of strings
//          All values should be lowercase

const iconTopics = {
  'fa-copy': 'reporting',
  'fa-snowflake-o': 'snow',
  'fa-cloud': 'weather',
  'fa-sun-o': 'climate',
  'fa-thermometer': ['temperature', 'heat'],
  'fa-rocket': ['space', 'space program', 'rocket'],
  'fa-line-chart': 'dow jones',
  'fa-bug': 'antibiotics',
  'fa-ambulance': 'mortality',
  'fa-home': ['housing', 'home', 'realty'],
  'fa-industry': 'climate change',
  'fa-newspaper-o': ['news', 'events'],
  'fa-users': 'elections',
  'fa-ship': ['international trade', 'shipping']
};

export default iconTopics;
