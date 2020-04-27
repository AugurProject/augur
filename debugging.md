## 0x
### I'm seeing a LOT of errors where by browser cannot connect to servers?

If your browser is attempting to connect to IP addresses on port 60559 -- this is a part of the Gnosis 0x mesh Peer to Peer network. Generally speaking these issues are benign unless you are specifically looking into what two peers cannot communicate.

* It is normal to see a lot of errors *

#### But why is it trying to connect to localhost:60559 / 127.0.0.1:60559

So when you connect to the mesh, your browser will reach out to one of the bootstrap nodes that is in the default list. This node will then pass part of its current list of peers back to your browser, which will initiate trying to connect to them directly. The addresses of these nodes are determined by what *each peer* believes its address to be, and can be a mix of internal (127.0.0.1, 192.168.x.x, 10.0.0.x) and public addresses. These may not allow connections. There is an optimization that would try to ignore local addresses when not in dev mode that should happen in the mesh sometime.

### The 0x mesh in browser keeps dying with "Timed out waiting for newer block"
This happens when you restart your local eth node and don't delete the `0x-mesh-db` database from IndexedDB. Basically the mesh node is waiting for a block NEWER than what it already has, but since the POP docker has restarted that will always be the case.

Solution: Clear application state OR delete `0x-mesh-db` indexeddb!

