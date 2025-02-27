import { Node } from './node';

const node1 = new Node();
const node2 = new Node();
const node3 = new Node();

node1.printNode();
node2.printNode();
node3.printNode();

node1.assignPeer(node2);
node1.assignPeer(node3);

node1.sendMessage({
  id: 1,
  data: 'test message'
});

node2.printLogs();
node3.printLogs();

