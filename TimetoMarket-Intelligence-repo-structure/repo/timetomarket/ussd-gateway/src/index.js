const express = require("express");
const { handleUssd } = require("./menus");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Webhook called by the USSD aggregator on every keypress.
// Body fields follow the Africa's Talking / Orange USSD webhook spec.
app.post("/ussd", (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  const response = handleUssd({ sessionId, serviceCode, phoneNumber, text });
  res.set("Content-Type", "text/plain");
  res.send(response);
});

const PORT = process.env.PORT || 3000;

/* istanbul ignore next */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`USSD gateway listening on port ${PORT}`);
  });
}

module.exports = app;
