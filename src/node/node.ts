
import { v4 as uuidv4 } from 'uuid';

type NodeIdentifierType = string;

export enum NodeStatus {
  LEADER = 'leader',
  CANDIDATE = 'candidate',
  FOLLOWER = 'follower'
}

export class ElectionState {
  term: number;
  vote: NodeIdentifierType;
}

type LogEntryDataType = string | number;

export class LogEntry {
  id: number;
  data: LogEntryDataType;
}

export class Node {

  id: NodeIdentifierType;
  status: NodeStatus;
  election: ElectionState;
  log: LogEntry[];

  constructor(id?: string) {
    this.id = id ?? uuidv4();
    this.status = NodeStatus.FOLLOWER;
    this.election = {
      term: 0,
      vote: null,
    };
    this.log = [];
  }

  printNode(): void {
    console.log(`[node]: ${this.id}, [status]: ${this.status}`);
  }
}