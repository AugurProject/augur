import { CUSTOM } from 'modules/common/constants';

export interface SortedGroup {
  value: string;
  label: string;
  subGroup?: Array<SortedGroup>;
  autoCompleteList?: Array<SortedGroup>;
}

export const categories: Array<SortedGroup> = [
  {
    value: 'Sports',
    label: 'Sports',
    subGroup: [
      {
        value: 'Soccer',
        label: 'Soccer',
        subGroup: [
          { value: 'Copa America', label: 'Copa America' },
          { value: 'Africa Cup of Nations', label: 'Africa Cup of Nations' },
          { value: 'UEFA Nations League', label: 'UEFA Nations League' },
          { value: 'UEFA Champions League', label: 'UEFA Champions League' },
          { value: 'English Premier League', label: 'English Premier League' },
          { value: 'English FA Cup', label: 'English FA Cup' },
          {
            value: 'Mexican Liga BBVA Bancomer',
            label: 'Mexican Liga BBVA Bancomer',
          },
          { value: 'German Bundesliga', label: 'German Bundesliga' },
          { value: 'French Ligue 1', label: 'French Ligue 1' },
          { value: 'FIFA World Cup', label: 'FIFA World Cup' },
          { value: 'CONCACAF Gold Cup', label: 'CONCACAF Gold Cup' },
          { value: 'UEFA', label: 'UEFA' },
          {
            value: 'English League Championship',
            label: 'English League Championship',
          },
          { value: 'Major League Soccer', label: 'Major League Soccer' },
          { value: CUSTOM, label: CUSTOM }
        ],
        autoCompleteList: [
          {
            value: 'Spanish Primera Division',
            label: 'Spanish Primera Division',
          },
          { value: 'Italian Serie A', label: 'Italian Serie A' },
          {
            value: 'FIFA Under-20 World Cup',
            label: 'FIFA Under-20 World Cup',
          },
          {
            value: 'CONCACAF Champions League',
            label: 'CONCACAF Champions League',
          },
          {
            value: 'Mexican Liga BBVA Bancomer',
            label: 'Mexican Liga BBVA Bancomer',
          },
          { value: 'Mexican Ascenso MX', label: 'Mexican Ascenso MX' },
          {
            value: 'Guatemalan Liga Nacional',
            label: 'Guatemalan Liga Nacional',
          },
          {
            value: 'Jamaican Premier League',
            label: 'Jamaican Premier League',
          },
          {
            value: 'Salvadoran Primera Division',
            label: 'Salvadoran Primera Division',
          },
          {
            value: "United States NCAA Women's Soccer",
            label: "United States NCAA Women's Soccer",
          },
          {
            value: "United States NWSL Women's League",
            label: "United States NWSL Women's League",
          },
          { value: 'CONCACAF League', label: 'CONCACAF League' },
          { value: 'Mexican Copa MX', label: 'Mexican Copa MX' },
          { value: 'United States Open Cup', label: 'United States Open Cup' },
          {
            value: 'Costa Rican Primera Division',
            label: 'Costa Rican Primera Division',
          },
          {
            value: 'Honduran Primera Division',
            label: 'Honduran Primera Division',
          },
          { value: 'USL Championship', label: 'USL Championship' },
          {
            value: 'North American Soccer League',
            label: 'North American Soccer League',
          },
          {
            value: "United States NCAA Men's Soccer",
            label: "United States NCAA Men's Soccer",
          },
          { value: 'English Carabao Cup', label: 'English Carabao Cup' },
          {
            value: 'French Coupe de la Ligue',
            label: 'French Coupe de la Ligue',
          },
          { value: 'Dutch KNVB Beker', label: 'Dutch KNVB Beker' },
          { value: 'Russian Premier League', label: 'Russian Premier League' },
          { value: 'Scottish Premiership', label: 'Scottish Premiership' },
          { value: 'Scottish League Cup', label: 'Scottish League Cup' },
          { value: 'Greek Super League', label: 'Greek Super League' },
          { value: 'Swiss Super League', label: 'Swiss Super League' },
          { value: 'Norwegian Eliteserien', label: 'Norwegian Eliteserien' },
          {
            value: 'Romanian First Division',
            label: 'Romanian First Division',
          },
          { value: 'Maltese Premier League', label: 'Maltese Premier League' },
          { value: 'German 2. Bundesliga', label: 'German 2. Bundesliga' },
          { value: 'French Ligue 2', label: 'French Ligue 2' },
          { value: 'English League One', label: 'English League One' },
          {
            value: 'English National League',
            label: 'English National League',
          },
          {
            value: 'Northern Irish Premiership',
            label: 'Northern Irish Premiership',
          },
          { value: 'UEFA Europa League', label: 'UEFA Europa League' },
          { value: 'Spanish Copa del Rey', label: 'Spanish Copa del Rey' },
          { value: 'Italian Coppa Italia', label: 'Italian Coppa Italia' },
          { value: 'German DFB Pokal', label: 'German DFB Pokal' },
          { value: 'French Coupe de France', label: 'French Coupe de France' },
          { value: 'Dutch Eredivisie', label: 'Dutch Eredivisie' },
          { value: 'Portuguese Liga', label: 'Portuguese Liga' },
          {
            value: 'Belgian First Division A',
            label: 'Belgian First Division A',
          },
          { value: 'Scottish Cup', label: 'Scottish Cup' },
          { value: 'Turkish Super Lig', label: 'Turkish Super Lig' },
          { value: 'Austrian Bundesliga', label: 'Austrian Bundesliga' },
          { value: 'Danish SAS-Ligaen', label: 'Danish SAS-Ligaen' },
          {
            value: 'Swedish Allsvenskanliga',
            label: 'Swedish Allsvenskanliga',
          },
          { value: 'Israeli Premier League', label: 'Israeli Premier League' },
          {
            value: 'Spanish Segunda División',
            label: 'Spanish Segunda División',
          },
          { value: 'Italian Serie B', label: 'Italian Serie B' },
          { value: 'Dutch Eerste Divisie', label: 'Dutch Eerste Divisie' },
          { value: 'English League Two', label: 'English League Two' },
          { value: 'Welsh Premier League', label: 'Welsh Premier League' },
          { value: 'Irish Premier Division', label: 'Irish Premier Division' },
          {
            value: 'FIFA Confederations Cup',
            label: 'FIFA Confederations Cup',
          },
          {
            value: 'CONCACAF Nations League Qualifying',
            label: 'CONCACAF Nations League Qualifying',
          },
          {
            value: 'FIFA World Cup Qualifying - CAF',
            label: 'FIFA World Cup Qualifying - CAF',
          },
          {
            value: 'FIFA World Cup Qualifying - CONMEBOL',
            label: 'FIFA World Cup Qualifying - CONMEBOL',
          },
          {
            value: 'FIFA World Cup Qualifying - UEFA',
            label: 'FIFA World Cup Qualifying - UEFA',
          },
          {
            value: 'FIFA Under-17 World Cup',
            label: 'FIFA Under-17 World Cup',
          },
          {
            value: 'UEFA European Championship',
            label: 'UEFA European Championship',
          },
          {
            value: 'UEFA European Under-19 Championship',
            label: 'UEFA European Under-19 Championship',
          },
          {
            value: 'Africa Nations Cup Championship',
            label: 'Africa Nations Cup Championship',
          },
          {
            value: 'AFC Asian Cup Qualifiers',
            label: 'AFC Asian Cup Qualifiers',
          },
          { value: 'SAFF Championship', label: 'SAFF Championship' },
          { value: 'Mens Olympics', label: 'Mens Olympics' },
          {
            value: "Women's International Friendly",
            label: "Women's International Friendly",
          },
          { value: "Women's Olympic ", label: "Women's Olympic " },
          { value: "FIFA Women's World Cup", label: "FIFA Women's World Cup" },
          { value: 'AFF Cup', label: 'AFF Cup' },
          { value: 'AFC Asian Cup', label: 'AFC Asian Cup' },
          { value: 'International Friendly', label: 'International Friendly' },
          {
            value: 'FIFA Under-20 World Cup',
            label: 'FIFA Under-20 World Cup',
          },
          {
            value: 'FIFA World Cup Qualifying - OFC',
            label: 'FIFA World Cup Qualifying - OFC',
          },
          {
            value: 'FIFA World Cup Qualifying - CONCACAF',
            label: 'FIFA World Cup Qualifying - CONCACAF',
          },
          {
            value: 'FIFA World Cup Qualifying - AFC',
            label: 'FIFA World Cup Qualifying - AFC',
          },
          { value: 'FIFA Club World Cup', label: 'FIFA Club World Cup' },
          {
            value: 'CONMEBOL Copa Libertadores',
            label: 'CONMEBOL Copa Libertadores',
          },
          { value: 'Argentine Superliga', label: 'Argentine Superliga' },
          { value: 'Argentine Nacional B', label: 'Argentine Nacional B' },
          { value: 'Argentine Primera C', label: 'Argentine Primera C' },
          { value: 'Brazilian Serie A', label: 'Brazilian Serie A' },
          { value: 'Brazilian Serie C', label: 'Brazilian Serie C' },
          {
            value: 'Brazilian Campeonato Carioca',
            label: 'Brazilian Campeonato Carioca',
          },
          {
            value: 'Brazilian Campeonato Mineiro',
            label: 'Brazilian Campeonato Mineiro',
          },
          { value: 'Colombian Primera A', label: 'Colombian Primera A' },
          { value: 'Colombian Primera B', label: 'Colombian Primera B' },
          { value: 'Copa Chile', label: 'Copa Chile' },
          {
            value: 'Paraguayan Primera Division',
            label: 'Paraguayan Primera Division',
          },
          {
            value: 'Peruvian Primera Profesional',
            label: 'Peruvian Primera Profesional',
          },
          {
            value: 'Bolivian Liga Profesional',
            label: 'Bolivian Liga Profesional',
          },
          {
            value: 'CONMEBOL Copa Sudamericana',
            label: 'CONMEBOL Copa Sudamericana',
          },
          { value: 'Copa Argentina', label: 'Copa Argentina' },
          { value: 'Argentine Primera B', label: 'Argentine Primera B' },
          { value: 'Argentine Primera D', label: 'Argentine Primera D' },
          { value: 'Brazilian Serie B', label: 'Brazilian Serie B' },
          { value: 'Copa Do Brazil', label: 'Copa Do Brazil' },
          {
            value: 'Brazilian Campeonato Gaucho',
            label: 'Brazilian Campeonato Gaucho',
          },
          {
            value: 'Brazilian Campeonato Paulista',
            label: 'Brazilian Campeonato Paulista',
          },
          { value: 'Copa Colombia', label: 'Copa Colombia' },
          {
            value: 'Chilean Primera Division',
            label: 'Chilean Primera Division',
          },
          { value: 'Ecuadoran Primera A', label: 'Ecuadoran Primera A' },
          {
            value: 'Uruguayan Primera Division',
            label: 'Uruguayan Primera Division',
          },
          {
            value: 'Venezuelan Primera Profesional',
            label: 'Venezuelan Primera Profesional',
          },
          { value: 'AFC Champions League', label: 'AFC Champions League' },
          { value: 'Chinese Super League', label: 'Chinese Super League' },
          { value: 'Indian I-League', label: 'Indian I-League' },
          { value: 'Malaysian Super League', label: 'Malaysian Super League' },
          { value: 'Japanese J League', label: 'Japanese J League' },
          { value: 'Thai Premier League', label: 'Thai Premier League' },
          { value: 'Australian A-League', label: 'Australian A-League' },
          {
            value: 'Indonesian Super League',
            label: 'Indonesian Super League',
          },
          {
            value: 'Singaporean Premier League',
            label: 'Singaporean Premier League',
          },
          { value: 'CAF Champions League', label: 'CAF Champions League' },
          {
            value: 'South African Premiership',
            label: 'South African Premiership',
          },
          {
            value: 'South African Nedbank Cup',
            label: 'South African Nedbank Cup',
          },
          {
            value: 'Nigerian Professional League',
            label: 'Nigerian Professional League',
          },
          { value: 'Kenyan Premier League', label: 'Kenyan Premier League' },
          { value: 'Zambian Super League', label: 'Zambian Super League' },
          { value: 'CAF Confederations Cup', label: 'CAF Confederations Cup' },
          {
            value: 'South African First Division',
            label: 'South African First Division',
          },
          {
            value: 'South African Telkom Knockout',
            label: 'South African Telkom Knockout',
          },
          { value: 'Ugandan Super League', label: 'Ugandan Super League' },
          {
            value: 'Ghanaian Premier League',
            label: 'Ghanaian Premier League',
          },
          {
            value: 'Zimbabwean Premier Soccer League',
            label: 'Zimbabwean Premier Soccer League',
          },
        ],
      },
      {
        value: 'Baseball',
        label: 'Baseball',
        subGroup: [
          { value: 'MLB', label: 'MLB' },
          { value: 'College Baseball', label: 'College Baseball' },
          { value: 'Minor League', label: 'Minor League' },
          { value: 'World Baseball Classic', label: 'World Baseball Classic' },
          { value: CUSTOM, label: CUSTOM }
        ],
        autoCompleteList: [
          { value: 'Nippon', label: 'Nippon' },
          { value: 'KBO', label: 'KBO' },
          { value: 'CPBL', label: 'CPBL' },
          { value: 'LCBP', label: 'LCBP' },
          { value: 'Cuba', label: 'Cuba' },
        ],
      },
      {
        value: 'American Football',
        label: 'American Football',
        subGroup: [
          { value: 'NFL', label: 'NFL' },
          { value: 'NCAA', label: 'NCAA' },
          { value: 'CFL', label: 'CFL' },
          { value: 'AFL', label: 'AFL' },
          { value: CUSTOM, label: CUSTOM }
        ],
      },
      {
        value: 'Basketball',
        label: 'Basketball',
        subGroup: [
          { value: 'NBA', label: 'NBA' },
          { value: 'NCAA', label: 'NCAA' },
          { value: 'WNBA', label: 'WNBA' },
          { value: 'Olympics', label: 'Olympics' },
          { value: 'World Cup', label: 'World Cup' },
          { value: CUSTOM, label: CUSTOM }
        ],
        autoCompleteList: [
          { value: 'International Friendly', label: 'International Friendly' },
          { value: 'LNB Pro A', label: 'LNB Pro A' },
          { value: 'FIBA', label: 'FIBA' },
          { value: 'EuroLeague', label: 'EuroLeague' },
          { value: '(Spain) Liga ACB', label: '(Spain) Liga ACB' },
          {
            value: 'Turkish Basketball Super League (BSL)',
            label: 'Turkish Basketball Super League (BSL)',
          },
          {
            value: 'Russia VTB United League',
            label: 'Russia VTB United League',
          },
          {
            value: 'Germany Basketball Bundesliga (BBL)',
            label: 'Germany Basketball Bundesliga (BBL)',
          },
          {
            value: "Italy's Lega Serie A (LBA)",
            label: "Italy's Lega Serie A (LBA)",
          },
          { value: 'Adriatic League (ABA)', label: 'Adriatic League (ABA)' },
          { value: 'Greek A1 League', label: 'Greek A1 League' },
          {
            value: 'Australian National Basketball League (NBL)',
            label: 'Australian National Basketball League (NBL)',
          },
        ],
      },
      {
        value: 'Hockey',
        label: 'Hockey',
        subGroup: [
          { value: 'NHL', label: 'NHL' },
          { value: 'Olympics', label: 'Olympics' },
          {
            value: 'International Ice Hockey Federation (IIHF)',
            label: 'International Ice Hockey Federation (IIHF)',
          },
          { value: CUSTOM, label: CUSTOM }
        ],
      },
      {
        value: 'Golf',
        label: 'Golf',
        subGroup: [
          { value: 'PGA Championship', label: 'PGA Championship' },
          { value: 'Open Championship', label: 'Open Championship' },
          { value: 'US Open', label: 'US Open' },
          { value: 'The Masters', label: 'The Masters' },
          { value: 'British Open', label: 'British Open' },
          { value: 'FedEx Cup', label: 'FedEx Cup' },
          { value: 'PGA', label: 'PGA' },
          { value: 'LPGA', label: 'LPGA' },
          { value: CUSTOM, label: CUSTOM }
        ],
        autoCompleteList: [
          {
            value: 'Sentry Tournament of Champions',
            label: 'Sentry Tournament of Champions',
          },
          { value: 'Sony Open in Hawaii', label: 'Sony Open in Hawaii' },
          { value: 'Desert Classic', label: 'Desert Classic' },
          { value: 'Farmers Insurance Open', label: 'Farmers Insurance Open' },
          {
            value: 'Waste Management Phoenix Open',
            label: 'Waste Management Phoenix Open',
          },
          {
            value: 'AT&T Pebble Beach Pro-Am',
            label: 'AT&T Pebble Beach Pro-Am',
          },
          { value: 'Genesis Open', label: 'Genesis Open' },
          {
            value: 'WGC-Mexico Championship',
            label: 'WGC-Mexico Championship',
          },
          { value: 'Puerto Rico Open', label: 'Puerto Rico Open' },
          { value: 'The Honda Classic', label: 'The Honda Classic' },
          {
            value: 'Arnold Palmer Invitational Pres. By Mastercard',
            label: 'Arnold Palmer Invitational Pres. By Mastercard',
          },
          {
            value: 'THE PLAYERS Championship',
            label: 'THE PLAYERS Championship',
          },
          { value: 'Valspar Championship', label: 'Valspar Championship' },
          {
            value: 'WGC-Dell Technologies Match Play',
            label: 'WGC-Dell Technologies Match Play',
          },
          {
            value: 'Corales Puntacana Resort & Club Championship',
            label: 'Corales Puntacana Resort & Club Championship',
          },
          { value: 'Valero Texas Open', label: 'Valero Texas Open' },
          { value: 'RBC Heritage', label: 'RBC Heritage' },
          {
            value: 'Zurich Classic Of New Orleans',
            label: 'Zurich Classic Of New Orleans',
          },
          {
            value: 'Wells Fargo Championship',
            label: 'Wells Fargo Championship',
          },
          { value: 'AT&T Byron Nelson', label: 'AT&T Byron Nelson' },
          {
            value: 'Charles Schwab Challenge',
            label: 'Charles Schwab Challenge',
          },
          {
            value: 'the Memorial Tournament pres. by Nationwide',
            label: 'the Memorial Tournament pres. by Nationwide',
          },
          { value: 'RBC Canadian Open', label: 'RBC Canadian Open' },
          { value: 'Travelers Championship', label: 'Travelers Championship' },
          { value: '3M Open', label: '3M Open' },
          { value: 'John Deere Classic', label: 'John Deere Classic' },
          { value: 'Barbasol Championship', label: 'Barbasol Championship' },
          { value: 'The Open Championship', label: 'The Open Championship' },
          {
            value: 'WGC-FedEx St. Jude Invitational',
            label: 'WGC-FedEx St. Jude Invitational',
          },
          { value: 'Barracuda Championship', label: 'Barracuda Championship' },
          { value: 'Wyndham Championship', label: 'Wyndham Championship' },
          { value: 'THE NORTHERN TRUST', label: 'THE NORTHERN TRUST' },
          { value: 'BMW Championship', label: 'BMW Championship' },
          { value: 'Tour Championship', label: 'Tour Championship' },
          {
            value: 'Rocket Mortgage Classic',
            label: 'Rocket Mortgage Classic',
          },
          { value: 'Safeway Open', label: 'Safeway Open' },
          { value: 'CIMB Classic', label: 'CIMB Classic' },
          {
            value: 'THE CJ CUP @ NINE BRIDGES',
            label: 'THE CJ CUP @ NINE BRIDGES',
          },
          { value: 'WGC-HSBC CHAMPIONS', label: 'WGC-HSBC CHAMPIONS' },
          {
            value: 'Sanderson Farms Championship',
            label: 'Sanderson Farms Championship',
          },
          {
            value: 'Shriners Hospital for Children Open',
            label: 'Shriners Hospital for Children Open',
          },
          { value: 'Mayakoba Golf Classic', label: 'Mayakoba Golf Classic' },
          { value: 'The RSM Classic', label: 'The RSM Classic' },
          { value: 'Hero World Challenge', label: 'Hero World Challenge' },
          {
            value: 'U.S. Senior Open Championship',
            label: 'U.S. Senior Open Championship',
          },
          {
            value: 'Mitsubishi Electric Championship at Hualalai',
            label: 'Mitsubishi Electric Championship at Hualalai',
          },
          { value: 'Oasis Championship', label: 'Oasis Championship' },
          { value: 'Chubb Classic', label: 'Chubb Classic' },
          { value: 'Cologuard Classic', label: 'Cologuard Classic' },
          { value: 'Hoag Classic', label: 'Hoag Classic' },
          {
            value: 'Rapiscan Systems Classic',
            label: 'Rapiscan Systems Classic',
          },
          {
            value: 'Mitsubishi Electric Classic',
            label: 'Mitsubishi Electric Classic',
          },
          { value: 'Insperity Invitational', label: 'Insperity Invitational' },
          { value: 'Regions Tradition', label: 'Regions Tradition' },
          {
            value: 'KitchenAid Senior PGA Championship',
            label: 'KitchenAid Senior PGA Championship',
          },
          {
            value: 'Principal Charity Classic',
            label: 'Principal Charity Classic',
          },
          {
            value: 'Mastercard Japan Championship',
            label: 'Mastercard Japan Championship',
          },
          {
            value: 'American Family Insurance Championship',
            label: 'American Family Insurance Championship',
          },
          {
            value: 'Bridgestone SENIOR PLAYERS Championship',
            label: 'Bridgestone SENIOR PLAYERS Championship',
          },
          {
            value: 'Senior Open Championship Presented By Rolex',
            label: 'Senior Open Championship Presented By Rolex',
          },
          {
            value: "DICK'S Sporting Goods Open",
            label: "DICK'S Sporting Goods Open",
          },
          { value: 'Boeing Classic', label: 'Boeing Classic' },
          { value: 'Shaw Charity Classic', label: 'Shaw Charity Classic' },
          { value: 'The Ally Challenge', label: 'The Ally Challenge' },
          { value: 'Sanford International', label: 'Sanford International' },
          {
            value: 'PURE Insurance Championship',
            label: 'PURE Insurance Championship',
          },
          { value: 'SAS Championship', label: 'SAS Championship' },
          {
            value: 'Dominion Energy Charity Classic',
            label: 'Dominion Energy Charity Classic',
          },
          {
            value: 'Invesco QQQ Championship',
            label: 'Invesco QQQ Championship',
          },
          {
            value: 'Charles Schwab Cup Championship',
            label: 'Charles Schwab Cup Championship',
          },
          {
            value: 'Australian PGA Championship',
            label: 'Australian PGA Championship',
          },
          {
            value: 'Australian PGA Championship',
            label: 'Australian PGA Championship',
          },
          {
            value: 'Omega Dubai Desert Classic',
            label: 'Omega Dubai Desert Classic',
          },
          { value: 'Saudi International', label: 'Saudi International' },
          { value: 'Oman Open', label: 'Oman Open' },
          {
            value: 'Commercial Bank Qatar Masters',
            label: 'Commercial Bank Qatar Masters',
          },
          { value: 'BMW International Open', label: 'BMW International Open' },
          {
            value: 'DUBAI DUTY FREE IRISH OPEN',
            label: 'DUBAI DUTY FREE IRISH OPEN',
          },
          {
            value: 'Betfred British Masters',
            label: 'Betfred British Masters',
          },
          {
            value: 'Alfred Dunhill Championship',
            label: 'Alfred Dunhill Championship',
          },
          { value: 'Omega European Masters', label: 'Omega European Masters' },
          {
            value: 'Alfred Dunhill Links Championship',
            label: 'Alfred Dunhill Links Championship',
          },
          { value: 'ITALIAN OPEN', label: 'ITALIAN OPEN' },
          { value: 'Open de France', label: 'Open de France' },
          { value: 'Portugal Masters', label: 'Portugal Masters' },
          { value: 'TURKISH AIRLINES OPEN', label: 'TURKISH AIRLINES OPEN' },
          { value: 'KLM Open', label: 'KLM Open' },
          { value: 'Volvo China Open', label: 'Volvo China Open' },
          {
            value: 'NEDBANK GOLF CHALLENGE HOSTED BY GARY PLAYER',
            label: 'NEDBANK GOLF CHALLENGE HOSTED BY GARY PLAYER',
          },
          {
            value: 'DP WORLD TOUR CHAMPIONSHIP, DUBAI',
            label: 'DP WORLD TOUR CHAMPIONSHIP, DUBAI',
          },
        ],
      },
      {
        value: 'Tennis',
        label: 'Tennis',
        subGroup: [
          { value: 'Australian Open', label: 'Australian Open' },
          { value: 'French Open', label: 'French Open' },
          { value: 'Wimbledon', label: 'Wimbledon' },
          { value: 'US Open', label: 'US Open' },
          { value: 'Mens', label: 'Mens' },
          { value: 'Womens', label: 'Womens' },
          { value: 'Doubles', label: 'Doubles' },
          { value: CUSTOM, label: CUSTOM }
        ],
        autoCompleteList: [
          { value: 'Brisbane International', label: 'Brisbane International' },
          { value: 'Tata Open Maharashtra', label: 'Tata Open Maharashtra' },
          { value: 'Qatar ExxonMobil Open', label: 'Qatar ExxonMobil Open' },
          { value: 'Sydney International', label: 'Sydney International' },
          { value: 'ASB Classic', label: 'ASB Classic' },
          { value: 'Open Sud de France', label: 'Open Sud de France' },
          { value: 'Sofia Open', label: 'Sofia Open' },
          { value: 'Cordoba Open', label: 'Cordoba Open' },
          {
            value: 'ABN Amro World Tennis Tournament',
            label: 'ABN Amro World Tennis Tournament',
          },
          { value: 'Argentina Open', label: 'Argentina Open' },
          { value: 'New York Open', label: 'New York Open' },
          { value: 'Open 13 Provence', label: 'Open 13 Provence' },
          { value: 'Delray Beach Open', label: 'Delray Beach Open' },
          { value: 'Rio Open', label: 'Rio Open' },
          { value: 'Brasil Open', label: 'Brasil Open' },
          {
            value: 'Dubai Duty Free Tennis Championships',
            label: 'Dubai Duty Free Tennis Championships',
          },
          {
            value: 'Abierto Mexicano TELCEL',
            label: 'Abierto Mexicano TELCEL',
          },
          { value: 'BNP Paribas Open', label: 'BNP Paribas Open' },
          { value: 'Miami Open', label: 'Miami Open' },
          { value: 'Grand Prix Hassan II', label: 'Grand Prix Hassan II' },
          {
            value: 'US Mens Clay Court Championship',
            label: 'US Mens Clay Court Championship',
          },
          {
            value: 'Rolex Monte-Carlo Masters',
            label: 'Rolex Monte-Carlo Masters',
          },
          {
            value: 'Barcelona Open Banc Sabadell',
            label: 'Barcelona Open Banc Sabadell',
          },
          { value: 'Hungarian Open', label: 'Hungarian Open' },
          { value: 'BMW Open by FWU', label: 'BMW Open by FWU' },
          {
            value: 'Millennium Estoril Open',
            label: 'Millennium Estoril Open',
          },
          { value: 'Mutua Madrid Open', label: 'Mutua Madrid Open' },
          {
            value: 'Internazionali BNL dItalia',
            label: 'Internazionali BNL dItalia',
          },
          {
            value: 'Banque Eric Sturdza Geneva Open',
            label: 'Banque Eric Sturdza Geneva Open',
          },
          {
            value: 'Open Parc Auvergne-Rhone-Alpes Lyon',
            label: 'Open Parc Auvergne-Rhone-Alpes Lyon',
          },
          { value: 'Mercedes Cup', label: 'Mercedes Cup' },
          { value: 'Libema Open', label: 'Libema Open' },
          { value: 'Noventi Open', label: 'Noventi Open' },
          {
            value: 'Fever-Tree Championships',
            label: 'Fever-Tree Championships',
          },
          { value: 'Hall of Fame Open', label: 'Hall of Fame Open' },
          {
            value: 'Plava Laguna Croatia Open Umag',
            label: 'Plava Laguna Croatia Open Umag',
          },
          { value: 'Swedish Open', label: 'Swedish Open' },
          {
            value: 'J Safra Sarasin Swiss Open Gstaad',
            label: 'J Safra Sarasin Swiss Open Gstaad',
          },
          { value: 'BB&T Atlanta Open', label: 'BB&T Atlanta Open' },
          { value: 'Hamburg Open', label: 'Hamburg Open' },
          { value: 'Generali Open', label: 'Generali Open' },
          { value: 'Citi Open', label: 'Citi Open' },
          {
            value: 'Abierto Mexicano de Tenis Mifel presentado por Cinemax',
            label: 'Abierto Mexicano de Tenis Mifel presentado por Cinemax',
          },
          { value: 'Rogers Cup (M)', label: 'Rogers Cup (M)' },
          {
            value: 'Western & Southern Open',
            label: 'Western & Southern Open',
          },
          { value: 'Winston-Salem Open', label: 'Winston-Salem Open' },
          { value: 'Moselle Open', label: 'Moselle Open' },
          { value: 'St Petersburg Open', label: 'St Petersburg Open' },
          { value: 'Chengdu Open', label: 'Chengdu Open' },
          { value: 'Zhuhai Open', label: 'Zhuhai Open' },
          { value: 'China Open', label: 'China Open' },
          { value: 'Nitto ATP Finals', label: 'Nitto ATP Finals' },
          {
            value: 'Rakuten Japan Open Tennis Championships',
            label: 'Rakuten Japan Open Tennis Championships',
          },
          { value: 'Rolex Shanghai Masters', label: 'Rolex Shanghai Masters' },
          { value: 'Intrum Stockholm Open', label: 'Intrum Stockholm Open' },
          { value: 'VTB Kremlin Cup', label: 'VTB Kremlin Cup' },
          { value: 'European Open', label: 'European Open' },
          { value: 'Erste Bank Open 500', label: 'Erste Bank Open 500' },
          { value: 'Swiss Indoors Basel', label: 'Swiss Indoors Basel' },
          { value: 'Rolex Paris Masters', label: 'Rolex Paris Masters' },
        ],
      },
      {
        value: 'Horse Racing',
        label: 'Horse Racing',
        subGroup: [
          { value: 'Kentucky Derby', label: 'Kentucky Derby' },
          { value: 'Preakness', label: 'Preakness' },
          { value: 'Belmont', label: 'Belmont' },
          { value: 'Triple Crown', label: 'Triple Crown' },
          { value: CUSTOM, label: CUSTOM }
        ],
      },
      {
        value: CUSTOM,
        label: CUSTOM,
        autoCompleteList: [
          {
            value: 'Boxing',
            label: 'Boxing',
            autoCompleteList: [
              {
                value: 'International Boxing Federation (IBF)',
                label: 'International Boxing Federation (IBF)',
              },
              {
                value: 'World Boxing Association (WBA)',
                label: 'World Boxing Association (WBA)',
              },
              {
                value: 'World boxing Organization (WBO)',
                label: 'World boxing Organization (WBO)',
              },
              {
                value: 'World Boxing Council (WBC)',
                label: 'World Boxing Council (WBC)',
              },
            ],
          },
          { value: 'Cricket', label: 'Cricket' },
          { value: 'Rugby', label: 'Rugby' },
          {
            value: 'Car Racing',
            label: 'Car Racing',
            autoCompleteList: [
              { value: 'Formula 1', label: 'Formula 1' },
              { value: 'Nascar', label: 'Nascar' },
            ],
          },
          { value: 'Motorbikes', label: 'Motorbikes' },
          {
            value: 'MMA',
            label: 'MMA',
            autoCompleteList: [{ value: 'UFC', label: 'UFC' }],
          },
          {
            value: 'Cycling',
            label: 'Cycling',
            autoCompleteList: [
              { value: 'Tour de France', label: 'Tour de France' },
            ],
          },
          { value: 'Aussie Rules Football', label: 'Aussie Rules Football' },
          { value: 'Snooker', label: 'Snooker' },
          { value: 'Table Tennis', label: 'Table Tennis' },
          { value: 'Volleyball', label: 'Volleyball' },
          { value: 'Darts', label: 'Darts' },
          { value: 'Greyhounds', label: 'Greyhounds' },
          { value: 'Pool', label: 'Pool' },
          {
            value: 'Badminton',
            label: 'Badminton',
            autoCompleteList: [{ value: 'Olympics', label: 'Olympics' }],
          },
          { value: 'Surfing', label: 'Surfing' },
          { value: 'Poker', label: 'Poker' },
          {
            value: 'Skiing',
            label: 'Skiing',
            autoCompleteList: [{ value: 'Olympics', label: 'Olympics' }],
          },
          {
            value: 'Swimming',
            label: 'Swimming',
            autoCompleteList: [{ value: 'Olympics', label: 'Olympics' }],
          },
          {
            value: 'Awards',
            label: 'Awards',
            autoCompleteList: [{ value: "The Espy's", label: "The Espy's" }],
          },
        ],
      },
    ],
  },
  {
    value: 'Politics',
    label: 'Politics',
    subGroup: [
      {
        value: 'US Elections',
        label: 'US Elections',
        subGroup: [
          { value: 'Presidential', label: 'Presidential' },
          { value: 'Primary', label: 'Primary' },
          { value: 'Republican', label: 'Republican' },
          { value: 'Democratic', label: 'Democratic' },
          { value: CUSTOM, label: CUSTOM }
        ],
        autoCompleteList: [
          { value: "House", label: "House" },
          { value: "Senate", label: "Senate" },
          { value: "Polling", label: "Polling" }
        ]
      },
      {
        value: 'US Politics',
        label: 'US Politics',
        subGroup: [
          { value: 'Impeachment', label: 'Impeachment' },
          { value: 'Supreme Court', label: 'Supreme Court' },
          { value: 'House', label: 'House' },
          { value: 'Senate', label: 'Senate' },
          { value: 'Congress', label: 'Congress' },
          { value: CUSTOM, label: CUSTOM }
        ],
      },
      {
        value: 'World Politics',
        label: 'World Politics',
        subGroup: [
          { value: 'European Leader', label: 'European Leader' },
          { value: 'Prime Minister', label: 'Prime Minister' },
          { value: 'Parliament', label: 'Parliament' },
          { value: 'North Korea', label: 'North Korea' },
          { value: 'Russia', label: 'Russia' },
          { value: 'China', label: 'China' },
          { value: 'Iran', label: 'Iran' },
          { value: CUSTOM, label: CUSTOM }
        ],
      },
      { value: CUSTOM, label: CUSTOM }
    ],
  },
  {
    value: 'Finance',
    label: 'Finance',
    subGroup: [
      {
        value: 'Stocks',
        label: 'Stocks',
        subGroup: [
          {
            value: 'APPL',
            label: 'APPL',
          },
          {
            value: 'BA',
            label: 'BA',
          },
          {
            value: 'TSLA',
            label: 'TSLA',
          },
          {
            value: 'AXP',
            label: 'AXP',
          },
          {
            value: 'MA',
            label: 'MA',
          },
          {
            value: 'JPM',
            label: 'JPM',
          },
          {
            value: 'GOOGL',
            label: 'GOOGL',
          },
          {
            value: 'FB',
            label: 'FB',
          },
          {
            value: 'AMZN',
            label: 'AMZN',
          },
          {
            value: 'MSFT',
            label: 'MSFT',
          },
          { value: CUSTOM, label: CUSTOM }
        ],
      },
      {
        value: 'Commodities',
        label: 'Commodities',
        subGroup: [
          {
            value: 'Crude Oil',
            label: 'Crude Oil',
          },
          {
            value: 'Natural Gas',
            label: 'Natural Gas',
          },
          {
            value: 'Gold',
            label: 'Gold',
          },
          {
            value: 'Silver',
            label: 'Silver',
          },
          { value: CUSTOM, label: CUSTOM }
        ],
        autoCompleteList: [
          { value: "Sugar", label: "Sugar" },
          { value: "Coffee", label: "Coffee" },
          { value: "Cocoa", label: "Cocoa" },
          { value: "Cotton", label: "Cotton" },
          { value: "Soyabeans", label: "Soyabeans" },
          { value: "Corn", label: "Corn" },
          { value: "Copper", label: "Copper" },
          { value: "Aluminium", label: "Aluminium" },
          { value: "Platinum", label: "Platinum" },
          { value: "Steel", label: "Steel" },
          { value: "Heating oil", label: "Heating oil" },
          { value: "Gasoline", label: "Gasoline" },
          { value: "Lean Hogs", label: "Lean Hogs" },
          { value: "Pork Bellies", label: "Pork Bellies" },
          { value: "Cattle", label: "Cattle" },
        ]
      },
      {
        value: 'Indexes',
        label: 'Indexes',
        subGroup: [
          {
            value: 'NASDAQ Composite',
            label: 'NASDAQ Composite',
          },
          {
            value: 'Dow Jones Industrial Average',
            label: 'Dow Jones Industrial Average',
          },
          {
            value: 'S&P 500',
            label: 'S&P 500',
          },
          {
            value: 'FTSE 100',
            label: 'FTSE 100',
          },
          {
            value: 'DAX 30',
            label: 'DAX 30',
          },
          {
            value: 'Nikkei 255 Index',
            label: 'Nikkei 255 Index',
          },
          { value: CUSTOM, label: CUSTOM }
        ],
        autoCompleteList: [
          { value: "S&P Asia 50 Index", label: "S&P Asia 50 Index" },
          { value: "Dow Jones Asian Titan 50 Index", label: "Dow Jones Asian Titan 50 Index" },
          { value: "FTSE ASEAN 40 Index", label: "FTSE ASEAN 40 Index" },
          { value: "Euro Stoxx 50 Index", label: "Euro Stoxx 50 Index" },
          { value: "FTSE Euro 100 Index", label: "FTSE Euro 100 Index" },
          { value: "S&P Europe 350 Index", label: "S&P Europe 350 Index" },
          { value: "S&P Latin America 40 Index", label: "S&P Latin America 40 Index" },
          { value: "SSE Composite Index", label: "SSE Composite Index" },
          { value: "SZSE Component Index", label: "SZSE Component Index" },
          { value: "CSI 300 Index", label: "CSI 300 Index" },
          { value: "MSCI World Index", label: "MSCI World Index" },
          { value: "Topic Index", label: "Topic Index" },
          { value: "JPX-Nikkei 400 Index", label: "JPX-Nikkei 400 Index" },
          { value: "TecDAX Index", label: "TecDAX Index" },
          { value: "MDAX Index", label: "MDAX Index" },
          { value: "FTSE All-Share Index", label: "FTSE All-Share Index" },
          { value: "FTSE techMark Index", label: "FTSE techMark Index" },
          { value: "CAC 40 Index", label: "CAC 40 Index" },
          { value: "CAC Next 20 Index", label: "CAC Next 20 Index" },
          { value: "CAC Mid 60 Index", label: "CAC Mid 60 Index" },
          { value: "Bovespa Stock Index", label: "Bovespa Stock Index" },
          { value: "IBrX Stock Index", label: "IBrX Stock Index" },
          { value: "ITEL Stock Index", label: "ITEL Stock Index" },
          { value: "S&P TSX 60 Index", label: "S&P TSX 60 Index" },
          { value: "S&P TSX Composite Index", label: "S&P TSX Composite Index" },
          { value: "S&P TSX Venture Composite Index", label: "S&P TSX Venture Composite Index" },
          { value: "KOSPI Index", label: "KOSPI Index" },
          { value: "KOSDAQ Index", label: "KOSDAQ Index" },
          { value: "NIFTY 50", label: "NIFTY 50" },
          { value: "Nasdaq 100", label: "Nasdaq 100" },
          { value: "VIX", label: "VIX" },
          { value: "Wilshire 5000", label: "Wilshire 5000" },
        ]
      },
      {
        value: 'ETF',
        label: 'ETF',
      },
      {
        value: 'Bonds',
        label: 'Bonds',
      },
      { value: CUSTOM, label: CUSTOM }
    ],
  },
  {
    value: 'Entertainment',
    label: 'Entertainment',
    subGroup: [
      {
        value: 'Awards',
        label: 'Awards',
        subGroup: [
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
          { value: CUSTOM, label: CUSTOM }
        ],
        autoCompleteList: [
          { value: "BRIT Awards", label: "BRIT Awards" },
          { value: "MTV VMA's", label: "MTV VMA's" },
          { value: "British Academy of film and Television Arts (BAFTA)", label: "British Academy of film and Television Arts (BAFTA)" },
          { value: "Billboard Music Awards", label: "Billboard Music Awards" }
        ]
      },
      {
        value: 'Movies',
        label: 'Movies',
      },
      {
        value: 'Music',
        label: 'Music',
      },
      {
        value: 'TV Shows',
        label: 'TV Shows',
        subGroup: [
          {
            value: 'American Idol',
            label: 'American Idol',
          },
          {
            value: 'Big Brother',
            label: 'Big Brother',
          },
          {
            value: 'The Bachelor',
            label: 'The Bachelor',
          },
          {
            value: 'The Bachelorette',
            label: 'The Bachelorette',
          },
          {
            value: 'Dancing with the Stars',
            label: 'Dancing with the Stars',
          },
          { value: CUSTOM, label: CUSTOM }
        ],
      },
      { value: CUSTOM, label: CUSTOM }
    ],
  },
  {
    value: 'Crypto',
    label: 'Crypto',
    subGroup: [
      {
        value: 'Bitcoin',
        label: 'Bitcoin',
      },
      {
        value: 'Ethereum',
        label: 'Ethereum',
        subGroup: [{ value: 'ICO', label: 'ICO' }, { value: CUSTOM, label: CUSTOM }],
      },
      {
        value: 'Litecoin',
        label: 'Litecoin',
      },
      {
        value: 'Rep',
        label: 'Rep',
      },
      { value: CUSTOM, label: CUSTOM }
    ],
  },
  {
    value: 'Weather',
    label: 'Weather',
    subGroup: [
      {
        value: 'Natural Disasters',
        label: 'Natural Disasters',
        subGroup: [
          {
            value: 'Hurricanes',
            label: 'Hurricanes',
          },
          {
            value: 'Earthquakes',
            label: 'Earthquakes',
          },
          {
            value: 'Tornadoes',
            label: 'Tornadoes',
          },
          { value: CUSTOM, label: CUSTOM }
        ],
      },
      {
        value: 'Precipitation Totals',
        label: 'Precipitation Totals',
        subGroup: [
          { value: 'Snow Fall', label: 'Snow Fall' },
          { value: 'Rain Fall', label: 'Rain Fall' },
          { value: CUSTOM, label: CUSTOM }
        ],
      },
      {
        value: 'Tempature',
        label: 'Tempature',
      },
      { value: CUSTOM, label: CUSTOM }
    ],
  },
  {
    value: 'Space',
    label: 'Space',
    subGroup: [
      {
        value: 'Mars',
        label: 'Mars',
      },
      {
        value: 'NASA',
        label: 'NASA',
      },
      {
        value: 'Moon',
        label: 'Moon',
      },
      {
        value: 'SpaceX',
        label: 'SpaceX',
      },
      { value: CUSTOM, label: CUSTOM }
    ],
  },
];
