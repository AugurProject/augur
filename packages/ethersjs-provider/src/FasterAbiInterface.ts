import {ethers} from 'ethers';
import {Abi} from 'ethereum';


export interface LogDescription {
  readonly name: string;
  readonly topic: string;
  readonly values: any
}

export class FasterAbiInterface extends ethers.utils.Interface {

  readonly topicEventNames: { [topic: string]: string };

  constructor(abi: Abi) {
    super(abi);
    this.topicEventNames = {};
    for (const name in this.events) {
      const event = this.events[name];
      this.topicEventNames[this.getEventTopic(event)] = name;
    }
  }

  fastParseLog(log: { topics: string[], data: string }): LogDescription {
    const name = this.topicEventNames[log.topics[0]];
    if (!name) throw new Error(`Could not find event for log ${JSON.stringify(log)}`)
    const event = this.events[name];

    return {
      name: event.name,
      topic: this.getEventTopic(event),
      values: this.decodeEventLog(event, log.data, log.topics),
    };
  }
}
