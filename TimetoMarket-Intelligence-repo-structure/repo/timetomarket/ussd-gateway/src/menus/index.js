// USSD menu tree for TimetoMarket farmer-facing flows.
//
// USSD protocol: the `text` field sent by the aggregator is the full input
// history for the session, with each keypress joined by "*".
//   Entry (no input yet):  text = ""
//   Selected 1:            text = "1"
//   Selected 1 then 2:     text = "1*2"
//
// Responses must start with CON (continue) or END (terminate).
// Each screen must fit in 160 chars; option lines capped at 30 chars.

const SCREENS = {
  main:
    "CON Welcome to TimetoMarket\n" +
    "1. Sell produce\n" +
    "2. Buy produce\n" +
    "3. My listings\n" +
    "0. Exit",

  sell:
    "CON Sell Produce\n" +
    "1. Add new listing\n" +
    "2. View my listings\n" +
    "0. Back",

  buy:
    "CON Buy Produce\n" +
    "1. Browse listings\n" +
    "2. Search by crop\n" +
    "0. Back",

  myListings:
    "CON My Listings\n" +
    "1. Active listings\n" +
    "2. Sold items\n" +
    "0. Back",
};

function handleUssd({ sessionId, phoneNumber, text }) {
  const input = text ? text.trim() : "";
  const parts = input.split("*");
  const latest = parts[parts.length - 1];
  const depth = parts.filter(Boolean).length;

  if (depth === 0) return SCREENS.main;

  if (depth === 1) {
    if (latest === "1") return SCREENS.sell;
    if (latest === "2") return SCREENS.buy;
    if (latest === "3") return SCREENS.myListings;
    if (latest === "0") return "END Thank you. Goodbye.";
    return "END Invalid selection.";
  }

  const root = parts[0];

  if (root === "1") {
    // Sell produce sub-flow
    if (latest === "1") return "CON Enter crop name\n(e.g. Cassava, Rice):";
    if (latest === "2") return "END Listing view coming soon.";
    if (latest === "0") return SCREENS.main;
    // Depth 3+: crop name has been entered — placeholder until listing logic is built
    if (depth === 3) return "END Listing saved. We will\ncontact you shortly.";
  }

  if (root === "2") {
    // Buy produce sub-flow
    if (latest === "1") return "END Browse listings coming soon.";
    if (latest === "2") return "CON Enter crop to search:";
    if (latest === "0") return SCREENS.main;
    if (depth === 3) return "END Search coming soon.";
  }

  if (root === "3") {
    // My listings sub-flow
    if (latest === "1") return "END Active listings coming soon.";
    if (latest === "2") return "END Sold items coming soon.";
    if (latest === "0") return SCREENS.main;
  }

  return "END Session ended.";
}

module.exports = { handleUssd, SCREENS };
