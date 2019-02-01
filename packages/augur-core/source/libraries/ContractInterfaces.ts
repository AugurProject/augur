import { ethers } from "ethers";
import * as c from "./GenericContractInterfaces";
export * from "./GenericContractInterfaces";
export class Contract extends c.Contract<ethers.utils.BigNumber> {
}
export class Augur extends c.Augur<ethers.utils.BigNumber> {
}
export class ERC820Registry extends c.ERC820Registry<ethers.utils.BigNumber> {
}
export class LegacyReputationToken extends c.LegacyReputationToken<ethers.utils.BigNumber> {
}
export class TestNetReputationToken extends c.TestNetReputationToken<ethers.utils.BigNumber> {
}
export class TestOrders extends c.TestOrders<ethers.utils.BigNumber> {
}
export class Time extends c.Time<ethers.utils.BigNumber> {
}
export class TimeControlled extends c.TimeControlled<ethers.utils.BigNumber> {
}
export class AuctionFactory extends c.AuctionFactory<ethers.utils.BigNumber> {
}
export class AuctionTokenFactory extends c.AuctionTokenFactory<ethers.utils.BigNumber> {
}
export class DisputeCrowdsourcerFactory extends c.DisputeCrowdsourcerFactory<ethers.utils.BigNumber> {
}
export class DisputeWindowFactory extends c.DisputeWindowFactory<ethers.utils.BigNumber> {
}
export class InitialReporterFactory extends c.InitialReporterFactory<ethers.utils.BigNumber> {
}
export class MapFactory extends c.MapFactory<ethers.utils.BigNumber> {
}
export class MarketFactory extends c.MarketFactory<ethers.utils.BigNumber> {
}
export class ReputationTokenFactory extends c.ReputationTokenFactory<ethers.utils.BigNumber> {
}
export class ShareTokenFactory extends c.ShareTokenFactory<ethers.utils.BigNumber> {
}
export class TestNetReputationTokenFactory extends c.TestNetReputationTokenFactory<ethers.utils.BigNumber> {
}
export class UniverseFactory extends c.UniverseFactory<ethers.utils.BigNumber> {
}
export class DelegationTarget extends c.DelegationTarget<ethers.utils.BigNumber> {
}
export class Map extends c.Map<ethers.utils.BigNumber> {
}
export class Auction extends c.Auction<ethers.utils.BigNumber> {
}
export class AuctionToken extends c.AuctionToken<ethers.utils.BigNumber> {
}
export class DisputeCrowdsourcer extends c.DisputeCrowdsourcer<ethers.utils.BigNumber> {
}
export class DisputeWindow extends c.DisputeWindow<ethers.utils.BigNumber> {
}
export class InitialReporter extends c.InitialReporter<ethers.utils.BigNumber> {
}
export class Market extends c.Market<ethers.utils.BigNumber> {
}
export class ReputationToken extends c.ReputationToken<ethers.utils.BigNumber> {
}
export class Universe extends c.Universe<ethers.utils.BigNumber> {
}
export class CancelOrder extends c.CancelOrder<ethers.utils.BigNumber> {
}
export class Cash extends c.Cash<ethers.utils.BigNumber> {
}
export class ClaimTradingProceeds extends c.ClaimTradingProceeds<ethers.utils.BigNumber> {
}
export class CompleteSets extends c.CompleteSets<ethers.utils.BigNumber> {
}
export class CreateOrder extends c.CreateOrder<ethers.utils.BigNumber> {
}
export class FillOrder extends c.FillOrder<ethers.utils.BigNumber> {
}
export class Orders extends c.Orders<ethers.utils.BigNumber> {
}
export class ShareToken extends c.ShareToken<ethers.utils.BigNumber> {
}
export class Trade extends c.Trade<ethers.utils.BigNumber> {
}
