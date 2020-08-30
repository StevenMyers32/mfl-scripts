const franchiseRequest = require("../requests/franchises");
const transactionRequest = require("../requests/transactions");

const getFranchiseAuctionInitialState = async () => {
  /**
   * To initialize the first time
   * Save the response in code below to run it
   * Manually update bids granted as bids are manually handed out
   *
   * Save to file to avoid code update if used more than me :)
   */
  console.log('--- START INITIAL STATE ---')
  const franchise = await franchiseRequest.getIdFranchiseMap();
  const franchiseAuctions = Object.values(franchise).reduce((acc, current) => {
    acc[current.id] = {
      name: current.name,
      wonTotal: 0,
      initTotal: 0,
      bidsGranted: 2,
    };
    return acc;
  }, {});
  console.log(franchiseAuctions);
  console.log('--- END INITIAL STATE ---')

  /**
   * After initialized, below is the saved response from the above command
   */
  // const franchiseAuctions = { '0001': { name: 'Duffman', wonTotal: 0, initTotal: 0, bidsGranted: 2 },
  // '0002':
  //  { name: 'Drunk Monkey',
  //    wonTotal: 0,
  //    initTotal: 0,
  //    bidsGranted: 2 },
  // '0003':
  //  { name: 'Globo Gym Purple Cobras',
  //    wonTotal: 0,
  //    initTotal: 0,
  //    bidsGranted: 2 },
  // '0004':
  //  { name: 'Timbuk Too Sweet',
  //    wonTotal: 0,
  //    initTotal: 0,
  //    bidsGranted: 2 },
  // '0005':
  //  { name: 'Show Me The Money',
  //    wonTotal: 0,
  //    initTotal: 0,
  //    bidsGranted: 2 },
  // '0006':
  //  { name: 'Pass the poop back and forth forever',
  //    wonTotal: 0,
  //    initTotal: 0,
  //    bidsGranted: 2 },
  // '0007':
  //  { name: 'Return of the Mack...?',
  //    wonTotal: 0,
  //    initTotal: 0,
  //    bidsGranted: 2 },
  // '0008': { name: 'Brad', wonTotal: 0, initTotal: 0, bidsGranted: 2 },
  // '0009': { name: 'JoeB', wonTotal: 0, initTotal: 0, bidsGranted: 2 },
  // '0010':
  //  { name: 'Orange Peanut',
  //    wonTotal: 0,
  //    initTotal: 0,
  //    bidsGranted: 2 },
  // '0011':
  //  { name: 'Hurst to First',
  //    wonTotal: 0,
  //    initTotal: 0,
  //    bidsGranted: 2 },
  // '0012':
  //  { name: 'Hal Incandenza',
  //    wonTotal: 0,
  //    initTotal: 0,
  //    bidsGranted: 2 } };

  return franchiseAuctions;
};

async function calculateAuctionTimes() {
  const transactions = await transactionRequest.getAuctionsWon();
  const franchiseAuctions = await getFranchiseAuctionInitialState();

  for (const trans of transactions) {
    const currentFranchise = franchiseAuctions[trans.franchise];
    if (trans.type === "AUCTION_WON") {
      if (
        !currentFranchise.lastWon ||
        currentFranchise.lastWon <= trans.timestamp
      ) {
        currentFranchise.lastWon = trans.timestamp;
      }
      currentFranchise.wonTotal += 1;
    } else if (trans.type === "AUCTION_INIT") {
      if (
        !currentFranchise.lastInit ||
        currentFranchise.lastInit <= trans.timestamp
      ) {
        currentFranchise.lastInit = trans.timestamp;
      }
      currentFranchise.initTotal += 1;
    }
  }
  console.log(franchiseAuctions);

  const now = Math.floor(new Date().getTime() / 1000);
  let totalBidsAvailable = 0;
  for (const franchise of Object.values(franchiseAuctions)) {
    const bidsAvailable =
      franchise.wonTotal - (franchise.initTotal - franchise.bidsGranted);
    console.log(
      `${franchise.name} has ${bidsAvailable} bid${
        bidsAvailable !== 1 ? "s" : ""
      } available.`
    );
    totalBidsAvailable += bidsAvailable;
    if (bidsAvailable > 0) {
      const timeWaiting = (franchise.timeWaiting = now - franchise.lastWon);

      console.log(
        `   - ${formatTime(timeWaiting)} since last auction won...shame`
      );
    }
  }
  console.log("------------");
  console.log(`Total outstanding nominations: ${totalBidsAvailable}`);
}

const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;
function formatTime(time) {
  if (time >= day) {
    const number = Math.floor(time / day);
    return `${number} day${number !== 1 ? "s" : ""}`;
  }
  if (time >= hour) {
    const number = Math.floor(time / hour);
    return `${number} hour${number !== 1 ? "s" : ""}`;
  }
  if (time >= minute) {
    const number = Math.floor(time / minute);
    return `${number} minute${number !== 1 ? "s" : ""}`;
  }

  return `${time} seconds`;
}

calculateAuctionTimes();
