const franchiseRequest = require('../requests/franchises');
const rosterRequest = require('../requests/rosters');


async function printRosterSizes() {
  const idFranchiseMap = await franchiseRequest.getIdFranchiseMap();
  const rosters = await rosterRequest.getRosters();
  
  const nameCountTuple = rosters.map((curr) => {
    let result = [];
    // set name
    result.push(idFranchiseMap[curr.id].name);
    // set count
    const filteredActive = curr.player.filter(p => p.status === 'ROSTER');
    result.push(filteredActive.length);
    return result;
  });
  nameCountTuple.sort((a, b) => a[1] - b[1]);
  
  for(const [name, count] of nameCountTuple) {
    console.log(`${name}: ${count}`);
  }
}

printRosterSizes();