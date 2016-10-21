import makeDate from 'utils/make-date';
import makeNumber from 'utils/make-number';
import { M } from 'modules/site/constants/views';

const randomBool = () => Math.random() > 0.5;
const randomSign = () => (Math.random() > 0.5 ? 1 : -1);

export default [
	{
		id: '0',
		marketLink: {
			text: 'Market',
			className: 'portfolio-row-link',
			onClick: () => require('../selectors').update({ activeView: M, market: require('../selectors').markets[0], url: '/m/0' })
		},
		description: 'Will the thorn be added to the english alphabet before 2016?',
		outcome: 'No',
		outcomePercentage: makeNumber(((Math.random() * (100 - 51)) + 51), '%'),
		reported: 'No',
		isReportEqual: randomBool(),
		feesEarned: makeNumber(randomSign() * Math.random() * 1.9, ' ETH'),
		repEarned: makeNumber(randomSign() * Math.random() * 1.3, ' REP'),
		endDate: makeDate(new Date('2015/12/31')),
		isChallenged: randomBool(),
		isChallengeable: randomBool()
	},
	{
		id: '1',
		marketLink: {
			text: 'Market',
			className: 'portfolio-row-link',
			onClick: () => require('../selectors').update({ activeView: M, market: require('../selectors').markets[1], url: '/m/1' })
		},
		description: 'Will I go back to the future by 2016?',
		outcome: null,
		outcomePercentage: makeNumber(((Math.random() * (100 - 51)) + 51), '%'),
		reported: 'Yes',
		isReportEqual: randomBool(),
		feesEarned: makeNumber(randomSign() * Math.random() * 1.2, ' ETH'),
		repEarned: makeNumber(randomSign() * Math.random() * 1.3, ' REP'),
		endDate: makeDate(new Date('2015/12/31')),
		isChallenged: randomBool(),
		isChallengeable: randomBool()
	},
	{
		id: '2',
		marketLink: {
			text: 'Market',
			className: 'portfolio-row-link',
			onClick: () => require('../selectors').update({ activeView: M, market: require('../selectors').markets[2], url: '/m/2' })
		},
		description: 'Who will win the US presidential election in 2008?',
		outcome: 'Barack Obama',
		outcomePercentage: makeNumber(((Math.random() * (100 - 51)) + 51), '%'),
		reported: 'Mitt Romney',
		isReportEqual: randomBool(),
		feesEarned: makeNumber(randomSign() * Math.random() * 1.8, ' ETH'),
		repEarned: makeNumber(randomSign() * Math.random() * 2.1, ' REP'),
		endDate: makeDate(new Date('2008/11/4')),
		isChallenged: randomBool(),
		isChallengeable: randomBool()
	}
];
