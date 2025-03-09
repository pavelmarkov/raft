
import { v4 as uuidv4 } from 'uuid';
import { ELECTION_TIMEOUT, HEARTBEAT_TIMEOUT } from '../const';

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
  peers: Node[];

  electionTimer: NodeJS.Timeout;
  heartbeatTimer: NodeJS.Timeout;

  constructor(id?: string) {
    this.id = id ?? uuidv4();
    this.status = NodeStatus.FOLLOWER;
    this.election = {
      term: 0,
      vote: null,
    };
    this.log = [];
    this.peers = [];

    this.startNewElectionTimer();
  }

  startNewElectionTimer(): void {
    this.electionTimer = setTimeout(() => {
      console.log(`[node]: ${this.id} election time`);
      this.initElection();
    }, ELECTION_TIMEOUT);
  }

  clearElectionTimer(): void {
    clearTimeout(this.electionTimer);
  }

  startNewHeartbeatTimer(): void {
    setTimeout(() => {
      console.log(`[node]: ${this.id} heartbeat time`);
      this.sendHeartbeat();
    }, HEARTBEAT_TIMEOUT);
  }

  printNode(): void {
    console.log(`[node]: ${this.id}, [status]: ${this.status}`);
  };

  printLogs(): void {
    console.log(`[node]: ${this.id}`);
    this.log.forEach(item => {
      console.log(`[log id]: ${item.id}, [log data] ${item.data}`);
    });
  };

  assignPeer(node: Node): void {
    this.peers.push(node);
  };

  sendMessage(log: LogEntry): boolean {
    this.peers.forEach(node => {
      node.log.push(log);
    });
    return true;
  }

  sendHeartbeat(): void {
    console.log(`[heartbeat]: node ${this.id} sending`);
    this.peers.forEach(node => {
      node.receiveHeartbeat();
    });
    this.startNewHeartbeatTimer();
  };

  receiveHeartbeat(): void {
    console.log(`[heartbeat]: node ${this.id} accepted`);
    this.clearElectionTimer();
    this.startNewElectionTimer();
  }

  initElection(): void {
    this.clearElectionTimer();
    this.status = NodeStatus.CANDIDATE;
    this.election.term += 1;
    this.election.vote = this.id;

    let numberOfPeersAccepted = 0;
    this.peers.forEach(node => {
      const isVoteAccepted = node.processVote(this.election);
      if (isVoteAccepted) {
        numberOfPeersAccepted += 1;
      }
    });

    if (numberOfPeersAccepted > Math.floor(this.peers.length / 2)) {
      console.log(`[leader selected]: node ${this.id} selected as leader`);
      this.status = NodeStatus.LEADER;
      this.sendHeartbeat();
    }
  }

  processVote(vote: ElectionState): boolean {
    if (this.election.term > vote.term) {
      return false;
    }
    if (this.status === NodeStatus.LEADER) {
      return false;
    }
    this.election.term = vote.term;
    this.status = NodeStatus.FOLLOWER;
    this.clearElectionTimer();
    this.startNewElectionTimer();
    return true;
  }


}