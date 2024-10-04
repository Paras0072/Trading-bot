// // npm init : package.json - This is a node project
// // npm i express : expressJs package get install - project came to know that we are using express
// // We finally use express

const express = require("express");
const axios = require("axios"); // For making HTTP requests
const logger = require("./src/utils/logger");
const {
  movingAverageCrossover,
  momentumTradingStrategy,
  basicTradingLogic,
  bollingerBandsTradingStrategy,
} = require("./src/strategies/bot"); // Import strategies
const { generateReport } = require("./src/utils/profitTracker"); // Import profit tracker
const app = express();
const PORT = 3000;

let symbol = "AAPL"; // Stock symbol to monitor
let tradingInterval = null; // Store interval ID for stopping the bot
const mockApiUrl = "http://localhost:4000/api/stock"; // Mock API base URL

// Function to fetch stock prices from the mock API
const fetchStockPrice = async (symbol) => {
  try {
    const response = await axios.get(`${mockApiUrl}/${symbol}`);
    return response.data;
  } catch (error) {
    logger.error("Error fetching stock price:", error.message);
    return null; // Handle error gracefully
  }
};
const pricesHistory = []; // To keep track of the last few prices
// Trading logic: Call the trading strategies

const tradingLogic = async () => {
  try {
    const stockData = await fetchStockPrice(symbol); // Fetch stock price from API
    if (!stockData) return;

    const currentPrice = parseFloat(stockData.price);
    console.log(`Stock price of ${symbol}: $${currentPrice.toFixed(2)}`);
    logger.info(`Current price: $${currentPrice.toFixed(2)}`);

    // Maintain a history of prices for Bollinger Bands calculation
    pricesHistory.push(currentPrice);
    if (pricesHistory.length > 20) pricesHistory.shift(); // Keep only the last 20 prices

    // Call trading strategies
    momentumTradingStrategy(currentPrice);
    bollingerBandsTradingStrategy(currentPrice, pricesHistory); // Call the Bollinger Bands strategy
    movingAverageCrossover(currentPrice);
    basicTradingLogic(currentPrice); // Call basic trading logic
  } catch (error) {
    logger.error(`Trading logic error: ${error.message}`);
    // Optionally: implement a retry mechanism or alert admin
  }
};

// Endpoint to start trading bot
app.get("/start", (req, res) => {
  if (tradingInterval) {
    return res.send("Trading bot is already running.");
  }

  tradingInterval = setInterval(tradingLogic, 2000); // Check stock prices every 2 seconds
  res.send("Trading bot started.");
});

// Endpoint to stop trading bot
app.get("/stop", (req, res) => {
  if (!tradingInterval) {
    return res.send("Trading bot is not running.");
  }

  clearInterval(tradingInterval);
  tradingInterval = null; // Reset interval ID
  res.send("Trading bot stopped.");
});

// Endpoint to generate trade summary report
app.get("/report", (req, res) => {
  generateReport(); // Call function to generate report
  res.send("Trade summary report generated. Check console for details.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
