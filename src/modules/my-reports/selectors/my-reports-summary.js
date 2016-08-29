import selectMyReports from '../../my-reports/selectors/my-reports';
import { abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';

export default function () {
	const reports = selectMyReports();

	const numReports = reports.length;
	const netRep = reports.reduce((prevNet, report) => prevNet.plus(abi.bignum(report.repEarned.value)), ZERO).toNumber();

	return {
		numReports,
		netRep
	};
}
