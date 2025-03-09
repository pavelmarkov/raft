import { Node } from './node';

const node1 = new Node('1');
const node2 = new Node('2');
const node3 = new Node('3');

node1.printNode();
node2.printNode();
node3.printNode();

node1.assignPeer(node2);
node1.assignPeer(node3);
node2.assignPeer(node1);
node2.assignPeer(node3);
node3.assignPeer(node1);
node3.assignPeer(node2);


