const fetch = require("node-fetch");

async function getRosters() {
  const resp = await fetch(
    "https://www77.myfantasyleague.com/2020/export?TYPE=rosters&L=35036&APIKEY=&JSON=1"
  );
  const {
    rosters: { franchise },
  } = await resp.json();

  return franchise;
}

module.exports = {
  getRosters,
};
