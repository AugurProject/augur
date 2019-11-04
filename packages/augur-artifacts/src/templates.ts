export const REQUIRED = 'REQUIRED';
export const CHOICE = 'CHOICE';
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

export interface UserInputDateYear extends UserInputText {
  setEndTime: number;
}

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

export interface TemplateChildren {
  [category: string]: CategoryTemplate;
}

export interface CategoryTemplate {
  templates: Template[];
  children: TemplateChildren;
}

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

export interface TemplateValidation {
  [hash: string]: {
    templateValidation: string;
  }
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


export const TEMPLATES = {"Sports":{"children":{"Golf":{"templates":[{"marketType":"YesNo","question":"Will [0] win the [1] [2]?","example":"Will Tiger Woods win the 2020 PGA Championship?","inputs":[{"id":0,"type":"TEXT","placeholder":"Player"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"PGA Championship","label":"PGA Championship"},{"value":"Open Championship","label":"Open Championship"},{"value":"US Open","label":"US Open"},{"value":"Masters Tournament","label":"Masters Tournament"},{"value":"British Open","label":"British Open"}]}],"resolutionRules":{"REQUIRED":[{"text":"If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as \"No\""}]},"hash":"0x555b57b7096010e7a8a1136577b888f0aac6a963f90e8609a20805289eb709a4"},{"marketType":"YesNo","question":"Will [0] make the cut at the [1] [2]?","example":"Will Tiger Woods make the cut at the 2020 PGA Championship?","inputs":[{"id":0,"type":"TEXT","placeholder":"Player"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"PGA Championship","label":"PGA Championship"},{"value":"Open Championship","label":"Open Championship"},{"value":"US Open","label":"US Open"},{"value":"Masters Tournament","label":"Masters Tournament"},{"value":"British Open","label":"British Open"}]}],"resolutionRules":{"REQUIRED":[{"text":"If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as \"No\""}]},"hash":"0x9f39eb57e7a9109a23416c65ee919e56bbee44ed4df0898b5c3770e701d05b63"},{"marketType":"Categorical","question":"Which golfer will win the [0] [1]?","example":"Which golfer will win the 2020 PGA Championship?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"PGA Championship","label":"PGA Championship"},{"value":"Open Championship","label":"Open Championship"},{"value":"US Open","label":"US Open"},{"value":"Masters Tournament","label":"Masters Tournament"},{"value":"British Open","label":"British Open"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x2ffafbb3f1b354a1be0cd7fc10d199f822b61e0a3933723882ccfc317971f489"}]},"Hockey":{"templates":[{"marketType":"YesNo","question":"Will the [0] win vs the [1], Estimated schedule start time: [2]?","example":"Will the St Louis Blues win vs the Dallas Stars, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{},"hash":"0xd90162c00d9ffc40249a5e3a7537af6a454a27186ca64b586ce04eb2073a2f39"},{"marketType":"YesNo","question":"Will the [0] & [1] score [2] or more combined goals, Estimated schedule start time: [3]?","example":"Will the NY Rangers & Dallas Stars score 5 or more combined goals, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation, overtime and any shoot-outs. The game must go 55 minutes or more to be considered official. If it does not \"No winner\" should be deemed the winning outcome."}]},"hash":"0x4c5565b108c2ec016d81ca8940cd21df047c1f4ead92d7d90396f4c4d3cb4c41"},{"marketType":"YesNo","question":"Will the [0] win the [1] Stanley Cup?","example":"Will the Montreal Canadiens win the 2019-2020 Stanley Cup?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]}],"resolutionRules":{},"hash":"0xb4e45e68b3462c32f93a97a25a458127aafa4bd052669863efa500e124dc815d"},{"marketType":"Categorical","question":"Which team will win: [0] vs [1], Estimated schedule start time: [2]?","example":"Which Team will win: NY Rangers vs NJ Devils, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":1,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, or ends in a tie, the market should resolve as \"Draw/No Winner\"."},{"text":"Include Regulation, overtime and any shoot-outs. The game must go 55 minutes or more to be considered official. If it does not \"No winner\" should be deemed the winning outcome."}]},"hash":"0x2241c5b5dae5fccd31a017173764ffffbc3e612e96e6828cfbcf5d964d8ab279"},{"marketType":"Categorical","question":"[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"St Louis Blues vs. NY Rangers: Total goals scored Over/Under 4.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"If the game is not played or is NOT completed for any reason, the market should resolve as \"No Winner\"."}]},"hash":"0xd5cc030641edc76fbef02407f3afe5befdad1f8546e108a193c6b4698e5b89e5"},{"marketType":"Categorical","question":"Which NHL team will win the [0] Stanley Cup?","example":"Which NHL team will win the 2019-2020 Stanley Cup?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":1,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0xc48fcf70e146d7f24a5d840f432c5fa280663c662bd3199a7d1bbe13725bdbfb"},{"marketType":"Categorical","question":"Which NHL player will win the [0] [1]?","example":"Which NHL player will win the 2019-2020 Calder Trophy?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":1,"type":"DROPDOWN","placeholder":"Award","values":[{"value":"Hart Trophy","label":"Hart Trophy"},{"value":"Norris Trophy","label":"Norris Trophy"},{"value":"Vezina Trophy","label":"Vezina Trophy"},{"value":"Calder Trophy","label":"Calder Trophy"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x8881652322573bf5b8c2e2be749bb5ebd91cbcd8fe620034d8e80dcb25541302"},{"marketType":"Scalar","question":"Total number of wins the [0] will finish [1] regular season with?","example":"Total number of wins the LA Kings will finish 2019-2020 regular season with?","denomination":"wins","tickSize":1,"inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]}],"resolutionRules":{"REQUIRED":[{"text":"Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games"}]},"hash":"0x5ad742b1509e9f3c290820d0f58c282e2837b67eeb4966cccebaf2a9165f2e09"}]},"Horse Racing":{"templates":[{"marketType":"YesNo","question":"Will [0] win the [1] [2]?","example":"Will American Pharoah win the 2020 Triple Crown?","inputs":[{"id":0,"type":"TEXT","placeholder":"Horse"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Kentucky Derby","label":"Kentucky Derby"},{"value":"Preakness","label":"Preakness"},{"value":"Belmont","label":"Belmont"},{"value":"Triple Crown","label":"Triple Crown"}]}],"resolutionRules":{"REQUIRED":[{"text":"If the horse named in the market is scratched and does NOT run or is disqualified for any reason, the market should resolve as \"No\""}]},"hash":"0x1364e4f250da59b2aa9acf6abc79e4029d3b554f2742daf0b643a34aacef4011"},{"marketType":"Categorical","question":"Which horse will win the [0] [1]?","example":"Which horse will win the 2020 Kentucky Derby?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Kentucky Derby","label":"Kentucky Derby"},{"value":"Preakness","label":"Preakness"},{"value":"Belmont","label":"Belmont"},{"value":"Triple Crown","label":"Triple Crown"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0xae5243d22496121af6310b9309befd813cb2a8e5ce2c6070b9f4a2e18b5b29e0"}]},"Tennis":{"templates":[{"marketType":"YesNo","question":"Will [0] win the [1] [2]?","example":"Will Roger Federer win the 2020 Wimbledon?","inputs":[{"id":0,"type":"TEXT","placeholder":"Player"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Australian Open","label":"Australian Open"},{"value":"French Open","label":"French Open"},{"value":"Wimbledon","label":"Wimbledon"},{"value":"US Open","label":"US Open"}]}],"resolutionRules":{"REQUIRED":[{"text":"If a player fails to start a tournament or a match or withdraws early or is disqualified, the market should resolve as \"No\""}]},"hash":"0xe9485562e27609fdf99747a08380383b37df3ec2f35458543414cd65d5112b0e"},{"marketType":"Categorical","question":"Which tennis player will win the [0] [1]?","example":"Which tennis player will win the 2020 Australian Open?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Australian Open","label":"Australian Open"},{"value":"French Open","label":"French Open"},{"value":"Wimbledon","label":"Wimbledon"},{"value":"US Open","label":"US Open"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"If a player is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner"}]},"hash":"0xec042693f4130534bb54886dd63001394c45b6113bd35ffb5c0311eb62b7b2b3"},{"marketType":"Categorical","question":"[0] [1] Match play winner: [2] vs [3]?","example":"2020 Wimbledon Match play winner between Roger Federer vs Rafael Nadal?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Australian Open","label":"Australian Open"},{"value":"French Open","label":"French Open"},{"value":"Wimbledon","label":"Wimbledon"},{"value":"US Open","label":"US Open"}]},{"id":2,"type":"USER_DESCRIPTION_TEXT","placeholder":"Player A"},{"id":3,"type":"USER_DESCRIPTION_TEXT","placeholder":"Player B"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"If a player is disqualified or withdraws before the match is complete, the player moving forward to the next round should be declared the winner."},{"text":"If a player fails to start a tournament or a match, or the match was not able to start for any reason, the market should resolve as \"No Winner\"."},{"text":"If the match is not played for any reason, or is terminated prematurely with both players willing and able to play, the market should resolve as \"No Winner\"."}]},"hash":"0x1cc6d4171af59f96e405e1f1b22ccf26c400490a5d941baa7515d3932149d86c"}]},"Soccer":{"templates":[{"marketType":"Categorical","question":"Which team will win: [0] vs [1], Estimated schedule start time: [2]?","example":"Which team will win: Real Madrid vs Manchester United, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":1,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"Draw/No Winner"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"Unofficial game/Cancelled"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out."},{"text":"If the match concludes and is deemed an official game, meaning more than 90% of the scheduled match has been completed and the score ends in a tie, the market should resolve as \"Draw\"."},{"text":"If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as \"Unofficial game/Cancelled\"."}]},"hash":"0xc10d5c98daf4a76fbc8fe810c4138c14adf7c3156d20d2aaef47e9da4ccf4016"},{"marketType":"Categorical","question":"[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"Real Madrid vs Manchester United: Total goals scored Over/Under 4.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"},{"id":7,"type":"ADDED_OUTCOME","placeholder":"Unofficial game/Cancelled"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and any added injury or stoppage time only. Does NOT include any Overtime or Penalty shoot-out. If the game is NOT played or is not deemed an official game, meaning, less than 90% of the scheduled match had been completed, the market should resolve as \"Unofficial game/Cancelled\"."}]},"hash":"0xefaacf4b0300e7100ab6fac864f61fb80f15f0ede53b30df649d37a3112d994f"}]},"Basketball":{"children":{"NBA":{"templates":[{"marketType":"YesNo","question":"Will the [0] win vs the [1], Estimated schedule start time: [2]?","example":"Will the Los Angeles Lakers win vs the Golden State Warriors, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":2,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO\"'"},{"text":"At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as \"No\""}]},"hash":"0x8e25cb1d726b475e392e27b98a9d58c7cdbcb5f22b8aae459b53aa5e15c72f9f"},{"marketType":"YesNo","question":"Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?","example":"Will the Los Angeles Lakers win vs the Golden State Warriors by 5 or more points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO\"'"},{"text":"At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as \"No\""}]},"hash":"0x576738d7a49f1f4790360e63d5a42454ad3170dd51c460f14ed1ca0e289ef038"},{"marketType":"YesNo","question":"Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?","example":"Will the Los Angeles Lakers & the Golden State Warriors score 172 or more combined points, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO\"'"},{"text":"At least 43 minutes of play must have elapsed for the game to be deemed official.  If less than 43 minutes of play have been completed, the game is not considered official game and the market should resolve as \"No\""}]},"hash":"0x74e61aa8dd822dc7d5f9426a83bacbc20583d286e19a03885ed721293102a688"},{"marketType":"YesNo","question":"Will the [0] win the [1] NBA Championship?","example":"Will the Golden State Warriors win the 2019-20 NBA Championship?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]}],"resolutionRules":{},"hash":"0x1b5a9cc0c27a5f99d80aa3d459b9aefdb4cab3edb7dc0bbd8fc955535915f497"},{"marketType":"YesNo","question":"Will [0] win the [1] [2] award?","example":"Will Steph Curry win the 2019-2020 NBA Most Valuable Player award?","inputs":[{"id":0,"type":"TEXT","placeholder":"Name"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":2,"type":"DROPDOWN","placeholder":"Award","values":[{"value":"Most Valuable Player","label":"Most Valuable Player"},{"value":"Rookie of the year","label":"Rookie of the year"},{"value":"6th Man","label":"6th Man"},{"value":"Defensive Player of the Year","label":"Defensive Player of the Year"},{"value":"Most Improved player","label":"Most Improved player"}]}],"resolutionRules":{},"hash":"0x97b8b49d0194864a17a05e678538b97c233465adf9c080ec00c9abcae6757316"},{"marketType":"Categorical","question":"Which team will win: [0] vs [1], Estimated schedule start time: [2]?","example":"Which Team will win: Brooklyn Nets vs NY Knicks, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team A","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team B","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":2,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"}]},"hash":"0xad8db569c459e5a9650d5adbbc3c202b8ccef906955b93f77cfc5387eaf2c6a0"},{"marketType":"Categorical","question":"[0] vs [1]: Total Points scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"Brooklyn Nets vs NY Knicks: Total Points scored: Over/Under 164.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"}]},"hash":"0x99bf171e0df5862ca3a04a9048d91d1e0f6135536eaec208e6e60a9e2432f2a5"},{"marketType":"Categorical","question":"Which NBA team will win the [0] [1]?","example":"Which NBA team will win the 2019-2020 Western Conference Finals?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Eastern Conference Finals","label":"Eastern Conference Finals"},{"value":"Western Conference Finals","label":"Western Conference Finals"},{"value":"NBA Championship","label":"NBA Championship"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"}]},"hash":"0x2c7fa2c5159beb1883b74cd6f5439213564914867471ec157a50b63946dc3d33"},{"marketType":"Categorical","question":"Which NBA player will win the [0] [1] award?","example":"Which NBA player will win the 2019-2020 Most Valuable Player award?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":1,"type":"DROPDOWN","placeholder":"Award","values":[{"value":"Most Valuable Player","label":"Most Valuable Player"},{"value":"Rookie of the year","label":"Rookie of the year"},{"value":"6th Man","label":"6th Man"},{"value":"Defensive Player of the Year","label":"Defensive Player of the Year"},{"value":"Most Improved player","label":"Most Improved player"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"}]},"hash":"0x05c57279195026f1196471ad671310d8f484474c1e4cb571fd4c8fca90fff221"},{"marketType":"Categorical","question":"Which Player will have the most [0] at the end of the the [1] regular season?","example":"Which Player will have the most Points scored at the end of the the 2019-2020 regular season?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Action","values":[{"value":"Points Scored","label":"Points Scored"},{"value":"Rebounds","label":"Rebounds"},{"value":"Assists","label":"Assists"},{"value":"made 3-pointers","label":"made 3-pointers"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"}]},"hash":"0x9f9dd1e775385731b373a550a27b4168d3ef9287b6a948f102a6f79c5499f136"},{"marketType":"Scalar","question":"Total number of wins [0] will finish [1] regular season with?","example":"Total number of wins NY Knicks will finish 2019-20 regular season with?","denomination":"wins","tickSize":1,"inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team","values":[{"value":"Atlanta Hawks","label":"Atlanta Hawks"},{"value":"Boston Celtics","label":"Boston Celtics"},{"value":"Brooklyn Nets","label":"Brooklyn Nets"},{"value":"Charlotte Hornets","label":"Charlotte Hornets"},{"value":"Chicago Bulls","label":"Chicago Bulls"},{"value":"Cleveland Cavaliers","label":"Cleveland Cavaliers"},{"value":"Dallas Mavericks","label":"Dallas Mavericks"},{"value":"Denver Nuggets","label":"Denver Nuggets"},{"value":"Detroit Pistons","label":"Detroit Pistons"},{"value":"Golden State Warriors","label":"Golden State Warriors"},{"value":"Houston Rockets","label":"Houston Rockets"},{"value":"Indiana Pacers","label":"Indiana Pacers"},{"value":"LA Clippers","label":"LA Clippers"},{"value":"LA Lakers","label":"LA Lakers"},{"value":"Memphis Grizzlies","label":"Memphis Grizzlies"},{"value":"Miami Heat","label":"Miami Heat"},{"value":"Milwaukee Bucks","label":"Milwaukee Bucks"},{"value":"Minnesota Timberwolves","label":"Minnesota Timberwolves"},{"value":"New Orleans Pelicans","label":"New Orleans Pelicans"},{"value":"New York Knicks","label":"New York Knicks"},{"value":"Oklahoma City Thunder","label":"Oklahoma City Thunder"},{"value":"Orlando Magic","label":"Orlando Magic"},{"value":"Philadelphia 76ers","label":"Philadelphia 76ers"},{"value":"Phoenix Suns","label":"Phoenix Suns"},{"value":"Portland Trail Blazers","label":"Portland Trail Blazers"},{"value":"Sacramento Kings","label":"Sacramento Kings"},{"value":"San Antonio Spurs","label":"San Antonio Spurs"},{"value":"Toronto Raptors","label":"Toronto Raptors"},{"value":"Utah Jazz","label":"Utah Jazz"},{"value":"Washington Wizards","label":"Washington Wizards"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year Range","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]}],"resolutionRules":{},"hash":"0x95f83c9f8d4ea5f226f2ddc67b1ba8aa62b520410ec83037f0d3e767d2bfce71"}]},"NCAA":{"templates":[{"marketType":"YesNo","question":"Will [0] win vs [1]; [2] basketball, Estimated schedule start time: [3]?","example":"Will Duke win vs Kentucky; Men's baskeball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' "},{"text":"At least 35 minutes of play must have elapsed for the game to be deemed official.  If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as \"No\""}]},"hash":"0x2f85afc1c2995288100eecf51adc1644bd3f0130735226d4a44f7f1b2c36103d"},{"marketType":"YesNo","question":"Will [0] win vs [1] by [2] or more points, [3] basketball, Estimated schedule start time: [4]?","example":"Will Duke Blue Devils win vs Kentucky Wildcats by 3 or more points; Men's basketball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":4,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' "},{"text":"At least 35 minutes of play must have elapsed for the game to be deemed official.  If less than 35 minutes of play have been completed, the game is not considered official game and the market should resolve as \"No\""}]},"hash":"0x923497a46bdfa38133a7b0de7af0fa4a5c5deead182d4cc5a88fd538ee07278d"},{"marketType":"YesNo","question":"Will [0] & [1] score [2] or more combined points; [3] basketball, Estimated schedule start time: [4]?","example":"Will UNC & Arizona score 142 or more combined points; Men's basketball, Estimated schedule start time: Sept 19, 2019 9:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":4,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"}]},"hash":"0x74bc125fd28001521cb3f2af1c9ecdae9da272fbe8173c99631b43bd09a1f129"},{"marketType":"YesNo","question":"Will [0] win the [1] NCAA [2] National Championship?","example":"Will Villanova win the 2020 NCAA Men's National Championship?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]}],"resolutionRules":{},"hash":"0x79b3d296be94e0bf2c3a051062c20951ef00ec6b3cf4e0a2d233766c15eb2f4d"},{"marketType":"YesNo","question":"Will [0] make the [1] [2] [3]?","example":"Will USC make the 2020 Men's Final Four?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":3,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"NCAA Tournament","label":"NCAA Tournament"},{"value":"Sweet 16","label":"Sweet 16"},{"value":"Elite 8","label":"Elite 8"},{"value":"Final Four","label":"Final Four"}]}],"resolutionRules":{},"hash":"0xdf3954de796093fe1b5b16c88a986195cc0dd0d0358b03270627e8913f2573ec"},{"marketType":"Categorical","question":"Which team will win: [0] vs [1], [2] basketball, Estimated schedule start time: [3]?","example":"Which Team will win: Duke vs Kentucky, Men's basketball, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":1,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":2,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"}]},"hash":"0x9da99d847f8709345d7e9008ed77355be6d6da0a25e9e307e19e31200e85702f"},{"marketType":"Categorical","question":"[0] basketball; [1] vs [2]: Total Points scored; Over/Under [3].5, Estimated schedule start time: [4]?","example":"Men's basketball; Duke Blue Devils vs Arizona Wildcats: Total Points scored: Over/Under 164.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Men's / Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":1,"type":"TEXT","placeholder":"Team A"},{"id":2,"type":"TEXT","placeholder":"Team B"},{"id":3,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":4,"type":"DATETIME","placeholder":"Date time"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"If the game is not played or is NOT completed for any reason, the market should resolve as \"No Winner\"."}]},"hash":"0xf57e47fdcb179751df2610e860933b4ca4ea56abfe634da6a71aebb71bd68997"},{"marketType":"Categorical","question":"Which college basketball team will win the [0] [1] [2] tournament?","example":"Which college basketball team will win the men's 2020 ACC tournament?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Men's/Women's","values":[{"value":"Men's","label":"Men's"},{"value":"Women's","label":"Women's"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Conference","values":[{"label":"American East","value":"American East"},{"label":"American","value":"American"},{"label":"Atlantic 10","value":"Atlantic 10"},{"label":"ACC","value":"ACC"},{"label":"Atlantic Sun","value":"Atlantic Sun"},{"label":"Big 12","value":"Big 12"},{"label":"Big East","value":"Big East"},{"label":"Big Sky","value":"Big Sky"},{"label":"Big South","value":"Big South"},{"label":"Big Ten","value":"Big Ten"},{"label":"Big West","value":"Big West"},{"label":"Colonial","value":"Colonial"},{"label":"Conference USA","value":"Conference USA"},{"label":"Horizon","value":"Horizon"},{"label":"Ivy","value":"Ivy"},{"label":"MAAC","value":"MAAC"},{"label":"Mid-American","value":"Mid-American"},{"label":"MEAC","value":"MEAC"},{"label":"Missouri Valley","value":"Missouri Valley"},{"label":"Mountain West","value":"Mountain West"},{"label":"Northeast","value":"Northeast"},{"label":"Ohio Valley","value":"Ohio Valley"},{"label":"Pac-12","value":"Pac-12"},{"label":"Patriot League","value":"Patriot League"},{"label":"SEC","value":"SEC"},{"label":"Southern","value":"Southern"},{"label":"Southland","value":"Southland"},{"label":"SWAC","value":"SWAC"},{"label":"Summit League","value":"Summit League"},{"label":"Sun Belt","value":"Sun Belt"},{"label":"West Coast","value":"West Coast"},{"label":"WAC","value":"WAC"}]},{"id":3,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"The winner is determined by the team who wins their conference tournament championship game"}]},"hash":"0x234462cb82f5911198b5053a6503f818bb8dee948b37e6ab511ae2ae2ac5c02a"}]}}},"Baseball":{"templates":[{"marketType":"YesNo","question":"Will the [0] win the [1] [2]?","example":"Will the NY Yankees win the 2020 World Series?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"American League Division Series","label":"American League Division Series"},{"value":"National League Division Series","label":"National League Division Series"},{"value":"American League Championship Series","label":"American League Championship Series"},{"value":"National League Championship Series","label":"National League Championship Series"},{"value":"World Series","label":"World Series"}]}],"resolutionRules":{},"hash":"0x59d3a98b357d405ff0cc7aea32d7bfe55f7b44b0f0913844c88937f12569c24f"},{"marketType":"Categorical","question":"Which team will win: [0] vs [1], Estimated schedule start time: [2]?","example":"Which Team will win: Yankees vs Red Sox, Estimated schedule start time: Sept 19, 2019 8:20 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":1,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the \"official time limit\", or ends in a tie, the market should resolve as \"No Winner\", and Extra innings count towards settlement purposes"}]},"hash":"0xfd1ccbcde754175d9472e31edb455b0136913411b296fc52714b9ead6b6acfdc"},{"marketType":"Categorical","question":"Which MLB team will win the [0] [1]?","example":"Which MLB team will win the 2020 World Series?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"American League Division Series","label":"American League Division Series"},{"value":"National League Division Series","label":"National League Division Series"},{"value":"American League Championship Series","label":"American League Championship Series"},{"value":"National League Championship Series","label":"National League Championship Series"},{"value":"World Series","label":"World Series"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x7cc8ea40d147fcc730696661355f27b8108cc9af62e2c294ff1275971940af38"},{"marketType":"Categorical","question":"[0] vs [1]: Total Runs scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"NY Yankees vs Boston Red Sox: Total Runs scored; Over/Under 9.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"In the event of a shortened game, results are official after (and, unless otherwise stated, bets shall be settled subject to the completion of) 5 innings of play, or 4.5 innings should the home team be leading at the commencement of the bottom of the 5th innings. Should a game be called, if the result is official in accordance with this rule, the winner will be determined by the score/stats after the last full inning completed (unless the home team score to tie, or take the lead in the bottom half of the inning, in which circumstances the winner is determined by the score/stats at the time the game is suspended). If the game does not reach the \"official time limit\", or ends in a tie, the market should resolve as \"No Winner\". Extra innings count towards settlement purposes"}]},"hash":"0x117883fd2bf1df971f8d35cc9d35b5a070b6ec0b8cabfc9656d4be69885f6aef"},{"marketType":"Categorical","question":"Which player will win the [0] [1]?","example":"Which Player will win the 2019 American League Cy Young award?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"American League Division Series","label":"American League Division Series"},{"value":"National League Division Series","label":"National League Division Series"},{"value":"American League Championship Series","label":"American League Championship Series"},{"value":"National League Championship Series","label":"National League Championship Series"},{"value":"World Series","label":"World Series"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x024d283f0845c7a95addb295e46ff3c2ef7e4f0eccf463578a7db051f99e7ddd"},{"marketType":"Scalar","question":"Total number of wins the [0] will finish the [1] regular season with?","example":"Total number of wins the LA Dodgers will finish the 2019 regular season with?","denomination":"wins","tickSize":1,"inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{},"hash":"0xec06c6aa8deb73fb90d393fd1b06f1836a8aefda36b19458eb5f8e4520d438e7"}]},"American Football":{"children":{"NFL":{"templates":[{"marketType":"YesNo","question":"Will the [0] win vs the [1], Estimated schedule start time: [2]?","example":"Will the NY Giants win vs. the New England Patriots, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0xb1fc4620ecbd00303243a32897647ed04f8bdd0fc06155ade475fa0e53b40295"},{"marketType":"YesNo","question":"Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?","example":"Will the NY Giants win vs. the New England Patriots by 3 or more points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0xbfc34250f880b4f439fe4ed64ad08cb6717cb41cb5f6217d5d448484203673d4"},{"marketType":"YesNo","question":"Will the [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?","example":"Will the NY Giants & the New England Patriots score 44 or more combined points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0xdc3f6ef3dc9533335587a6181fd085590421d15f4e915cd8c9b269f6ad853feb"},{"marketType":"YesNo","question":"Will the [0] have [1] or more regular season wins in [2]?","example":"Will the Dallas Cowboys have 9 or more regular season wins in 2019?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":2,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{"REQUIRED":[{"text":"Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games"}]},"hash":"0x84baf3a8294846c8b5e74b00730e21975e1f362b7d4839ae98c776e50e87b4f9"},{"marketType":"YesNo","question":"Will the [0] win SuperBowl [1]?","example":"Will the NY Giants win Superbowl LIV?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"TEXT","placeholder":"numeral"}],"resolutionRules":{},"hash":"0x0dc15a75f4c788c26d8c6bd4826a8af63b7c8560eb95de412eb305f76a719ab2"},{"marketType":"YesNo","question":"Will [0] win the [1] [2] award?","example":"Will Patrick Mahomes win the 2019-20 MVP award?","inputs":[{"id":0,"type":"TEXT","placeholder":"Player"},{"id":1,"type":"DROPDOWN","placeholder":"Year/Year","values":[{"value":"2019-20","label":"2019-20"},{"value":"2020-21","label":"2020-21"},{"value":"2021-22","label":"2021-22"}]},{"id":2,"type":"DROPDOWN","placeholder":"Select Award","values":[{"value":"MVP","label":"MVP"},{"value":"Offensive Player of the year","label":"Offensive Player of the year"},{"value":"Defensive player of the year","label":"Defensive player of the year"},{"value":"Offensive Rookie of the year","label":"Offensive Rookie of the year"},{"value":"Defensive Rookie of the year","label":"Defensive Rookie of the year"},{"value":"AP Most Valuable Player","label":"AP Most Valuable Player"}]}],"resolutionRules":{},"hash":"0x4d3c1447c79348ec0ae212f1a5e96e68c0bf16a6bea0420cfb565c22a99286d5"},{"marketType":"Categorical","question":"Which NFL Team will win: [0] vs [1], Estimated schedule start time [2]?","example":"Which NFL Team will win: NY GIants vs New England Patriots Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"Tie/No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0xdca74c1d35d2e47859cee44a61792d210ec3d5f6eef448781e274a1b09bda951"},{"marketType":"Categorical","question":"Which NFL Team will win: [0] vs [1], Estimated schedule start time [2]?","example":"Which NFL Team will win: Seattle Seahawks vs Dallas Cowboys Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"USER_DESCRIPTION_DROPDOWN_OUTCOME","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"Tie/No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x1c1de64224f31ce209784b82b7146c1073ee48153b9421b42cb0e600abfbc7c2"},{"marketType":"Categorical","question":"[0] vs [1]: Total goals scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"NY Giants vs Dallas Cowboys: Total points scored: Over/Under 56.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team A","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"DROPDOWN","placeholder":"Team B","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"Include Regulation and Overtime"},{"text":"If the game ends in a tie, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x5da9b112452d3208ca59aec10dbde9a40faadde1ce8217504fbfba96b107baa9"},{"marketType":"Categorical","question":"Which NFL team will win the [0] [1]?","example":"Which NFL team will win the 2020 AFC Championship game?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Superbowl","label":"Superbowl"},{"value":"AFC Championship game","label":"AFC Championship game"},{"value":"NFC Championship game","label":"NFC Championship game"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0x95df1f54e760e52b37ed86e2cd2c486b81b224136d3c70d63aa125567858da75"},{"marketType":"Categorical","question":"Which NFL player will win the [0] [1] award?","example":"Which NFL player will win the 2020 Most Valuable Player award?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":0,"type":"DROPDOWN","placeholder":"Award","values":[{"value":"MVP","label":"MVP"},{"value":"Offensive Player of the year","label":"Offensive Player of the year"},{"value":"Defensive player of the year","label":"Defensive player of the year"},{"value":"Offensive Rookie of the year","label":"Offensive Rookie of the year"},{"value":"Defensive Rookie of the year","label":"Defensive Rookie of the year"},{"value":"AP Most Valuable Player","label":"AP Most Valuable Player"}]}],"resolutionRules":{},"hash":"0x69bbecf582ce1a8f972189f44957f652385848bf4abf2713bf3dd54f59e377e7"},{"marketType":"Scalar","question":"Total number of wins [0] will finish [1] regular season with?","example":"Total number of wins NY Giants will finish 2019 regular season with?","denomination":"wins","tickSize":1,"inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Team","values":[{"value":"Arizona Cardinals","label":"Arizona Cardinals"},{"value":"Atlanta Falcons","label":"Atlanta Falcons"},{"value":"Baltimore Ravens","label":"Baltimore Ravens"},{"value":"Buffalo Bills","label":"Buffalo Bills"},{"value":"Carolina Panthers","label":"Carolina Panthers"},{"value":"Chicago Bears","label":"Chicago Bears"},{"value":"Cincinnati Bengals","label":"Cincinnati Bengals"},{"value":"Cleveland Browns","label":"Cleveland Browns"},{"value":"Dallas Cowboys","label":"Dallas Cowboys"},{"value":"Denver Broncos","label":"Denver Broncos"},{"value":"Detroit Lions","label":"Detroit Lions"},{"value":"Green Bay Packers","label":"Green Bay Packers"},{"value":"Houston Texans","label":"Houston Texans"},{"value":"Indianapolis Colts","label":"Indianapolis Colts"},{"value":"Jacksonville Jaguars","label":"Jacksonville Jaguars"},{"value":"Kansas City Chiefs","label":"Kansas City Chiefs"},{"value":"Las Angeles Chargers","label":"Las Angeles Chargers"},{"value":"Las Angeles Rams","label":"Las Angeles Rams"},{"value":"Miami Dolphins","label":"Miami Dolphins"},{"value":"Minnesota Vikings","label":"Minnesota Vikings"},{"value":"New England Patriots","label":"New England Patriots"},{"value":"New Orleans Saints","label":"New Orleans Saints"},{"value":"New York Giants","label":"New York Giants"},{"value":"New York Jets","label":"New York Jets"},{"value":"Oakland Raiders","label":"Oakland Raiders"},{"value":"Philadelphia Eagles","label":"Philadelphia Eagles"},{"value":"Pittsburgh Steelers","label":"Pittsburgh Steelers"},{"value":"San Francisco 49ers","label":"San Francisco 49ers"},{"value":"Seattle Seahawks","label":"Seattle Seahawks"},{"value":"Tampa Bay Buccaneers","label":"Tampa Bay Buccaneers"},{"value":"Tennessee Titans","label":"Tennessee Titans"},{"value":"Washington Redskins","label":"Washington Redskins"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{"REQUIRED":[{"text":"Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games"}]},"hash":"0x711624b346f94fae6794b32a9e59cddf9a3acb8eca10f95161251b42c12094ae"}]},"NCAA":{"templates":[{"marketType":"YesNo","question":"Will the [0] win vs the [1], Estimated schedule start time: [2]?","example":"Will Alabama Crimson Tide win vs. Florida Gators, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x00918d4ba74452063b7c51e3485d21ba878d5e6c95c0771a21674ce1a01d0af0"},{"marketType":"YesNo","question":"Will the [0] win vs the [1] by [2] or more points, Estimated schedule start time: [3]?","example":"Will Alabama Crimson Tide win vs. Florida Gators by 7 or more points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0xffea3c12e1d0fb93120cbd29bd4d1c1fee27adda6fd9a590e40e7f467f2ec6bc"},{"marketType":"YesNo","question":"Will [0] & [1] score [2] or more combined points, Estimated schedule start time: [3]?","example":"Will USC & UCLA score 51 or more combined points, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x5e430b6c5a4f3e201ac4b07864fd0f0fb032c36860401a8d92919eae6eaecf51"},{"marketType":"Categorical","question":"Which College Football Team will win: [0] vs [1], Estimated schedule start time [2]?","example":"Which College Football Team will win:  Alabama vs Michigan, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":1,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":2,"type":"DATETIME","placeholder":"Date time"},{"id":3,"type":"ADDED_OUTCOME","placeholder":"Draw/No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x6e01be5324c39a7d450b29778a8aaa707748abe55d05628ac13538c63342a075"},{"marketType":"Categorical","question":"[0] vs [1]: Total points scored; Over/Under [2].5, Estimated schedule start time: [3]?","example":"Alabama vs Michigan: Total points scored: Over/Under 56.5, Estimated schedule start time: Sept 19, 2019 1:00 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Team A"},{"id":1,"type":"TEXT","placeholder":"Team B"},{"id":2,"type":"TEXT","validationType":"WHOLE_NUMBER","placeholder":"Whole #"},{"id":3,"type":"DATETIME","placeholder":"Date time"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"},{"id":5,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Over [2].5"},{"id":6,"type":"SUBSTITUTE_USER_OUTCOME","placeholder":"Under [2].5"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0xa4dbe97ba7eefa85c7b2174a0b3ffc17894e851ff377481f7a1636004d1b15dc"},{"marketType":"Categorical","question":"Which team will win the [0] [1]: [2] vs [3]?","example":"Which team will win the 2020 Cotton Bowl: Tennessee Volunteers vs Miami Hurricanes?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"TEXT","placeholder":"Game"},{"id":2,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team A"},{"id":3,"type":"USER_DESCRIPTION_TEXT","placeholder":"Team B"},{"id":4,"type":"ADDED_OUTCOME","placeholder":"No Winner"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0x2617dcd5b675cb113d1bbf192727f90d2f2a74e107a1bc23b71fa8e5b0c3ad11"},{"marketType":"Categorical","question":"Which college football team will win [0] National Championship?","example":"Which college football team will win 2020 National Championship?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{},"hash":"0xf39f32ed052de5a55a82aeedd8026fb119b25987d0d9be027780931e0fb7b6b6"},{"marketType":"Categorical","question":"Which college football player will win the [0] Heisman Trophy?","example":"Which college football player will win the 2020 Heisman Trophy?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"ADDED_OUTCOME","placeholder":"Other (Field)"}],"resolutionRules":{"REQUIRED":[{"text":"Includes Regulation and Overtime"},{"text":"If the game is not played, the market should resolve as \"NO' as Team A did NOT win vs team B"},{"text":"At least 55 minutes of play must have elapsed for the game to be deemed official.  If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as \"No\""}]},"hash":"0xee36ad222b83e01afeb62ae6d4ac456eb421ca327fa3ee48169c0c83de56c00a"},{"marketType":"Scalar","question":"Total number of wins [0] will finish [1] regular season with?","example":"Total number of wins Michigan Wolverines will finish 2019 regular season with?","denomination":"wins","tickSize":1,"inputs":[{"id":0,"type":"TEXT","placeholder":"Team"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{"REQUIRED":[{"text":"Regular Season win totals are for regular season games ONLY and will not include any play-in, playoffs, or championship games"}]},"hash":"0xb044fa9ba98a4df4056d659132a7ae4ad630998f006b00125d62cdbe8b0d6913"}]}}}}},"Politics":{"children":{"US Politics":{"templates":[{"marketType":"YesNo","question":"Will [0] win the [1] presidential election?","example":"Will Donald Trump win the 2020 Presidential election?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{},"hash":"0x94e2c0f248605461b2ba491d7e0e05157a31442ca1370b3c0cee46648d6930dc"},{"marketType":"YesNo","question":"Will [0] win the [1] [2] presidential nomination?","example":"Will Elizabeth Warren win the 2020 Democratic Presidential nomination?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Party","values":[{"value":"Democratic","label":"Democratic"},{"value":"Republican","label":"Republican"}]}],"resolutionRules":{},"hash":"0x74fa917ece7b1657330ac8c4fb7309537a2b6b31874081b86556c877a44f08e0"},{"marketType":"YesNo","question":"Will [0] run for [1] by [2]?","example":"Will Oprah Winfrey run for President by December 31, 2019 1 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DROPDOWN","placeholder":"Office","values":[{"value":"President","label":"President"},{"value":"Vice-President","label":"Vice-President"},{"value":"Senator","label":"Senator"},{"value":"Congress","label":"Congress"}]},{"id":2,"type":"DATETIME","placeholder":"Specific Datetime","label":"Specific Datetime","sublabel":"Specify date time for event"}],"resolutionRules":{},"hash":"0x80b8ec188d6c42d724dc730d51b2d2d726c83f49e3098a12b43b81881aae3122"},{"marketType":"YesNo","question":"Will [0] be impeached by [1]?","example":"Will Donald Trump be impeached by December 31, 2019 11:59 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DATETIME","placeholder":"Specific Datetime","label":"Specific Datetime","sublabel":"Specify date time for event"}],"resolutionRules":{},"hash":"0xf8993ded0c84d9ab3e4b60217ddeccb313f34cc558f194fae89ef5f1f268601c"},{"marketType":"Categorical","question":"Who will win the [0] US presidential election?","example":"Who will win the 2020 US presidential election?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{},"hash":"0xb0d66e6e9a0b7ebba5ff65be0e6f9ffd243a86fa889061f2481a96f64202576e"},{"marketType":"Categorical","question":"Who will be the [0] [1] [2] nominee?","example":"Who will be the 2020 Republican Vice President nominee?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Party","values":[{"value":"Democratic","label":"Democratic"},{"value":"Republican","label":"Republican"}]},{"id":2,"type":"DROPDOWN","placeholder":"Office","values":[{"value":"President","label":"President"},{"value":"Vice-President","label":"Vice-President"}]}],"resolutionRules":{},"hash":"0x0d2f6b20431641b5fcac9103a246ce18c19dd7e9980b3d19a100e5d71b9ad514"},{"marketType":"Categorical","question":"Which party will win [0] in the [1] Presidential election?","example":"Which party will win Michigan in the 2020 Presidential election?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"State","values":[{"value":"Alabama","label":"Alabama"},{"value":"Alaska","label":"Alaska"},{"value":"Arizona","label":"Arizona"},{"value":"Arkansas","label":"Arkansas"},{"value":"California","label":"California"},{"value":"Colorado","label":"Colorado"},{"value":"Connecticut","label":"Connecticut"},{"value":"Delaware","label":"Delaware"},{"value":"Florida","label":"Florida"},{"value":"Georgia","label":"Georgia"},{"value":"Hawaii","label":"Hawaii"},{"value":"Idaho","label":"Idaho"},{"value":"Illinois","label":"Illinois"},{"value":"Indiana","label":"Indiana"},{"value":"Iowa","label":"Iowa"},{"value":"Kansas","label":"Kansas"},{"value":"Kentucky","label":"Kentucky"},{"value":"Louisiana","label":"Louisiana"},{"value":"Maine","label":"Maine"},{"value":"Maryland","label":"Maryland"},{"value":"Massachusetts","label":"Massachusetts"},{"value":"Michigan","label":"Michigan"},{"value":"Minnesota","label":"Minnesota"},{"value":"Mississippi","label":"Mississippi"},{"value":"Missouri","label":"Missouri"},{"value":"Montana","label":"Montana"},{"value":"Nebraska","label":"Nebraska"},{"value":"Nevada","label":"Nevada"},{"value":"New Hampshire","label":"New Hampshire"},{"value":"New Jersey","label":"New Jersey"},{"value":"New Mexico","label":"New Mexico"},{"value":"New York","label":"New York"},{"value":"North Carolina","label":"North Carolina"},{"value":"North Dakota","label":"North Dakota"},{"value":"Ohio","label":"Ohio"},{"value":"Oklahoma","label":"Oklahoma"},{"value":"Oregon","label":"Oregon"},{"value":"Pennsylvania","label":"Pennsylvania"},{"value":"Rhode Island","label":"Rhode Island"},{"value":"South Carolina","label":"South Carolina"},{"value":"South Dakota","label":"South Dakota"},{"value":"Tennessee","label":"Tennessee"},{"value":"Texas","label":"Texas"},{"value":"Utah","label":"Utah"},{"value":"Vermont","label":"Vermont"},{"value":"Virginia","label":"Virginia"},{"value":"Washington","label":"Washington"},{"value":"West Virginia","label":"West Virginia"},{"value":"Wisconsin","label":"Wisconsin"},{"value":"Wyoming","label":"Wyoming"}]},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]}],"resolutionRules":{},"hash":"0xd6515f3fe7caddd9d01c46481f22530838edcd2e39f29633a09069e47640e700"}]},"World":{"templates":[{"marketType":"YesNo","question":"Will [0] be [1] of [2] on [3]?","example":"Will Kim Jong Un be Supreme Leader of North Korea on December 31, 2019 11:59 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DROPDOWN","placeholder":"Position","values":[{"value":"President","label":"President"},{"value":"Prime Minister","label":"Prime Minister"},{"value":"Supreme Leader","label":"Supreme Leader"},{"value":"Crown Prince","label":"Crown Prince"},{"value":"Chancellor","label":"Chancellor"},{"value":"Chief minister","label":"Chief minister"}]},{"id":2,"type":"TEXT","placeholder":"Location"},{"id":3,"type":"DATETIME","placeholder":"Specific Datetime","label":"Specific Datetime","sublabel":"Specify date time for event"}],"resolutionRules":{},"hash":"0xe84f6a33c694809a036a4a2b30ab964886d8f4d52880fb37f8f9398353cdd457"},{"marketType":"YesNo","question":"Will [0] be impeached by [1]?","example":"Will Benjamin Netanyahu be impeached be December 31, 2019 11:59 pm EST?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person"},{"id":1,"type":"DATETIME","placeholder":"Specific Datetime","label":"Specific Datetime","sublabel":"Specify date time for event"}],"resolutionRules":{},"hash":"0xcf965276e473d056c8957f929cbf1d71d2499a6703ab6eedd7a07b1f8bcbd71e"}]}}},"Finance":{"children":{"Stocks":{"templates":[{"marketType":"YesNo","question":"Will the price of [0] close on or above [1] [2] on the [3] on [4]?","example":"Will the price of AAPL close on or above $200 USD on the Nasdaq on September 1, 2020?","inputs":[{"id":0,"type":"TEXT","placeholder":"Stock"},{"id":1,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":2,"type":"DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":3,"type":"TEXT","placeholder":"Exchange"},{"id":4,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x89ec6e12065968394b773003997afb4482c60fa022e083006e785dc61858f527"},{"marketType":"YesNo","question":"Will the price of [0], exceed [1] [2] on the [3], anytime between the opening on [4] and the close on [5]?","example":"Will the price of AAPL exceed $250 USD on the Nasdaq anytime between the opening on June 1, 2020 and the close on September 1, 2020?","inputs":[{"id":0,"type":"TEXT","placeholder":"Stock"},{"id":1,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":2,"type":"DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":3,"type":"TEXT","placeholder":"Exchange"},{"id":4,"type":"DATEYEAR","placeholder":"Start Day of Year"},{"id":5,"type":"DATEYEAR","placeholder":"End Day of Year"}],"resolutionRules":{},"hash":"0x1c18e9b6bf3b5e5f988bfe506e7fbec2c8736408c237a380dbf5a256df29c1a1"},{"marketType":"Scalar","question":"What price will [0] close at in [1] on the [2] on [3]?","example":"What price will AAPL close at in USD on the Nasdaq on December 31, 2019?","denomination":"[Denomination]","inputs":[{"id":0,"type":"TEXT","placeholder":"Stock"},{"id":1,"type":"DENOMINATION_DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":2,"type":"TEXT","placeholder":"Exchange"},{"id":3,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x76bab31f7b8038b4a06677347fb564e94e03276dbcaaafa7624eb3818e5cf41f"}]},"Indexes":{"templates":[{"marketType":"YesNo","question":"Will the [0] close on or above [1] [2] on [3]?","example":"Will the Dow Jones Industrial Average close on or above $27,100.00 USD on September 20, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Index"},{"id":1,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":2,"type":"DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":3,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x749ca4c6ad55fdf664f892c0e4dfb245801e6cec452b9d654d3164324c8adb1d"},{"marketType":"Scalar","question":"What price will the [0] close at in [1] on [2]?","example":"What Price will the S&P 500 close at in USD on December 31, 2019?","denomination":"[Denomination]","inputs":[{"id":0,"type":"TEXT","placeholder":"Index"},{"id":1,"type":"DENOMINATION_DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x095d995fc91952611445eba408ea53eaa8d84446fd4ea277e3969439f8d6bf81"}]}}},"Entertainment":{"templates":[{"marketType":"YesNo","question":"Will [0] host the [1] [2]?","example":"Will Billy Crystal host the 2019 Academy Awards?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person Name"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Academy Awards","label":"Academy Awards"},{"value":"Emmy Awards","label":"Emmy Awards"},{"value":"Grammy Awards","label":"Grammy Awards"},{"value":"Golden Globe Awards","label":"Golden Globe Awards"}]}],"resolutionRules":{"REQUIRED":[{"text":"If more than one person hosts the event, and the person named in the market is one of the multiple hosts, the market should resolve as \"Yes\""}]},"hash":"0x7c731ff49afefde65e31d0d98c8438e90945b105aa15e2fd7bfafcf637ee36ae"},{"marketType":"YesNo","question":"Will [0] win an award for [1] at the [2] [3]?","example":"Will Leonardo DiCaprio win an award for Best Actor at the 2016 Academy Awards?","inputs":[{"id":0,"type":"TEXT","placeholder":"Person Name"},{"id":1,"type":"TEXT","placeholder":"Award"},{"id":2,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":3,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Academy Awards","label":"Academy Awards"},{"value":"Emmy Awards","label":"Emmy Awards"},{"value":"Grammy Awards","label":"Grammy Awards"},{"value":"Golden Globe Awards","label":"Golden Globe Awards"}]}],"resolutionRules":{},"hash":"0xf32fc175fd52fc52ecc53cf31c678a4fcf3bccab923c406b91e3ebc6be18116f"},{"marketType":"YesNo","question":"Will [0] win an award for [1] at the [2] [3]?","example":"Will Spotlight win an award for Best Picture at the 2016 Academy Awards?","inputs":[{"id":0,"type":"TEXT","placeholder":"Movie Name"},{"id":1,"type":"TEXT","placeholder":"Award"},{"id":2,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":3,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Academy Awards","label":"Academy Awards"},{"value":"Emmy Awards","label":"Emmy Awards"},{"value":"Grammy Awards","label":"Grammy Awards"},{"value":"Golden Globe Awards","label":"Golden Globe Awards"}]}],"resolutionRules":{},"hash":"0xe65a88b5d0ed2111d0cdf7918b815abb6c405c4975d727829be5c1c98c6e2207"},{"marketType":"YesNo","question":"Will [0] gross [1] [2] or more, in it's opening weekend [3]?","example":"Will Avangers: Endgame gross $350 million USD or more in it's opening weekend in the US?","inputs":[{"id":0,"type":"TEXT","placeholder":"Movie Name"},{"id":1,"type":"TEXT","placeholder":"Amount"},{"id":2,"type":"DROPDOWN","placeholder":"Currency","values":[{"value":"US dollar (USD)","label":"US dollar (USD)"},{"value":"Euro (EUR)","label":"Euro (EUR)"},{"value":"Chinese yuan (CNY)","label":"Chinese yuan (CNY)"},{"value":"British pound (GBP)","label":"British pound (GBP)"},{"value":"Australian dollar (AUD)","label":"Australian dollar (AUD)"},{"value":"Canadian dollar (CAD)","label":"Canadian dollar (CAD)"},{"value":"Swiss franc (CHF)","label":"Swiss franc (CHF)"}]},{"id":3,"type":"DROPDOWN","placeholder":"US / Worldwide","values":[{"value":"US (United States)","label":"US (United States)"},{"value":"Worldwide","label":"Worldwide"}]}],"resolutionRules":{"REQUIRED":[{"text":"Gross total should include 4-day weekend in if it is a holiday weekend"}]},"hash":"0x35b882c1d916a19f310390b36477fcae835f7ed06153442dc5599f5d9078c881"},{"marketType":"Categorical","question":"Who will host the [0] [1]?","example":"Who wll host the 2020 Emmy Awards?","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":1,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Academy Awards","label":"Academy Awards"},{"value":"Emmy Awards","label":"Emmy Awards"},{"value":"Grammy Awards","label":"Grammy Awards"},{"value":"Golden Globe Awards","label":"Golden Globe Awards"}]},{"id":2,"type":"ADDED_OUTCOME","placeholder":"Multiple Hosts"}],"resolutionRules":{"REQUIRED":[{"text":"The market should resolve as \"multiple hosts\" if more than one of the possible outcomes hosts the event. If only one of the potential outcomes hosts with multiple people, then the individual outcome would be the winner."}]},"hash":"0x15be6d7ee40265323e97739bf880c678969f0a16c42bc60d206f6814710bffab"},{"marketType":"Categorical","question":"Who will win for [0] in the [1] [2]?","example":"Who will win for Best Pop Vocal Album in the 2020 Grammy Awards?","inputs":[{"id":0,"type":"TEXT","placeholder":"Award"},{"id":1,"type":"DROPDOWN","placeholder":"Year","values":[{"value":"2019","label":"2019"},{"value":"2020","label":"2020"},{"value":"2021","label":"2021"},{"value":"2022","label":"2022"}]},{"id":2,"type":"DROPDOWN","placeholder":"Event","values":[{"value":"Academy Awards","label":"Academy Awards"},{"value":"Emmy Awards","label":"Emmy Awards"},{"value":"Grammy Awards","label":"Grammy Awards"},{"value":"Golden Globe Awards","label":"Golden Globe Awards"}]}],"resolutionRules":{},"hash":"0xf45b844fdd953160a3716c23d5e569f5f0f21868616f9cd56e0b7e765bf90e6b"}]},"Crypto":{"children":{"Bitcoin":{"children":{"USD":{"templates":[{"marketType":"YesNo","question":"Will the price of BTC close on or above [0] USD on [1] on [2]?","example":"Will the price of BTC close on or above $200 USD on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x906f13f108d6d697f8f626d377a5d9cc23caad59bd57465744b81a326345184f"},{"marketType":"YesNo","question":"Will the price of BTC, exceed [0] USD, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of BTC exceed $40 USD on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0x5203b073388e9c469138a1450b0a672d0e91436f7e7897aa15de96b4cbbfe51f"},{"marketType":"Scalar","question":"What price will BTC close at in USD on [0] on [1]?","example":"What price will BTC close at in USD on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x11f0c517188a7d5b1a30c91cde2b9dc2e261f24f17e226969da4c9c61a04a5aa"}]},"USDT":{"templates":[{"marketType":"YesNo","question":"Will the price of BTC close on or above [0] USDT on [1] on [2]?","example":"Will the price of BTC close on or above $200 USDT on Binance (binance.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x38b007061a853959312af47fe79a53a8fe82454334fa0ea63fb7234966f15865"},{"marketType":"YesNo","question":"Will the price of BTC, exceed [0] USDT, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of BTC exceed $40 USDT on Binance (binance.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0x6ea525324f9fe25f0f413805844d1c34c1e45cd79a89ec9595573750f78d474d"},{"marketType":"Scalar","question":"What price will BTC close at in USDT on [0] on [1]?","example":"What price will BTC close at in USDT on December 31, 2019 on Binance (binance.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xe8319ae75ca465501c777ca96f168d58c9c82426a20045a458f55e05a431115e"}]},"EUR":{"templates":[{"marketType":"YesNo","question":"Will the price of BTC close on or above [0] EUR on [1] on [2]?","example":"Will the price of BTC close on or above $200 EUR on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xdcf399bd2758ae24b09afe1cd1d5b7d415b496f8d120ed6c2dcb66bbfe65999d"},{"marketType":"YesNo","question":"Will the price of BTC, exceed [0] EUR, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of BTC exceed $40 EUR on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0xad2e67bf6791717dffc4cd7aa926fc7fbc6c35d7cc127a1406c97a39509dc657"},{"marketType":"Scalar","question":"What price will BTC close at in EUR on [0] on [1]?","example":"What price will BTC close at in EUR on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xfe0d66a148f31347029be406990ea8dc604584ced9ef2f36410dbde4c5dcbe17"}]}}},"Ethereum":{"children":{"USD":{"templates":[{"marketType":"YesNo","question":"Will the price of ETH close on or above [0] USD on [1] on [2]?","example":"Will the price of ETH close on or above $200 USD on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x8a1aa3fb1772e9838cc58b0615ad1a79be8972f6af45b047e3ab55bdf3998704"},{"marketType":"YesNo","question":"Will the price of ETH, exceed [0] USD, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of ETH exceed $40 USD on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0xf5634c578fe5cec4889d9a19125b129b5a474a438e339e4b9eacaf42c876212a"},{"marketType":"Scalar","question":"What price will ETH close at in USD on [0] on [1]?","example":"What price will ETH close at in USD on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xb0b143b6db66f8a60a01e8f225aa9793a06661a9ebb4aa61ac3f5825d977eae7"}]},"USDT":{"templates":[{"marketType":"YesNo","question":"Will the price of ETH close on or above [0] USDT on [1] on [2]?","example":"Will the price of ETH close on or above $200 USDT on Binance (binance.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x7cb7397b4ed1cfa2bd4c92c0dae06d6954ce7d3ad86e31bc42cbe581939e53e9"},{"marketType":"YesNo","question":"Will the price of ETH, exceed [0] USDT, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of ETH exceed $40 USDT on Binance (binance.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0x175d3dcde853f056e976744c21b3fb6e274119dfe246cffe604eb07744dbce93"},{"marketType":"Scalar","question":"What price will ETH close at in USDT on [0] on [1]?","example":"What price will ETH close at in USDT on December 31, 2019 on Binance (binance.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x7cab448ac91559384e3827ab144efdc40130eb52478b1562d273258ecb9128df"}]},"EUR":{"templates":[{"marketType":"YesNo","question":"Will the price of ETH close on or above [0] EUR on [1] on [2]?","example":"Will the price of ETH close on or above $200 EUR on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xcdcdd77df024fb29fec56da358401a9a3f2a58c79cf1936da52c1275cee8a781"},{"marketType":"YesNo","question":"Will the price of ETH, exceed [0] EUR, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of ETH exceed $40 EUR on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0xe21b8b1dfbf421c8723098d1f2735a4e7294475723b9453a16faf2a963943df6"},{"marketType":"Scalar","question":"What price will ETH close at in EUR on [0] on [1]?","example":"What price will ETH close at in EUR on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x946a7d9ebad21394f93d4076be63e05c469ffa1a7a5ef73554537b9378c07fd1"}]}}},"Litecoin":{"children":{"USD":{"templates":[{"marketType":"YesNo","question":"Will the price of LTC close on or above [0] USD on [1] on [2]?","example":"Will the price of LTC close on or above $200 USD on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x62eb64a624367e914326d285940ff964b388d86e2e640a7a0e08ec23a41d9af3"},{"marketType":"YesNo","question":"Will the price of LTC, exceed [0] USD, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of LTC exceed $40 USD on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0xcbfbc08241ba60e3febf2b0d02032b831175082dd87753f828c9307ac386d034"},{"marketType":"Scalar","question":"What price will LTC close at in USD on [0] on [1]?","example":"What price will LTC close at in USD on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"},{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x9952a2564dbb21729f5b80bced0f07a6dbb69c3dc6fdb599c9b748196a025da0"}]},"USDT":{"templates":[{"marketType":"YesNo","question":"Will the price of LTC close on or above [0] USDT on [1] on [2]?","example":"Will the price of LTC close on or above $200 USDT on Binance (binance.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x4d5a7b9433329487bcbe3a39fadc37014dd276161364711e1a8dbe7de567be52"},{"marketType":"YesNo","question":"Will the price of LTC, exceed [0] USDT, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of LTC exceed $40 USDT on Binance (binance.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0x83816e285588fc4f5797bec60613eba6378f70227e698897e45c433f63787dba"},{"marketType":"Scalar","question":"What price will LTC close at in USDT on [0] on [1]?","example":"What price will LTC close at in USDT on December 31, 2019 on Binance (binance.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Bittrex (bittrex.com)","label":"Bittrex (bittrex.com)"},{"value":"Binance (binance.com)","label":"Binance (binance.com)"},{"value":"Huobi Global (hbg.com)","label":"Huobi Global (hbg.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xf4f153105fa21d9a7f370128470fa06a5dcc3a370410eed62a30aeaba62a1e0f"}]},"EUR":{"templates":[{"marketType":"YesNo","question":"Will the price of LTC close on or above [0] EUR on [1] on [2]?","example":"Will the price of LTC close on or above $200 EUR on Coinbase Pro (pro.coinbase.com) on December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0x76eea4fcfea3c7f7208d3769b7340cf57b402b040c2f43120e85a3003395feb4"},{"marketType":"YesNo","question":"Will the price of LTC, exceed [0] EUR, on [1] anytime between the open of [2] and close of [3]?","example":"Will the price of LTC exceed $40 EUR on Coinbase Pro (pro.coinbase.com) anytime between the oepn of September 1, 2019 and close of December 31, 2019?","inputs":[{"id":0,"type":"TEXT","placeholder":"Value #","validationType":"NUMBER"},{"id":1,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":2,"type":"DATEYEAR","placeholder":"Open, Day of Year"},{"id":3,"type":"DATEYEAR","placeholder":"Close, Day of Year"}],"resolutionRules":{},"hash":"0x046da1f342cf384d6985855b2b673739f50eab9273b364e965987a809324170f"},{"marketType":"Scalar","question":"What price will LTC close at in EUR on [0] on [1]?","example":"What price will LTC close at in EUR on December 31, 2019 on Coinbase Pro (pro.coinbase.com)?","denomination":"USD","inputs":[{"id":0,"type":"DROPDOWN","placeholder":"Exchange","values":[{"value":"Coinbase Pro (pro.coinbase.com)","label":"Coinbase Pro (pro.coinbase.com)"},{"value":"Bitstamp (bitstamp.net)","label":"Bitstamp (bitstamp.net)"},{"value":"Kraken (kraken.com)","label":"Kraken (kraken.com)"}]},{"id":1,"type":"DATEYEAR","placeholder":"Day of Year"}],"resolutionRules":{},"hash":"0xb0923427881384b53627050aaeb4a9cf9831047e43b49fe46182541c4e12de6b"}]}}}}}}


export const TEMPLATE_VALIDATIONS = {"0x555b57b7096010e7a8a1136577b888f0aac6a963f90e8609a20805289eb709a4":{"templateValidation":"Will (.*) win the (2019|2020|2021|2022) (PGA Championship|Open Championship|US Open|Masters Tournament|British Open)?"},"0x9f39eb57e7a9109a23416c65ee919e56bbee44ed4df0898b5c3770e701d05b63":{"templateValidation":"Will (.*) make the cut at the (2019|2020|2021|2022) (PGA Championship|Open Championship|US Open|Masters Tournament|British Open)?"},"0x2ffafbb3f1b354a1be0cd7fc10d199f822b61e0a3933723882ccfc317971f489":{"templateValidation":"Which golfer will win the (2019|2020|2021|2022) (PGA Championship|Open Championship|US Open|Masters Tournament|British Open)?"},"0xd90162c00d9ffc40249a5e3a7537af6a454a27186ca64b586ce04eb2073a2f39":{"templateValidation":"Will the (.*) win vs the (.*), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x4c5565b108c2ec016d81ca8940cd21df047c1f4ead92d7d90396f4c4d3cb4c41":{"templateValidation":"Will the (.*) & (.*) score (.*) or more combined goals, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xb4e45e68b3462c32f93a97a25a458127aafa4bd052669863efa500e124dc815d":{"templateValidation":"Will the (.*) win the (2019-20|2020-21|2021-22) Stanley Cup?"},"0x2241c5b5dae5fccd31a017173764ffffbc3e612e96e6828cfbcf5d964d8ab279":{"templateValidation":"Which team will win: (.*) vs (.*), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xd5cc030641edc76fbef02407f3afe5befdad1f8546e108a193c6b4698e5b89e5":{"templateValidation":"(.*) vs (.*): Total goals scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xc48fcf70e146d7f24a5d840f432c5fa280663c662bd3199a7d1bbe13725bdbfb":{"templateValidation":"Which NHL team will win the (2019-20|2020-21|2021-22) Stanley Cup?"},"0x8881652322573bf5b8c2e2be749bb5ebd91cbcd8fe620034d8e80dcb25541302":{"templateValidation":"Which NHL player will win the (2019-20|2020-21|2021-22) (Hart Trophy|Norris Trophy|Vezina Trophy|Calder Trophy)?"},"0x5ad742b1509e9f3c290820d0f58c282e2837b67eeb4966cccebaf2a9165f2e09":{"templateValidation":"Total number of wins the (.*) will finish (2019-20|2020-21|2021-22) regular season with?"},"0x1364e4f250da59b2aa9acf6abc79e4029d3b554f2742daf0b643a34aacef4011":{"templateValidation":"Will (.*) win the (2019|2020|2021|2022) (Kentucky Derby|Preakness|Belmont|Triple Crown)?"},"0xae5243d22496121af6310b9309befd813cb2a8e5ce2c6070b9f4a2e18b5b29e0":{"templateValidation":"Which horse will win the (2019|2020|2021|2022) (Kentucky Derby|Preakness|Belmont|Triple Crown)?"},"0xe9485562e27609fdf99747a08380383b37df3ec2f35458543414cd65d5112b0e":{"templateValidation":"Will (.*) win the (2019|2020|2021|2022) (Australian Open|French Open|Wimbledon|US Open)?"},"0xec042693f4130534bb54886dd63001394c45b6113bd35ffb5c0311eb62b7b2b3":{"templateValidation":"Which tennis player will win the (2019|2020|2021|2022) (Australian Open|French Open|Wimbledon|US Open)?"},"0x1cc6d4171af59f96e405e1f1b22ccf26c400490a5d941baa7515d3932149d86c":{"templateValidation":"(2019|2020|2021|2022) (Australian Open|French Open|Wimbledon|US Open) Match play winner: (.*) vs (.*)?"},"0xc10d5c98daf4a76fbc8fe810c4138c14adf7c3156d20d2aaef47e9da4ccf4016":{"templateValidation":"Which team will win: (.*) vs (.*), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xefaacf4b0300e7100ab6fac864f61fb80f15f0ede53b30df649d37a3112d994f":{"templateValidation":"(.*) vs (.*): Total goals scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x8e25cb1d726b475e392e27b98a9d58c7cdbcb5f22b8aae459b53aa5e15c72f9f":{"templateValidation":"Will the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) win vs the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x576738d7a49f1f4790360e63d5a42454ad3170dd51c460f14ed1ca0e289ef038":{"templateValidation":"Will the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) win vs the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) by (.*) or more points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x74e61aa8dd822dc7d5f9426a83bacbc20583d286e19a03885ed721293102a688":{"templateValidation":"Will the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) & (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) score (.*) or more combined points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x1b5a9cc0c27a5f99d80aa3d459b9aefdb4cab3edb7dc0bbd8fc955535915f497":{"templateValidation":"Will the (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) win the (2019-20|2020-21|2021-22) NBA Championship?"},"0x97b8b49d0194864a17a05e678538b97c233465adf9c080ec00c9abcae6757316":{"templateValidation":"Will (.*) win the (2019-20|2020-21|2021-22) (Most Valuable Player|Rookie of the year|6th Man|Defensive Player of the Year|Most Improved player) award?"},"0xad8db569c459e5a9650d5adbbc3c202b8ccef906955b93f77cfc5387eaf2c6a0":{"templateValidation":"Which team will win: [0] vs [1], Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x99bf171e0df5862ca3a04a9048d91d1e0f6135536eaec208e6e60a9e2432f2a5":{"templateValidation":"(Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) vs (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards): Total Points scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x2c7fa2c5159beb1883b74cd6f5439213564914867471ec157a50b63946dc3d33":{"templateValidation":"Which NBA team will win the (2019-20|2020-21|2021-22) (Eastern Conference Finals|Western Conference Finals|NBA Championship)?"},"0x05c57279195026f1196471ad671310d8f484474c1e4cb571fd4c8fca90fff221":{"templateValidation":"Which NBA player will win the (2019-20|2020-21|2021-22) (Most Valuable Player|Rookie of the year|6th Man|Defensive Player of the Year|Most Improved player) award?"},"0x9f9dd1e775385731b373a550a27b4168d3ef9287b6a948f102a6f79c5499f136":{"templateValidation":"Which Player will have the most (Points Scored|Rebounds|Assists|made 3-pointers) at the end of the the (2019-20|2020-21|2021-22) regular season?"},"0x95f83c9f8d4ea5f226f2ddc67b1ba8aa62b520410ec83037f0d3e767d2bfce71":{"templateValidation":"Total number of wins (Atlanta Hawks|Boston Celtics|Brooklyn Nets|Charlotte Hornets|Chicago Bulls|Cleveland Cavaliers|Dallas Mavericks|Denver Nuggets|Detroit Pistons|Golden State Warriors|Houston Rockets|Indiana Pacers|LA Clippers|LA Lakers|Memphis Grizzlies|Miami Heat|Milwaukee Bucks|Minnesota Timberwolves|New Orleans Pelicans|New York Knicks|Oklahoma City Thunder|Orlando Magic|Philadelphia 76ers|Phoenix Suns|Portland Trail Blazers|Sacramento Kings|San Antonio Spurs|Toronto Raptors|Utah Jazz|Washington Wizards) will finish (2019-20|2020-21|2021-22) regular season with?"},"0x2f85afc1c2995288100eecf51adc1644bd3f0130735226d4a44f7f1b2c36103d":{"templateValidation":"Will (.*) win vs (.*); (Men's|Women's) basketball, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x923497a46bdfa38133a7b0de7af0fa4a5c5deead182d4cc5a88fd538ee07278d":{"templateValidation":"Will (.*) win vs (.*) by (.*) or more points, (Men's|Women's) basketball, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x74bc125fd28001521cb3f2af1c9ecdae9da272fbe8173c99631b43bd09a1f129":{"templateValidation":"Will (.*) & (.*) score (.*) or more combined points; (Men's|Women's) basketball, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x79b3d296be94e0bf2c3a051062c20951ef00ec6b3cf4e0a2d233766c15eb2f4d":{"templateValidation":"Will (.*) win the (2019|2020|2021|2022) NCAA (Men's|Women's) National Championship?"},"0xdf3954de796093fe1b5b16c88a986195cc0dd0d0358b03270627e8913f2573ec":{"templateValidation":"Will (.*) make the (2019|2020|2021|2022) (Men's|Women's) (NCAA Tournament|Sweet 16|Elite 8|Final Four)?"},"0x9da99d847f8709345d7e9008ed77355be6d6da0a25e9e307e19e31200e85702f":{"templateValidation":"Which team will win: (.*) vs (.*), (Men's|Women's) basketball, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xf57e47fdcb179751df2610e860933b4ca4ea56abfe634da6a71aebb71bd68997":{"templateValidation":"(Men's|Women's) basketball; (.*) vs (.*): Total Points scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x234462cb82f5911198b5053a6503f818bb8dee948b37e6ab511ae2ae2ac5c02a":{"templateValidation":"Which college basketball team will win the (Men's|Women's) (2019|2020|2021|2022) (American East|American|Atlantic 10|ACC|Atlantic Sun|Big 12|Big East|Big Sky|Big South|Big Ten|Big West|Colonial|Conference USA|Horizon|Ivy|MAAC|Mid-American|MEAC|Missouri Valley|Mountain West|Northeast|Ohio Valley|Pac-12|Patriot League|SEC|Southern|Southland|SWAC|Summit League|Sun Belt|West Coast|WAC) tournament?"},"0x59d3a98b357d405ff0cc7aea32d7bfe55f7b44b0f0913844c88937f12569c24f":{"templateValidation":"Will the (.*) win the (2019|2020|2021|2022) (American League Division Series|National League Division Series|American League Championship Series|National League Championship Series|World Series)?"},"0xfd1ccbcde754175d9472e31edb455b0136913411b296fc52714b9ead6b6acfdc":{"templateValidation":"Which team will win: (.*) vs (.*), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x7cc8ea40d147fcc730696661355f27b8108cc9af62e2c294ff1275971940af38":{"templateValidation":"Which MLB team will win the (2019|2020|2021|2022) (American League Division Series|National League Division Series|American League Championship Series|National League Championship Series|World Series)?"},"0x117883fd2bf1df971f8d35cc9d35b5a070b6ec0b8cabfc9656d4be69885f6aef":{"templateValidation":"(.*) vs (.*): Total Runs scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x024d283f0845c7a95addb295e46ff3c2ef7e4f0eccf463578a7db051f99e7ddd":{"templateValidation":"Which player will win the (2019|2020|2021|2022) (American League Division Series|National League Division Series|American League Championship Series|National League Championship Series|World Series)?"},"0xec06c6aa8deb73fb90d393fd1b06f1836a8aefda36b19458eb5f8e4520d438e7":{"templateValidation":"Total number of wins the (.*) will finish the (2019|2020|2021|2022) regular season with?"},"0xb1fc4620ecbd00303243a32897647ed04f8bdd0fc06155ade475fa0e53b40295":{"templateValidation":"Will the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) win vs the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xbfc34250f880b4f439fe4ed64ad08cb6717cb41cb5f6217d5d448484203673d4":{"templateValidation":"Will the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) win vs the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) by (.*) or more points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xdc3f6ef3dc9533335587a6181fd085590421d15f4e915cd8c9b269f6ad853feb":{"templateValidation":"Will the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) & (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) score (.*) or more combined points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x84baf3a8294846c8b5e74b00730e21975e1f362b7d4839ae98c776e50e87b4f9":{"templateValidation":"Will the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) have (.*) or more regular season wins in (2019|2020|2021|2022)?"},"0x0dc15a75f4c788c26d8c6bd4826a8af63b7c8560eb95de412eb305f76a719ab2":{"templateValidation":"Will the (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) win SuperBowl (.*)?"},"0x4d3c1447c79348ec0ae212f1a5e96e68c0bf16a6bea0420cfb565c22a99286d5":{"templateValidation":"Will (.*) win the (2019-20|2020-21|2021-22) (MVP|Offensive Player of the year|Defensive player of the year|Offensive Rookie of the year|Defensive Rookie of the year|AP Most Valuable Player) award?"},"0xdca74c1d35d2e47859cee44a61792d210ec3d5f6eef448781e274a1b09bda951":{"templateValidation":"Which NFL Team will win: [0] vs [1], Estimated schedule start time (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x1c1de64224f31ce209784b82b7146c1073ee48153b9421b42cb0e600abfbc7c2":{"templateValidation":"Which NFL Team will win: [0] vs [1], Estimated schedule start time (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x5da9b112452d3208ca59aec10dbde9a40faadde1ce8217504fbfba96b107baa9":{"templateValidation":"(Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) vs (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins): Total goals scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x95df1f54e760e52b37ed86e2cd2c486b81b224136d3c70d63aa125567858da75":{"templateValidation":"Which NFL team will win the (2019|2020|2021|2022) (Superbowl|AFC Championship game|NFC Championship game)?"},"0x69bbecf582ce1a8f972189f44957f652385848bf4abf2713bf3dd54f59e377e7":{"templateValidation":"Which NFL player will win the (2019|2020|2021|2022) [1] award?"},"0x711624b346f94fae6794b32a9e59cddf9a3acb8eca10f95161251b42c12094ae":{"templateValidation":"Total number of wins (Arizona Cardinals|Atlanta Falcons|Baltimore Ravens|Buffalo Bills|Carolina Panthers|Chicago Bears|Cincinnati Bengals|Cleveland Browns|Dallas Cowboys|Denver Broncos|Detroit Lions|Green Bay Packers|Houston Texans|Indianapolis Colts|Jacksonville Jaguars|Kansas City Chiefs|Las Angeles Chargers|Las Angeles Rams|Miami Dolphins|Minnesota Vikings|New England Patriots|New Orleans Saints|New York Giants|New York Jets|Oakland Raiders|Philadelphia Eagles|Pittsburgh Steelers|San Francisco 49ers|Seattle Seahawks|Tampa Bay Buccaneers|Tennessee Titans|Washington Redskins) will finish (2019|2020|2021|2022) regular season with?"},"0x00918d4ba74452063b7c51e3485d21ba878d5e6c95c0771a21674ce1a01d0af0":{"templateValidation":"Will the (.*) win vs the (.*), Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xffea3c12e1d0fb93120cbd29bd4d1c1fee27adda6fd9a590e40e7f467f2ec6bc":{"templateValidation":"Will the (.*) win vs the (.*) by (.*) or more points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x5e430b6c5a4f3e201ac4b07864fd0f0fb032c36860401a8d92919eae6eaecf51":{"templateValidation":"Will (.*) & (.*) score (.*) or more combined points, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x6e01be5324c39a7d450b29778a8aaa707748abe55d05628ac13538c63342a075":{"templateValidation":"Which College Football Team will win: (.*) vs (.*), Estimated schedule start time (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xa4dbe97ba7eefa85c7b2174a0b3ffc17894e851ff377481f7a1636004d1b15dc":{"templateValidation":"(.*) vs (.*): Total points scored; Over/Under (.*).5, Estimated schedule start time: (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x2617dcd5b675cb113d1bbf192727f90d2f2a74e107a1bc23b71fa8e5b0c3ad11":{"templateValidation":"Which team will win the (2019|2020|2021|2022) (.*): (.*) vs (.*)?"},"0xf39f32ed052de5a55a82aeedd8026fb119b25987d0d9be027780931e0fb7b6b6":{"templateValidation":"Which college football team will win (2019|2020|2021|2022) National Championship?"},"0xee36ad222b83e01afeb62ae6d4ac456eb421ca327fa3ee48169c0c83de56c00a":{"templateValidation":"Which college football player will win the (2019|2020|2021|2022) Heisman Trophy?"},"0xb044fa9ba98a4df4056d659132a7ae4ad630998f006b00125d62cdbe8b0d6913":{"templateValidation":"Total number of wins (.*) will finish (2019|2020|2021|2022) regular season with?"},"0x94e2c0f248605461b2ba491d7e0e05157a31442ca1370b3c0cee46648d6930dc":{"templateValidation":"Will (.*) win the (2019|2020|2021|2022) presidential election?"},"0x74fa917ece7b1657330ac8c4fb7309537a2b6b31874081b86556c877a44f08e0":{"templateValidation":"Will (.*) win the (2019|2020|2021|2022) (Democratic|Republican) presidential nomination?"},"0x80b8ec188d6c42d724dc730d51b2d2d726c83f49e3098a12b43b81881aae3122":{"templateValidation":"Will (.*) run for (President|Vice-President|Senator|Congress) by (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xf8993ded0c84d9ab3e4b60217ddeccb313f34cc558f194fae89ef5f1f268601c":{"templateValidation":"Will (.*) be impeached by (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xb0d66e6e9a0b7ebba5ff65be0e6f9ffd243a86fa889061f2481a96f64202576e":{"templateValidation":"Who will win the (2019|2020|2021|2022) US presidential election?"},"0x0d2f6b20431641b5fcac9103a246ce18c19dd7e9980b3d19a100e5d71b9ad514":{"templateValidation":"Who will be the (2019|2020|2021|2022) (Democratic|Republican) (President|Vice-President) nominee?"},"0xd6515f3fe7caddd9d01c46481f22530838edcd2e39f29633a09069e47640e700":{"templateValidation":"Which party will win (Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming) in the (2019|2020|2021|2022) Presidential election?"},"0xe84f6a33c694809a036a4a2b30ab964886d8f4d52880fb37f8f9398353cdd457":{"templateValidation":"Will (.*) be (President|Prime Minister|Supreme Leader|Crown Prince|Chancellor|Chief minister) of (.*) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0xcf965276e473d056c8957f929cbf1d71d2499a6703ab6eedd7a07b1f8bcbd71e":{"templateValidation":"Will (.*) be impeached by (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) dd:dd (AM|PM) \\(UTC 0\\)?"},"0x89ec6e12065968394b773003997afb4482c60fa022e083006e785dc61858f527":{"templateValidation":"Will the price of (.*) close on or above (.*) (US dollar (USD)|Euro (EUR)|Chinese yuan (CNY)|British pound (GBP)|Australian dollar (AUD)|Canadian dollar (CAD)|Swiss franc (CHF)) on the (.*) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x1c18e9b6bf3b5e5f988bfe506e7fbec2c8736408c237a380dbf5a256df29c1a1":{"templateValidation":"Will the price of (.*), exceed (.*) (US dollar (USD)|Euro (EUR)|Chinese yuan (CNY)|British pound (GBP)|Australian dollar (AUD)|Canadian dollar (CAD)|Swiss franc (CHF)) on the (.*), anytime between the opening on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and the close on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x76bab31f7b8038b4a06677347fb564e94e03276dbcaaafa7624eb3818e5cf41f":{"templateValidation":"What price will (.*) close at in [1] on the (.*) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x749ca4c6ad55fdf664f892c0e4dfb245801e6cec452b9d654d3164324c8adb1d":{"templateValidation":"Will the (.*) close on or above (.*) (US dollar (USD)|Euro (EUR)|Chinese yuan (CNY)|British pound (GBP)|Australian dollar (AUD)|Canadian dollar (CAD)|Swiss franc (CHF)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x095d995fc91952611445eba408ea53eaa8d84446fd4ea277e3969439f8d6bf81":{"templateValidation":"What price will the (.*) close at in [1] on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x7c731ff49afefde65e31d0d98c8438e90945b105aa15e2fd7bfafcf637ee36ae":{"templateValidation":"Will (.*) host the (2019|2020|2021|2022) (Academy Awards|Emmy Awards|Grammy Awards|Golden Globe Awards)?"},"0xf32fc175fd52fc52ecc53cf31c678a4fcf3bccab923c406b91e3ebc6be18116f":{"templateValidation":"Will (.*) win an award for (.*) at the (2019|2020|2021|2022) (Academy Awards|Emmy Awards|Grammy Awards|Golden Globe Awards)?"},"0xe65a88b5d0ed2111d0cdf7918b815abb6c405c4975d727829be5c1c98c6e2207":{"templateValidation":"Will (.*) win an award for (.*) at the (2019|2020|2021|2022) (Academy Awards|Emmy Awards|Grammy Awards|Golden Globe Awards)?"},"0x35b882c1d916a19f310390b36477fcae835f7ed06153442dc5599f5d9078c881":{"templateValidation":"Will (.*) gross (.*) (US dollar (USD)|Euro (EUR)|Chinese yuan (CNY)|British pound (GBP)|Australian dollar (AUD)|Canadian dollar (CAD)|Swiss franc (CHF)) or more, in it's opening weekend (US (United States)|Worldwide)?"},"0x15be6d7ee40265323e97739bf880c678969f0a16c42bc60d206f6814710bffab":{"templateValidation":"Who will host the (2019|2020|2021|2022) (Academy Awards|Emmy Awards|Grammy Awards|Golden Globe Awards)?"},"0xf45b844fdd953160a3716c23d5e569f5f0f21868616f9cd56e0b7e765bf90e6b":{"templateValidation":"Who will win for (.*) in the (2019|2020|2021|2022) (Academy Awards|Emmy Awards|Grammy Awards|Golden Globe Awards)?"},"0x906f13f108d6d697f8f626d377a5d9cc23caad59bd57465744b81a326345184f":{"templateValidation":"Will the price of BTC close on or above (.*) USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x5203b073388e9c469138a1450b0a672d0e91436f7e7897aa15de96b4cbbfe51f":{"templateValidation":"Will the price of BTC, exceed (.*) USD, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Bittrex (bittrex.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x11f0c517188a7d5b1a30c91cde2b9dc2e261f24f17e226969da4c9c61a04a5aa":{"templateValidation":"What price will BTC close at in USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x38b007061a853959312af47fe79a53a8fe82454334fa0ea63fb7234966f15865":{"templateValidation":"Will the price of BTC close on or above (.*) USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x6ea525324f9fe25f0f413805844d1c34c1e45cd79a89ec9595573750f78d474d":{"templateValidation":"Will the price of BTC, exceed (.*) USDT, on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xe8319ae75ca465501c777ca96f168d58c9c82426a20045a458f55e05a431115e":{"templateValidation":"What price will BTC close at in USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xdcf399bd2758ae24b09afe1cd1d5b7d415b496f8d120ed6c2dcb66bbfe65999d":{"templateValidation":"Will the price of BTC close on or above (.*) EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xad2e67bf6791717dffc4cd7aa926fc7fbc6c35d7cc127a1406c97a39509dc657":{"templateValidation":"Will the price of BTC, exceed (.*) EUR, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xfe0d66a148f31347029be406990ea8dc604584ced9ef2f36410dbde4c5dcbe17":{"templateValidation":"What price will BTC close at in EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x8a1aa3fb1772e9838cc58b0615ad1a79be8972f6af45b047e3ab55bdf3998704":{"templateValidation":"Will the price of ETH close on or above (.*) USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xf5634c578fe5cec4889d9a19125b129b5a474a438e339e4b9eacaf42c876212a":{"templateValidation":"Will the price of ETH, exceed (.*) USD, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xb0b143b6db66f8a60a01e8f225aa9793a06661a9ebb4aa61ac3f5825d977eae7":{"templateValidation":"What price will ETH close at in USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x7cb7397b4ed1cfa2bd4c92c0dae06d6954ce7d3ad86e31bc42cbe581939e53e9":{"templateValidation":"Will the price of ETH close on or above (.*) USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x175d3dcde853f056e976744c21b3fb6e274119dfe246cffe604eb07744dbce93":{"templateValidation":"Will the price of ETH, exceed (.*) USDT, on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x7cab448ac91559384e3827ab144efdc40130eb52478b1562d273258ecb9128df":{"templateValidation":"What price will ETH close at in USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xcdcdd77df024fb29fec56da358401a9a3f2a58c79cf1936da52c1275cee8a781":{"templateValidation":"Will the price of ETH close on or above (.*) EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xe21b8b1dfbf421c8723098d1f2735a4e7294475723b9453a16faf2a963943df6":{"templateValidation":"Will the price of ETH, exceed (.*) EUR, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x946a7d9ebad21394f93d4076be63e05c469ffa1a7a5ef73554537b9378c07fd1":{"templateValidation":"What price will ETH close at in EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x62eb64a624367e914326d285940ff964b388d86e2e640a7a0e08ec23a41d9af3":{"templateValidation":"Will the price of LTC close on or above (.*) USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xcbfbc08241ba60e3febf2b0d02032b831175082dd87753f828c9307ac386d034":{"templateValidation":"Will the price of LTC, exceed (.*) USD, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x9952a2564dbb21729f5b80bced0f07a6dbb69c3dc6fdb599c9b748196a025da0":{"templateValidation":"What price will LTC close at in USD on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)|Bittrex (bittrex.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x4d5a7b9433329487bcbe3a39fadc37014dd276161364711e1a8dbe7de567be52":{"templateValidation":"Will the price of LTC close on or above (.*) USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x83816e285588fc4f5797bec60613eba6378f70227e698897e45c433f63787dba":{"templateValidation":"Will the price of LTC, exceed (.*) USDT, on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xf4f153105fa21d9a7f370128470fa06a5dcc3a370410eed62a30aeaba62a1e0f":{"templateValidation":"What price will LTC close at in USDT on (Bittrex (bittrex.com)|Binance (binance.com)|Huobi Global (hbg.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x76eea4fcfea3c7f7208d3769b7340cf57b402b040c2f43120e85a3003395feb4":{"templateValidation":"Will the price of LTC close on or above (.*) EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0x046da1f342cf384d6985855b2b673739f50eab9273b364e965987a809324170f":{"templateValidation":"Will the price of LTC, exceed (.*) EUR, on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) anytime between the open of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2}) and close of (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"},"0xb0923427881384b53627050aaeb4a9cf9831047e43b49fe46182541c4e12de6b":{"templateValidation":"What price will LTC close at in EUR on (Coinbase Pro (pro.coinbase.com)|Bitstamp (bitstamp.net)|Kraken (kraken.com)) on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})?"}}
