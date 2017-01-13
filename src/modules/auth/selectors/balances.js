import { isZero } from '../../../utils/math';

export const anyAccountBalancesZero = balances => (
	(balances.ether !== undefined && isZero(balances.ether)) ||
	(balances.realEther !== undefined && isZero(balances.realEther)) ||
	(balances.rep !== undefined && isZero(balances.rep))
);

export const allAccountBalancesZero = balances => (
	(balances.ether !== undefined && isZero(balances.ether)) &&
	(balances.realEther !== undefined && isZero(balances.realEther)) &&
	(balances.rep !== undefined && isZero(balances.rep))
);

export const allAssetsLoaded = assets => (
    assets.ether !== undefined && assets.realEther !== undefined && assets.rep !== undefined
);
