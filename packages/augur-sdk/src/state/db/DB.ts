import { Augur } from '../../Augur';
import { SubscriptionEventName } from '../../constants';
import { Dexie } from "dexie";
import { SyncableDB } from './SyncableDB';
import { SyncStatus } from './SyncStatus';
//import { LiquidityDB, LiquidityLastUpdated, MarketHourlyLiquidity } from './LiquidityDB';
import { DisputeDatabase } from './DisputeDB';
import { CurrentOrdersDatabase } from './CurrentOrdersDB';
import { MarketDB } from './MarketDB';
import { IBlockAndLogStreamerListener, LogCallbackType } from './BlockAndLogStreamerListener';
import {
  CompleteSetsPurchasedLog,
  CompleteSetsSoldLog,
  DisputeCrowdsourcerCompletedLog,
  DisputeCrowdsourcerContributionLog,
  DisputeCrowdsourcerCreatedLog,
  DisputeCrowdsourcerRedeemedLog,
  DisputeWindowCreatedLog,
  GenericEventDBDescription,
  InitialReporterRedeemedLog,
  InitialReportSubmittedLog,
  InitialReporterTransferredLog,
  MarketCreatedLog,
  MarketData,
  DisputeDoc,
  MarketFinalizedLog,
  MarketMigratedLog,
  MarketVolumeChangedLog,
  MarketOIChangedLog,
  MarketParticipantsDisavowedLog,
  MarketTransferredLog,
  OrderEventType,
  ParsedOrderEventLog,
  ParticipationTokensRedeemedLog,
  ProfitLossChangedLog,
  ReportingParticipantDisavowedLog,
  TimestampSetLog,
  TokenBalanceChangedLog,
  ShareTokenBalanceChangedLog,
  TokensMinted,
  TradingProceedsClaimedLog,
  TokensTransferredLog,
  TransferSingleLog,
  TransferBatchLog,
  UniverseForkedLog,
  UniverseCreatedLog,
  CurrentOrder,
} from '../logs/types';
import { ZeroXOrders, StoredOrder } from './ZeroXOrders';
import { GetMarketsSortBy, MaxLiquiditySpread } from '../getter/Markets';

// XXX remove
interface FakePouchResponse {
  docs: any[];
}

// XXX TODO this whole section and below should _only_ be run for node context, not in browser
const setGlobalVars = require('indexeddbshim');

// ID_Start (includes Other_ID_Start)
const UnicodeIDStart =
  '(?:[$A-Z_a-z\\xAA\\xB5\\xBA\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u037F\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u052F\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0-\\u08B4\\u08B6-\\u08BD\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0980\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0AF9\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D\\u0C58-\\u0C5A\\u0C60\\u0C61\\u0C80\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D54-\\u0D56\\u0D5F-\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F5\\u13F8-\\u13FD\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F8\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19B0-\\u19C9\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1C80-\\u1C88\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2118-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309B-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FD5\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA69D\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA7AE\\uA7B0-\\uA7B7\\uA7F7-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA8FD\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uA9E0-\\uA9E4\\uA9E6-\\uA9EF\\uA9FA-\\uA9FE\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA7E-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uAB30-\\uAB5A\\uAB5C-\\uAB65\\uAB70-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]|\\uD800[\\uDC00-\\uDC0B\\uDC0D-\\uDC26\\uDC28-\\uDC3A\\uDC3C\\uDC3D\\uDC3F-\\uDC4D\\uDC50-\\uDC5D\\uDC80-\\uDCFA\\uDD40-\\uDD74\\uDE80-\\uDE9C\\uDEA0-\\uDED0\\uDF00-\\uDF1F\\uDF30-\\uDF4A\\uDF50-\\uDF75\\uDF80-\\uDF9D\\uDFA0-\\uDFC3\\uDFC8-\\uDFCF\\uDFD1-\\uDFD5]|\\uD801[\\uDC00-\\uDC9D\\uDCB0-\\uDCD3\\uDCD8-\\uDCFB\\uDD00-\\uDD27\\uDD30-\\uDD63\\uDE00-\\uDF36\\uDF40-\\uDF55\\uDF60-\\uDF67]|\\uD802[\\uDC00-\\uDC05\\uDC08\\uDC0A-\\uDC35\\uDC37\\uDC38\\uDC3C\\uDC3F-\\uDC55\\uDC60-\\uDC76\\uDC80-\\uDC9E\\uDCE0-\\uDCF2\\uDCF4\\uDCF5\\uDD00-\\uDD15\\uDD20-\\uDD39\\uDD80-\\uDDB7\\uDDBE\\uDDBF\\uDE00\\uDE10-\\uDE13\\uDE15-\\uDE17\\uDE19-\\uDE33\\uDE60-\\uDE7C\\uDE80-\\uDE9C\\uDEC0-\\uDEC7\\uDEC9-\\uDEE4\\uDF00-\\uDF35\\uDF40-\\uDF55\\uDF60-\\uDF72\\uDF80-\\uDF91]|\\uD803[\\uDC00-\\uDC48\\uDC80-\\uDCB2\\uDCC0-\\uDCF2]|\\uD804[\\uDC03-\\uDC37\\uDC83-\\uDCAF\\uDCD0-\\uDCE8\\uDD03-\\uDD26\\uDD50-\\uDD72\\uDD76\\uDD83-\\uDDB2\\uDDC1-\\uDDC4\\uDDDA\\uDDDC\\uDE00-\\uDE11\\uDE13-\\uDE2B\\uDE80-\\uDE86\\uDE88\\uDE8A-\\uDE8D\\uDE8F-\\uDE9D\\uDE9F-\\uDEA8\\uDEB0-\\uDEDE\\uDF05-\\uDF0C\\uDF0F\\uDF10\\uDF13-\\uDF28\\uDF2A-\\uDF30\\uDF32\\uDF33\\uDF35-\\uDF39\\uDF3D\\uDF50\\uDF5D-\\uDF61]|\\uD805[\\uDC00-\\uDC34\\uDC47-\\uDC4A\\uDC80-\\uDCAF\\uDCC4\\uDCC5\\uDCC7\\uDD80-\\uDDAE\\uDDD8-\\uDDDB\\uDE00-\\uDE2F\\uDE44\\uDE80-\\uDEAA\\uDF00-\\uDF19]|\\uD806[\\uDCA0-\\uDCDF\\uDCFF\\uDEC0-\\uDEF8]|\\uD807[\\uDC00-\\uDC08\\uDC0A-\\uDC2E\\uDC40\\uDC72-\\uDC8F]|\\uD808[\\uDC00-\\uDF99]|\\uD809[\\uDC00-\\uDC6E\\uDC80-\\uDD43]|[\\uD80C\\uD81C-\\uD820\\uD840-\\uD868\\uD86A-\\uD86C\\uD86F-\\uD872][\\uDC00-\\uDFFF]|\\uD80D[\\uDC00-\\uDC2E]|\\uD811[\\uDC00-\\uDE46]|\\uD81A[\\uDC00-\\uDE38\\uDE40-\\uDE5E\\uDED0-\\uDEED\\uDF00-\\uDF2F\\uDF40-\\uDF43\\uDF63-\\uDF77\\uDF7D-\\uDF8F]|\\uD81B[\\uDF00-\\uDF44\\uDF50\\uDF93-\\uDF9F\\uDFE0]|\\uD821[\\uDC00-\\uDFEC]|\\uD822[\\uDC00-\\uDEF2]|\\uD82C[\\uDC00\\uDC01]|\\uD82F[\\uDC00-\\uDC6A\\uDC70-\\uDC7C\\uDC80-\\uDC88\\uDC90-\\uDC99]|\\uD835[\\uDC00-\\uDC54\\uDC56-\\uDC9C\\uDC9E\\uDC9F\\uDCA2\\uDCA5\\uDCA6\\uDCA9-\\uDCAC\\uDCAE-\\uDCB9\\uDCBB\\uDCBD-\\uDCC3\\uDCC5-\\uDD05\\uDD07-\\uDD0A\\uDD0D-\\uDD14\\uDD16-\\uDD1C\\uDD1E-\\uDD39\\uDD3B-\\uDD3E\\uDD40-\\uDD44\\uDD46\\uDD4A-\\uDD50\\uDD52-\\uDEA5\\uDEA8-\\uDEC0\\uDEC2-\\uDEDA\\uDEDC-\\uDEFA\\uDEFC-\\uDF14\\uDF16-\\uDF34\\uDF36-\\uDF4E\\uDF50-\\uDF6E\\uDF70-\\uDF88\\uDF8A-\\uDFA8\\uDFAA-\\uDFC2\\uDFC4-\\uDFCB]|\\uD83A[\\uDC00-\\uDCC4\\uDD00-\\uDD43]|\\uD83B[\\uDE00-\\uDE03\\uDE05-\\uDE1F\\uDE21\\uDE22\\uDE24\\uDE27\\uDE29-\\uDE32\\uDE34-\\uDE37\\uDE39\\uDE3B\\uDE42\\uDE47\\uDE49\\uDE4B\\uDE4D-\\uDE4F\\uDE51\\uDE52\\uDE54\\uDE57\\uDE59\\uDE5B\\uDE5D\\uDE5F\\uDE61\\uDE62\\uDE64\\uDE67-\\uDE6A\\uDE6C-\\uDE72\\uDE74-\\uDE77\\uDE79-\\uDE7C\\uDE7E\\uDE80-\\uDE89\\uDE8B-\\uDE9B\\uDEA1-\\uDEA3\\uDEA5-\\uDEA9\\uDEAB-\\uDEBB]|\\uD869[\\uDC00-\\uDED6\\uDF00-\\uDFFF]|\\uD86D[\\uDC00-\\uDF34\\uDF40-\\uDFFF]|\\uD86E[\\uDC00-\\uDC1D\\uDC20-\\uDFFF]|\\uD873[\\uDC00-\\uDEA1]|\\uD87E[\\uDC00-\\uDE1D])';

// ID_Continue (includes Other_ID_Continue)
const UnicodeIDContinue =
  '(?:[$0-9A-Z_a-z\\xAA\\xB5\\xB7\\xBA\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0300-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u037F\\u0386-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u0483-\\u0487\\u048A-\\u052F\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0610-\\u061A\\u0620-\\u0669\\u066E-\\u06D3\\u06D5-\\u06DC\\u06DF-\\u06E8\\u06EA-\\u06FC\\u06FF\\u0710-\\u074A\\u074D-\\u07B1\\u07C0-\\u07F5\\u07FA\\u0800-\\u082D\\u0840-\\u085B\\u08A0-\\u08B4\\u08B6-\\u08BD\\u08D4-\\u08E1\\u08E3-\\u0963\\u0966-\\u096F\\u0971-\\u0983\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BC-\\u09C4\\u09C7\\u09C8\\u09CB-\\u09CE\\u09D7\\u09DC\\u09DD\\u09DF-\\u09E3\\u09E6-\\u09F1\\u0A01-\\u0A03\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A3C\\u0A3E-\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A59-\\u0A5C\\u0A5E\\u0A66-\\u0A75\\u0A81-\\u0A83\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABC-\\u0AC5\\u0AC7-\\u0AC9\\u0ACB-\\u0ACD\\u0AD0\\u0AE0-\\u0AE3\\u0AE6-\\u0AEF\\u0AF9\\u0B01-\\u0B03\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3C-\\u0B44\\u0B47\\u0B48\\u0B4B-\\u0B4D\\u0B56\\u0B57\\u0B5C\\u0B5D\\u0B5F-\\u0B63\\u0B66-\\u0B6F\\u0B71\\u0B82\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BBE-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCD\\u0BD0\\u0BD7\\u0BE6-\\u0BEF\\u0C00-\\u0C03\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D-\\u0C44\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C58-\\u0C5A\\u0C60-\\u0C63\\u0C66-\\u0C6F\\u0C80-\\u0C83\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBC-\\u0CC4\\u0CC6-\\u0CC8\\u0CCA-\\u0CCD\\u0CD5\\u0CD6\\u0CDE\\u0CE0-\\u0CE3\\u0CE6-\\u0CEF\\u0CF1\\u0CF2\\u0D01-\\u0D03\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D-\\u0D44\\u0D46-\\u0D48\\u0D4A-\\u0D4E\\u0D54-\\u0D57\\u0D5F-\\u0D63\\u0D66-\\u0D6F\\u0D7A-\\u0D7F\\u0D82\\u0D83\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0DCA\\u0DCF-\\u0DD4\\u0DD6\\u0DD8-\\u0DDF\\u0DE6-\\u0DEF\\u0DF2\\u0DF3\\u0E01-\\u0E3A\\u0E40-\\u0E4E\\u0E50-\\u0E59\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB9\\u0EBB-\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EC8-\\u0ECD\\u0ED0-\\u0ED9\\u0EDC-\\u0EDF\\u0F00\\u0F18\\u0F19\\u0F20-\\u0F29\\u0F35\\u0F37\\u0F39\\u0F3E-\\u0F47\\u0F49-\\u0F6C\\u0F71-\\u0F84\\u0F86-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u1000-\\u1049\\u1050-\\u109D\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u135D-\\u135F\\u1369-\\u1371\\u1380-\\u138F\\u13A0-\\u13F5\\u13F8-\\u13FD\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F8\\u1700-\\u170C\\u170E-\\u1714\\u1720-\\u1734\\u1740-\\u1753\\u1760-\\u176C\\u176E-\\u1770\\u1772\\u1773\\u1780-\\u17D3\\u17D7\\u17DC\\u17DD\\u17E0-\\u17E9\\u180B-\\u180D\\u1810-\\u1819\\u1820-\\u1877\\u1880-\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1920-\\u192B\\u1930-\\u193B\\u1946-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19B0-\\u19C9\\u19D0-\\u19DA\\u1A00-\\u1A1B\\u1A20-\\u1A5E\\u1A60-\\u1A7C\\u1A7F-\\u1A89\\u1A90-\\u1A99\\u1AA7\\u1AB0-\\u1ABD\\u1B00-\\u1B4B\\u1B50-\\u1B59\\u1B6B-\\u1B73\\u1B80-\\u1BF3\\u1C00-\\u1C37\\u1C40-\\u1C49\\u1C4D-\\u1C7D\\u1C80-\\u1C88\\u1CD0-\\u1CD2\\u1CD4-\\u1CF6\\u1CF8\\u1CF9\\u1D00-\\u1DF5\\u1DFB-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u200C\\u200D\\u203F\\u2040\\u2054\\u2071\\u207F\\u2090-\\u209C\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2118-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D7F-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2DE0-\\u2DFF\\u3005-\\u3007\\u3021-\\u302F\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u3099-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FD5\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA62B\\uA640-\\uA66F\\uA674-\\uA67D\\uA67F-\\uA6F1\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA7AE\\uA7B0-\\uA7B7\\uA7F7-\\uA827\\uA840-\\uA873\\uA880-\\uA8C5\\uA8D0-\\uA8D9\\uA8E0-\\uA8F7\\uA8FB\\uA8FD\\uA900-\\uA92D\\uA930-\\uA953\\uA960-\\uA97C\\uA980-\\uA9C0\\uA9CF-\\uA9D9\\uA9E0-\\uA9FE\\uAA00-\\uAA36\\uAA40-\\uAA4D\\uAA50-\\uAA59\\uAA60-\\uAA76\\uAA7A-\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEF\\uAAF2-\\uAAF6\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uAB30-\\uAB5A\\uAB5C-\\uAB65\\uAB70-\\uABEA\\uABEC\\uABED\\uABF0-\\uABF9\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE00-\\uFE0F\\uFE20-\\uFE2F\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF10-\\uFF19\\uFF21-\\uFF3A\\uFF3F\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]|\\uD800[\\uDC00-\\uDC0B\\uDC0D-\\uDC26\\uDC28-\\uDC3A\\uDC3C\\uDC3D\\uDC3F-\\uDC4D\\uDC50-\\uDC5D\\uDC80-\\uDCFA\\uDD40-\\uDD74\\uDDFD\\uDE80-\\uDE9C\\uDEA0-\\uDED0\\uDEE0\\uDF00-\\uDF1F\\uDF30-\\uDF4A\\uDF50-\\uDF7A\\uDF80-\\uDF9D\\uDFA0-\\uDFC3\\uDFC8-\\uDFCF\\uDFD1-\\uDFD5]|\\uD801[\\uDC00-\\uDC9D\\uDCA0-\\uDCA9\\uDCB0-\\uDCD3\\uDCD8-\\uDCFB\\uDD00-\\uDD27\\uDD30-\\uDD63\\uDE00-\\uDF36\\uDF40-\\uDF55\\uDF60-\\uDF67]|\\uD802[\\uDC00-\\uDC05\\uDC08\\uDC0A-\\uDC35\\uDC37\\uDC38\\uDC3C\\uDC3F-\\uDC55\\uDC60-\\uDC76\\uDC80-\\uDC9E\\uDCE0-\\uDCF2\\uDCF4\\uDCF5\\uDD00-\\uDD15\\uDD20-\\uDD39\\uDD80-\\uDDB7\\uDDBE\\uDDBF\\uDE00-\\uDE03\\uDE05\\uDE06\\uDE0C-\\uDE13\\uDE15-\\uDE17\\uDE19-\\uDE33\\uDE38-\\uDE3A\\uDE3F\\uDE60-\\uDE7C\\uDE80-\\uDE9C\\uDEC0-\\uDEC7\\uDEC9-\\uDEE6\\uDF00-\\uDF35\\uDF40-\\uDF55\\uDF60-\\uDF72\\uDF80-\\uDF91]|\\uD803[\\uDC00-\\uDC48\\uDC80-\\uDCB2\\uDCC0-\\uDCF2]|\\uD804[\\uDC00-\\uDC46\\uDC66-\\uDC6F\\uDC7F-\\uDCBA\\uDCD0-\\uDCE8\\uDCF0-\\uDCF9\\uDD00-\\uDD34\\uDD36-\\uDD3F\\uDD50-\\uDD73\\uDD76\\uDD80-\\uDDC4\\uDDCA-\\uDDCC\\uDDD0-\\uDDDA\\uDDDC\\uDE00-\\uDE11\\uDE13-\\uDE37\\uDE3E\\uDE80-\\uDE86\\uDE88\\uDE8A-\\uDE8D\\uDE8F-\\uDE9D\\uDE9F-\\uDEA8\\uDEB0-\\uDEEA\\uDEF0-\\uDEF9\\uDF00-\\uDF03\\uDF05-\\uDF0C\\uDF0F\\uDF10\\uDF13-\\uDF28\\uDF2A-\\uDF30\\uDF32\\uDF33\\uDF35-\\uDF39\\uDF3C-\\uDF44\\uDF47\\uDF48\\uDF4B-\\uDF4D\\uDF50\\uDF57\\uDF5D-\\uDF63\\uDF66-\\uDF6C\\uDF70-\\uDF74]|\\uD805[\\uDC00-\\uDC4A\\uDC50-\\uDC59\\uDC80-\\uDCC5\\uDCC7\\uDCD0-\\uDCD9\\uDD80-\\uDDB5\\uDDB8-\\uDDC0\\uDDD8-\\uDDDD\\uDE00-\\uDE40\\uDE44\\uDE50-\\uDE59\\uDE80-\\uDEB7\\uDEC0-\\uDEC9\\uDF00-\\uDF19\\uDF1D-\\uDF2B\\uDF30-\\uDF39]|\\uD806[\\uDCA0-\\uDCE9\\uDCFF\\uDEC0-\\uDEF8]|\\uD807[\\uDC00-\\uDC08\\uDC0A-\\uDC36\\uDC38-\\uDC40\\uDC50-\\uDC59\\uDC72-\\uDC8F\\uDC92-\\uDCA7\\uDCA9-\\uDCB6]|\\uD808[\\uDC00-\\uDF99]|\\uD809[\\uDC00-\\uDC6E\\uDC80-\\uDD43]|[\\uD80C\\uD81C-\\uD820\\uD840-\\uD868\\uD86A-\\uD86C\\uD86F-\\uD872][\\uDC00-\\uDFFF]|\\uD80D[\\uDC00-\\uDC2E]|\\uD811[\\uDC00-\\uDE46]|\\uD81A[\\uDC00-\\uDE38\\uDE40-\\uDE5E\\uDE60-\\uDE69\\uDED0-\\uDEED\\uDEF0-\\uDEF4\\uDF00-\\uDF36\\uDF40-\\uDF43\\uDF50-\\uDF59\\uDF63-\\uDF77\\uDF7D-\\uDF8F]|\\uD81B[\\uDF00-\\uDF44\\uDF50-\\uDF7E\\uDF8F-\\uDF9F\\uDFE0]|\\uD821[\\uDC00-\\uDFEC]|\\uD822[\\uDC00-\\uDEF2]|\\uD82C[\\uDC00\\uDC01]|\\uD82F[\\uDC00-\\uDC6A\\uDC70-\\uDC7C\\uDC80-\\uDC88\\uDC90-\\uDC99\\uDC9D\\uDC9E]|\\uD834[\\uDD65-\\uDD69\\uDD6D-\\uDD72\\uDD7B-\\uDD82\\uDD85-\\uDD8B\\uDDAA-\\uDDAD\\uDE42-\\uDE44]|\\uD835[\\uDC00-\\uDC54\\uDC56-\\uDC9C\\uDC9E\\uDC9F\\uDCA2\\uDCA5\\uDCA6\\uDCA9-\\uDCAC\\uDCAE-\\uDCB9\\uDCBB\\uDCBD-\\uDCC3\\uDCC5-\\uDD05\\uDD07-\\uDD0A\\uDD0D-\\uDD14\\uDD16-\\uDD1C\\uDD1E-\\uDD39\\uDD3B-\\uDD3E\\uDD40-\\uDD44\\uDD46\\uDD4A-\\uDD50\\uDD52-\\uDEA5\\uDEA8-\\uDEC0\\uDEC2-\\uDEDA\\uDEDC-\\uDEFA\\uDEFC-\\uDF14\\uDF16-\\uDF34\\uDF36-\\uDF4E\\uDF50-\\uDF6E\\uDF70-\\uDF88\\uDF8A-\\uDFA8\\uDFAA-\\uDFC2\\uDFC4-\\uDFCB\\uDFCE-\\uDFFF]|\\uD836[\\uDE00-\\uDE36\\uDE3B-\\uDE6C\\uDE75\\uDE84\\uDE9B-\\uDE9F\\uDEA1-\\uDEAF]|\\uD838[\\uDC00-\\uDC06\\uDC08-\\uDC18\\uDC1B-\\uDC21\\uDC23\\uDC24\\uDC26-\\uDC2A]|\\uD83A[\\uDC00-\\uDCC4\\uDCD0-\\uDCD6\\uDD00-\\uDD4A\\uDD50-\\uDD59]|\\uD83B[\\uDE00-\\uDE03\\uDE05-\\uDE1F\\uDE21\\uDE22\\uDE24\\uDE27\\uDE29-\\uDE32\\uDE34-\\uDE37\\uDE39\\uDE3B\\uDE42\\uDE47\\uDE49\\uDE4B\\uDE4D-\\uDE4F\\uDE51\\uDE52\\uDE54\\uDE57\\uDE59\\uDE5B\\uDE5D\\uDE5F\\uDE61\\uDE62\\uDE64\\uDE67-\\uDE6A\\uDE6C-\\uDE72\\uDE74-\\uDE77\\uDE79-\\uDE7C\\uDE7E\\uDE80-\\uDE89\\uDE8B-\\uDE9B\\uDEA1-\\uDEA3\\uDEA5-\\uDEA9\\uDEAB-\\uDEBB]|\\uD869[\\uDC00-\\uDED6\\uDF00-\\uDFFF]|\\uD86D[\\uDC00-\\uDF34\\uDF40-\\uDFFF]|\\uD86E[\\uDC00-\\uDC1D\\uDC20-\\uDFFF]|\\uD873[\\uDC00-\\uDEA1]|\\uD87E[\\uDC00-\\uDE1D]|\\uDB40[\\uDD00-\\uDDEF])';

const UnicodeIdentifiers = {UnicodeIDStart, UnicodeIDContinue};

function configureDexieForNode() {
    const shim: {indexedDB?: IDBFactory, IDBKeyRange?: IDBKeyRange } = {};
    const obj = setGlobalVars(shim, {
        checkOrigin: false,
        memoryDatabase: "", // XXX should only be for testing
    });
    obj.shimIndexedDB.__setUnicodeIdentifiers(UnicodeIdentifiers);
    const { indexedDB, IDBKeyRange } = shim;
    Dexie.dependencies.indexedDB = indexedDB!;
    Dexie.dependencies.IDBKeyRange = IDBKeyRange!;
}

configureDexieForNode();

interface Schemas {
  [table: string]: string;
}

export interface DerivedDBConfiguration {
  name: string;
  eventNames?: string[];
  idFields?: string[];
}

export class DB {
  private networkId: number;
  private blockstreamDelay: number;
  private syncableDatabases: { [dbName: string]: SyncableDB } = {};
  //private liquidityDatabase: LiquidityDB;
  private disputeDatabase: DisputeDatabase;
  private currentOrdersDatabase: CurrentOrdersDatabase;
  private marketDatabase: MarketDB;
  private zeroXOrders: ZeroXOrders;
  private blockAndLogStreamerListener: IBlockAndLogStreamerListener;
  private augur: Augur;
  readonly dexieDB: Dexie;
  syncStatus: SyncStatus;

  readonly genericEventDBDescriptions: GenericEventDBDescription[] = [
    { EventName: 'CompleteSetsPurchased', indexes: ['timestamp'] },
    { EventName: 'CompleteSetsSold', indexes: ['timestamp'] },
    { EventName: 'DisputeCrowdsourcerCompleted', indexes: ['market', 'timestamp', 'disputeCrowdsourcer'] },
    { EventName: 'DisputeCrowdsourcerContribution', indexes: ['timestamp', 'market', '[universe+reporter]'] },
    { EventName: 'DisputeCrowdsourcerCreated', indexes: ['disputeCrowdsourcer'] },
    { EventName: 'DisputeCrowdsourcerRedeemed', indexes: ['timestamp', 'reporter'] },
    { EventName: 'DisputeWindowCreated', indexes: [] },
    { EventName: 'InitialReporterRedeemed', indexes: ['timestamp', 'reporter'] },
    { EventName: 'InitialReportSubmitted', indexes: ['timestamp', 'reporter', '[universe+reporter]'] },
    { EventName: 'InitialReporterTransferred', indexes: [] },
    { EventName: 'MarketCreated', indexes: ['market', 'timestamp', '[universe+timestamp]'] },
    { EventName: 'MarketFinalized', indexes: ['market'] },
    { EventName: 'MarketMigrated', indexes: ['market'] },
    { EventName: 'MarketParticipantsDisavowed', indexes: [] },
    { EventName: 'MarketTransferred', indexes: [] },
    { EventName: 'MarketVolumeChanged', indexes: [], primaryKey: 'market' },
    { EventName: 'MarketOIChanged', indexes: [], primaryKey: 'market' },
    { EventName: 'OrderEvent', indexes: ['market', 'timestamp', 'orderId', '[universe+eventType+timestamp]', '[market+eventType]'] },
    { EventName: 'ParticipationTokensRedeemed', indexes: ['timestamp'] },
    { EventName: 'ProfitLossChanged', indexes: ['[universe+account+timestamp]', 'account'] },
    { EventName: 'ReportingParticipantDisavowed', indexes: [] },
    { EventName: 'TimestampSet', indexes: ['newTimestamp'] },
    { EventName: 'TokenBalanceChanged', indexes: ['[universe+owner+tokenType]'], primaryKey: '[owner+token]' },
    { EventName: 'TokensMinted', indexes: [] },
    { EventName: 'TokensTransferred', indexes: [] },
    { EventName: 'TradingProceedsClaimed', indexes: ['timestamp'] },
    { EventName: 'UniverseCreated', indexes: ['childUniverse', 'parentUniverse'] },
    { EventName: 'UniverseForked', indexes: ['universe'] },
    { EventName: 'TransferSingle', indexes: []},
    { EventName: 'TransferBatch', indexes: []},
    { EventName: 'ShareTokenBalanceChanged', indexes: ['[universe+account]'], primaryKey: '[account+market+outcome]'},
  ];

  constructor(dexieDB: Dexie) {
    this.dexieDB = dexieDB;
  }

  /**
   * Creates and returns a new dbController.
   *
   * @param {number} networkId Network on which to sync events
   * @param {number} blockstreamDelay Number of blocks by which to delay blockstream
   * @param {number} defaultStartSyncBlockNumber Block number at which to start sycing (if no higher block number has been synced)
   * @param {Array<string>} trackedUsers Array of user addresses for which to sync user-specific events
   * @param {Array<string>} genericEventNames Array of names for generic event types
   * @param {Array<DerivedDBConfiguration>} derivedDBConfigurations Array of custom event objects
   * @param {Array<UserSpecificDBConfiguration>} userSpecificDBConfiguration Array of user-specific event objects
   * @param {TableFactoryType} TableFactory Factory function generatin PouchDB instance
   * @param {IBlockAndLogStreamerListener} blockAndLogStreamerListener Stream listener for blocks and logs
   * @returns {Promise<DB>} Promise to a DB controller object
   */
  static createAndInitializeDB(networkId: number, blockstreamDelay: number, defaultStartSyncBlockNumber: number, augur: Augur, blockAndLogStreamerListener: IBlockAndLogStreamerListener): Promise<DB> {
    const dbName = `augur-${networkId}`;
    const dbController = new DB(new Dexie(dbName));

    dbController.augur = augur;

    return dbController.initializeDB(networkId, blockstreamDelay, defaultStartSyncBlockNumber, blockAndLogStreamerListener);
  }

  /**
   * Creates databases to be used for syncing.
   *
   * @param {number} networkId Network on which to sync events
   * @param {number} blockstreamDelay Number of blocks by which to delay blockstream
   * @param {number} defaultStartSyncBlockNumber Block number at which to start sycing (if no higher block number has been synced)
   * @param {Array<string>} trackedUsers Array of user addresses for which to sync user-specific events
   * @param {Array<string>} genericEventNames Array of names for generic event types
   * @param {Array<UserSpecificDBConfiguration>} userSpecificDBConfiguration Array of user-specific event objects
   * @param blockAndLogStreamerListener
   * @return {Promise<void>}
   */
  async initializeDB(networkId: number, blockstreamDelay: number, defaultStartSyncBlockNumber: number, blockAndLogStreamerListener: IBlockAndLogStreamerListener): Promise<DB> {
    this.networkId = networkId;
    this.blockstreamDelay = blockstreamDelay;
    this.blockAndLogStreamerListener = blockAndLogStreamerListener;

    const schemas = this.generateSchemas();

    this.dexieDB.version(1).stores(schemas);

    await this.dexieDB.open();

    this.syncStatus = new SyncStatus(networkId, defaultStartSyncBlockNumber, this);

    // Create SyncableDBs for generic event types & UserSyncableDBs for user-specific event types
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      new SyncableDB(this.augur, this, networkId, genericEventDBDescription.EventName, genericEventDBDescription.EventName, genericEventDBDescription.indexes);
    }

    // TODO this.liquidityDatabase = new LiquidityDB(this.augur, this, networkId, 'Liquidity');

    // Custom Derived DBs here
    this.disputeDatabase = new DisputeDatabase(this, networkId, 'Dispute', ['InitialReportSubmitted', 'DisputeCrowdsourcerCreated', 'DisputeCrowdsourcerContribution', 'DisputeCrowdsourcerCompleted'], this.augur);
    this.currentOrdersDatabase = new CurrentOrdersDatabase(this, networkId, 'CurrentOrders', ['OrderEvent'], this.augur);
    this.marketDatabase = new MarketDB(this, networkId, this.augur);

    // Zero X Orders. Only on if a mesh client has been provided
    this.zeroXOrders = this.augur.zeroX ? await ZeroXOrders.create(this, networkId, this.augur): undefined;

    // Always start syncing from 10 blocks behind the lowest
    // last-synced block (in case of restarting after a crash)
    const startSyncBlockNumber = await this.getSyncStartingBlock();
    if (startSyncBlockNumber > this.syncStatus.defaultStartSyncBlockNumber) {
      console.log('Performing rollback of block ' + startSyncBlockNumber + ' onward');
      await this.rollback(startSyncBlockNumber);
    }

    return this;
  }

  generateSchemas() : Schemas {
    const schemas: Schemas = {};
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      let primaryKey = "[blockNumber+logIndex]";
      if (genericEventDBDescription.primaryKey) primaryKey = genericEventDBDescription.primaryKey;
      const fields = [primaryKey,"blockNumber"].concat(genericEventDBDescription.indexes);
      schemas[genericEventDBDescription.EventName] = fields.join(',');
    }
    schemas["Markets"] = "market,reportingState,universe,marketCreator,timestamp,finalized,blockNumber";
    schemas["CurrentOrders"] = "orderId, [market+open], [market+outcome+orderType], orderCreator, orderFiller, blockNumber";
    schemas["Dispute"] = "[market+payoutNumerators],market,blockNumber";
    schemas["ZeroXOrders"] = "orderHash, [market+outcome+orderType],blockNumber";
    schemas["SyncStatus"] = "eventName,blockNumber,syncing";
    return schemas;
  }

  /**
   * Called from SyncableDB constructor once SyncableDB is successfully created.
   *
   * @param {SyncableDB} db dbController that utilizes the SyncableDB
   */
  notifySyncableDBAdded(db: SyncableDB): void {
    this.syncableDatabases[db.dbName] = db;
  }

  registerEventListener(eventNames: string | string[], callback: LogCallbackType): void {
    this.blockAndLogStreamerListener.listenForEvent(eventNames, callback);
  }

  /**
   * Syncs generic events and user-specific events with blockchain and updates MetaDB info.
   *
   * @param {Augur} augur Augur object with which to sync
   * @param {number} chunkSize Number of blocks to retrieve at a time when syncing logs
   * @param {number} blockstreamDelay Number of blocks by which blockstream is behind the blockchain
   */
  async sync(augur: Augur, chunkSize: number, blockstreamDelay: number): Promise<void> {
    let dbSyncPromises = [];
    const highestAvailableBlockNumber = await augur.provider.getBlockNumber();

    console.log('Syncing generic log DBs');
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      const dbName = genericEventDBDescription.EventName;
      dbSyncPromises.push(
        this.syncableDatabases[dbName].sync(
          augur,
          chunkSize,
          blockstreamDelay,
          highestAvailableBlockNumber
        )
      );
    }

    await Promise.all(dbSyncPromises);

    // Derived DBs are synced after generic log DBs complete
    console.log('Syncing derived DBs');

    // If no meshCLient provided will not exists
    if (this.zeroXOrders) await this.zeroXOrders.sync();

    await this.disputeDatabase.sync(highestAvailableBlockNumber);
    await this.currentOrdersDatabase.sync(highestAvailableBlockNumber);

    // The Market DB syncs after the derived DBs, as it depends on a derived DB
    await this.marketDatabase.sync(highestAvailableBlockNumber);

    // Update LiquidityDatabase and set it to update whenever there's a new block
    //await this.liquidityDatabase.updateLiquidity(augur, this, (await augur.getTimestamp()).toNumber());

    //this.augur.getAugurEventEmitter().on(SubscriptionEventName.NewBlock, (args) => this.liquidityDatabase.updateLiquidity(this.augur, this, args.timestamp));
    this.augur.getAugurEventEmitter().emit(SubscriptionEventName.SDKReady, {
      eventName: SubscriptionEventName.SDKReady,
    });
  }

  /**
   * Gets the block number at which to begin syncing. (That is, the lowest last-synced
   * block across all event log databases or the upload block number for this network.)
   *
   * @returns {Promise<number>} Promise to the block number at which to begin syncing.
   */
  async getSyncStartingBlock(): Promise<number> {
    const highestSyncBlocks = [];
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      highestSyncBlocks.push(await this.syncStatus.getHighestSyncBlock(genericEventDBDescription.EventName));
    }
    const lowestLastSyncBlock = Math.min.apply(null, highestSyncBlocks);
    return Math.max.apply(null, [lowestLastSyncBlock - this.blockstreamDelay, this.syncStatus.defaultStartSyncBlockNumber]);
  }

  /**
   * Gets a syncable database based upon the name
   *
   * @param {string} dbName The name of the database
   */
  getSyncableDatabase(dbName: string): SyncableDB {
    return this.syncableDatabases[dbName];
  }

  /**
   * Rolls back all blocks from blockNumber onward.
   *
   * @param {number} blockNumber Oldest block number to delete
   */
  rollback = async (blockNumber: number): Promise<void> => {
    const dbRollbackPromises = [];
    // Perform rollback on SyncableDBs & UserSyncableDBs
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      const dbName = genericEventDBDescription.EventName;
      dbRollbackPromises.push(this.syncableDatabases[dbName].rollback(blockNumber));
    }

    // Perform rollback on derived DBs
    dbRollbackPromises.push(this.disputeDatabase.rollback(blockNumber));
    dbRollbackPromises.push(this.currentOrdersDatabase.rollback(blockNumber));
    dbRollbackPromises.push(this.marketDatabase.rollback(blockNumber));

    // TODO Figure out a way to handle concurrent request limit of 40
    await Promise.all(dbRollbackPromises).catch(error => { throw error; });
  }

  /**
   * Adds a new block to a SyncableDB/UserSyncableDB and updates MetaDB.
   *
   * TODO Define blockLogs interface
   *
   * @param {string} dbName Name of the database to which the block should be added
   * @param {any} blockLogs Logs from a new block
   */
  async addNewBlock(dbName: string, blockLogs: any): Promise<void> {
    const db = this.syncableDatabases[dbName];
    if (!db) {
      throw new Error('Unknown DB name: ' + dbName);
    }
    try {
      await db.addNewBlock(blockLogs[0].blockNumber, blockLogs);

      const highestSyncBlock = await this.syncStatus.getHighestSyncBlock(dbName);
      if (highestSyncBlock !== blockLogs[0].blockNumber) {
        throw new Error('Highest sync block is ' + highestSyncBlock + '; newest block number is ' + blockLogs[0].blockNumber);
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Queries a DB to get a row count.
   *
   * @param {string} dbName Name of the DB to query
   * @param {{}} Optional request Query object to narrow results
   * @returns {Promise<number>} Promise to a number of rows
   */
  async getNumRowsFromDB(dbName: string, request?: {}): Promise<number> {
    const fullDBName = dbName;
    const table: Dexie.Table<any, any> = this.dexieDB[fullDBName];

    if (request) {
      const results = await table.where(request);
      return results.count();
    }

    return table.count();
  }

  get CompleteSetsPurchased() { return this.dexieDB["CompleteSetsPurchased"] as Dexie.Table<CompleteSetsPurchasedLog, any>; }
  get CompleteSetsSold() { return this.dexieDB["CompleteSetsSold"] as Dexie.Table<CompleteSetsSoldLog, any>; }
  get DisputeCrowdsourcerContribution() { return this.dexieDB["DisputeCrowdsourcerContribution"] as Dexie.Table<DisputeCrowdsourcerContributionLog, any>; }
  get DisputeCrowdsourcerCompleted() { return this.dexieDB["DisputeCrowdsourcerCompleted"] as Dexie.Table<DisputeCrowdsourcerCompletedLog, any>; }
  get DisputeCrowdsourcerCreated() { return this.dexieDB["DisputeCrowdsourcerCreated"] as Dexie.Table<DisputeCrowdsourcerCreatedLog, any>; }
  get DisputeCrowdsourcerRedeemed() { return this.dexieDB["DisputeCrowdsourcerRedeemed"] as Dexie.Table<DisputeCrowdsourcerRedeemedLog, any>; }
  get DisputeWindowCreated() { return this.dexieDB["DisputeWindowCreated"] as Dexie.Table<DisputeWindowCreatedLog, any>; }
  get InitialReporterRedeemed() { return this.dexieDB["InitialReporterRedeemed"] as Dexie.Table<InitialReporterRedeemedLog, any>; }
  get InitialReportSubmitted() { return this.dexieDB["InitialReportSubmitted"] as Dexie.Table<InitialReportSubmittedLog, any>; }
  get InitialReporterTransferred() { return this.dexieDB["InitialReporterTransferred"] as Dexie.Table<InitialReporterTransferredLog, any>; }
  get MarketCreated() { return this.dexieDB["MarketCreated"] as Dexie.Table<MarketCreatedLog, any>; }
  get MarketFinalized() { return this.dexieDB["MarketFinalized"] as Dexie.Table<MarketFinalizedLog, any>; }
  get MarketMigrated() { return this.dexieDB["MarketMigrated"] as Dexie.Table<MarketMigratedLog, any>; }
  get MarketParticipantsDisavowed() { return this.dexieDB["MarketParticipantsDisavowed"] as Dexie.Table<MarketParticipantsDisavowedLog, any>; }
  get MarketTransferred() { return this.dexieDB["MarketTransferred"] as Dexie.Table<MarketTransferredLog, any>; }
  get MarketVolumeChanged() { return this.dexieDB["MarketVolumeChanged"] as Dexie.Table<MarketVolumeChangedLog, any>; }
  get MarketOIChanged() { return this.dexieDB["MarketOIChanged"] as Dexie.Table<MarketOIChangedLog, any>; }
  get OrderEvent() { return this.dexieDB["OrderEvent"] as Dexie.Table<ParsedOrderEventLog, any>; }
  get ParticipationTokensRedeemed() { return this.dexieDB["ParticipationTokensRedeemed"] as Dexie.Table<ParticipationTokensRedeemedLog, any>; }
  get ProfitLossChanged() { return this.dexieDB["ProfitLossChanged"] as Dexie.Table<ProfitLossChangedLog, any>; }
  get ReportingParticipantDisavowed() { return this.dexieDB["ReportingParticipantDisavowed"] as Dexie.Table<ReportingParticipantDisavowedLog, any>; }
  get TimestampSet() { return this.dexieDB["TimestampSet"] as Dexie.Table<TimestampSetLog, any>; }
  get TokenBalanceChanged() { return this.dexieDB["TokenBalanceChanged"] as Dexie.Table<TokenBalanceChangedLog, any>; }
  get TokensMinted() { return this.dexieDB["TokensMinted"] as Dexie.Table<TokensMinted, any>; }
  get TokensTransferred() { return this.dexieDB["TokensTransferred"] as Dexie.Table<TokensTransferredLog, any>; }
  get TradingProceedsClaimed() { return this.dexieDB["TradingProceedsClaimed"] as Dexie.Table<TradingProceedsClaimedLog, any>; }
  get UniverseCreated() { return this.dexieDB["UniverseCreated"] as Dexie.Table<UniverseCreatedLog, any>; }
  get UniverseForked() { return this.dexieDB["UniverseForked"] as Dexie.Table<UniverseForkedLog, any>; }
  get TransferSingle() { return this.dexieDB["TransferSingle"] as Dexie.Table<TransferSingleLog, any>; }
  get TransferBatch() { return this.dexieDB["TransferBatch"] as Dexie.Table<TransferBatchLog, any>; }
  get ShareTokenBalanceChanged() { return this.dexieDB["ShareTokenBalanceChanged"] as Dexie.Table<ShareTokenBalanceChangedLog, any>; }
  get Markets() { return this.dexieDB["Markets"] as Dexie.Table<MarketData, any>; }
  get Dispute() { return this.dexieDB["Dispute"] as Dexie.Table<DisputeDoc, any>; }
  get CurrentOrders() { return this.dexieDB["CurrentOrders"] as Dexie.Table<CurrentOrder, any>; }
  get ZeroXOrders() { return this.dexieDB["ZeroXOrders"] as Dexie.Table<StoredOrder, any>; }

  /**
   * Queries the a Table using the provided query args
   *
   * @param {{}}} request Query object
   * @returns {Promise<Array<T>>}
   */
  async findData<T>(name: string, request: {}): Promise<T[]> {
    const results = await this.dexieDB[name].get(request);
    const logs = results as unknown as T[];
    return logs;
  }

  // XXX

  /**
   * Queries a SyncableDB.
   *
   * @param {string} dbName Name of the SyncableDB to query
   * @param {{}} request Query object
   * @returns {Promise<FakePouchResponse>} Promise to a FindResponse
   */
  async findInSyncableDB(dbName: string, request: PouchDB.Find.FindRequest<{}>): Promise<FakePouchResponse> {
    if (this.syncableDatabases[dbName]) {
      console.log(`REQUEST: ${JSON.stringify(request)}`);
      const result = await this.syncableDatabases[dbName].find(request);
      console.log(`RESULT: ${JSON.stringify(result)}`);
      return {docs: await result.toArray()};
    }
    else {
      return {docs: []};
    }
  }

  /**
   * Queries a DerivedDB.
   *
   * @param {string} dbName Name of the SyncableDB to query
   * @param {{}} request Query object
   * @returns {Promise<{FakePouchResponse>} Promise to a FindResponse
   */
  async findInDerivedDB(dbName: string, request: PouchDB.Find.FindRequest<{}>): Promise<FakePouchResponse> {
    const result = await this.dexieDB[dbName].get(request);
    return {docs: await result.toArray()};
  }

  /**
   * Queries the CompleteSetsPurchased DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<CompleteSetsPurchasedLog>>}
   */
  async findCompleteSetsPurchasedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<CompleteSetsPurchasedLog[]> {
    const results = await this.findInSyncableDB('CompleteSetsPurchased', request);
    return results.docs as unknown as CompleteSetsPurchasedLog[];
  }

  /**
   * Queries the CompleteSetsSold DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<CompleteSetsSoldLog>>}
   */
  async findCompleteSetsSoldLogs(request: PouchDB.Find.FindRequest<{}>): Promise<CompleteSetsSoldLog[]> {
    const results = await this.findInSyncableDB('CompleteSetsSold', request);
    return results.docs as unknown as CompleteSetsSoldLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerCompleted DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerCompletedLog>>}
   */
  async findDisputeCrowdsourcerCompletedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerCompletedLog[]> {
    const results = await this.findInSyncableDB('DisputeCrowdsourcerCompleted', request);
    return results.docs as unknown as DisputeCrowdsourcerCompletedLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerContribution DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerContributionLog>>}
   */
  async findDisputeCrowdsourcerContributionLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerContributionLog[]> {
    const results = await this.findInSyncableDB('DisputeCrowdsourcerContribution', request);
    return results.docs as unknown as DisputeCrowdsourcerContributionLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerCreatedLog>>}
   */
  async findDisputeCrowdsourcerCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerCreatedLog[]> {
    const results = await this.findInSyncableDB('DisputeCrowdsourcerCreated', request);
    return results.docs as unknown as DisputeCrowdsourcerCreatedLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerRedeemed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerRedeemedLog>>}
   */
  async findDisputeCrowdsourcerRedeemedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerRedeemedLog[]> {
    const results = await this.findInSyncableDB('DisputeCrowdsourcerRedeemed', request);
    return results.docs as unknown as DisputeCrowdsourcerRedeemedLog[];
  }

  /**
   * Queries the DisputeWindowCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeWindowCreatedLog>>}
   */
  async findDisputeWindowCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeWindowCreatedLog[]> {
    const results = await this.findInSyncableDB('DisputeWindowCreated', request);
    return results.docs as unknown as DisputeWindowCreatedLog[];
  }

  /**
   * Queries the InitialReporterRedeemed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<InitialReporterRedeemedLog>>}
   */
  async findInitialReporterRedeemedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<InitialReporterRedeemedLog[]> {
    const results = await this.findInSyncableDB('InitialReporterRedeemed', request);
    return results.docs as unknown as InitialReporterRedeemedLog[];
  }

  /**
   * Queries the InitialReportSubmitted DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<InitialReportSubmittedLog>>}
   */
  async findInitialReportSubmittedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<InitialReportSubmittedLog[]> {
    const results = await this.findInSyncableDB('InitialReportSubmitted', request);
    return results.docs as unknown as InitialReportSubmittedLog[];
  }

  /**
   * Queries the MarketCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketCreatedLog>>}
   */
  async findMarketCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketCreatedLog[]> {
    const results = await this.findInSyncableDB('MarketCreated', request);
    return results.docs as unknown as MarketCreatedLog[];
  }

  /**
   * Queries the MarketFinalized DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketFinalizedLog>>}
   */
  async findMarketFinalizedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketFinalizedLog[]> {
    const results = await this.findInSyncableDB('MarketFinalized', request);
    return results.docs as unknown as MarketFinalizedLog[];
  }

  /**
   * Queries the MarketMigrated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketMigratedLog>>}
   */
  async findMarketMigratedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketMigratedLog[]> {
    const results = await this.findInSyncableDB('MarketMigrated', request);
    return results.docs as unknown as MarketMigratedLog[];
  }

  /**
   * Queries the MarketVolumeChanged DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketVolumeChangedLog>>}
   */
  async findMarketVolumeChangedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketVolumeChangedLog[]> {
    const results = await this.findInSyncableDB('MarketVolumeChanged', request);
    return results.docs as unknown as MarketVolumeChangedLog[];
  }

  /**
   * Queries the MarketOIChanged DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketOIChangedLog>>}
   */
  async findMarketOIChangedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketOIChangedLog[]> {
    const results = await this.findInSyncableDB('MarketOIChanged', request);
    return results.docs as unknown as MarketOIChangedLog[];
  }

  /**
   * Queries the OrderEvent DB for Cancel events
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParsedOrderEventLog>>}
   */
  async findOrderCanceledLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParsedOrderEventLog[]> {
    request.selector['eventType'] = OrderEventType.Cancel;
    const results = await this.findInSyncableDB('OrderEvent', request);
    const logs = results.docs as unknown as ParsedOrderEventLog[];
    for (const log of logs) log.timestamp = log.timestamp;
    return logs;
  }

  /**
   * Queries the OrderEvent DB for Create events
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParsedOrderEventLog>>}
   */
  async findOrderCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParsedOrderEventLog[]> {
    request.selector['eventType'] = OrderEventType.Create;
    const results = await this.findInSyncableDB('OrderEvent', request);
    const logs = results.docs as unknown as ParsedOrderEventLog[];
    for (const log of logs) log.timestamp = log.timestamp;
    return logs;
  }

  /**
   * Queries the OrderEvent DB for Fill events
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParsedOrderEventLog>>}
   */
  async findOrderFilledLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParsedOrderEventLog[]> {
    request.selector['eventType'] = OrderEventType.Fill;
    const results = await this.findInSyncableDB('OrderEvent', request);
    const logs = results.docs as unknown as ParsedOrderEventLog[];
    for (const log of logs) log.timestamp = log.timestamp;
    return logs;
  }

  /**
   * Queries the ParticipationTokensRedeemed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParticipationTokensRedeemedLog>>}
   */
  async findParticipationTokensRedeemedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParticipationTokensRedeemedLog[]> {
    const results = await this.findInSyncableDB('ParticipationTokensRedeemed', request);
    return results.docs as unknown as ParticipationTokensRedeemedLog[];
  }

  /**
   * Queries the ProfitLossChanged DB
   *
   * @param {string} the user whose logs are being retreived
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ProfitLossChangedLog>>}
   */
  async findProfitLossChangedLogs(user: string, request: PouchDB.Find.FindRequest<{}>): Promise<ProfitLossChangedLog[]> {
    const results = await this.findInSyncableDB('ProfitLossChanged', request);
    return results.docs as unknown as ProfitLossChangedLog[];
  }

  /**
   * Queries the TimestampSet DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<TimestampSetLog>>}
   */
  async findTimestampSetLogs(request: PouchDB.Find.FindRequest<{}>): Promise<TimestampSetLog[]> {
    const results = await this.findInSyncableDB('TimestampSet', request);
    return results.docs as unknown as TimestampSetLog[];
  }

  /**
   * Queries the TokenBalanceChanged DB
   *
   * @param {string} the user whose logs are being retreived
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<TokenBalanceChangedLog>>}
   */
  async findTokenBalanceChangedLogs(user: string, request: PouchDB.Find.FindRequest<{}>): Promise<TokenBalanceChangedLog[]> {
    const results = await this.findInSyncableDB('TokenBalanceChanged', request);
    return results.docs as unknown as TokenBalanceChangedLog[];
  }

  /**
   * Queries the ShareTokenBalanceChanged DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<TokenBalanceChangedLog>>}
   */
  async findShareTokenBalanceChangedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ShareTokenBalanceChangedLog[]> {
    const results = await this.findInSyncableDB('ShareTokenBalanceChanged', request);
    return results.docs as unknown as ShareTokenBalanceChangedLog[];
  }

  async findTokensMintedLogs(user: string, request: PouchDB.Find.FindRequest<{}>): Promise<TokensMinted[]> {
    const results = await this.findInSyncableDB('TokensMinted', request);
    return results.docs as unknown as TokensMinted[];
  }

  /**
   * Queries the TradingProceedsClaimed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<TradingProceedsClaimedLog>>}
   */
  async findTradingProceedsClaimedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<TradingProceedsClaimedLog[]> {
    const results = await this.findInSyncableDB('TradingProceedsClaimed', request);
    return results.docs as unknown as TradingProceedsClaimedLog[];
  }

  /**
   * Queries the UniverseForked DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<UniverseForkedLog>>}
   */
  async findUniverseCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<UniverseCreatedLog[]> {
    const results = await this.findInSyncableDB("UniverseCreated", request);
    return results.docs as unknown as UniverseCreatedLog[];
  }

  /**
   * Queries the UniverseCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<UniverseForkedLog>>}
   */
  async findUniverseForkedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<UniverseForkedLog[]> {
    const results = await this.findInSyncableDB('UniverseForked', request);
    return results.docs as unknown as UniverseForkedLog[];
  }

  /**
   * Queries the CurrentOrders DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParsedOrderEventLog>>}
   */
  async findCurrentOrderLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParsedOrderEventLog[]> {
    const results = await this.findInDerivedDB('CurrentOrders', request);
    const logs = results.docs as unknown as ParsedOrderEventLog[];
    for (const log of logs) log.timestamp = log.timestamp;
    return logs;
  }

  /**
   * Queries the Dispute DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeDoc>>}
   */
  async findDisputeDocs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeDoc[]> {
    const results = await this.findInDerivedDB('Dispute', request);
    const logs = results.docs as unknown as DisputeDoc[];
    return logs;
  }

  /**
   * Queries the ZeroXOrders DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<StoredOrder>>}
   */
  async findZeroXOrderLogs(request: PouchDB.Find.FindRequest<{}>): Promise<StoredOrder[]> {
    if (!this.zeroXOrders) throw new Error("ZeroX orders not available as no mesh client was provided");
    const results = await this.zeroXOrders.find(request);
    const logs = results.toArray() as unknown as StoredOrder[];
    return logs;
  }

  /**
   * Queries the Markets DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketData>>}
   */
  async findMarkets(request: PouchDB.Find.FindRequest<{}>): Promise<MarketData[]> {
    const results = await this.findInDerivedDB('Markets', request);
    return results.docs as unknown as MarketData[];
  }

  // END XXX

  /**
   * Queries the Liquidity DB for hourly liquidity of markets
   *
   * @param {number} currentTimestamp Timestamp of the latest block
   * @param {string?} marketIds Array of market IDs to filter by
   * @returns {Promise<MarketHourlyLiquidity[]>}
   */
  /*
  async findRecentMarketsLiquidityDocs(currentTimestamp: number, marketIds?: string[]): Promise<MarketHourlyLiquidity[]> {
    const secondsPerHour = SECONDS_IN_AN_HOUR.toNumber();
    const mostRecentOnTheHourTimestamp = currentTimestamp - (currentTimestamp % secondsPerHour);
    const selectorConditions: any[] = [
      { _id: { $ne: 'lastUpdated' } },
      { timestamp: { $gte: mostRecentOnTheHourTimestamp - (SECONDS_IN_A_DAY).toNumber() } },
    ];
    if (marketIds) {
      selectorConditions.push(
        { market: { $in: marketIds } }
      );
    }
    const marketsLiquidity = await this.liquidityDatabase.find({
      selector: {
        $and: selectorConditions,
      },
    });

    return marketsLiquidity.docs as unknown as MarketHourlyLiquidity[];
  }
  */
  /**
   * Queries the Liquidity DB for hourly liquidity of all markets
   *
   * @returns {Promise<number|undefined>}
   */
  /*
  async findLiquidityLastUpdatedTimestamp(): Promise<number|undefined> {
    const lastUpdatedResults = await this.liquidityDatabase.find({
      selector: {
        _id: { $eq: 'lastUpdated' },
      },
    });
    const lastUpdatedDocs = lastUpdatedResults.docs as unknown as LiquidityLastUpdated[];
    if (lastUpdatedDocs.length > 0) {
      return lastUpdatedDocs[0].timestamp;
    }
    return undefined;
  }
  */
}
