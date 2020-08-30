const fetch = require("node-fetch");

async function getIdFranchiseMap() {
  const resp = await fetch(
    "https://www77.myfantasyleague.com/2020/export?TYPE=league&L=35036&APIKEY=&JSON=1"
  );
  const json = await resp.json();

  const {
    league: {
      franchises: { franchise },
    },
  } = json;

  const idsToFranchise = franchise.reduce((acc, current) => {
    acc[current.id] = current;
    return acc;
  }, {});
  return idsToFranchise;
}

module.exports = {
  getIdFranchiseMap,
};
