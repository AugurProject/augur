import { makeDate } from '../utils/make-date';
import { makeNumber } from '../utils/make-number';

const randomBool = () => Math.random() > 0.5;
const randomSign = () => Math.random() > 0.5 ? 1 : -1;

export default [
	{
		id: '0',
		description: 'Will the thorn be added to the english alphabet before 2016?',
		outcome: 'No',
		outcomePercentage: makeNumber((Math.random() * (100 - 51) + 51), '%'),
		reported: 'No',
		isReportEqual: randomBool(),
		feesEarned: makeNumber(randomSign() * Math.random() * 1.9, 'eth'),
		repEarned: makeNumber(randomSign() * Math.random() * 1.3, 'rep'),
		endDate: makeDate(new Date('2015/12/31')),
		isChallenged: randomBool(),
		isChallengeable: randomBool()
	},
	{
		id: '1',
		description: 'Will I go back to the future by 2016?',
		outcome: null,
		outcomePercentage: makeNumber((Math.random() * (100 - 51) + 51), '%'),
		reported: 'Yes',
		isReportEqual: randomBool(),
		feesEarned: makeNumber(randomSign() * Math.random() * 1.2, 'eth'),
		repEarned: makeNumber(randomSign() * Math.random() * 1.3, 'rep'),
		endDate: makeDate(new Date('2015/12/31')),
		isChallenged: randomBool(),
		isChallengeable: randomBool()
	},
	{
		id: '2',
		description: 'Who will win the US presidential election in 2008?',
		outcome: 'Barack Obama',
		outcomePercentage: makeNumber((Math.random() * (100 - 51) + 51), '%'),
		reported: 'Mitt Romney',
		isReportEqual: randomBool(),
		feesEarned: makeNumber(randomSign() * Math.random() * 1.8, 'eth'),
		repEarned: makeNumber(randomSign() * Math.random() * 2.1, 'rep'),
		endDate: makeDate(new Date('2008/11/4')),
		isChallenged: randomBool(),
		isChallengeable: randomBool()
	}
];
