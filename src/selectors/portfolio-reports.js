import { makeDate } from '../utils/make-date';
import { makeNumber } from '../utils/make-number';

export default [
	{
		description: 'Will the thorn be added to the english alphabet before 2016?',
		outcome: 'No',
		outcomePercentage: makeNumber((Math.random() * ((100 - 51) + 51)), '%'),
		reported: 'No',
		isReportEqual: true,
		feesEarned: makeNumber(Math.random() * 1.9, 'ETH'),
		repEarned: makeNumber(Math.random() * 1.3, 'REP'),
		endDate: makeDate(new Date('2015/12/31')),
		isChallengeable: true
	},
	{
		description: 'Will I go back to the future by 2016?',
		outcome: null,
		outcomePercentage: makeNumber(0, '%'),
		reported: 'Yes',
		isReportEqual: false,
		feesEarned: makeNumber(Math.random() * 1.2, 'ETH'),
		repEarned: makeNumber(Math.random() * 1.3, 'REP'),
		endDate: makeDate(new Date('2015/12/31')),
		isChallengeable: false
	},
	{
		description: 'Who will win the US presidential election in 2008?',
		outcome: 'Barack Obama',
		outcomePercentage: makeNumber((Math.random() * ((100 - 51) + 51)), '%'),
		reported: 'Mitt Romney',
		isReportEqual: false,
		feesEarned: makeNumber(-Math.random() * 1.8, 'ETH'),
		repEarned: makeNumber(-Math.random() * 2.1, 'REP'),
		endDate: makeDate(new Date('2008/11/4')),
		isChallengeable: true
	}
];
