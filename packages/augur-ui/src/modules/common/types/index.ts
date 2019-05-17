// import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export type voidFunction = () => void;

export class BaseAction implements Action {
  public type!: string;
}
