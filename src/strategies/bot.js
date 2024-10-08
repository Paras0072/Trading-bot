const logger = require("../utils/logger"); // Import logger

const movingAverage = (data, period) => {
  if (data.length < period) return null;
  const sum = data.slice(-period).reduce((acc, price) => acc + price, 0);
  return sum / period;
};

const momentumTrading = (currentPrice, previousPrice) => {
  return currentPrice > previousPrice;
};

// Import profit tracker
const { recordTrade } = require("../utils/profitTracker");

let shortTermPrices = []; // To track short-term price history
let longTermPrices = []; // To track long-term price history
let balance = 10000; // Starting balance
let positions = 0; // Current positions
let lastPrice = null; // Last price when positions were bought
let lastBasicTradePrice = null; // Last price for basic trading logic
const shortTermPeriod = 5; // Short-term moving average period
const longTermPeriod = 10; // Long-term moving average period

// Moving Average Crossover Trading Strategy
const movingAverageCrossover = (currentPrice) => {
  shortTermPrices.push(currentPrice);
  longTermPrices.push(currentPrice);

  if (shortTermPrices.length > shortTermPeriod) {
    shortTermPrices.shift(); // Remove oldest price
  }
  if (longTermPrices.length > longTermPeriod) {
    longTermPrices.shift(); // Remove oldest price
  }

  const shortTermMA = movingAverage(shortTermPrices, shortTermPeriod);
  const longTermMA = movingAverage(longTermPrices, longTermPeriod);

  if (shortTermMA && longTermMA && !isNaN(shortTermMA) && !isNaN(longTermMA)) {
    logger.info(
      `Short-term MA: ${shortTermMA.toFixed(
        2
      )}, Long-term MA: ${longTermMA.toFixed(2)}`
    );
    console.log(
      `Short-term MA: ${shortTermMA.toFixed(
        2
      )}, Long-term MA: ${longTermMA.toFixed(2)}`
    );

    // Buy signal
    if (shortTermMA > longTermMA && positions === 0) {
      positions = Math.floor(balance / currentPrice); // Buy as many shares as possible
      if (positions > 0) {
        lastPrice = currentPrice; // Store the price at which shares were bought
        balance -= positions * currentPrice; // Deduct the cost from the balance
        recordTrade("buy", currentPrice, positions); // Record trade
        logger.info(
          `Bought ${positions} shares at $${currentPrice.toFixed(
            2
          )} (MA Crossover)`
        );
        console.log(
          `Bought ${positions} shares at $${currentPrice.toFixed(
            2
          )} (MA Crossover)`
        );
      } else {
        logger.warn(
          `Insufficient balance to buy shares at $${currentPrice.toFixed(2)}`
        );
      }
    }
    // Sell signal
    else if (shortTermMA < longTermMA && positions > 0) {
      balance += positions * currentPrice; // Add the proceeds to the balance
      recordTrade("sell", currentPrice, positions); // Record trade
      logger.info(
        `Sold ${positions} shares at $${currentPrice.toFixed(2)} (MA Crossover)`
      );
      console.log(
        `Sold ${positions} shares at $${currentPrice.toFixed(2)} (MA Crossover)`
      );
      positions = 0; // Reset positions after selling
    }
  }
};
// Momentum Trading Strategy
const momentumTradingStrategy = (currentPrice) => {
  if (lastPrice === null) {
    lastPrice = currentPrice; // Initialize last price
    return;
  }

  if (momentumTrading(currentPrice, lastPrice) && positions === 0) {
    // Buy if momentum is positive and there are no positions
    positions = Math.floor(balance / currentPrice);
    if (positions > 0) {
      balance -= positions * currentPrice; // Deduct the cost of the shares bought
      lastPrice = currentPrice;
      recordTrade("buy", currentPrice, positions); // Record trade
      console.log(
        `Bought ${positions} shares (momentum) at $${currentPrice.toFixed(2)}`
      );
      logger.info(
        `Bought ${positions} shares at $${currentPrice.toFixed(2)} (Momentum)`
      );
    } else {
      console.log(
        `Insufficient balance to buy shares at $${currentPrice.toFixed(2)}`
      );
      logger.warn(
        `Insufficient balance to buy shares at $${currentPrice.toFixed(2)}`
      );
    }
  } else if (!momentumTrading(currentPrice, lastPrice) && positions > 0) {
    // Sell if momentum is negative and there are positions
    balance += positions * currentPrice; // Add the proceeds from selling
    recordTrade("sell", currentPrice, positions); // Record trade
    console.log(
      `Sold ${positions} shares (momentum) at $${currentPrice.toFixed(2)}`
    );
    logger.info(
      `Sold ${positions} shares at $${currentPrice.toFixed(2)} (Momentum)`
    );
    positions = 0; // Reset position
  }

  lastPrice = currentPrice; // Update last price
};
// Basic Trading Logic: Buy on 2% drop, Sell on 3% rise
const basicTradingLogic = (currentPrice) => {
  if (lastBasicTradePrice === null) {
    lastBasicTradePrice = currentPrice; // Initialize last price for basic logic
    return;
  }

  // Buy on a 2% drop
  if (positions === 0 && currentPrice <= lastBasicTradePrice * 0.98) {
    positions = Math.floor(balance / currentPrice); // Buy as many as possible
    balance -= positions * currentPrice;
    recordTrade("buy", currentPrice, positions); // Record trade
    lastBasicTradePrice = currentPrice;
    console.log(
      `Bought ${positions} shares at $${currentPrice.toFixed(2)} (Basic Logic)`
    );
    logger.info(
      `Bought ${positions} shares at $${currentPrice.toFixed(2)} (Basic Logiv)`
    );
  }
  // Sell on a 3% rise
  else if (positions > 0 && currentPrice >= lastBasicTradePrice * 1.03) {
    recordTrade("sell", currentPrice, positions); // Record trade
    balance += positions * currentPrice; // Sell all shares
    console.log(
      `Sold ${positions} shares at $${currentPrice.toFixed(2)} (Basic Logic)`
    );
    logger.info(
      `Sold ${positions} shares at $${currentPrice.toFixed(2)} (Basic Logic)`
    );
    positions = 0; // Reset position
    lastBasicTradePrice = currentPrice;
  }
};

const calculateBollingerBands = (prices) => {
  const average = prices.reduce((a, b) => a + b, 0) / prices.length;
  const squaredDiffs = prices.map((price) => Math.pow(price - average, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / prices.length;
  const stdDev = Math.sqrt(variance);

  const upperBand = average + stdDev * 2; // Adjust the multiplier as needed
  const lowerBand = average - stdDev * 2;

  return { average, upperBand, lowerBand };
};
// bollingerband Trading Strategy
const bollingerBandsTradingStrategy = (currentPrice, prices) => {
  const { average, upperBand, lowerBand } = calculateBollingerBands(prices);

  // Ensure valid Bollinger Bands are calculated
  if (!average || !upperBand || !lowerBand) {
    logger.warn("Bollinger Bands not calculated, insufficient data.");
    return;
  }

  // Define trading conditions
  if (currentPrice < lowerBand && positions === 0) {
    // Buy condition: Price is below the lower band
    const quantityToBuy = Math.floor(balance / currentPrice); // Buy as many shares as possible
    if (quantityToBuy > 0) {
      balance -= quantityToBuy * currentPrice; // Deduct from balance
      positions += quantityToBuy; // Increase positions
      recordTrade("buy", currentPrice, quantityToBuy); // Record the trade
      logger.info(
        `Bought ${quantityToBuy} shares at $${currentPrice.toFixed(
          2
        )} (Bollinger Bands Strategy)`
      );
    }
  } else if (currentPrice > upperBand && positions > 0) {
    // Sell condition: Price is above the upper band
    balance += positions * currentPrice; // Add to balance
    logger.info(
      `Sold ${positions} shares at $${currentPrice.toFixed(
        2
      )} (Bollinger Bands Strategy)`
    );
    recordTrade("sell", currentPrice, positions); // Record the trade
    positions = 0; // Reset positions
  }
};

// Export trading strategies
module.exports = {
  movingAverageCrossover,
  momentumTradingStrategy,
  basicTradingLogic,
  bollingerBandsTradingStrategy,
};
