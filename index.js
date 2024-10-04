// // npm init : package.json - This is a node project
// // npm i express : expressJs package get install - project came to know that we are using express
// // We finally use express

const express = require("express");
const axios = require("axios"); // For making HTTP requests

const {

  basicTradingLogic,
  
} = require("./src/strategies/bot"); // Import strategies
const app = express();
const PORT = 2000;

let symbol = "AAPL"; // Stock symbol to monitor
let tradingInterval = null; // Store interval ID for stopping the bot
const mockApiUrl = "http://localhost:4000/api/stock"; // Mock API base URL

// Function to fetch stock prices from the mock API
const fetchStockPrice = async (symbol) => {
  try {
    const response = await axios.get(`${mockApiUrl}/${symbol}`);
    return response.data;
  } catch (error) {
   
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
   

    // Maintain a history of prices for Bollinger Bands calculation
    pricesHistory.push(currentPrice);
    if (pricesHistory.length > 20) pricesHistory.shift(); // Keep only the last 20 prices

    // Call trading strategies
    
    basicTradingLogic(currentPrice); // Call basic trading logic
  } catch (error) {
   
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


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
