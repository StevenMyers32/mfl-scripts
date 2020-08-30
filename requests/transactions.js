const fetch = require("node-fetch");

async function getAuctionsWon() {
  const resp = await fetch(
    "https://www77.myfantasyleague.com/2020/export?TYPE=transactions&L=35036&APIKEY=&W=&TRANS_TYPE=AUCTION_WON,AUCTION_INIT&FRANCHISE=&DAYS=&COUNT=&JSON=1"
  );
  const {
    transactions: { transaction },
  } = await resp.json();

  return transaction;
}

module.exports = {
  getAuctionsWon,
};
