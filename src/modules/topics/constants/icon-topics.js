// NOTE --  Each topic must be uniquely mapped to an icon
//          Each icon can have multiple topics via an array of strings
//          Two icon font sets are availble:
//            All Font Awesome icons (v4.7.0) are available -- http://fontawesome.io/cheatsheet/
//            Icons from the following Icofont (v1.0.0b) groups are available: Business, Currency, Payment, Sport, Transport, Travel, and Weather -- http://icofont.com/

const fontAwesomeIcons = {
  'fa-copy': ['reporting', 'testing', 'beta', 'policy'],
  'fa-snowflake-o': 'snow',
  'fa-bolt': 'lightning',
  'fa-cloud': ['weather', 'rain', 'precipitation'],
  'fa-sun-o': ['climate', 'sunspot', 'sunspots'],
  'fa-thermometer': ['temperature', 'heat'],
  'fa-line-chart': ['finance', 'financial', 'financials', 'dow jones', 'to the moon', 'stock', 'stocks', 'derivative', 'derivatives', 'option', 'options', 'future', 'futures'],
  'fa-bug': ['antibiotic', 'antibiotics', 'bacteria', 'infection', 'infections', 'epidemic', 'epidemics'],
  'fa-ambulance': ['mortality', 'hospital', 'hospitals', 'medicine'],
  'fa-home': ['housing', 'home', 'realty'],
  'fa-industry': ['climate change', 'pollution', 'global warming', 'eraserhead'],
  'fa-newspaper-o': ['news', 'events', 'newspaper', 'newspapers', 'fake news', 'media'],
  'fa-ship': ['international trade', 'shipping'],
  'fa-music': ['music', 'songs', 'pop', 'rock', 'rap', 'dancing', 'dance', 'techno'],
  'fa-laptop': ['computers', 'computing', 'laptops'],
  'fa-lock': ['crypto', 'cryptography', 'encryption', 'security'],
  'fa-money': ['trading', 'cryptocurrency', 'currency', 'currencies', 'money', 'value', 'fiat', 'debt', 'forex', 'lottery', 'daily lottery'],
  'fa-chain': ['blockchain', 'blockchains', 'block chain', 'block chains'],
  'fa-btc': ['bitcoin', 'btc', 'bitcoins'],
  'fa-usd': ['dollar', 'dollars', 'usd'],
  'fa-yen': ['yen', 'jpy', 'rmb', 'cny'],
  'fa-eur': ['euro', 'eur', 'euros'],
  'fa-rub': ['ruble', 'rubles', 'rub'],
  'fa-inr': ['inr', 'rupee', 'rupees'],
  'fa-superscript': ['math', 'mathematics', 'maths'],
  'fa-apple': ['apple', 'mac', 'osx', 'ios', 'ipad', 'steve jobs', 'tim cook'],
  'fa-futbol-o': ['futbol', 'soccer', 'world cup', 'sports'],
  'fa-shield': ['defense', 'national defense', 'military'],
  'fa-motorcycle': ['travel', 'traveling', 'motorcycles'],
  'fa-pie-chart': ['data', 'big data', 'analytics', 'statistics'],
  'fa-phone': ['phones', 'telephone', 'telephones'],
  'fa-mobile': ['smartphone', 'smartphones', 'smart phone', 'smart phones', 'android', 'iphone'],
  'fa-plug': ['electricity', 'electrical', 'power', 'power grid', 'electric'],
  'fa-plane': ['planes', 'airplane', 'airplanes', 'flying', 'flight', 'airport', 'airports', 'airline', 'airliner', 'jet'],
  'fa-flask': ['science', 'scientists', 'physics', 'chemistry', 'biology', 'genetics', 'chemical', 'chemicals'],
  'fa-cogs': ['engineering', 'engineers', 'manufacturing', 'manufacturers', 'steampunk', 'makers'],
  'fa-copyright': ['ip', 'intellectual property', 'copyleft', 'patents'],
  'fa-automobile': ['cars', 'automobiles', 'self-driving cars', 'accidents', 'crashes', 'driving', 'drivers', 'road rage'],
  'fa-beer': ['alcohol', 'alcoholics', 'drinking', 'beers'],
  'fa-briefcase': ['law', 'legal', 'laws', 'lawyers', 'legalese'],
  'fa-shopping-cart': ['e-commerce', 'commerce', 'shopping', 'consumers', 'customers'],
  'fa-university': ['banks', 'schools', 'universities', 'institutions', 'government', 'state', 'federal', 'bureaucracy', 'college', 'colleges', 'uni', 'college football'],
  'fa-truck': ['cargo', 'transport', 'transportation', 'trucks'],
  'fa-wrench': ['reliability', 'durability'],
  'fa-gavel': ['justice', 'courts', 'court system', 'judicial', 'supreme court', 'appeals court', 'superior court', 'trial', 'trials'],
  'fa-globe': ['earth', 'world', 'planet', 'planets', 'planetary'],
  'fa-key': ['vulnerability', 'vulnerabilities', 'backdoor', 'backdoors'],
  'fa-recycle': ['environment', 'environmental', 'environmentalism', 'recycling', 'green'],
  'fa-share-alt': ['network', 'networks', 'networking'],
  'fa-checkered': ['race', 'racing', 'races', 'horseracing', 'horserace', 'nascar'],
  'fa-at': ['email', 'emails', 'e-mail', 'e-mails', 'identity', 'names'],
  'fa-code': ['coding', 'programming', 'programmers', 'software', 'development', 'developers'],
  'fa-eye': ['surveillance', 'big brother', 'nsa', 'national security agency', 'snowden'],
  'fa-font-awesome': ['capture the flag', 'ctf', 'flag football', 'frisbee golf'],
  'fa-compress': ['debates', 'arguments', 'conflicts', 'fights', 'war', 'wars', 'fighting', 'calexit'],
  'fa-flag-o': ['France', 'USA', 'United States', 'UK', 'United Kingdom', 'Spain', 'Portugal', 'China', 'Russia', 'Australia', 'Canada', 'New Zealand', 'Japan'],
  'fa-smile-o': ['happy', 'pleasure']
};

const icofontIcons = {
  'icofont-people': ['elections', 'politics'],
  'icofont-rocket-alt-2': ['space', 'space program', 'rocket', 'nasa', 'spacex'],
  'icofont-tractor': ['agriculture', 'farming', 'GMO'],
  'icofont-growth': ['market', 'markets', 'exchange'],
  'icofont-excavator': ['construction'],
  'icofont-bull-dozer': ['demolition'],
  'icofont-basketball': ['basketball'],
  'icofont-rugby': ['rugby', 'football', 'american football'],
  'icofont-baseball': ['baseball'],
  'icofont-motor-bike': ['motorcycles', 'motorcycling', 'bikers']
};

const iconTopics = {
  ...fontAwesomeIcons,
  ...icofontIcons
};

export default iconTopics;
