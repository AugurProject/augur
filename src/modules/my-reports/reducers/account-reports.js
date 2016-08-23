import { UPDATE_ACCOUNT_REPORTS_DATA } from '../../../modules/my-reports/actions/update-account-reports-data';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

const INITIAL_STATE = {
    oldestLoadedPeriod: null,
    events: []
};

export default function (accountReports = INITIAL_STATE, action) {
    switch(action.type){
    case UPDATE_ACCOUNT_REPORTS_DATA:
        const events = (action.data.events || []).reduce((previous, eventID) => {
            if (accountReports.events.indexOf(eventID) === -1) previous.push(eventID);
            return previous;
        }, accountReports.events);

        return {
            ...accountReports,
            ...action.data,
            events
        };
    case CLEAR_LOGIN_ACCOUNT:
        return null;
    default:
        return accountReports;
    }
}