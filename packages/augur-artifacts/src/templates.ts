export const REQUIRED = 'REQUIRED';
// Market templates
export const SPORTS = 'Sports';
export const POLITICS = 'Politics';
export const FINANCE = 'Finance';
export const ENTERTAINMENT = 'Entertainment';
export const CRYPTO = 'Crypto';
export const USD = 'USD';
export const USDT = 'USDT';
export const EUR = 'EUR';

// Market Subtemplates
export const SOCCER = 'Soccer';
export const AMERICAN_FOOTBALL = 'American Football';
export const BASEBALL = 'Baseball';
export const GOLF = 'Golf';
export const BASKETBALL = 'Basketball';
export const TENNIS = 'Tennis';
export const HOCKEY = 'Hockey';
export const HORSE_RACING = 'Horse Racing';
export const US_POLITICS = 'US Politics';
export const WORLD = 'World';
export const STOCKS = 'Stocks';
export const INDEXES = 'Indexes';
export const BITCOIN = 'Bitcoin';
export const ETHEREUM = 'Ethereum';
export const LITECOIN = 'Litecoin';
export const BTC = 'BTC';
export const ETH = 'ETH';
export const LTC = 'LTC';
export const NBA = 'NBA';
export const NCAA = 'NCAA';
export const NFL = 'NFL';

interface TimezoneDateObject {
  formattedUtc: string;
  formattedTimezone: string;
  timestamp: number;
}

export interface UserInputText {
  value: string;
}

export interface UserInputDateYear extends UserInputText {}
export interface UserInputDateTime {
  endTime: number;
  hour?: number;
  minute?: number;
  meridiem: string;
  timezone: string;
  offset: number;
  offsetName: string;
  endTimeFormatted: TimezoneDateObject;
}
export interface UserInputDropdown extends UserInputText {}
export interface UserInputUserOutcome extends UserInputText {}


export type UserInputtedType =
  | UserInputText
  | UserInputDateYear
  | UserInputDateTime
  | UserInputDropdown
  | UserInputUserOutcome;

export interface ValueLabelPair {
  label: string;
  value: string;
}

export interface ResolutionRule {
  text: string;
  isSelected?: boolean;
}

export interface ResolutionRules {
  [REQUIRED]?: ResolutionRule[];
}

export interface Categories {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface Template {
  hash: string;
  categories: Categories;
  marketType: string;
  question: string;
  example: string;
  inputs: TemplateInput[];
  resolutionRules: ResolutionRules;
  denomination?: string;
  tickSize?: number;
}

export interface TemplateInput {
  id: number;
  type: TemplateInputType;
  placeholder: string;
  label?: string;
  tooltip?: string;
  userInput?: string;
  userInputObject?: UserInputtedType;
  values?: ValueLabelPair[];
  sublabel?: string;
}

export enum ValidationType {
  WHOLE_NUMBER = 'WHOLE_NUMBER',
  NUMBER = 'NUMBER',
}

export enum TemplateInputType {
  TEXT = 'TEXT',
  DATEYEAR = 'DATEYEAR',
  DATETIME = 'DATETIME',
  DROPDOWN = 'DROPDOWN',
  DENOMINATION_DROPDOWN = 'DENOMINATION_DROPDOWN',
  ADDED_OUTCOME = 'ADDED_OUTCOME',
  USER_DESCRIPTION_OUTCOME = 'USER_DESCRIPTION_TEXT',
  SUBSTITUTE_USER_OUTCOME = 'SUBSTITUTE_USER_OUTCOME',
  USER_DESCRIPTION_DROPDOWN_OUTCOME = 'USER_DESCRIPTION_DROPDOWN_OUTCOME',
}

export const ValidationTemplateInputType = {
  [TemplateInputType.TEXT]: `(.*)`,
  [TemplateInputType.USER_DESCRIPTION_OUTCOME]: `(.*)`,
  [TemplateInputType.DATETIME]: `(January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) \d\d:\d\d (AM|PM) \\(UTC 0\\)`,
  [TemplateInputType.DATEYEAR]: `(January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})`
};

export const LIST_VALUES = {
  YEARS: [
    {
      value: '2019',
      label: '2019',
    },
    {
      value: '2020',
      label: '2020',
    },
    {
      value: '2021',
      label: '2021',
    },
    {
      value: '2022',
      label: '2022',
    },
  ],
  YEAR_RANGE: [
    {
      value: '2019-20',
      label: '2019-20',
    },
    {
      value: '2020-21',
      label: '2020-21',
    },
    {
      value: '2021-22',
      label: '2021-22',
    },
  ],
  FOOTBALL_AWARDS: [
    {
      value: 'MVP',
      label: 'MVP',
    },
    {
      value: 'Offensive Player of the year',
      label: 'Offensive Player of the year',
    },
    {
      value: 'Defensive player of the year',
      label: 'Defensive player of the year',
    },
    {
      value: 'Offensive Rookie of the year',
      label: 'Offensive Rookie of the year',
    },
    {
      value: 'Defensive Rookie of the year',
      label: 'Defensive Rookie of the year',
    },
    {
      value: 'AP Most Valuable Player',
      label: 'AP Most Valuable Player'
    }
  ],
  FOOTBALL_EVENT: [
    {
      value: 'Superbowl',
      label: 'Superbowl',
    },
    {
      value: 'AFC Championship game',
      label: 'AFC Championship game',
    },
    {
      value: 'NFC Championship game',
      label: 'NFC Championship game',
    },
  ],
  NCAA_BASKETBALL_CONF: [
    {
      label: 'American East',
      value: 'American East',
    },
    {
      label: 'American',
      value: 'American',
    },
    {
      label: 'Atlantic 10',
      value: 'Atlantic 10',
    },
    {
      label: 'ACC',
      value: 'ACC',
    },
    {
      label: 'Atlantic Sun',
      value: 'Atlantic Sun',
    },
    {
      label: 'Big 12',
      value: 'Big 12',
    },
    {
      label: 'Big East',
      value: 'Big East',
    },
    {
      label: 'Big Sky',
      value: 'Big Sky',
    },
    {
      label: 'Big South',
      value: 'Big South',
    },
    {
      label: 'Big Ten',
      value: 'Big Ten',
    },
    {
      label: 'Big West',
      value: 'Big West',
    },
    {
      label: 'Colonial',
      value: 'Colonial',
    },
    {
      label: 'Conference USA',
      value: 'Conference USA',
    },
    {
      label: 'Horizon',
      value: 'Horizon',
    },
    {
      label: 'Ivy',
      value: 'Ivy',
    },
    {
      label: 'MAAC',
      value: 'MAAC',
    },
    {
      label: 'Mid-American',
      value: 'Mid-American',
    },
    {
      label: 'MEAC',
      value: 'MEAC',
    },
    {
      label: 'Missouri Valley',
      value: 'Missouri Valley',
    },
    {
      label: 'Mountain West',
      value: 'Mountain West',
    },
    {
      label: 'Northeast',
      value: 'Northeast',
    },
    {
      label: 'Ohio Valley',
      value: 'Ohio Valley',
    },
    {
      label: 'Pac-12',
      value: 'Pac-12',
    },
    {
      label: 'Patriot League',
      value: 'Patriot League',
    },
    {
      label: 'SEC',
      value: 'SEC',
    },
    {
      label: 'Southern',
      value: 'Southern',
    },
    {
      label: 'Southland',
      value: 'Southland',
    },
    {
      label: 'SWAC',
      value: 'SWAC',
    },
    {
      label: 'Summit League',
      value: 'Summit League',
    },
    {
      label: 'Sun Belt',
      value: 'Sun Belt',
    },
    {
      label: 'West Coast',
      value: 'West Coast',
    },
    {
      label: 'WAC',
      value: 'WAC',
    },
  ],
  BASEBALL_EVENT: [
    {
      value: 'American League Division Series',
      label: 'American League Division Series',
    },
    {
      value: 'National League Division Series',
      label: 'National League Division Series',
    },
    {
      value: 'American League Championship Series',
      label: 'American League Championship Series',
    },
    {
      value: 'National League Championship Series',
      label: 'National League Championship Series',
    },
    {
      value: 'World Series',
      label: 'World Series',
    },
  ],
  ENTERTAINMENT_EVENT: [
    {
      value: 'Academy Awards',
      label: 'Academy Awards',
    },
    {
      value: 'Emmy Awards',
      label: 'Emmy Awards',
    },
    {
      value: 'Grammy Awards',
      label: 'Grammy Awards',
    },
    {
      value: 'Golden Globe Awards',
      label: 'Golden Globe Awards',
    },
  ],
  CURRENCY: [
    {
      value: 'US dollar (USD)',
      label: 'US dollar (USD)',
    },
    {
      value: 'Euro (EUR)',
      label: 'Euro (EUR)',
    },
    {
      value: 'Chinese yuan (CNY)',
      label: 'Chinese yuan (CNY)',
    },
    {
      value: 'British pound (GBP)',
      label: 'British pound (GBP)',
    },
    {
      value: 'Australian dollar (AUD)',
      label: 'Australian dollar (AUD)',
    },
    {
      value: 'Canadian dollar (CAD)',
      label: 'Canadian dollar (CAD)',
    },
    {
      value: 'Swiss franc (CHF)',
      label: 'Swiss franc (CHF)',
    },
  ],
  REGION: [
    {
      value: 'US (United States)',
      label: 'US (United States)',
    },
    {
      value: 'Worldwide',
      label: 'Worldwide',
    },
  ],
  POL_PARTY: [
    {
      value: 'Democratic',
      label: 'Democratic',
    },
    {
      value: 'Republican',
      label: 'Republican',
    },
  ],
  PRES_OFFICES: [
    {
      value: 'President',
      label: 'President',
    },
    {
      value: 'Vice-President',
      label: 'Vice-President',
    },
  ],
  OFFICES: [
    {
      value: 'President',
      label: 'President',
    },
    {
      value: 'Vice-President',
      label: 'Vice-President',
    },
    {
      value: 'Senator',
      label: 'Senator',
    },
    {
      value: 'Congress',
      label: 'Congress',
    },
  ],
  POL_POSITION: [
    {
      value: 'President',
      label: 'President',
    },
    {
      value: 'Prime Minister',
      label: 'Prime Minister',
    },
    {
      value: 'Supreme Leader',
      label: 'Supreme Leader',
    },
    {
      value: 'Crown Prince',
      label: 'Crown Prince',
    },
    {
      value: 'Chancellor',
      label: 'Chancellor',
    },
    {
      value: 'Chief minister',
      label: 'Chief minister',
    },
  ],
  US_STATES: [
    {
      value: 'Alabama',
      label: 'Alabama',
    },
    {
      value: 'Alaska',
      label: 'Alaska',
    },
    {
      value: 'Arizona',
      label: 'Arizona',
    },
    {
      value: 'Arkansas',
      label: 'Arkansas',
    },
    {
      value: 'California',
      label: 'California',
    },
    {
      value: 'Colorado',
      label: 'Colorado',
    },
    {
      value: 'Connecticut',
      label: 'Connecticut',
    },
    {
      value: 'Delaware',
      label: 'Delaware',
    },
    {
      value: 'Florida',
      label: 'Florida',
    },
    {
      value: 'Georgia',
      label: 'Georgia',
    },
    {
      value: 'Hawaii',
      label: 'Hawaii',
    },
    {
      value: 'Idaho',
      label: 'Idaho',
    },
    {
      value: 'Illinois',
      label: 'Illinois',
    },
    {
      value: 'Indiana',
      label: 'Indiana',
    },
    {
      value: 'Iowa',
      label: 'Iowa',
    },
    {
      value: 'Kansas',
      label: 'Kansas',
    },
    {
      value: 'Kentucky',
      label: 'Kentucky',
    },
    {
      value: 'Louisiana',
      label: 'Louisiana',
    },
    {
      value: 'Maine',
      label: 'Maine',
    },
    {
      value: 'Maryland',
      label: 'Maryland',
    },
    {
      value: 'Massachusetts',
      label: 'Massachusetts',
    },
    {
      value: 'Michigan',
      label: 'Michigan',
    },
    {
      value: 'Minnesota',
      label: 'Minnesota',
    },
    {
      value: 'Mississippi',
      label: 'Mississippi',
    },
    {
      value: 'Missouri',
      label: 'Missouri',
    },
    {
      value: 'Montana',
      label: 'Montana',
    },
    {
      value: 'Nebraska',
      label: 'Nebraska',
    },
    {
      value: 'Nevada',
      label: 'Nevada',
    },
    {
      value: 'New Hampshire',
      label: 'New Hampshire',
    },
    {
      value: 'New Jersey',
      label: 'New Jersey',
    },
    {
      value: 'New Mexico',
      label: 'New Mexico',
    },
    {
      value: 'New York',
      label: 'New York',
    },
    {
      value: 'North Carolina',
      label: 'North Carolina',
    },
    {
      value: 'North Dakota',
      label: 'North Dakota',
    },
    {
      value: 'Ohio',
      label: 'Ohio',
    },
    {
      value: 'Oklahoma',
      label: 'Oklahoma',
    },
    {
      value: 'Oregon',
      label: 'Oregon',
    },
    {
      value: 'Pennsylvania',
      label: 'Pennsylvania',
    },
    {
      value: 'Rhode Island',
      label: 'Rhode Island',
    },
    {
      value: 'South Carolina',
      label: 'South Carolina',
    },
    {
      value: 'South Dakota',
      label: 'South Dakota',
    },
    {
      value: 'Tennessee',
      label: 'Tennessee',
    },
    {
      value: 'Texas',
      label: 'Texas',
    },
    {
      value: 'Utah',
      label: 'Utah',
    },
    {
      value: 'Vermont',
      label: 'Vermont',
    },
    {
      value: 'Virginia',
      label: 'Virginia',
    },
    {
      value: 'Washington',
      label: 'Washington',
    },
    {
      value: 'West Virginia',
      label: 'West Virginia',
    },
    {
      value: 'Wisconsin',
      label: 'Wisconsin',
    },
    {
      value: 'Wyoming',
      label: 'Wyoming',
    },
  ],
  BASKETBALL_EVENT: [
    {
      value: 'Eastern Conference Finals',
      label: 'Eastern Conference Finals',
    },
    {
      value: 'Western Conference Finals',
      label: 'Western Conference Finals',
    },
    {
      value: 'NBA Championship',
      label: 'NBA Championship',
    },
  ],
  NBA_BASKETBALL_AWARD: [
    {
      value: 'Most Valuable Player',
      label: 'Most Valuable Player',
    },
    {
      value: 'Rookie of the year',
      label: 'Rookie of the year',
    },
    {
      value: '6th Man',
      label: '6th Man',
    },
    {
      value: 'Defensive Player of the Year',
      label: 'Defensive Player of the Year',
    },
    {
      value: 'Most Improved player',
      label: 'Most Improved player',
    },
  ],
  NCAA_BASKETBALL_EVENTS: [
    {
      value: 'NCAA Tournament',
      label: 'NCAA Tournament',
    },
    {
      value: 'Sweet 16',
      label: 'Sweet 16',
    },
    {
      value: 'Elite 8',
      label: 'Elite 8',
    },
    {
      value: 'Final Four',
      label: 'Final Four',
    },
  ],
  NCAA_BASKETBALL_AWARD: [
    {
      value: 'Most Valuable Player',
      label: 'Most Valuable Player',
    },
    {
      value: 'Defensive Player of the Year',
      label: 'Defensive Player of the Year',
    },
    {
      value: 'Most Improved player',
      label: 'Most Improved player',
    },
    {
      value: 'Coach of the year',
      label: 'Coach of the year',
    },
    {
      value: 'NCAA-Naismith College Player of the Year',
      label: 'NCAA-Naismith College Player of the Year',
    },
    {
      value: 'AP college Player of the year',
      label: 'AP college Player of the year',
    },
    {
      value: 'Sporting News College Basketball Player of the year',
      label: 'Sporting News College Basketball Player of the year',
    },
    {
      value: 'John Wooden',
      label: 'John Wooden',
    },
    {
      value: 'Oscar Robertson',
      label: 'Oscar Robertson',
    },
  ],
  MENS_WOMENS: [
    {
      value: "Men's",
      label: "Men's",
    },
    {
      value: "Women's",
      label: "Women's",
    },
  ],
  BASKETBALL_ACTION: [
    {
      value: 'Points Scored',
      label: 'Points Scored',
    },
    {
      value: 'Rebounds',
      label: 'Rebounds',
    },
    {
      value: 'Assists',
      label: 'Assists',
    },
    {
      value: 'made 3-pointers',
      label: 'made 3-pointers',
    },
  ],
  HOCKEY_AWARD: [
    {
      value: 'Hart Trophy',
      label: 'Hart Trophy',
    },
    {
      value: 'Norris Trophy',
      label: 'Norris Trophy',
    },
    {
      value: 'Vezina Trophy',
      label: 'Vezina Trophy',
    },
    {
      value: 'Calder Trophy',
      label: 'Calder Trophy',
    },
  ],
  HORSE_RACING_EVENT: [
    {
      value: 'Kentucky Derby',
      label: 'Kentucky Derby',
    },
    {
      value: 'Preakness',
      label: 'Preakness',
    },
    {
      value: 'Belmont',
      label: 'Belmont',
    },
    {
      value: 'Triple Crown',
      label: 'Triple Crown',
    },
  ],
  TENNIS_EVENT: [
    {
      value: 'Australian Open',
      label: 'Australian Open',
    },
    {
      value: 'French Open',
      label: 'French Open',
    },
    {
      value: 'Wimbledon',
      label: 'Wimbledon',
    },
    {
      value: 'US Open',
      label: 'US Open',
    },
  ],
  GOLF_EVENT: [
    {
      value: 'PGA Championship',
      label: 'PGA Championship',
    },
    {
      value: 'Open Championship',
      label: 'Open Championship',
    },
    {
      value: 'US Open',
      label: 'US Open',
    },
    {
      value: 'Masters Tournament',
      label: 'Masters Tournament',
    },
    {
      value: 'British Open',
      label: 'British Open',
    },
  ],
  MLB_TEAMS: [
    {
      value: 'Arizona Diamondbacks',
      label: 'Arizona Diamondbacks',
    },
    {
      value: 'Atlanta Braves',
      label: 'Atlanta Braves',
    },
    {
      value: 'Baltimore Orioles',
      label: 'Baltimore Orioles',
    },
    {
      value: 'Boston Red Sox',
      label: 'Boston Red Sox',
    },
    {
      value: 'Chicago White Sox',
      label: 'Chicago White Sox',
    },
    {
      value: 'Chicago Cubs',
      label: 'Chicago Cubs',
    },
    {
      value: 'Cincinnati Reds',
      label: 'Cincinnati Reds',
    },
    {
      value: 'Cleveland Indians',
      label: 'Cleveland Indians',
    },
    {
      value: 'Colorado Rockies',
      label: 'Colorado Rockies',
    },
    {
      value: 'Detroit Tigers',
      label: 'Detroit Tigers',
    },
    {
      value: 'Houston Astros',
      label: 'Houston Astros',
    },
    {
      value: 'Kansas City Royals',
      label: 'Kansas City Royals',
    },
    {
      value: 'Las Angeles Angels',
      label: 'Las Angeles Angels',
    },
    {
      value: 'Las Angeles Dodgers',
      label: 'Las Angeles Dodgers',
    },
    {
      value: 'Miami Marlins',
      label: 'Miami Marlins',
    },
    {
      value: 'Milwaukee Brewers',
      label: 'Milwaukee Brewers',
    },
    {
      value: 'Minnesota Twins',
      label: 'Minnesota Twins',
    },
    {
      value: 'New York Yankees',
      label: 'New York Yankees',
    },
    {
      value: 'New York Mets',
      label: 'New York Mets',
    },
    {
      value: 'Oakland Athletics',
      label: 'Oakland Athletics',
    },
    {
      value: 'Philadelphia Phillies',
      label: 'Philadelphia Phillies',
    },
    {
      value: 'Pittsburgh Pirates',
      label: 'Pittsburgh Pirates',
    },
    {
      value: 'San Diego Padres',
      label: 'San Diego Padres',
    },
    {
      value: 'San Francisco Giants',
      label: 'San Francisco Giants',
    },
    {
      value: 'Seattle Mariners',
      label: 'Seattle Mariners',
    },
    {
      value: 'St. Louis Cardinals',
      label: 'St. Louis Cardinals',
    },
    {
      value: 'Tampa Bay Rays',
      label: 'Tampa Bay Rays',
    },
    {
      value: 'Texas Rangers',
      label: 'Texas Rangers',
    },
    {
      value: 'Toronto Blue Jays',
      label: 'Toronto Blue Jays',
    },
    {
      value: 'Washington Nationals',
      label: 'Washington Nationals',
    },
  ],
  NFL_TEAMS: [
    {
      value: 'Arizona Cardinals',
      label: 'Arizona Cardinals',
    },
    {
      value: 'Atlanta Falcons',
      label: 'Atlanta Falcons',
    },
    {
      value: 'Baltimore Ravens',
      label: 'Baltimore Ravens',
    },
    {
      value: 'Buffalo Bills',
      label: 'Buffalo Bills',
    },
    {
      value: 'Carolina Panthers',
      label: 'Carolina Panthers',
    },
    {
      value: 'Chicago Bears',
      label: 'Chicago Bears',
    },
    {
      value: 'Cincinnati Bengals',
      label: 'Cincinnati Bengals',
    },
    {
      value: 'Cleveland Browns',
      label: 'Cleveland Browns',
    },
    {
      value: 'Dallas Cowboys',
      label: 'Dallas Cowboys',
    },
    {
      value: 'Denver Broncos',
      label: 'Denver Broncos',
    },
    {
      value: 'Detroit Lions',
      label: 'Detroit Lions',
    },
    {
      value: 'Green Bay Packers',
      label: 'Green Bay Packers',
    },
    {
      value: 'Houston Texans',
      label: 'Houston Texans',
    },
    {
      value: 'Indianapolis Colts',
      label: 'Indianapolis Colts',
    },
    {
      value: 'Jacksonville Jaguars',
      label: 'Jacksonville Jaguars',
    },
    {
      value: 'Kansas City Chiefs',
      label: 'Kansas City Chiefs',
    },
    {
      value: 'Las Angeles Chargers',
      label: 'Las Angeles Chargers',
    },
    {
      value: 'Las Angeles Rams',
      label: 'Las Angeles Rams',
    },
    {
      value: 'Miami Dolphins',
      label: 'Miami Dolphins',
    },
    {
      value: 'Minnesota Vikings',
      label: 'Minnesota Vikings',
    },
    {
      value: 'New England Patriots',
      label: 'New England Patriots',
    },
    {
      value: 'New Orleans Saints',
      label: 'New Orleans Saints',
    },
    {
      value: 'New York Giants',
      label: 'New York Giants',
    },
    {
      value: 'New York Jets',
      label: 'New York Jets',
    },
    {
      value: 'Oakland Raiders',
      label: 'Oakland Raiders',
    },
    {
      value: 'Philadelphia Eagles',
      label: 'Philadelphia Eagles',
    },
    {
      value: 'Pittsburgh Steelers',
      label: 'Pittsburgh Steelers',
    },
    {
      value: 'San Francisco 49ers',
      label: 'San Francisco 49ers',
    },
    {
      value: 'Seattle Seahawks',
      label: 'Seattle Seahawks',
    },
    {
      value: 'Tampa Bay Buccaneers',
      label: 'Tampa Bay Buccaneers',
    },
    {
      value: 'Tennessee Titans',
      label: 'Tennessee Titans',
    },
    {
      value: 'Washington Redskins',
      label: 'Washington Redskins',
    },
  ],
  NBA_TEAMS: [
    {
      value: 'Atlanta Hawks',
      label: 'Atlanta Hawks',
    },
    {
      value: 'Boston Celtics',
      label: 'Boston Celtics',
    },
    {
      value: 'Brooklyn Nets',
      label: 'Brooklyn Nets',
    },
    {
      value: 'Charlotte Hornets',
      label: 'Charlotte Hornets',
    },
    {
      value: 'Chicago Bulls',
      label: 'Chicago Bulls',
    },
    {
      value: 'Cleveland Cavaliers',
      label: 'Cleveland Cavaliers',
    },
    {
      value: 'Dallas Mavericks',
      label: 'Dallas Mavericks',
    },
    {
      value: 'Denver Nuggets',
      label: 'Denver Nuggets',
    },
    {
      value: 'Detroit Pistons',
      label: 'Detroit Pistons',
    },
    {
      value: 'Golden State Warriors',
      label: 'Golden State Warriors',
    },
    {
      value: 'Houston Rockets',
      label: 'Houston Rockets',
    },
    {
      value: 'Indiana Pacers',
      label: 'Indiana Pacers',
    },
    {
      value: 'LA Clippers',
      label: 'LA Clippers',
    },
    {
      value: 'LA Lakers',
      label: 'LA Lakers',
    },
    {
      value: 'Memphis Grizzlies',
      label: 'Memphis Grizzlies',
    },
    {
      value: 'Miami Heat',
      label: 'Miami Heat',
    },
    {
      value: 'Milwaukee Bucks',
      label: 'Milwaukee Bucks',
    },
    {
      value: 'Minnesota Timberwolves',
      label: 'Minnesota Timberwolves',
    },
    {
      value: 'New Orleans Pelicans',
      label: 'New Orleans Pelicans',
    },
    {
      value: 'New York Knicks',
      label: 'New York Knicks',
    },
    {
      value: 'Oklahoma City Thunder',
      label: 'Oklahoma City Thunder',
    },
    {
      value: 'Orlando Magic',
      label: 'Orlando Magic',
    },
    {
      value: 'Philadelphia 76ers',
      label: 'Philadelphia 76ers',
    },
    {
      value: 'Phoenix Suns',
      label: 'Phoenix Suns',
    },
    {
      value: 'Portland Trail Blazers',
      label: 'Portland Trail Blazers',
    },
    {
      value: 'Sacramento Kings',
      label: 'Sacramento Kings',
    },
    {
      value: 'San Antonio Spurs',
      label: 'San Antonio Spurs',
    },
    {
      value: 'Toronto Raptors',
      label: 'Toronto Raptors',
    },
    {
      value: 'Utah Jazz',
      label: 'Utah Jazz',
    },
    {
      value: 'Washington Wizards',
      label: 'Washington Wizards',
    },
  ],
  BTC_USD_EXCHANGES: [
    {
      value: 'Coinbase Pro (pro.coinbase.com)',
      label: 'Coinbase Pro (pro.coinbase.com)',
    },
    {
      value: 'Bitstamp (bitstamp.net)',
      label: 'Bitstamp (bitstamp.net)',
    },
    {
      value: 'Bittrex (bittrex.com)',
      label: 'Bittrex (bittrex.com)',
    },
  ],
  NON_BTC_USD_EXCHANGES: [
    {
      value: 'Coinbase Pro (pro.coinbase.com)',
      label: 'Coinbase Pro (pro.coinbase.com)',
    },
    {
      value: 'Bitstamp (bitstamp.net)',
      label: 'Bitstamp (bitstamp.net)',
    },
    {
      value: 'Kraken (kraken.com)',
      label: 'Kraken (kraken.com)',
    },
    {
      value: 'Bittrex (bittrex.com)',
      label: 'Bittrex (bittrex.com)',
    },
  ],
  USDT_EXCHANGES: [
    {
      value: 'Bittrex (bittrex.com)',
      label: 'Bittrex (bittrex.com)',
    },
    {
      value: 'Binance (binance.com)',
      label: 'Binance (binance.com)',
    },
    {
      value: 'Huobi Global (hbg.com)',
      label: 'Huobi Global (hbg.com)',
    },
  ],
  EUR_EXCHANGES: [
    {
      value: 'Coinbase Pro (pro.coinbase.com)',
      label: 'Coinbase Pro (pro.coinbase.com)',
    },
    {
      value: 'Bitstamp (bitstamp.net)',
      label: 'Bitstamp (bitstamp.net)',
    },
    {
      value: 'Kraken (kraken.com)',
      label: 'Kraken (kraken.com)',
    },
  ],
};


export const TEMPLATES = {"Sports":{"children":{"Golf":{"templates":[{"marketType":"YesNo","question":"Will [0] win the [1] [2]?","example":"Will Tiger Woods win the 2020 PGA Championship?","inputs":[{"id":0,"type":"TEXT","placeholder":"Player"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"PGA Championship","label":"PGA Championship"},{"value":"Open Championship","label":"Open Championship"},{"value":"US Open","label":"US Open"},{"value":"Masters Tournament","label":"Masters Tournament"},{"value":"British Open","label":"British Open"}]}],"resolutionRules":{"REQUIRED":[{"text":"If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as \"No\""}]},"hash":"0xb11764bcd6054968fa75a3b0fd55aa7031101315321edcbfb200f869cf66b6ee"},{"marketType":"YesNo","question":"Will [0] make the cut at the [1] [2]?","example":"Will Tiger Woods make the cut at the 2020 PGA Championship?","inputs":[{"id":0,"type":"TEXT","placeholder":"Player"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"PGA Championship","label":"PGA Championship"},{"value":"Open Championship","label":"Open Championship"},{"value":"US Open","label":"US Open"},{"value":"Masters Tournament","label":"Masters Tournament"},{"value":"British Open","label":"British Open"}]}],"resolutionRules":{"REQUIRED":[{"text":"If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as \"No\""}]},"hash":"0xc9d0483f3d82cf535c9e58fc9e190bc4c507950dc28609df31c27ee58b42694f"},{"marketType":"Categorical","question":"Which golfer will win the [0] [1]?","example":"Which golfer will win the 2020 PGA Championship?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"PGA Championship","label":"PGA Championship"},{"value":"Open Championship","label":"Open Championship"},{"value":"US Open","label":"US Open"},{"value":"Masters Tournament","label":"Masters Tournament"},{"value":"British Open","label":"British Open"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x084b594dc549099e066b9733e9bb1c4ef5067851b8bb08d7733614e484e09369"}]},"Hockey":{"templates":[{"marketType":"YesNo","question":"Will the [0] win vs the [1], Estimated schedule start time: [2]?","example":"Will the St Louis Blues win vs the Dallas Stars, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{},"hash":"0xea0b6b5eb2e16392fd2b17bb7f0c761b13e7b40a35d87e7702109dc7a0a6bbbd"},{"marketType":"YesNo","question":"Will the [0] & [1] score [2] or more combined goals, Estimated schedule start time: [3]?","example":"Will the NY Rangers & Dallas Stars score 5 or more combined goals, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation, overtime and any shoot-outs. The game must go 55 minutes or more to be considered official. If it does not \"No winner\" should be deemed the winning outcome."}]},"hash":"0x6e8b9ded9bc2706356452eba9682ae7c0eae61f067a6311e015bcdc739b674a7"},{"marketType":"YesNo","question":"Will the [0] win the [1] Stanley Cup?","example":"Will the Montreal Canadiens win the 2019-2020 Stanley Cup?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]}],"resolutionRules":{},"hash":"0x2240793e8bc7080ec1f2489b82fe33cb3c3e5d06defd9752681996498a7a2620"},{"marketType":"Categorical","question":"Which team will win: [0] vs [1], Estimated schedule start time: [2]?","example":"Which Team will win: NY Rangers vs NJ Devils, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":1,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, or ends in a tie, the market should resolve as \"Draw/No Winner\"."},{"text":"Include Regulation, overtime and any shoot-outs. The game must go 55 minutes or more to be considered official. If it does not \"No winner\" should be deemed the winning outcome."}]},"hash":"0xc828397abfe32a946d82e4a605f465a979dcb698f8846ba4d759b8aad1427ed5"},{"marketType":"Categorical","question":"[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"St Louis Blues vs. NY Rangers: Total goals scored Over/Under 4.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"If the game is not played or is NOT completed for any reason, the market should resolve as \"No Winner\"."}]},"hash":"0x8046e1128dc30571a3c8680c40927b4cde8e3d0af9ae05e678d1b722f2099fbe"},{"marketType":"Categorical","question":"Which NHL team will win the [0] Stanley Cup?","example":"Which NHL team will win the 2019-2020 Stanley Cup?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":1,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0xf0cae533cd96f75ef69a4a184faa958d043e3c992eb7538bca7649cf6911ecb0"},{"marketType":"Categorical","question":"Which NHL player will win the [0] [1]?","example":"Which NHL player will win the 2019-2020 Calder Trophy?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":1,"type":"DROPDOWN","placeholder":"Award","values":[{"value":"Hart Trophy","label":"Hart Trophy"},{"value":"Norris Trophy","label":"Norris Trophy"},{"value":"Vezina Trophy","label":"Vezina Trophy"},{"value":"Calder Trophy","label":"Calder Trophy"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x5725d708831ed60c02f8444e17dc9ef3942ee173e0f8b2ac6b5b6897eb33aaf7"},{"marketType":"Scalar","question":"Total number of wins the [0] will finish [1] regular season with?","example":"Total number of wins the LA Kings will finish 2019-2020 regular season with?","denomination":"wins","tickSize":1,"inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]}],"resolutionRules":{"REQUIRED":[{"text":"Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games"}]},"hash":"0xa1dfe1a7dcc8af56aed57c3dc0be4520854c4d6c94946f0a6d5a4a512b293536"}]},"Horse Racing":{"templates":[{"marketType":"YesNo","question":"Will [0] win the [1] [2]?","example":"Will American Pharoah win the 2020 Triple Crown?","inputs":[{"id":0,"type":"TEXT","placeholder":"Horse"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Kentucky Derby","label":"Kentucky Derby"},{"value":"Preakness","label":"Preakness"},{"value":"Belmont","label":"Belmont"},{"value":"Triple Crown","label":"Triple Crown"}]}],"resolutionRules":{"REQUIRED":[{"text":"If the horse named in the market is scratched and does NOT run or is disqualified for any reason, the market should resolve as \"No\""}]},"hash":"0x47f523be60c55370df2f8e4ab3f65d318b8587e49c9c368eb478b61391694989"},{"marketType":"Categorical","question":"Which horse will win the [0] [1]?","example":"Which horse will win the 2020 Kentucky Derby?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Kentucky Derby","label":"Kentucky Derby"},{"value":"Preakness","label":"Preakness"},{"value":"Belmont","label":"Belmont"},{"value":"Triple Crown","label":"Triple Crown"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x51fd7be9de99ec8e30a2ebf075a4c289ed3ad9a2591e5d5d9ac7444b01e99d32"}]},"Tennis":{"templates":[{"marketType":"YesNo","question":"Will [0] win the [1] [2]?","example":"Will Roger Federer win the 2020 Wimbledon?","inputs":[{"id":0,"type":"TEXT","placeholder":"Player"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Australian Open","label":"Australian Open"},{"value":"French Open","label":"French Open"},{"value":"Wimbledon","label":"Wimbledon"},{"value":"US Open","label":"US Open"}]}],"resolutionRules":{"REQUIRED":[{"text":"If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as \"No\""}]},"hash":"0xb11764bcd6054968fa75a3b0fd55aa7031101315321edcbfb200f869cf66b6ee"},{"marketType":"Categorical","question":"Which tennis player will win the [0] [1]?","example":"Which tennis player will win the 2020 Australian Open?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Australian Open","label":"Australian Open"},{"value":"French Open","label":"French Open"},{"value":"Wimbledon","label":"Wimbledon"},{"value":"US Open","label":"US Open"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"If a player is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner"}]},"hash":"0x743293ce0547a7accfa5da5699a43068ebaaba4bb9e49fee792e177a508f5656"},{"marketType":"Categorical","question":"[0] [1] Match play winner: [2] vs [3]?","example":"2020 Wimbledon Match play winner between Roger Federer vs Rafael Nadal?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Australian Open","label":"Australian Open"},{"value":"French Open","label":"French Open"},{"value":"Wimbledon","label":"Wimbledon"},{"value":"US Open","label":"US Open"}]},{"id":2,"type":"USER_DESCRIPTION_TEXT","placeholder":"Player A"},{"id":3,"type":"USER_DESCRIPTION_TEXT","placeholder":"Player B"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"If a player is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner."},{"text":"If a player fails to start a tournament or a match, or the match was not able to start for any reason, the market should resolve as \"No Winner\"."},{"text":"If the match is not played for any reason, or is terminated prematurely with both players willing and able to play, the market should resolve as \"No Winner\"."}]},"hash":"0x70acee7e8aca7b038bf26ecf4904718906ac5298679e019ddee895b579280196"}]},"Soccer":{"templates":[{"marketType":"Categorical","question":"Which team will win: [0] vs [1], Estimated schedule start time: [2]?","example":"Which team will win: Real Madrid vs Manchester United, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":1,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"Draw/No Winner"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"Unofficial game/Cancelled"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out."},{"text":"If the match concludes and is deemed an official game, meaning more than 90% of the scheduled match has been completed and the score ends in a tie, the market should resolve as \"Draw\"."},{"text":"If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as \"Unofficial game/Cancelled\"."}]},"hash":"0x51a17bd92fdf4aaf4035b9df4e9e9daf7ad500dfcb1eeac8c75367e9b2cd2f2d"},{"marketType":"Categorical","question":"[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"Real Madrid vs Manchester United: Total goals scored Over/Under 4.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"},{"id":7,"type":"ADDED_OUTCOME","placeholder":"Unofficial game/Cancelled"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out. If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as \"Unofficial game/Cancelled\"."}]},"hash":"0xa4abe419a906aca7784b996baeca43cbcb3042d7f8ae13a2f40f883842e06e42"}]},"Basketball":{"children":{"NBA":{"templates":[{"marketType":"YesNo","question":"Will the [0] win vs the [1], Estimated schedule start time: [2]?","example":"Will the Los Angeles Lakers win vs the Golden State Warriors, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":2,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO\"'"},{"text":"At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as \"No\""}]},"hash":"0x7732e4cff79bc21ed270bd720c914c0aa12d683258541200b634babf1e38d4cf"},{"marketType":"YesNo","question":"Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?","example":"Will the Los Angeles Lakers win vs the Golden State Warriors by 5 or more points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO\"'"},{"text":"At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as \"No\""}]},"hash":"0x3fce5e6f6f8aa4cf99aef2dab47e76e3b58e71f4ec4a60011342f54ec1c405de"},{"marketType":"YesNo","question":"Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?","example":"Will the Los Angeles Lakers & the Golden State Warriors score 172 or more combined points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO\"'"},{"text":"At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as \"No\""}]},"hash":"0x1d07150af31e64a68aade0c85cc351f754154383d38fb74d9f9473478b77adb8"},{"marketType":"YesNo","question":"Will the [0] win the [1] NBA Championship?","example":"Will the Golden State Warriors win the 2019-20 NBA Championship?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]}],"resolutionRules":{},"hash":"0x761d3707d55b48235d0296198c1158ed21cd69dcf39430afb9a0aa55bf004d1b"},{"marketType":"YesNo","question":"Will [0] win the [1] [2] award?","example":"Will Steph Curry win the 2019-2020 NBA Most Valuable Player award?","inputs":[{"id":0,"type":"TEXT","placeholder":"Name"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":2,"type":"DROPDOWN","placeholder":"Award","values":[{"value":"Most Valuable Player","label":"Most Valuable Player"},{"value":"Rookie of the year","label":"Rookie of the year"},{"value":"6th Man","label":"6th Man"},{"value":"Defensive Player of the Year","label":"Defensive Player of the Year"},{"value":"Most Improved player","label":"Most Improved player"}]}],"resolutionRules":{},"hash":"0x2e79389570ac2cd9030e0bbbab6d2ae924ee66c22dcc19745a41d30cfe57667a"},{"marketType":"Categorical","question":"Which team will win: [0] vs [1], Estimated schedule start time: [2]?","example":"Which Team will win: Brooklyn Nets vs NY Knicks, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team A","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team B","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":2,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"}]},"hash":"0x9db7819dfeabbeccd25962cc2c85865c64dd0bff75aa7e8c2b5a25f3ef1f7a0b"},{"marketType":"Categorical","question":"[0] vs [1]: Total Points scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"Brooklyn Nets vs NY Knicks: Total Points scored: Over/Under 164.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"}]},"hash":"0x0d92f11622849ead67f48a71714cf329c99cf639418fbda14aa200b85c70c2bb"},{"marketType":"Categorical","question":"Which NBA team will win the [0] [1]?","example":"Which NBA team will win the 2019-2020 Western Conference Finals?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Eastern Conference Finals","label":"Eastern Conference Finals"},{"value":"Western Conference Finals","label":"Western Conference Finals"},{"value":"NBA Championship","label":"NBA Championship"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"}]},"hash":"0xc1a1b03edab906931d6bc54cdbb12d5d0b39b13ad2d1ed673ab9bece4a059fc2"},{"marketType":"Categorical","question":"Which NBA player will win the [0] [1] award?","example":"Which NBA player will win the 2019-2020 Most Valuable Player award?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":1,"type":"DROPDOWN","placeholder":"Award","values":[{"value":"Most Valuable Player","label":"Most Valuable Player"},{"value":"Rookie of the year","label":"Rookie of the year"},{"value":"6th Man","label":"6th Man"},{"value":"Defensive Player of the Year","label":"Defensive Player of the Year"},{"value":"Most Improved player","label":"Most Improved player"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"}]},"hash":"0x684bf2baaf987ab313a90c2fdb0ab1d718a961ae0f14691087326cc1eb32538d"},{"marketType":"Categorical","question":"Which Player will have the most [0] at the end of the the [1] regular season?","example":"Which Player will have the most Points scored at the end of the the 2019-2020 regular season?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Action","values":[{"value":"Points Scored","label":"Points Scored"},{"value":"Rebounds","label":"Rebounds"},{"value":"Assists","label":"Assists"},{"value":"made 3-pointers","label":"made 3-pointers"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"}]},"hash":"0x1656ff772320d996cb27d1818527097e626c0232931b349a3c42641ada816b29"},{"marketType":"Scalar","question":"Total number of wins [0] will finish [1] regular season with?","example":"Total number of wins NY Knicks will finish 2019-20 regular season with?","denomination":"wins","tickSize":1,"inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]}],"resolutionRules":{},"hash":"0x4956280754a3192bb93a85dbb35830ee4645ff8da99caac5a198ea16f5895a55"}]},"NCAA":{"templates":[{"marketType":"YesNo","question":"Will [0] win vs [1]; [2] basketball, Estimated schedule start time: [3]?","example":"Will Duke win vs Kentucky; Men's baskeball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' "},{"text":"At least 35 minutes of play must have elapsed for the game to be deemed official.  If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as \"No\""}]},"hash":"0x1d85cf567b88ecd10432c9e3475281a7c6103b6461a9b3957d97272fe260ab68"},{"marketType":"YesNo","question":"Will [0] win vs [1] by [2] or more points, [3] basketball, Estimated schedule start time: [4]?","example":"Will Duke Blue Devils win vs Kentucky Wildcats by 3 or more points; Men's basketball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":4,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' "},{"text":"At least 35 minutes of play must have elapsed for the game to be deemed official.  If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as \"No\""}]},"hash":"0xb780cc879bbb1096fd1a3e8fb679f8a397306cd3575a4a3304c9b0e7a81ae643"},{"marketType":"YesNo","question":"Will [0] & [1] score [2] or more combined points; [3] basketball, Estimated schedule start time: [4]?","example":"Will UNC & Arizona score 142 or more combined points; Men's basketball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":4,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"}]},"hash":"0x3258d36deb4c932ef1bc8670d9b5e249d624752be59f723784d851017eabfaf7"},{"marketType":"YesNo","question":"Will [0] win the [1] NCAA [2] National Championship?","example":"Will Villanova win the 2020 NCAA Men's National Championship?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]}],"resolutionRules":{},"hash":"0xa6394443c2eea97ca78e877e2b020f521ed40edecc9bf3aa53eda8944b920b18"},{"marketType":"YesNo","question":"Will [0] make the [1] [2] [3]?","example":"Will USC make the 2020 Men's Final Four?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":3,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"NCAA Tournament","label":"NCAA Tournament"},{"value":"Sweet 16","label":"Sweet 16"},{"value":"Elite 8","label":"Elite 8"},{"value":"Final Four","label":"Final Four"}]}],"resolutionRules":{},"hash":"0xc4131e424bd11f52e2da28eec9b88bcf2ad85fb09241ac23f84ba28f158118a0"},{"marketType":"Categorical","question":"Which team will win: [0] vs [1], [2] basketball, Estimated schedule start time: [3]?","example":"Which Team will win: Duke vs Kentucky, Men's basketball, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":1,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":2,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"}]},"hash":"0xc4c90502bd7e77b8810381e781ba1a76a306bd5c3d075281764da2d812443f3f"},{"marketType":"Categorical","question":"[0] basketball; [1] vs [2]: Total Points scored; Over/Under [3].5, Estimated schedule start time: [4]?","example":"Men's basketball; Duke Blue Devils vs Arizona Wildcats: Total Points scored: Over/Under 164.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":1,"type":"TEXT","placeholder":"Team A"},{"id":2,"type":"TEXT","placeholder":"Team B"},{"id":3,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":4,"type":"DATETIME","placeholder":"Date time"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"If the game is not played or is NOT completed for any reason, the market should resolve as \"No Winner\"."}]},"hash":"0x760dd0987edaaf13d9aa81a39ae1182a756bf427c4e8d3da668c60ab9b56c1ec"},{"marketType":"Categorical","question":"Which college basketball team will win the [0] [1] [2] tournament?","example":"Which college basketball team will win the men's 2020 ACC tournament?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Men's/Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Conference","values":[{"label":"American East","value":"American East"},{"label":"American","value":"American"},{"label":"Atlantic 10","value":"Atlantic 10"},{"label":"ACC","value":"ACC"},{"label":"Atlantic Sun","value":"Atlantic Sun"},{"label":"Big 12","value":"Big 12"},{"label":"Big East","value":"Big East"},{"label":"Big Sky","value":"Big Sky"},{"label":"Big South","value":"Big South"},{"label":"Big Ten","value":"Big Ten"},{"label":"Big West","value":"Big West"},{"label":"Colonial","value":"Colonial"},{"label":"Conference USA","value":"Conference USA"},{"label":"Horizon","value":"Horizon"},{"label":"Ivy","value":"Ivy"},{"label":"MAAC","value":"MAAC"},{"label":"Mid-American","value":"Mid-American"},{"label":"MEAC","value":"MEAC"},{"label":"Missouri Valley","value":"Missouri Valley"},{"label":"Mountain West","value":"Mountain West"},{"label":"Northeast","value":"Northeast"},{"label":"Ohio Valley","value":"Ohio Valley"},{"label":"Pac-12","value":"Pac-12"},{"label":"Patriot League","value":"Patriot League"},{"label":"SEC","value":"SEC"},{"label":"Southern","value":"Southern"},{"label":"Southland","value":"Southland"},{"label":"SWAC","value":"SWAC"},{"label":"Summit League","value":"Summit League"},{"label":"Sun Belt","value":"Sun Belt"},{"label":"West Coast","value":"West Coast"},{"label":"WAC","value":"WAC"}]},{"id":3,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"The winner is determined by the team who wins their conference tournament championship game"}]},"hash":"0x16c586f8848bf4d4e3c0802d45313db649ebee293f3b660f916af92ab193044e"}]}}},"Baseball":{"templates":[{"marketType":"YesNo","question":"Will the [0] win the [1] [2]?","example":"Will the NY Yankees win the 2020 World Series?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"American League Division Series","label":"American League Division Series"},{"value":"National League Division Series","label":"National League Division Series"},{"value":"American League Championship Series","label":"American League Championship Series"},{"value":"National League Championship Series","label":"National League Championship Series"},{"value":"World Series","label":"World Series"}]}],"resolutionRules":{},"hash":"0x58bdcffd6a31d16291b30acd27adf152f62ca509799561e88f8ee6f4e4bed643"},{"marketType":"Categorical","question":"Which team will win: [0] vs [1], Estimated schedule start time: [2]?","example":"Which Team will win: Yankees vs Red Sox, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":1,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the \"official time limit\", or ends in a tie, the market should resolve as \"No Winner\", and Extra innings count towards settlement purposes"}]},"hash":"0xda3c949f84da9f47840bca587e8097b75bf6a9b370e8bb6c2b1889ca9bf68509"},{"marketType":"Categorical","question":"Which MLB team will win the [0] [1]?","example":"Which MLB team will win the 2020 World Series?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"American League Division Series","label":"American League Division Series"},{"value":"National League Division Series","label":"National League Division Series"},{"value":"American League Championship Series","label":"American League Championship Series"},{"value":"National League Championship Series","label":"National League Championship Series"},{"value":"World Series","label":"World Series"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x3aa9d1c31aad6b7f700fd72aa31571ced7453ed8491bdbb5c1105b07634ba518"},{"marketType":"Categorical","question":"[0] vs [1]: Total Runs scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"NY Yankees vs Boston Red Sox: Total Runs scored; Over/Under 9.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the \"official time limit\", or ends in a tie, the market should resolve as \"No Winner\". Extra innings count towards settlement purposes"}]},"hash":"0x5a9e16ed367462965c09f7f897e14fc7f26fa997094f924539b4a4faac8bfe8d"},{"marketType":"Categorical","question":"Which player will win the [0] [1]?","example":"Which Player will win the 2019 American League Cy Young award?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"American League Division Series","label":"American League Division Series"},{"value":"National League Division Series","label":"National League Division Series"},{"value":"American League Championship Series","label":"American League Championship Series"},{"value":"National League Championship Series","label":"National League Championship Series"},{"value":"World Series","label":"World Series"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x0c7bc8c8af0908e86dfd6cc9da40a1c7f21f05611d550ab6147590d980a45879"},{"marketType":"Scalar","question":"Total number of wins the [0] will finish the [1] regular season with?","example":"Total number of wins the LA Dodgers will finish the 2019 regular season with?","denomination":"wins","tickSize":1,"inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{},"hash":"0x68d6e07c814f11f54edc9e4585ac696cb3e732f0398ac339be3e5a652b46d742"}]},"American Football":{"children":{"NFL":{"templates":[{"marketType":"YesNo","question":"Will the [0] win vs the [1], Estimated schedule start time: [2]?","example":"Will the NY Giants win vs. the New England Patriots, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x72e6654de12c0d25496c4699f21b8071a1718ae5142faccbdf1202ba2cb6d69e"},{"marketType":"YesNo","question":"Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?","example":"Will the NY Giants win vs. the New England Patriots by 3 or more points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x431bb08039e6ce1acb72c56f80be886836ca253fbdf6ecfff384c0483c2e1e9d"},{"marketType":"YesNo","question":"Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?","example":"Will the NY Giants & the New England Patriots score 44 or more combined points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x1359b0cf7cd2cb0e949726de1725ff88b2b09987d67f7581d784ab7ab56d34f3"},{"marketType":"YesNo","question":"Will the [0] have [1] or more regular season wins in [2]?","example":"Will the Dallas Cowboys have 9 or more regular season wins in 2019?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":2,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{"REQUIRED":[{"text":"Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games"}]},"hash":"0xc55df05a57f25aff625202bd2658c866ae7043c741a258e061130736b326bbdd"},{"marketType":"YesNo","question":"Will the [0] win SuperBowl [1]?","example":"Will the NY Giants win Superbowl LIV?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"TEXT","placeholder":"numeral"}],"resolutionRules":{},"hash":"0xfb3e93db226b63ef67738b2e6a16e2ed32e1e8951e6d7ebddea07bf96b91a3a2"},{"marketType":"YesNo","question":"Will [0] win the [1] [2] award?","example":"Will Patrick Mahomes win the 2019-20 MVP award?","inputs":[{"id":0,"type":"TEXT","placeholder":"Player"},{"id":1,"type":"DROPDOWN","placeholder":"Year/Year","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":2,"type":"DROPDOWN","placeholder":"Select Award","values":[{"value":"MVP","label":"MVP"},{"value":"Offensive Player of the year","label":"Offensive Player of the year"},{"value":"Defensive player of the year","label":"Defensive player of the year"},{"value":"Offensive Rookie of the year","label":"Offensive Rookie of the year"},{"value":"Defensive Rookie of the year","label":"Defensive Rookie of the year"},{"value":"AP Most Valuable Player","label":"AP Most Valuable Player"}]}],"resolutionRules":{},"hash":"0x7754ef4075690383fb69cf4901d6f6d363b5d24414a09f753070f5f0eaa4d64d"},{"marketType":"Categorical","question":"Which NFL Team will win: [0] vs [1], Estimated schedule start time [2]?","example":"Which NFL Team will win: NY GIants vs New England Patriots Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"Tie/No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x9959500a42c39b54c8005810f16af32cdf70d475065701bed9e3ea036a5c49bf"},{"marketType":"Categorical","question":"Which NFL Team will win: [0] vs [1], Estimated schedule start time [2]?","example":"Which NFL Team will win: Seattle Seahawks vs Dallas Cowboys Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"Tie/No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x9959500a42c39b54c8005810f16af32cdf70d475065701bed9e3ea036a5c49bf"},{"marketType":"Categorical","question":"[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"NY Giants vs Dallas Cowboys: Total points scored: Over/Under 56.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x0f79872f367831cc1dd6cae6f3f8147e5be9c6dccc6dfe863e5ab902e93cbabd"},{"marketType":"Categorical","question":"Which NFL team will win the [0] [1]?","example":"Which NFL team will win the 2020 AFC Championship game?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Superbowl","label":"Superbowl"},{"value":"AFC Championship game","label":"AFC Championship game"},{"value":"NFC Championship game","label":"NFC Championship game"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x7663b4ac659216534e2423a4ec309dd125a30dad4d6ed5a304498681e121f88f"},{"marketType":"Categorical","question":"Which NFL player will win the [0] [1] award?","example":"Which NFL player will win the 2020 Most Valuable Player award?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":0,"type":"DROPDOWN","placeholder":"Award","values":[{"value":"MVP","label":"MVP"},{"value":"Offensive Player of the year","label":"Offensive Player of the year"},{"value":"Defensive player of the year","label":"Defensive player of the year"},{"value":"Offensive Rookie of the year","label":"Offensive Rookie of the year"},{"value":"Defensive Rookie of the year","label":"Defensive Rookie of the year"},{"value":"AP Most Valuable Player","label":"AP Most Valuable Player"}]}],"resolutionRules":{},"hash":"0xe9d385a38308783a39c31ab9c9953285d1105cd9bbd28bed8ebb60c695ed9d82"},{"marketType":"Scalar","question":"Total number of wins [0] will finish [1] regular season with?","example":"Total number of wins NY Giants will finish 2019 regular season with?","denomination":"wins","tickSize":1,"inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{"REQUIRED":[{"text":"Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games"}]},"hash":"0xaa449e5f7803c06219010a2dc95a58143efb58c25e7369239922ed043ab24d85"}]},"NCAA":{"templates":[{"marketType":"YesNo","question":"Will the [0] win vs the [1], Estimated schedule start time: [2]?","example":"Will Alabama Crimson Tide win vs. Florida Gators, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0xeab1052b4013c7193e8850b8ed9d0b3259d10ee9d627725c3e2f972720e36c65"},{"marketType":"YesNo","question":"Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?","example":"Will Alabama Crimson Tide win vs. Florida Gators by 7 or more points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x01f46e7baf9c70519e1b7371d43fc9ce7585ceac40a8ef10f3449a48e0f4384b"},{"marketType":"YesNo","question":"Will [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?","example":"Will USC & UCLA score 51 or more combined points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x65e36028adccb829dcfcfacf85d8e1d75038551120da45b5e435e825faf909e4"},{"marketType":"Categorical","question":"Which College Football Team will win: [0] vs [1], Estimated schedule start time [2]?","example":"Which College Football Team will win:  Alabama vs Michigan, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":1,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"Draw/No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x96cbb6f026a6c6d66c246cde1f32b291673fccf9d300599f5b6094b16152ab6e"},{"marketType":"Categorical","question":"[0] vs [1]: Total points scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"Alabama vs Michigan: Total points scored: Over/Under 56.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0xd00bafc7a5965847d5efbb9ac9edf17c32e920d1f0fbd1b904606358e9979081"},{"marketType":"Categorical","question":"Which team will win the [0] [1]: [2] vs [3]?","example":"Which team will win the 2020 Cotton Bowl: Tennessee Volunteers vs Miami Hurricanes?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"TEXT","placeholder":"Game"},{"id":2,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":3,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x0bb5284bfebe6d84781cd622ec5cd269b2b72be1952ddd4aea872c79ecbe5d0f"},{"marketType":"Categorical","question":"Which college football team will win [0] National Championship?","example":"Which college football team will win 2020 National Championship?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x3c8f548a78ec23373e520d0c247b633d3e76ad6b1efa4859255638b7b54f1dae"},{"marketType":"Categorical","question":"Which college football player will win the [0] Heisman Trophy?","example":"Which college football player will win the 2020 Heisman Trophy?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x1184c404f1a581cd6e96ae321cc600f674298e0350590a91228d1e77160087b8"},{"marketType":"Scalar","question":"Total number of wins [0] will finish [1] regular season with?","example":"Total number of wins Michigan Wolverines will finish 2019 regular season with?","denomination":"wins","tickSize":1,"inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{"REQUIRED":[{"text":"Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games"}]},"hash":"0x58e60643299bc9ad5c47083d79ea0070c15d292e040ab5da3475a010f167b969"}]}}}}},"Politics":{"children":{"US Politics":{"templates":[{"marketType":"YesNo","question":"Will [0] win the [1] presidential election?","example":"Will Donald Trump win the 2020 Presidential election?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{},"hash":"0xdeb8b22022d58186bd7c23a7ec636281333622dbd98d456c636aa92b1e2f17a2"},{"marketType":"YesNo","question":"Will [0] win the [1] [2] presidential nomination?","example":"Will Elizabeth Warren win the 2020 Democratic Presidential nomination?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Party","values":[{"value":"Democratic","label":"Democratic"},{"value":"Republican","label":"Republican"}]}],"resolutionRules":{},"hash":"0x6dad128b22e9ad4eedc025ad88806e53bfa2aa47d13e10023a076e86b076ef67"},{"marketType":"YesNo","question":"Will [0] run for [1] by [2]?","example":"Will Oprah Winfrey run for President by December 31, 2019 1 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DROPDOWN","placeholder":"Office","values":[{"value":"President","label":"President"},{"value":"Vice-President","label":"Vice-President"},{"value":"Senator","label":"Senator"},{"value":"Congress","label":"Congress"}]},{"id":2,"type":"DATETIME","placeholder":"Specific Datetime","label":"Specific Datetime","sublabel":"Specify date time for event"}],"resolutionRules":{},"hash":"0x348652f114f18221347dea7aab5b3b761e7bdb1e01246524aea42932793f8844"},{"marketType":"YesNo","question":"Will [0] be impeached by [1]?","example":"Will Donald Trump be impeached by December 31, 2019 11:59 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DATETIME","placeholder":"Specific Datetime","label":"Specific Datetime","sublabel":"Specify date time for event"}],"resolutionRules":{},"hash":"0xf253f62b06ed8ec2a91b45c65a0c821d7cd7c8cd554eb370f292133688990d40"},{"marketType":"Categorical","question":"Who will win the [0] US presidential election?","example":"Who will win the 2020 US presidential election?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{},"hash":"0xbd84f9d9ab033ea1255777bbee883ea4f60f56999982604027f95091d6e2fc4c"},{"marketType":"Categorical","question":"Who will be the [0] [1] [2] nominee?","example":"Who will be the 2020 Republican Vice President nominee?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Party","values":[{"value":"Democratic","label":"Democratic"},{"value":"Republican","label":"Republican"}]},{"id":2,"type":"DROPDOWN","placeholder":"Office","values":[{"value":"President","label":"President"},{"value":"Vice-President","label":"Vice-President"}]}],"resolutionRules":{},"hash":"0x4adf85a8dee8e02705fb095750aa632d85219f5f1158261b7c8e93da1d6eb847"},{"marketType":"Categorical","question":"Which party will win [0] in the [1] Presidential election?","example":"Which party will win Michigan in the 2020 Presidential election?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"State","values":[{"value":"Alabama","label":"Alabama"},{"value":"Alaska","label":"Alaska"},{"value":"Arizona","label":"Arizona"},{"value":"Arkansas","label":"Arkansas"},{"value":"California","label":"California"},{"value":"Colorado","label":"Colorado"},{"value":"Connecticut","label":"Connecticut"},{"value":"Delaware","label":"Delaware"},{"value":"Florida","label":"Florida"},{"value":"Georgia","label":"Georgia"},{"value":"Hawaii","label":"Hawaii"},{"value":"Idaho","label":"Idaho"},{"value":"Illinois","label":"Illinois"},{"value":"Indiana","label":"Indiana"},{"value":"Iowa","label":"Iowa"},{"value":"Kansas","label":"Kansas"},{"value":"Kentucky","label":"Kentucky"},{"value":"Louisiana","label":"Louisiana"},{"value":"Maine","label":"Maine"},{"value":"Maryland","label":"Maryland"},{"value":"Massachusetts","label":"Massachusetts"},{"value":"Michigan","label":"Michigan"},{"value":"Minnesota","label":"Minnesota"},{"value":"Mississippi","label":"Mississippi"},{"value":"Missouri","label":"Missouri"},{"value":"Montana","label":"Montana"},{"value":"Nebraska","label":"Nebraska"},{"value":"Nevada","label":"Nevada"},{"value":"New Hampshire","label":"New Hampshire"},{"value":"New Jersey","label":"New Jersey"},{"value":"New Mexico","label":"New Mexico"},{"value":"New York","label":"New York"},{"value":"North Carolina","label":"North Carolina"},{"value":"North Dakota","label":"North Dakota"},{"value":"Ohio","label":"Ohio"},{"value":"Oklahoma","label":"Oklahoma"},{"value":"Oregon","label":"Oregon"},{"value":"Pennsylvania","label":"Pennsylvania"},{"value":"Rhode Island","label":"Rhode Island"},{"value":"South Carolina","label":"South Carolina"},{"value":"South Dakota","label":"South Dakota"},{"value":"Tennessee","label":"Tennessee"},{"value":"Texas","label":"Texas"},{"value":"Utah","label":"Utah"},{"value":"Vermont","label":"Vermont"},{"value":"Virginia","label":"Virginia"},{"value":"Washington","label":"Washington"},{"value":"West Virginia","label":"West Virginia"},{"value":"Wisconsin","label":"Wisconsin"},{"value":"Wyoming","label":"Wyoming"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{},"hash":"0xc352a41c2826a88755acecfb524829f53a2a588a291497f84a2c7e01a6003e7a"}]},"World":{"templates":[{"marketType":"YesNo","question":"Will [0] be [1] of [2] on [3]?","example":"Will Kim Jong Un be Supreme Leader of North Korea on December 31, 2019 11:59 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DROPDOWN","placeholder":"Position","values":[{"value":"President","label":"President"},{"value":"Prime Minister","label":"Prime Minister"},{"value":"Supreme Leader","label":"Supreme Leader"},{"value":"Crown Prince","label":"Crown Prince"},{"value":"Chancellor","label":"Chancellor"},{"value":"Chief minister","label":"Chief minister"}]},{"id":2,"type":"TEXT","placeholder":"Location"},{"id":3,"type":"DATETIME","placeholder":"Specific Datetime","label":"Specific Datetime","sublabel":"Specify date time for event"}],"resolutionRules":{},"hash":"0xb77b581429a42885f4f7824c5afee85169bd44c447d03dcf569f6902c7031e1c"},{"marketType":"YesNo","question":"Will [0] be impeached by [1]?","example":"Will Benjamin Netanyahu be impeached be December 31, 2019 11:59 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DATETIME","placeholder":"Specific Datetime","label":"Specific Datetime","sublabel":"Specify date time for event"}],"resolutionRules":{},"hash":"0xf253f62b06ed8ec2a91b45c65a0c821d7cd7c8cd554eb370f292133688990d40"}]}}},"Finance":{"children":{"Stocks":{"templates":[{"marketType":"YesNo","question":"Will the price of [0] close on or above [1] [2] on the [3] on [4]?","example":"Will the price of AAPL close on or above $200 USD on the Nasdaq on September 1, 2020?","inputs":[{"id":0,"type":"TEXT","placeholder":"Stock"},{"id":1,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":2,"type":"DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":3,"type":"TEXT","placeholder":"Exchange"},{"id":4,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xd9de3a11f1f02a46171162497945f59d52dfdaa3719b178d41a87984acd506ef"},{"marketType":"YesNo","question":"Will the price of [0], exceed [1] [2] on the [3], anytime between the opening on [4] and the close on [5]?","example":"Will the price of AAPL exceed $250 USD on the Nasdaq anytime between the opening on June 1, 2020 and the close on September 1, 2020?","inputs":[{"id":0,"type":"TEXT","placeholder":"Stock"},{"id":1,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":2,"type":"DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":3,"type":"TEXT","placeholder":"Exchange"},{"id":4,"type":"DATEYEAR","placeholder":"Start Day of Year"},{"id":5,"type":"DATEYEAR","placeholder":"End Day of Year"}],"resolutionRules":{},"hash":"0x1f89ce2ea9c9226f5f62bbafdac836348bd3d15408b85922cd35f61e410c50c8"},{"marketType":"Scalar","question":"What price will [0] close at in [1] on the [2] on [3]?","example":"What price will AAPL close at in USD on the Nasdaq on December 31, 2019?","denomination":"[Denomination]","inputs":[{"id":0,"type":"TEXT","placeholder":"Stock"},{"id":1,"type":"DENOMINATION_DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":2,"type":"TEXT","placeholder":"Exchange"},{"id":3,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x17828784ae9bde9227049d98e5beb39e504a95c6f6c361d1bdcd71b7a644da69"}]},"Indexes":{"templates":[{"marketType":"YesNo","question":"Will the [0] close on or above [1] [2] on [3]?","example":"Will the Dow Jones Industrial Average close on or above $27,100.00 USD on September 20, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Index"},{"id":1,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":2,"type":"DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":3,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xb6e484281ed46cf147c96b36957ee9a4f5c8d1fd6d42bf762cd2f2e6675eb9d7"},{"marketType":"Scalar","question":"What price will the [0] close at in [1] on [2]?","example":"What Price will the S&P 500 close at in USD on December 31, 2019?","denomination":"[Denomination]","inputs":[{"id":0,"type":"TEXT","placeholder":"Index"},{"id":1,"type":"DENOMINATION_DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xa4fe1fe1a2fda0d0ade09a83521bd3f1ebfcadf5e0af977d1535d56bd9f7ed6b"}]}}},"Entertainment":{"templates":[{"marketType":"YesNo","question":"Will [0] host the [1] [2]?","example":"Will Billy Crystal host the 2019 Academy Awards?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person Name"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Academy Awards","label":"Academy Awards"},{"value":"Emmy Awards","label":"Emmy Awards"},{"value":"Grammy Awards","label":"Grammy Awards"},{"value":"Golden Globe Awards","label":"Golden Globe Awards"}]}],"resolutionRules":{"REQUIRED":[{"text":"If more than one person hosts the event, and the person named in the market is one of the multiple hosts, the market should resolve as \"Yes\""}]},"hash":"0xcfe6fe6434562550b65929dc64ed4eeab1f4876da9f7ab059bf1a59ae227d34a"},{"marketType":"YesNo","question":"Will [0] win an award for [1] at the [2] [3]?","example":"Will Leonardo DiCaprio win an award for Best Actor at the 2016 Academy Awards?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person Name"},{"id":1,"type":"TEXT","placeholder":"Award"},{"id":2,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":3,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Academy Awards","label":"Academy Awards"},{"value":"Emmy Awards","label":"Emmy Awards"},{"value":"Grammy Awards","label":"Grammy Awards"},{"value":"Golden Globe Awards","label":"Golden Globe Awards"}]}],"resolutionRules":{},"hash":"0x8a52880f1b1ac9fd98e65f70810bffda872adb1baeac2552de49039cc0c7b2ac"},{"marketType":"YesNo","question":"Will [0] win an award for [1] at the [2] [3]?","example":"Will Spotlight win an award for Best Picture at the 2016 Academy Awards?","inputs":[{"id":0,"type":"TEXT","placeholder":"Movie Name"},{"id":1,"type":"TEXT","placeholder":"Award"},{"id":2,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":3,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Academy Awards","label":"Academy Awards"},{"value":"Emmy Awards","label":"Emmy Awards"},{"value":"Grammy Awards","label":"Grammy Awards"},{"value":"Golden Globe Awards","label":"Golden Globe Awards"}]}],"resolutionRules":{},"hash":"0x9c191394b902dd8fe9c0cea5e882b813fd692d859f84009c6463898c002b4dd3"},{"marketType":"YesNo","question":"Will [0] gross [1] [2] or more, in it's opening weekend [3]?","example":"Will Avangers: Endgame gross $350 million USD or more in it's opening weekend in the US?","inputs":[{"id":0,"type":"TEXT","placeholder":"Movie Name"},{"id":1,"type":"TEXT","placeholder":"Amount"},{"id":2,"type":"DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":3,"type":"DROPDOWN","placeholder":"US / Worldwide","values":[{"value":"US (United States)","label":"US (United States)"},{"value":"Worldwide","label":"Worldwide"}]}],"resolutionRules":{"REQUIRED":[{"text":"Gross total should include 4-day weekend in if it is a holiday weekend"}]},"hash":"0xbc55fd68f51201504da6f0c2b0f2b4ff43b95d67f38c6cf2fec9a74d3d6131fc"},{"marketType":"Categorical","question":"Who will host the [0] [1]?","example":"Who wll host the 2020 Emmy Awards?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Academy Awards","label":"Academy Awards"},{"value":"Emmy Awards","label":"Emmy Awards"},{"value":"Grammy Awards","label":"Grammy Awards"},{"value":"Golden Globe Awards","label":"Golden Globe Awards"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Multiple Hosts"}],"resolutionRules":{"REQUIRED":[{"text":"The market should resolve as \"multiple hosts\" if more than one of the possible outcomes hosts the event. If only one of the potential outcomes hosts with multiple people, then the individual outcome would be the winner."}]},"hash":"0x5f112405a856dfb2f93c33109b682ad2d1c059804662094a92e842345fd3250f"},{"marketType":"Categorical","question":"Who will win for [0] in the [1] [2]?","example":"Who will win for Best Pop Vocal Album in the 2020 Grammy Awards?","inputs":[{"id":0,"type":"TEXT","placeholder":"Award"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Academy Awards","label":"Academy Awards"},{"value":"Emmy Awards","label":"Emmy Awards"},{"value":"Grammy Awards","label":"Grammy Awards"},{"value":"Golden Globe Awards","label":"Golden Globe Awards"}]}],"resolutionRules":{},"hash":"0x5e4fcc48b32cf9aaf4b02a975678a8d23bb69db1be75c898bcaa23f3c3082c28"}]},"Crypto":{"children":{"Bitcoin":{"children":{"USD":{"templates":[{"marketType":"YesNo","question":"Will the price of BTC close on or above [0] USD on [1] on [2]?","example":"Will the price of BTC close on or above $200 USD on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xa83363e930e8f4baaa69efed022f695a57346b2835c0c9eed6110086b2425e3a"},{"marketType":"YesNo","question":"Will the price of BTC, exceed [0] USD, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of BTC exceed $40 USD on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0xe7ed26924cafc11ef163f1ee77193e585b9155a72c461840bc21f95dc8bbfb00"},{"marketType":"Scalar","question":"What price will BTC close at in USD on [0] on [1]?","example":"What price will BTC close at in USD on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x0a7e8b4f8f049f5f3ba017dad796489c8347cf0101a6075b0a2d4a4a868703cc"}]},"USDT":{"templates":[{"marketType":"YesNo","question":"Will the price of BTC close on or above [0] USDT on [1] on [2]?","example":"Will the price of BTC close on or above $200 USDT on Binance (binance.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x50ad89fe500293a1e03061db66dcedc432ea431679b6bf9e5c8c5a892b98b0f8"},{"marketType":"YesNo","question":"Will the price of BTC, exceed [0] USDT, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of BTC exceed $40 USDT on Binance (binance.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0xf110f2d91eb350544ad77a63691e7b12cd87044c7e27046a264951de872a29fb"},{"marketType":"Scalar","question":"What price will BTC close at in USDT on [0] on [1]?","example":"What price will BTC close at in USDT on December 31, 2019 on Binance (binance.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x3f8219ca19ecacdeef573e6c87e210f26ab13a99855beca20ab86c31583e380f"}]},"EUR":{"templates":[{"marketType":"YesNo","question":"Will the price of BTC close on or above [0] EUR on [1] on [2]?","example":"Will the price of BTC close on or above $200 EUR on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xbcf2185d668d0349fc2c8e065af79325b9539ae226ce4a38ff0822c301a9a5df"},{"marketType":"YesNo","question":"Will the price of BTC, exceed [0] EUR, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of BTC exceed $40 EUR on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0x017fe619025a9220cea5d8f523d36dc0306009b3d2b2d397ff082d3965942799"},{"marketType":"Scalar","question":"What price will BTC close at in EUR on [0] on [1]?","example":"What price will BTC close at in EUR on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x16abad4e0fa13a0ca496d755ee8ab3a2aa750bd2e79d6f3fb0b03773d9a61212"}]}}},"Ethereum":{"children":{"USD":{"templates":[{"marketType":"YesNo","question":"Will the price of ETH close on or above [0] USD on [1] on [2]?","example":"Will the price of ETH close on or above $200 USD on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x5113e7945335610ff817caa38b88078a153e6bfcbea2b0b6339ba3a7747a166a"},{"marketType":"YesNo","question":"Will the price of ETH, exceed [0] USD, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of ETH exceed $40 USD on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0x6c6849a4ddc5f9ac6568fc1249227a25fe68637b2935456170b33351d75b678e"},{"marketType":"Scalar","question":"What price will ETH close at in USD on [0] on [1]?","example":"What price will ETH close at in USD on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xf71a29a28ad8451b3229c2906e4a4fa562d61d9bc6c327c15ba472449250e431"}]},"USDT":{"templates":[{"marketType":"YesNo","question":"Will the price of ETH close on or above [0] USDT on [1] on [2]?","example":"Will the price of ETH close on or above $200 USDT on Binance (binance.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x269618c5abcdff3fcd262d2f70bff2943f87813e301202983b623a37e580a861"},{"marketType":"YesNo","question":"Will the price of ETH, exceed [0] USDT, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of ETH exceed $40 USDT on Binance (binance.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0x58e3b0341ee34d151a8587a17bfcfff875fb163a95c55692ce9aedc09f46063b"},{"marketType":"Scalar","question":"What price will ETH close at in USDT on [0] on [1]?","example":"What price will ETH close at in USDT on December 31, 2019 on Binance (binance.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xfcf28d9720dfcd0950e89c0c77e74195bbd88882139d3ecb2bbeb322ab6ce76c"}]},"EUR":{"templates":[{"marketType":"YesNo","question":"Will the price of ETH close on or above [0] EUR on [1] on [2]?","example":"Will the price of ETH close on or above $200 EUR on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x05acbcddc96803dc0647d5d85f7b3c3e77f3d131b0a63c35742f24122e809c1c"},{"marketType":"YesNo","question":"Will the price of ETH, exceed [0] EUR, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of ETH exceed $40 EUR on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0xca0c52e5b00a0718210aca812b7d6aae373fa8c39dbc36c4e6c3d209d5dd5f6e"},{"marketType":"Scalar","question":"What price will ETH close at in EUR on [0] on [1]?","example":"What price will ETH close at in EUR on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xcce8901a89ddbbe34d5fe12d35f2872fa449cf217354dba2a59faed92421e7c3"}]}}},"Litecoin":{"children":{"USD":{"templates":[{"marketType":"YesNo","question":"Will the price of LTC close on or above [0] USD on [1] on [2]?","example":"Will the price of LTC close on or above $200 USD on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xde7516aac3f788601861cb8b45b9dbc28906fcc19cfaadc8536ac8a1b4a2e07c"},{"marketType":"YesNo","question":"Will the price of LTC, exceed [0] USD, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of LTC exceed $40 USD on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0xb4ab9d8231a4d4ff0cebff6d7e9c84ac47e790d64292b133d324bffbe0c2d77f"},{"marketType":"Scalar","question":"What price will LTC close at in USD on [0] on [1]?","example":"What price will LTC close at in USD on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xa21144083fca0007131bfd8d6fc66f99db9aa53cccbc124e4d62eb6b3fa46fca"}]},"USDT":{"templates":[{"marketType":"YesNo","question":"Will the price of LTC close on or above [0] USDT on [1] on [2]?","example":"Will the price of LTC close on or above $200 USDT on Binance (binance.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x67e3b611d58b1ac5484a9a7eb38ce45a039068221502cc2f756dbc4b3dd37664"},{"marketType":"YesNo","question":"Will the price of LTC, exceed [0] USDT, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of LTC exceed $40 USDT on Binance (binance.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0x95f1202347e998c1e1d06fdfaa8d545ce1dafe0abbafd086d0f5545a01c585a3"},{"marketType":"Scalar","question":"What price will LTC close at in USDT on [0] on [1]?","example":"What price will LTC close at in USDT on December 31, 2019 on Binance (binance.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x5642852ac7f4e3917cedf917122bf40bbd2537fb4a907a9a719675946f713914"}]},"EUR":{"templates":[{"marketType":"YesNo","question":"Will the price of LTC close on or above [0] EUR on [1] on [2]?","example":"Will the price of LTC close on or above $200 EUR on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x5dca49ab00526b98a92654e1edcf6b6750d200421ab32ecd050420de384aa9d0"},{"marketType":"YesNo","question":"Will the price of LTC, exceed [0] EUR, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of LTC exceed $40 EUR on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0xa9c14421579b7ba1e8e8d22bfb6178cc3953fddd118f76bf3a4fe4b80c5ca897"},{"marketType":"Scalar","question":"What price will LTC close at in EUR on [0] on [1]?","example":"What price will LTC close at in EUR on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x2b18091a3114d128813eeb98eaec41db957209083ef7d8c07c5471968b42fabc"}]}}}}}}


export const TEMPLATE_VALIDATIONS = {"0xb11764bcd6054968fa75a3b0fd55aa7031101315321edcbfb200f869cf66b6ee":{"templateValidation":"Will (.*) win the (2019|2020|2021|2022) (Australian Open|French Open|Wimbledon|US Open)?"},"0xc9d0483f3d82cf535c9e58fc9e190bc4c507950dc28609df31c27ee58b42694f":{"templateValidation":"Will (.*) make the cut at the (2019|2020|2021|2022) (PGA Championship|Open Championship|US Open|Masters Tournament|British Open)?"},"0x084b594dc549099e066b9733e9bb1c4ef5067851b8bb08d7733614e484e09369":{"templateValidation":"Which golfer will win the (2019|2020|2021|2022) (PGA Championship|Open Championship|US Open|Masters Tournament|British Open)?"},"0xea0b6b5eb2e16392fd2b17bb7f0c761b13e7b40a35d87e7702109dc7a0a6bbbd":{"templateValidation":"Will the (.*) win vs the (.*), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x6e8b9ded9bc2706356452eba9682ae7c0eae61f067a6311e015bcdc739b674a7":{"templateValidation":"Will the (.*) & (.*) score (.*) or more combined goals, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x2240793e8bc7080ec1f2489b82fe33cb3c3e5d06defd9752681996498a7a2620":{"templateValidation":"Will the (.*) win the (2019-20|2020-21|2021-22) Stanley Cup?"},"0xc828397abfe32a946d82e4a605f465a979dcb698f8846ba4d759b8aad1427ed5":{"templateValidation":"Which team will win: (.*) vs (.*), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x8046e1128dc30571a3c8680c40927b4cde8e3d0af9ae05e678d1b722f2099fbe":{"templateValidation":"(.*) vs (.*): Total goals scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xf0cae533cd96f75ef69a4a184faa958d043e3c992eb7538bca7649cf6911ecb0":{"templateValidation":"Which NHL team will win the (2019-20|2020-21|2021-22) Stanley Cup?"},"0x5725d708831ed60c02f8444e17dc9ef3942ee173e0f8b2ac6b5b6897eb33aaf7":{"templateValidation":"Which NHL player will win the (2019-20|2020-21|2021-22) (Hart Trophy|Norris Trophy|Vezina Trophy|Calder Trophy)?"},"0xa1dfe1a7dcc8af56aed57c3dc0be4520854c4d6c94946f0a6d5a4a512b293536":{"templateValidation":"Total number of wins the (.*) will finish (2019-20|2020-21|2021-22) regular season with?"},"0x47f523be60c55370df2f8e4ab3f65d318b8587e49c9c368eb478b61391694989":{"templateValidation":"Will (.*) win the (2019|2020|2021|2022) (Kentucky Derby|Preakness|Belmont|Triple Crown)?"},"0x51fd7be9de99ec8e30a2ebf075a4c289ed3ad9a2591e5d5d9ac7444b01e99d32":{"templateValidation":"Which horse will win the (2019|2020|2021|2022) (Kentucky Derby|Preakness|Belmont|Triple Crown)?"},"0x743293ce0547a7accfa5da5699a43068ebaaba4bb9e49fee792e177a508f5656":{"templateValidation":"Which tennis player will win the (2019|2020|2021|2022) (Australian Open|French Open|Wimbledon|US Open)?"},"0x70acee7e8aca7b038bf26ecf4904718906ac5298679e019ddee895b579280196":{"templateValidation":"(2019|2020|2021|2022) (Australian Open|French Open|Wimbledon|US Open) Match play winner: (.*) vs (.*)?"},"0x51a17bd92fdf4aaf4035b9df4e9e9daf7ad500dfcb1eeac8c75367e9b2cd2f2d":{"templateValidation":"Which team will win: (.*) vs (.*), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xa4abe419a906aca7784b996baeca43cbcb3042d7f8ae13a2f40f883842e06e42":{"templateValidation":"(.*) vs (.*): Total goals scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x7732e4cff79bc21ed270bd720c914c0aa12d683258541200b634babf1e38d4cf":{"templateValidation":"Will the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) win vs the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x3fce5e6f6f8aa4cf99aef2dab47e76e3b58e71f4ec4a60011342f54ec1c405de":{"templateValidation":"Will the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) win vs the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) by (.*) or more points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x1d07150af31e64a68aade0c85cc351f754154383d38fb74d9f9473478b77adb8":{"templateValidation":"Will the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) & (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) score (.*) or more combined points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x761d3707d55b48235d0296198c1158ed21cd69dcf39430afb9a0aa55bf004d1b":{"templateValidation":"Will the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) win the (2019-20|2020-21|2021-22) NBA Championship?"},"0x2e79389570ac2cd9030e0bbbab6d2ae924ee66c22dcc19745a41d30cfe57667a":{"templateValidation":"Will (.*) win the (2019-20|2020-21|2021-22) (Most Valuable Player|Rookie of the year|6th Man|Defensive Player of the Year|Most Improved player) award?"},"0x9db7819dfeabbeccd25962cc2c85865c64dd0bff75aa7e8c2b5a25f3ef1f7a0b":{"templateValidation":"Which team will win: [0] vs [1], Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x0d92f11622849ead67f48a71714cf329c99cf639418fbda14aa200b85c70c2bb":{"templateValidation":"(Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) vs (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards): Total Points scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xc1a1b03edab906931d6bc54cdbb12d5d0b39b13ad2d1ed673ab9bece4a059fc2":{"templateValidation":"Which NBA team will win the (2019-20|2020-21|2021-22) (Eastern Conference Finals|Western Conference Finals|NBA Championship)?"},"0x684bf2baaf987ab313a90c2fdb0ab1d718a961ae0f14691087326cc1eb32538d":{"templateValidation":"Which NBA player will win the (2019-20|2020-21|2021-22) (Most Valuable Player|Rookie of the year|6th Man|Defensive Player of the Year|Most Improved player) award?"},"0x1656ff772320d996cb27d1818527097e626c0232931b349a3c42641ada816b29":{"templateValidation":"Which Player will have the most (Points Scored|Rebounds|Assists|made 3-pointers) at the end of the the (2019-20|2020-21|2021-22) regular season?"},"0x4956280754a3192bb93a85dbb35830ee4645ff8da99caac5a198ea16f5895a55":{"templateValidation":"Total number of wins (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) will finish (2019-20|2020-21|2021-22) regular season with?"},"0x1d85cf567b88ecd10432c9e3475281a7c6103b6461a9b3957d97272fe260ab68":{"templateValidation":"Will (.*) win vs (.*); (Men's|Women's) basketball, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xb780cc879bbb1096fd1a3e8fb679f8a397306cd3575a4a3304c9b0e7a81ae643":{"templateValidation":"Will (.*) win vs (.*) by (.*) or more points, (Men's|Women's) basketball, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x3258d36deb4c932ef1bc8670d9b5e249d624752be59f723784d851017eabfaf7":{"templateValidation":"Will (.*) & (.*) score (.*) or more combined points; (Men's|Women's) basketball, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xa6394443c2eea97ca78e877e2b020f521ed40edecc9bf3aa53eda8944b920b18":{"templateValidation":"Will (.*) win the (2019|2020|2021|2022) NCAA (Men's|Women's) National Championship?"},"0xc4131e424bd11f52e2da28eec9b88bcf2ad85fb09241ac23f84ba28f158118a0":{"templateValidation":"Will (.*) make the (2019|2020|2021|2022) (Men's|Women's) (NCAA Tournament|Sweet 16|Elite 8|Final Four)?"},"0xc4c90502bd7e77b8810381e781ba1a76a306bd5c3d075281764da2d812443f3f":{"templateValidation":"Which team will win: (.*) vs (.*), (Men's|Women's) basketball, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x760dd0987edaaf13d9aa81a39ae1182a756bf427c4e8d3da668c60ab9b56c1ec":{"templateValidation":"(Men's|Women's) basketball; (.*) vs (.*): Total Points scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x16c586f8848bf4d4e3c0802d45313db649ebee293f3b660f916af92ab193044e":{"templateValidation":"Which college basketball team will win the (Men's|Women's) (2019|2020|2021|2022) (American East|American|Atlantic 10|ACC|Atlantic Sun|Big 12|Big East|Big Sky|Big South|Big Ten|Big West|Colonial|Conference USA|Horizon|Ivy|MAAC|Mid-American|MEAC|Missouri Valley|Mountain West|Northeast|Ohio Valley|Pac-12|Patriot League|SEC|Southern|Southland|SWAC|Summit League|Sun Belt|West Coast|WAC) tournament?"},"0x58bdcffd6a31d16291b30acd27adf152f62ca509799561e88f8ee6f4e4bed643":{"templateValidation":"Will the (.*) win the (2019|2020|2021|2022) (American League Division Series|National League Division Series|American League Championship Series|National League Championship Series|World Series)?"},"0xda3c949f84da9f47840bca587e8097b75bf6a9b370e8bb6c2b1889ca9bf68509":{"templateValidation":"Which team will win: (.*) vs (.*), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x3aa9d1c31aad6b7f700fd72aa31571ced7453ed8491bdbb5c1105b07634ba518":{"templateValidation":"Which MLB team will win the (2019|2020|2021|2022) (American League Division Series|National League Division Series|American League Championship Series|National League Championship Series|World Series)?"},"0x5a9e16ed367462965c09f7f897e14fc7f26fa997094f924539b4a4faac8bfe8d":{"templateValidation":"(.*) vs (.*): Total Runs scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x0c7bc8c8af0908e86dfd6cc9da40a1c7f21f05611d550ab6147590d980a45879":{"templateValidation":"Which player will win the (2019|2020|2021|2022) (American League Division Series|National League Division Series|American League Championship Series|National League Championship Series|World Series)?"},"0x68d6e07c814f11f54edc9e4585ac696cb3e732f0398ac339be3e5a652b46d742":{"templateValidation":"Total number of wins the (.*) will finish the (2019|2020|2021|2022) regular season with?"},"0x72e6654de12c0d25496c4699f21b8071a1718ae5142faccbdf1202ba2cb6d69e":{"templateValidation":"Will the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) win vs the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x431bb08039e6ce1acb72c56f80be886836ca253fbdf6ecfff384c0483c2e1e9d":{"templateValidation":"Will the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) win vs the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) by (.*) or more points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x1359b0cf7cd2cb0e949726de1725ff88b2b09987d67f7581d784ab7ab56d34f3":{"templateValidation":"Will the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) & (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) score (.*) or more combined points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xc55df05a57f25aff625202bd2658c866ae7043c741a258e061130736b326bbdd":{"templateValidation":"Will the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) have (.*) or more regular season wins in (2019|2020|2021|2022)?"},"0xfb3e93db226b63ef67738b2e6a16e2ed32e1e8951e6d7ebddea07bf96b91a3a2":{"templateValidation":"Will the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) win SuperBowl (.*)?"},"0x7754ef4075690383fb69cf4901d6f6d363b5d24414a09f753070f5f0eaa4d64d":{"templateValidation":"Will (.*) win the (2019-20|2020-21|2021-22) (MVP|Offensive Player of the year|Defensive player of the year|Offensive Rookie of the year|Defensive Rookie of the year|AP Most Valuable Player) award?"},"0x9959500a42c39b54c8005810f16af32cdf70d475065701bed9e3ea036a5c49bf":{"templateValidation":"Which NFL Team will win: [0] vs [1], Estimated schedule start time (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x0f79872f367831cc1dd6cae6f3f8147e5be9c6dccc6dfe863e5ab902e93cbabd":{"templateValidation":"(Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) vs (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins): Total goals scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x7663b4ac659216534e2423a4ec309dd125a30dad4d6ed5a304498681e121f88f":{"templateValidation":"Which NFL team will win the (2019|2020|2021|2022) (Superbowl|AFC Championship game|NFC Championship game)?"},"0xe9d385a38308783a39c31ab9c9953285d1105cd9bbd28bed8ebb60c695ed9d82":{"templateValidation":"Which NFL player will win the (2019|2020|2021|2022) [1] award?"},"0xaa449e5f7803c06219010a2dc95a58143efb58c25e7369239922ed043ab24d85":{"templateValidation":"Total number of wins (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) will finish (2019|2020|2021|2022) regular season with?"},"0xeab1052b4013c7193e8850b8ed9d0b3259d10ee9d627725c3e2f972720e36c65":{"templateValidation":"Will the (.*) win vs the (.*), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x01f46e7baf9c70519e1b7371d43fc9ce7585ceac40a8ef10f3449a48e0f4384b":{"templateValidation":"Will the (.*) win vs the (.*) by (.*) or more points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x65e36028adccb829dcfcfacf85d8e1d75038551120da45b5e435e825faf909e4":{"templateValidation":"Will (.*) & (.*) score (.*) or more combined points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x96cbb6f026a6c6d66c246cde1f32b291673fccf9d300599f5b6094b16152ab6e":{"templateValidation":"Which College Football Team will win: (.*) vs (.*), Estimated schedule start time (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xd00bafc7a5965847d5efbb9ac9edf17c32e920d1f0fbd1b904606358e9979081":{"templateValidation":"(.*) vs (.*): Total points scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x0bb5284bfebe6d84781cd622ec5cd269b2b72be1952ddd4aea872c79ecbe5d0f":{"templateValidation":"Which team will win the (2019|2020|2021|2022) (.*): (.*) vs (.*)?"},"0x3c8f548a78ec23373e520d0c247b633d3e76ad6b1efa4859255638b7b54f1dae":{"templateValidation":"Which college football team will win (2019|2020|2021|2022) National Championship?"},"0x1184c404f1a581cd6e96ae321cc600f674298e0350590a91228d1e77160087b8":{"templateValidation":"Which college football player will win the (2019|2020|2021|2022) Heisman Trophy?"},"0x58e60643299bc9ad5c47083d79ea0070c15d292e040ab5da3475a010f167b969":{"templateValidation":"Total number of wins (.*) will finish (2019|2020|2021|2022) regular season with?"},"0xdeb8b22022d58186bd7c23a7ec636281333622dbd98d456c636aa92b1e2f17a2":{"templateValidation":"Will (.*) win the (2019|2020|2021|2022) presidential election?"},"0x6dad128b22e9ad4eedc025ad88806e53bfa2aa47d13e10023a076e86b076ef67":{"templateValidation":"Will (.*) win the (2019|2020|2021|2022) (Democratic|Republican) presidential nomination?"},"0x348652f114f18221347dea7aab5b3b761e7bdb1e01246524aea42932793f8844":{"templateValidation":"Will (.*) run for (President|Vice-President|Senator|Congress) by (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xf253f62b06ed8ec2a91b45c65a0c821d7cd7c8cd554eb370f292133688990d40":{"templateValidation":"Will (.*) be impeached by (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xbd84f9d9ab033ea1255777bbee883ea4f60f56999982604027f95091d6e2fc4c":{"templateValidation":"Who will win the (2019|2020|2021|2022) US presidential election?"},"0x4adf85a8dee8e02705fb095750aa632d85219f5f1158261b7c8e93da1d6eb847":{"templateValidation":"Who will be the (2019|2020|2021|2022) (Democratic|Republican) (President|Vice-President) nominee?"},"0xc352a41c2826a88755acecfb524829f53a2a588a291497f84a2c7e01a6003e7a":{"templateValidation":"Which party will win (Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming) in the (2019|2020|2021|2022) Presidential election?"},"0xb77b581429a42885f4f7824c5afee85169bd44c447d03dcf569f6902c7031e1c":{"templateValidation":"Will (.*) be (President|Prime Minister|Supreme Leader|Crown Prince|Chancellor|Chief minister) of (.*) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xd9de3a11f1f02a46171162497945f59d52dfdaa3719b178d41a87984acd506ef":{"templateValidation":"Will the price of (.*) close on or above (.*) (US dollar (USD)|Euro (EUR)|Chinese yuan (CNY)|British pound (GBP)|Australian dollar (AUD)|Canadian dollar (CAD)|Swiss franc (CHF)) on the (.*) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x1f89ce2ea9c9226f5f62bbafdac836348bd3d15408b85922cd35f61e410c50c8":{"templateValidation":"Will the price of (.*), exceed (.*) (US dollar (USD)|Euro (EUR)|Chinese yuan (CNY)|British pound (GBP)|Australian dollar (AUD)|Canadian dollar (CAD)|Swiss franc (CHF)) on the (.*), anytime between the opening on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and the close on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x17828784ae9bde9227049d98e5beb39e504a95c6f6c361d1bdcd71b7a644da69":{"templateValidation":"What price will (.*) close at in [1] on the (.*) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xb6e484281ed46cf147c96b36957ee9a4f5c8d1fd6d42bf762cd2f2e6675eb9d7":{"templateValidation":"Will the (.*) close on or above (.*) (US dollar (USD)|Euro (EUR)|Chinese yuan (CNY)|British pound (GBP)|Australian dollar (AUD)|Canadian dollar (CAD)|Swiss franc (CHF)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xa4fe1fe1a2fda0d0ade09a83521bd3f1ebfcadf5e0af977d1535d56bd9f7ed6b":{"templateValidation":"What price will the (.*) close at in [1] on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xcfe6fe6434562550b65929dc64ed4eeab1f4876da9f7ab059bf1a59ae227d34a":{"templateValidation":"Will (.*) host the (2019|2020|2021|2022) (Academy Awards|Emmy Awards|Grammy Awards|Golden Globe Awards)?"},"0x8a52880f1b1ac9fd98e65f70810bffda872adb1baeac2552de49039cc0c7b2ac":{"templateValidation":"Will (.*) win an award for (.*) at the (2019|2020|2021|2022) (Academy Awards|Emmy Awards|Grammy Awards|Golden Globe Awards)?"},"0x9c191394b902dd8fe9c0cea5e882b813fd692d859f84009c6463898c002b4dd3":{"templateValidation":"Will (.*) win an award for (.*) at the (2019|2020|2021|2022) (Academy Awards|Emmy Awards|Grammy Awards|Golden Globe Awards)?"},"0xbc55fd68f51201504da6f0c2b0f2b4ff43b95d67f38c6cf2fec9a74d3d6131fc":{"templateValidation":"Will (.*) gross (.*) (US dollar (USD)|Euro (EUR)|Chinese yuan (CNY)|British pound (GBP)|Australian dollar (AUD)|Canadian dollar (CAD)|Swiss franc (CHF)) or more, in it's opening weekend (US (United States)|Worldwide)?"},"0x5f112405a856dfb2f93c33109b682ad2d1c059804662094a92e842345fd3250f":{"templateValidation":"Who will host the (2019|2020|2021|2022) (Academy Awards|Emmy Awards|Grammy Awards|Golden Globe Awards)?"},"0x5e4fcc48b32cf9aaf4b02a975678a8d23bb69db1be75c898bcaa23f3c3082c28":{"templateValidation":"Who will win for (.*) in the (2019|2020|2021|2022) (Academy Awards|Emmy Awards|Grammy Awards|Golden Globe Awards)?"},"0xa83363e930e8f4baaa69efed022f695a57346b2835c0c9eed6110086b2425e3a":{"templateValidation":"Will the price of BTC close on or above (.*) USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xe7ed26924cafc11ef163f1ee77193e585b9155a72c461840bc21f95dc8bbfb00":{"templateValidation":"Will the price of BTC, exceed (.*) USD, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Bittrex (bittrex.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x0a7e8b4f8f049f5f3ba017dad796489c8347cf0101a6075b0a2d4a4a868703cc":{"templateValidation":"What price will BTC close at in USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x50ad89fe500293a1e03061db66dcedc432ea431679b6bf9e5c8c5a892b98b0f8":{"templateValidation":"Will the price of BTC close on or above (.*) USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xf110f2d91eb350544ad77a63691e7b12cd87044c7e27046a264951de872a29fb":{"templateValidation":"Will the price of BTC, exceed (.*) USDT, on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x3f8219ca19ecacdeef573e6c87e210f26ab13a99855beca20ab86c31583e380f":{"templateValidation":"What price will BTC close at in USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xbcf2185d668d0349fc2c8e065af79325b9539ae226ce4a38ff0822c301a9a5df":{"templateValidation":"Will the price of BTC close on or above (.*) EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x017fe619025a9220cea5d8f523d36dc0306009b3d2b2d397ff082d3965942799":{"templateValidation":"Will the price of BTC, exceed (.*) EUR, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x16abad4e0fa13a0ca496d755ee8ab3a2aa750bd2e79d6f3fb0b03773d9a61212":{"templateValidation":"What price will BTC close at in EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x5113e7945335610ff817caa38b88078a153e6bfcbea2b0b6339ba3a7747a166a":{"templateValidation":"Will the price of ETH close on or above (.*) USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x6c6849a4ddc5f9ac6568fc1249227a25fe68637b2935456170b33351d75b678e":{"templateValidation":"Will the price of ETH, exceed (.*) USD, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xf71a29a28ad8451b3229c2906e4a4fa562d61d9bc6c327c15ba472449250e431":{"templateValidation":"What price will ETH close at in USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x269618c5abcdff3fcd262d2f70bff2943f87813e301202983b623a37e580a861":{"templateValidation":"Will the price of ETH close on or above (.*) USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x58e3b0341ee34d151a8587a17bfcfff875fb163a95c55692ce9aedc09f46063b":{"templateValidation":"Will the price of ETH, exceed (.*) USDT, on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xfcf28d9720dfcd0950e89c0c77e74195bbd88882139d3ecb2bbeb322ab6ce76c":{"templateValidation":"What price will ETH close at in USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x05acbcddc96803dc0647d5d85f7b3c3e77f3d131b0a63c35742f24122e809c1c":{"templateValidation":"Will the price of ETH close on or above (.*) EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xca0c52e5b00a0718210aca812b7d6aae373fa8c39dbc36c4e6c3d209d5dd5f6e":{"templateValidation":"Will the price of ETH, exceed (.*) EUR, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xcce8901a89ddbbe34d5fe12d35f2872fa449cf217354dba2a59faed92421e7c3":{"templateValidation":"What price will ETH close at in EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xde7516aac3f788601861cb8b45b9dbc28906fcc19cfaadc8536ac8a1b4a2e07c":{"templateValidation":"Will the price of LTC close on or above (.*) USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xb4ab9d8231a4d4ff0cebff6d7e9c84ac47e790d64292b133d324bffbe0c2d77f":{"templateValidation":"Will the price of LTC, exceed (.*) USD, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xa21144083fca0007131bfd8d6fc66f99db9aa53cccbc124e4d62eb6b3fa46fca":{"templateValidation":"What price will LTC close at in USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x67e3b611d58b1ac5484a9a7eb38ce45a039068221502cc2f756dbc4b3dd37664":{"templateValidation":"Will the price of LTC close on or above (.*) USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x95f1202347e998c1e1d06fdfaa8d545ce1dafe0abbafd086d0f5545a01c585a3":{"templateValidation":"Will the price of LTC, exceed (.*) USDT, on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x5642852ac7f4e3917cedf917122bf40bbd2537fb4a907a9a719675946f713914":{"templateValidation":"What price will LTC close at in USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x5dca49ab00526b98a92654e1edcf6b6750d200421ab32ecd050420de384aa9d0":{"templateValidation":"Will the price of LTC close on or above (.*) EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xa9c14421579b7ba1e8e8d22bfb6178cc3953fddd118f76bf3a4fe4b80c5ca897":{"templateValidation":"Will the price of LTC, exceed (.*) EUR, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x2b18091a3114d128813eeb98eaec41db957209083ef7d8c07c5471968b42fabc":{"templateValidation":"What price will LTC close at in EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"}}
