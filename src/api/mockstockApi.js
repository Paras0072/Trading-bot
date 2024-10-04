const express = require("express");
const app = express();
const PORT = 4000;

// Mock stock prices that fluctuate over time
let stockPrice = 150; // Start at $150

// Simulate price fluctuations for the stock
app.get("/api/stock/:symbol", (req, res) => {
  const symbol = req.params.symbol;
  stockPrice += Math.random() * 2 - 1; // Random fluctuation

  res.json({
    symbol,
    price: stockPrice.toFixed(2),
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Mock Stock API running on http://localhost:${PORT}`);
});
