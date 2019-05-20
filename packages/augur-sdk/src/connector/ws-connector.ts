import { Connector, Callback } from "./connector";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

export class WebsocketConnector extends Connector {
  private subject: WebSocketSubject<any>;

  public async connect(url: string): Promise<any> {
    this.subject = WebSocketSubject.create(url);

    this.subject.subscribe(
      (msg) => dispatch(msg),
      (err) => console.error(err),
      () => console.log("closed")
    )
  }

  public async disconnect(): Promise<any> {
    this.subject.complete();
  }

  public dispatch(msg: any): void {
    console.log(msg);
  }

  public async send(data: any, callback: Callback): Promise<any> {
    this.subject.next(data);
  }
}
