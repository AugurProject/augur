import {
  SPORTS,
  POLITICS,
  ECONOMICS,
  ENTERTAINMENT,
  CRYPTO,
  MEDICAL,
  SOCCER,
  AMERICAN_FOOTBALL,
  OLYMPICS,
  BASEBALL,
  GOLF,
  BASKETBALL,
  TENNIS,
  HOCKEY,
  HORSE_RACING,
  US_POLITICS,
  WORLD,
  BOXING,
  MMA,
  CAR_RACING,
  AWARDS,
  TV_MOVIES,
  SOCIAL_MEDIA,
  // BITCOIN,
  // ETHEREUM,
  // COMPOUND,
  // BALANCER,
  // AUGUR,
  // MAKER,
  // AMPLE,
  // ZEROX,
  // CHAINLINK,
} from '@augurproject/sdk-lite';
import { FINANCE } from 'modules/constants';
import {
  MedicalIcon,
  PoliticsIcon,
  USPoliticsIcon,
  WorldPoliticsIcon,
  EntertainmentIcon,
  FinanceIcon,
  CryptoIcon,
  SportsIcon,
  EntertainmentAwardsIcon,
  EntertainmentMoviesIcon,
  EntertainmentSocialMediaIcon,
  GolfIcon,
  TennisIcon,
  BasketballIcon,
  HorseRacingIcon,
  SoccerIcon,
  FootballIcon,
  HockeyIcon,
  OlympicIcon,
  BaseballIcon,
  BoxingIcon,
  MMAIcon,
  CarRacingIcon,
} from './category-icons';
// SUB CATEGORIES
// MEDICAL
// POLITICS
// ENTERTAINMENT
// FINANCE
// CRYPTO
// SPORTS

export const CATEGORIES_ICON_MAP = {
  [MEDICAL.toLowerCase()]: {
    icon: MedicalIcon,
    subOptions: {},
  },
  [POLITICS.toLowerCase()]: {
    icon: PoliticsIcon,
    subOptions: {
      [US_POLITICS.toLowerCase()]: { icon: USPoliticsIcon },
      [WORLD.toLowerCase()]: { icon: WorldPoliticsIcon },
    },
  },
  [ENTERTAINMENT.toLowerCase()]: {
    icon: EntertainmentIcon,
    subOptions: {
      [AWARDS.toLowerCase()]: { icon: EntertainmentAwardsIcon },
      [TV_MOVIES.toLowerCase()]: { icon: EntertainmentMoviesIcon },
      [SOCIAL_MEDIA.toLowerCase()]: { icon: EntertainmentSocialMediaIcon },
    },
  },
  [FINANCE.toLowerCase()]: { icon: FinanceIcon, subOptions: {} },
  [ECONOMICS.toLowerCase()]: { icon: FinanceIcon, subOptions: {} },
  [CRYPTO.toLowerCase()]: { icon: CryptoIcon, subOptions: {} },
  [SPORTS.toLowerCase()]: { icon: SportsIcon, subOptions: {
    [BASKETBALL.toLowerCase()]: { icon: BasketballIcon },
    [TENNIS.toLowerCase()]: { icon: TennisIcon },
    [HORSE_RACING.toLowerCase()]: { icon: HorseRacingIcon },
    [SOCCER.toLowerCase()]: { icon: SoccerIcon },
    [AMERICAN_FOOTBALL.toLowerCase()]: { icon: FootballIcon },
    [HOCKEY.toLowerCase()]: { icon: HockeyIcon },
    [GOLF.toLowerCase()]: { icon: GolfIcon },
    [OLYMPICS.toLowerCase()]: { icon: OlympicIcon },
    [BASEBALL.toLowerCase()]: { icon: BaseballIcon },
    [BOXING.toLowerCase()]: { icon: BoxingIcon },
    [MMA.toLowerCase()]: { icon: MMAIcon },
    [CAR_RACING.toLowerCase()]: { icon: CarRacingIcon }
  } },
};
