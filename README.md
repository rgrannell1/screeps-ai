
## Screeps AI

Just another Screeps AI

## Features

```
collect tomb energy
spawn harvesters in advance
estimate numbers of creeps
block secondary actions until spawns
create roads with steiner tree


var tombs = harvester.room.find(FIND_TOMBSTONES, {filter: (tomb) => {
          return (tomb.store[RESOURCE_ENERGY] > 0)}
  });
var energies = harvester.room.find(FIND_DROPPED_RESOURCES, {filter: (resource) => {
          return (resource.resourceType == RESOURCE_ENERGY)}
  });
var sources = energies.concat(tombs);
```